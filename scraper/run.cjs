const fs = require("node:fs/promises");
const path = require("node:path");
const { scrapeNse } = require("./nse.cjs");
const { scrapeBse } = require("./bse.cjs");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "ipos.json");
const logFile = path.join(dataDir, "last-run.log");

async function log(message) {
  await fs.mkdir(dataDir, { recursive: true });
  const line = `${new Date().toISOString()} ${message}\n`;
  await fs.appendFile(logFile, line, "utf8");
  console.log(line.trim());
}

async function run() {
  const settled = await Promise.allSettled([scrapeNse(), scrapeBse()]);
  const [nse, bse] = settled;
  const nseRecords = nse.status === "fulfilled" ? nse.value : [];
  const bseRecords = bse.status === "fulfilled" ? bse.value : [];

  if (nse.status === "rejected") await log(`NSE failed: ${nse.reason.message}`);
  if (bse.status === "rejected") await log(`BSE failed: ${bse.reason.message}`);

  // Do not replace a known-good data file with a partial or empty scrape.
  if (nseRecords.length === 0 || bseRecords.length === 0) {
    await log(`Kept existing data (NSE=${nseRecords.length}, BSE=${bseRecords.length}).`);
    process.exitCode = 1;
    return;
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    sources: { nse: nseRecords.length, bse: bseRecords.length },
    records: [...nseRecords, ...bseRecords].sort(
      (a, b) => (a.openDate || "").localeCompare(b.openDate || "") || a.name.localeCompare(b.name)
    ),
  };

  await fs.mkdir(dataDir, { recursive: true });
  const temporary = `${dataFile}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.rename(temporary, dataFile);
  await log(`Saved ${payload.records.length} records (NSE=${nseRecords.length}, BSE=${bseRecords.length}).`);
}

run().catch(async (error) => {
  await log(`Unexpected scraper failure: ${error.stack || error.message}`);
  process.exitCode = 1;
});
