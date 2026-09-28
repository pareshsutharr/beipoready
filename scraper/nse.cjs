const { browserHeaders, getJson, isoFromNseDate, issueStatus } = require("./shared.cjs");

const NSE_API = "https://www.nseindia.com/api/all-upcoming-issues?category=ipo";

/**
 * NSE blocks the document URL from this VPS but currently allows its public
 * JSON response when it is requested with the same navigation context as its
 * site. Avoid a mandatory homepage preflight: it is the blocked request.
 */
async function scrapeNse() {
  const rows = await getJson(NSE_API, {
    headers: browserHeaders("https://www.nseindia.com/"),
  });

  if (!Array.isArray(rows)) throw new Error("NSE response is not an array");

  return rows
    .filter((row) => row.companyName && row.issueStartDate && row.issueEndDate)
    .map((row) => {
      const openDate = isoFromNseDate(row.issueStartDate);
      const closeDate = isoFromNseDate(row.issueEndDate);
      return {
        id: `nse:${row.symbol || row.companyName}`,
        source: "nse",
        name: row.companyName.trim(),
        symbol: row.symbol || null,
        platform: row.series || null,
        openDate,
        closeDate,
        priceBand: row.priceBand || row.issuePrice || null,
        lotSize: row.lotSize || null,
        issueSize: row.issueSize || null,
        issueSizeUnit: row.issueSize ? "shares" : null,
        status: issueStatus(openDate, closeDate),
        sourceUrl: NSE_API,
      };
    });
}

module.exports = { scrapeNse };
