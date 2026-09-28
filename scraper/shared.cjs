const { setTimeout: delay } = require("node:timers/promises");

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

function browserHeaders(referer, extra = {}) {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": USER_AGENT,
    referer,
    ...extra,
  };
}

async function getJson(url, { headers, attempts = 3 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(url, {
        headers,
        redirect: "follow",
        signal: controller.signal,
      });
      const body = await response.text();

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}: ${body.slice(0, 180)}`);
      }

      try {
        return JSON.parse(body);
      } catch {
        throw new Error(`Expected JSON but received: ${body.slice(0, 180)}`);
      }
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(attempt * 1_500);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

function isoFromNseDate(value) {
  const match = /^([0-3]\d)-([A-Za-z]{3})-(\d{4})$/.exec(value || "");
  if (!match) return null;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[2]);
  if (month < 0) return null;
  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[1]}`;
}

function isoFromBseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function todayInIndia() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts();
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function issueStatus(openDate, closeDate) {
  const today = todayInIndia();
  if (openDate && today < openDate) return "upcoming";
  if (closeDate && today > closeDate) return "closed";
  return "live";
}

function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;

  return Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next;
        next += 1;
        results[index] = await mapper(items[index], index);
      }
    })
  ).then(() => results);
}

module.exports = {
  browserHeaders,
  getJson,
  isoFromNseDate,
  isoFromBseDate,
  issueStatus,
  mapLimit,
};
