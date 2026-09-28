// Linked-WhatsApp sender. Runs as its own long-lived pm2 process (the Next app restarts on
// every deploy, which would drop the WhatsApp session) and links the admin's own WhatsApp
// account the same way WhatsApp Web does, via Baileys. The Next app talks to it over
// localhost with a shared token — see src/lib/whatsapp-link.ts.
//
// Unofficial: WhatsApp doesn't allow automation on normal accounts, so sends are queued
// and spaced out to look less bot-like. Heavy use can still get the number banned.
//
// Run: node --env-file=.env whatsapp/server.mjs

import http from "node:http";
import { rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState as loadAuthState } from "baileys";
import pino from "pino";
import QRCode from "qrcode";

const PORT = Number(process.env.WHATSAPP_SERVICE_PORT || 3017);
const TOKEN = process.env.WHATSAPP_SERVICE_TOKEN;
const AUTH_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), ".auth");
const MIN_GAP_MS = 3000;
const MAX_GAP_MS = 7000;

if (!TOKEN) {
  console.error("WHATSAPP_SERVICE_TOKEN is not set; refusing to start.");
  process.exit(1);
}

const logger = pino({ level: "warn" });

/** @type {{ status: "starting" | "qr" | "connected" | "disconnected", qr: string | null, me: string | null }} */
const state = { status: "starting", qr: null, me: null };
/** @type {import("baileys").WASocket | null} */
let sock = null;
let reconnectTimer = null;

async function connect() {
  clearTimeout(reconnectTimer);
  await mkdir(AUTH_DIR, { recursive: true, mode: 0o700 });
  const { state: auth, saveCreds } = await loadAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: undefined }));

  const socket = makeWASocket({
    auth,
    version,
    logger,
    browser: ["BeIPOReady Admin", "Chrome", "1.0"],
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });
  sock = socket;

  socket.ev.on("creds.update", saveCreds);
  socket.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (socket !== sock) return; // a newer socket replaced this one

    if (qr) {
      state.status = "qr";
      state.qr = await QRCode.toDataURL(qr, { margin: 1, width: 280 });
    }
    if (connection === "open") {
      state.status = "connected";
      state.qr = null;
      state.me = socket.user?.id ? `+${socket.user.id.split(/[:@]/)[0]}` : null;
      console.log(`WhatsApp linked as ${state.me}`);
    }
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      state.status = "disconnected";
      state.me = null;
      if (code === DisconnectReason.loggedOut) {
        // Unlinked from the phone (or via /logout): drop the old session so a fresh QR appears.
        console.log("WhatsApp logged out; waiting for a new QR scan.");
        await rm(AUTH_DIR, { recursive: true, force: true });
        reconnectTimer = setTimeout(connect, 1000);
      } else {
        reconnectTimer = setTimeout(connect, code === DisconnectReason.restartRequired ? 500 : 5000);
      }
    }
  });
}

// One send at a time with a random pause between them.
let queue = Promise.resolve();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function enqueueSend(phone, text) {
  const job = queue.then(async () => {
    if (state.status !== "connected" || !sock) throw new Error("WhatsApp is not linked. Scan the QR code in admin.");
    const digits = String(phone).replace(/\D/g, "");
    const [result] = await sock.onWhatsApp(digits);
    if (!result?.exists) throw new Error(`+${digits} is not on WhatsApp.`);
    await sock.sendMessage(result.jid, { text });
  });
  // Keep the queue alive after a failure, and space out the next send.
  queue = job.catch(() => {}).then(() => sleep(MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS)));
  return job;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function reply(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return reply(res, 401, { error: "Unauthorized" });

  try {
    if (req.method === "GET" && req.url === "/status") return reply(res, 200, state);

    if (req.method === "POST" && req.url === "/send") {
      const { phone, text } = await readJson(req);
      if (!phone || !text) return reply(res, 400, { error: "phone and text are required." });
      await enqueueSend(phone, String(text));
      return reply(res, 200, { ok: true });
    }

    if (req.method === "POST" && req.url === "/logout") {
      if (sock && state.status === "connected") {
        await sock.logout(); // triggers connection "close" with loggedOut -> fresh QR
      } else {
        sock?.end(undefined);
        sock = null;
        await rm(AUTH_DIR, { recursive: true, force: true });
        state.status = "starting";
        state.qr = null;
        await connect();
      }
      return reply(res, 200, { ok: true });
    }

    reply(res, 404, { error: "Not found" });
  } catch (error) {
    reply(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(PORT, "127.0.0.1", () => console.log(`WhatsApp service on 127.0.0.1:${PORT}`));
connect().catch((error) => {
  console.error("WhatsApp connect failed:", error);
  process.exit(1);
});
