const { browserHeaders, getJson, isoFromBseDate, issueStatus, mapLimit } = require("./shared.cjs");

const BSE_ORIGIN = "https://www.bseindia.com";
const BSE_API = "https://api.bseindia.com/BseIndiaAPI/api";
const headers = browserHeaders(`${BSE_ORIGIN}/publicissue`, { origin: BSE_ORIGIN });

function tableRowsToObject(rows) {
  return Object.fromEntries((rows || []).map((row) => [row.Label, row.Value]));
}

async function scrapeBse() {
  // The old publicissue.html is now an Angular app shell; the site itself uses
  // this JSON endpoint. Filtering IPO excludes OFS, buybacks and rights issues.
  const listing = await getJson(`${BSE_API}/GetPublicIssue_par/w`, { headers });
  const issues = (listing.Table || []).filter((row) => row.IR_flag === "IPO" && row.IPO_NO);

  const records = await mapLimit(issues, 3, async (issue) => {
    const details = await getJson(`${BSE_API}/ipo_details_ng/w?stripono=${encodeURIComponent(issue.IPO_NO)}`, {
      headers,
    });
    const fields = tableRowsToObject(details.TableRows);
    const openDate = isoFromBseDate(issue.Start_Dt);
    const closeDate = isoFromBseDate(issue.End_Dt);

    return {
      id: `bse:${issue.IPO_NO}`,
      source: "bse",
      name: (fields.ScripName || issue.Scrip_Name || "").trim(),
      symbol: fields.Symbol || null,
      platform: issue.eXCHANGE_PLATFORM || null,
      openDate,
      closeDate,
      priceBand: fields["Price Band"] || issue.Price_Band || null,
      lotSize: fields["Market Lot"] || fields["Minimum Bid Quantity"] || null,
      issueSize: fields["Issue Size – No. of Shares"] || null,
      issueSizeUnit: fields["Issue Size – No. of Shares"] ? "shares" : null,
      status: issueStatus(openDate, closeDate),
      sourceUrl: `${BSE_ORIGIN}/markets/publicIssues/OfsDisp?id=${issue.Scrip_cd}&type=IPO&idtype=1&status=${issue.Status}&IPONo=${issue.IPO_NO}`,
    };
  });

  return records.filter((record) => record.name);
}

module.exports = { scrapeBse };
