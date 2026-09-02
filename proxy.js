// ============================================================
//  KrishiMitra AI — IBM API Proxy Server
//  Bypasses CORS: browser → localhost:3001 → IBM Cloud
//  Run: node proxy.js
// ============================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

// IBM config
const WO_BASE = "https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/f538224f-3143-4dbd-b202-1d97bf14915a";
const IAM_URL = "https://iam.cloud.ibm.com/identity/token";
const API_KEY = "jWjYnClRhieS3ivfEsSsD_GwcS1Gixh17t73_WVF-TjT";

app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Token cache ───────────────────────────────────────────────
let _tokenCache = null;
let _tokenExpiry = 0;

async function getIAMToken() {
  const now = Date.now();
  if (_tokenCache && now < _tokenExpiry) {
    console.log("[proxy] Using cached IAM token");
    return _tokenCache;
  }
  console.log("[proxy] Fetching fresh IAM token...");
  const resp = await fetch(IAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: API_KEY,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`IAM error ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  _tokenCache = data.access_token;
  _tokenExpiry = now + 50 * 60 * 1000;
  console.log(`[proxy] IAM token fetched. Expires in ${data.expires_in}s`);
  return _tokenCache;
}

// ── GET /api/token — return IAM token info ────────────────────
app.get("/api/token", async (req, res) => {
  try {
    const token = await getIAMToken();
    res.json({
      ok: true,
      tokenPreview: token.slice(0, 50) + "...",
      expiresIn: Math.round((_tokenExpiry - Date.now()) / 1000),
      cached: !!_tokenCache,
    });
  } catch (err) {
    console.error("[proxy] /api/token error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/ping — ping Watson Orchestrate instance ─────────
app.get("/api/ping", async (req, res) => {
  try {
    const token = await getIAMToken();
    const r = await fetch(WO_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 300) }; }
    res.status(r.status).json({ ok: r.ok, httpStatus: r.status, statusText: r.statusText, data });
  } catch (err) {
    console.error("[proxy] /api/ping error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/models — list available models ───────────────────
app.get("/api/models", async (req, res) => {
  try {
    const token = await getIAMToken();
    const r = await fetch(`${WO_BASE}/v1/models`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 300) }; }
    res.status(r.status).json({ ok: r.ok, httpStatus: r.status, statusText: r.statusText, data });
  } catch (err) {
    console.error("[proxy] /api/models error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/chat — chat completions proxy ───────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const token = await getIAMToken();
    const { messages, model = "ibm/granite-13b-chat-v2", max_tokens = 512, temperature = 0.3 } = req.body;

    // Try endpoints in order
    const endpoints = [
      `${WO_BASE}/v1/chat/completions`,
      `${WO_BASE}/v2/chat/completions`,
    ];

    let lastError = null;
    for (const endpoint of endpoints) {
      console.log(`[proxy] Trying chat endpoint: ${endpoint.replace(WO_BASE, "")}`);
      try {
        const r = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ model, messages, max_tokens, temperature }),
        });

        const text = await r.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        console.log(`[proxy] Chat response: HTTP ${r.status} from ${endpoint.replace(WO_BASE, "")}`);

        if (r.ok) {
          return res.json({ ok: true, httpStatus: r.status, endpoint: endpoint.replace(WO_BASE, ""), data });
        }
        lastError = { httpStatus: r.status, statusText: r.statusText, data };
      } catch (e) {
        lastError = { error: e.message };
      }
    }

    res.status(502).json({ ok: false, error: "All chat endpoints failed", lastError });
  } catch (err) {
    console.error("[proxy] /api/chat error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", proxy: "KrishiMitra IBM API Proxy", port: PORT });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌾 KrishiMitra IBM API Proxy running at http://localhost:${PORT}`);
  console.log(`   /health       — health check`);
  console.log(`   /api/token    — IBM IAM token test`);
  console.log(`   /api/ping     — Watson Orchestrate instance ping`);
  console.log(`   /api/models   — available models`);
  console.log(`   POST /api/chat — chat completions\n`);
});
