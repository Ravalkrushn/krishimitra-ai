// ============================================================
//  WatsonTest.jsx — Live API diagnostic page
//  Tests every step: IAM token → instance check → chat API
// ============================================================
import React, { useState } from "react";

const API_KEY = "jWjYnClRhieS3ivfEsSsD_GwcS1Gixh17t73_WVF-TjT";
const WO_BASE = "https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/f538224f-3143-4dbd-b202-1d97bf14915a";
const IAM_URL = "https://iam.cloud.ibm.com/identity/token";

const STEPS = [
  { id: "iam",    label: "Step 1 — IBM IAM Token",              desc: "POST to iam.cloud.ibm.com with API key" },
  { id: "ping",   label: "Step 2 — Watson Orchestrate Instance", desc: "GET instance info to verify URL + auth" },
  { id: "models", label: "Step 3 — Available Models",            desc: "GET /v1/models (if supported)" },
  { id: "chat",   label: "Step 4 — Chat Completions",            desc: "POST /v1/chat/completions with Granite" },
];

export default function WatsonTest() {
  const [results, setResults] = useState({});
  const [token, setToken] = useState(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (msg, type = "info") => setLog(prev => [...prev, { msg, type, ts: new Date().toISOString().slice(11,19) }]);

  const setResult = (id, data) => setResults(prev => ({ ...prev, [id]: data }));

  const runAll = async () => {
    setRunning(true);
    setResults({});
    setToken(null);
    setLog([]);

    // ── STEP 1: IAM Token ─────────────────────────────────────
    addLog("Fetching IAM token...");
    setResult("iam", { status: "running" });
    let iamToken = null;
    try {
      const r = await fetch(IAM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ibm:params:oauth:grant-type:apikey",
          apikey: API_KEY,
        }),
      });
      const raw = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${raw.slice(0,200)}`);
      const data = JSON.parse(raw);
      if (!data.access_token) throw new Error("No access_token in response: " + raw.slice(0,200));
      iamToken = data.access_token;
      setToken(iamToken);
      setResult("iam", {
        status: "ok",
        httpStatus: r.status,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        tokenPreview: iamToken.slice(0, 50) + "...",
        scope: data.scope,
      });
      addLog(`IAM token received. Expires in ${data.expires_in}s.`, "ok");
    } catch (e) {
      setResult("iam", { status: "fail", error: e.message });
      addLog(`IAM FAILED: ${e.message}`, "fail");
      setRunning(false);
      return;
    }

    // ── STEP 2: Watson Orchestrate Instance Ping ──────────────
    addLog("Pinging Watson Orchestrate instance...");
    setResult("ping", { status: "running" });
    try {
      const r = await fetch(WO_BASE, {
        headers: { Authorization: `Bearer ${iamToken}` },
      });
      const raw = await r.text();
      let data;
      try { data = JSON.parse(raw); } catch { data = { raw: raw.slice(0, 300) }; }
      setResult("ping", {
        status: r.ok ? "ok" : "fail",
        httpStatus: r.status,
        statusText: r.statusText,
        response: data,
      });
      addLog(`Instance ping: HTTP ${r.status} ${r.statusText}`, r.ok ? "ok" : "fail");
    } catch (e) {
      setResult("ping", { status: "fail", error: e.message });
      addLog(`Instance ping FAILED: ${e.message}`, "fail");
    }

    // ── STEP 3: Models endpoint ───────────────────────────────
    addLog("Checking /v1/models endpoint...");
    setResult("models", { status: "running" });
    try {
      const r = await fetch(`${WO_BASE}/v1/models`, {
        headers: { Authorization: `Bearer ${iamToken}` },
      });
      const raw = await r.text();
      let data;
      try { data = JSON.parse(raw); } catch { data = { raw: raw.slice(0, 300) }; }
      setResult("models", {
        status: r.ok ? "ok" : "warn",
        httpStatus: r.status,
        statusText: r.statusText,
        models: data?.data?.map(m => m.id) || data,
      });
      addLog(`Models endpoint: HTTP ${r.status}`, r.ok ? "ok" : "warn");
    } catch (e) {
      setResult("models", { status: "warn", error: e.message, note: "Endpoint may not be supported" });
      addLog(`Models endpoint not available: ${e.message}`, "warn");
    }

    // ── STEP 4: Chat Completions ──────────────────────────────
    addLog("Testing chat completions with ibm/granite-13b-chat-v2...");
    setResult("chat", { status: "running" });

    const CHAT_ENDPOINTS = [
      `${WO_BASE}/v1/chat/completions`,
      `${WO_BASE}/v2/chat/completions`,
      `${WO_BASE}/v1/completions`,
    ];

    let chatOk = false;
    for (const endpoint of CHAT_ENDPOINTS) {
      try {
        addLog(`Trying: ${endpoint.replace(WO_BASE, "")}`);
        const r = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${iamToken}`,
          },
          body: JSON.stringify({
            model: "ibm/granite-13b-chat-v2",
            messages: [
              { role: "system", content: "You are KrishiMitra AI. Reply in 1 sentence." },
              { role: "user", content: "What is the best mandi for cotton in Gujarat?" },
            ],
            max_tokens: 80,
            temperature: 0.3,
          }),
        });
        const raw = await r.text();
        let data;
        try { data = JSON.parse(raw); } catch { data = { raw: raw.slice(0, 500) }; }
        if (r.ok && (data?.choices?.[0]?.message?.content || data?.result)) {
          const reply = data?.choices?.[0]?.message?.content || data?.result?.message?.content || JSON.stringify(data).slice(0, 200);
          setResult("chat", {
            status: "ok",
            httpStatus: r.status,
            endpoint,
            reply,
            fullResponse: data,
          });
          addLog(`Chat OK at ${endpoint.replace(WO_BASE, "")} — reply: "${reply.slice(0,80)}"`, "ok");
          chatOk = true;
          break;
        } else {
          addLog(`HTTP ${r.status} at ${endpoint.replace(WO_BASE, "")}: ${JSON.stringify(data).slice(0,150)}`, "warn");
        }
      } catch (e) {
        addLog(`Error at ${endpoint.replace(WO_BASE, "")}: ${e.message}`, "warn");
      }
    }

    if (!chatOk) {
      setResult("chat", {
        status: "fail",
        note: "None of the chat endpoints responded with valid output.",
        triedEndpoints: CHAT_ENDPOINTS,
      });
      addLog("Chat completions FAILED on all endpoints.", "fail");
    }

    setRunning(false);
    addLog("Diagnostics complete.", "info");
  };

  const statusIcon  = (s) => ({ ok:"✅", fail:"❌", warn:"⚠️", running:"⏳" }[s] || "⬜");
  const statusColor = (s) => ({ ok:"#dcfce7", fail:"#fee2e2", warn:"#fef3c7", running:"#dbeafe" }[s] || "#f3f4f6");
  const statusText  = (s) => ({ ok:"#166534", fail:"#dc2626", warn:"#b45309", running:"#1d4ed8" }[s] || "#374151");

  return (
    <div style={{ padding:"28px 32px", maxWidth:900, fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#0d3b1f,#2e7d32)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:"white", flexShrink:0 }}>🌐</div>
          <div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#111827" }}>Watson Orchestrate API Diagnostics</h2>
            <p style={{ margin:0, fontSize:12, color:"#6b7280" }}>IBM IAM Token → Instance → Models → Chat Completions</p>
          </div>
        </div>
        <div style={{ padding:"10px 14px", background:"#f0faf0", border:"1px solid #a5d6a7", borderRadius:8, fontSize:12, color:"#374151" }}>
          <strong>API Key:</strong> {API_KEY.slice(0,12)}...{API_KEY.slice(-6)} &nbsp;|&nbsp;
          <strong>Instance:</strong> f538224f-3143-4dbd-b202-1d97bf14915a &nbsp;|&nbsp;
          <strong>Region:</strong> au-syd
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={runAll}
        disabled={running}
        style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"12px 24px", background: running ? "#9ca3af" : "#1a5c2a",
          color:"white", border:"none", borderRadius:10,
          fontSize:14, fontWeight:700, cursor: running ? "not-allowed" : "pointer",
          marginBottom:24,
        }}
      >
        {running ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> Running Tests…</> : "▶ Run API Diagnostics"}
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Step results */}
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
        {STEPS.map(step => {
          const r = results[step.id];
          const s = r?.status || "idle";
          return (
            <div key={step.id} style={{ background:"white", border:"1px solid #e5e7eb", borderRadius:12, overflow:"hidden" }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background: statusColor(s), borderBottom:"1px solid #e5e7eb" }}>
                <span style={{ fontSize:20 }}>{statusIcon(s)}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color: statusText(s) }}>{step.label}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>{step.desc}</div>
                </div>
                {r && s !== "running" && (
                  <span style={{ padding:"3px 12px", borderRadius:20, fontSize:11, fontWeight:700, background: statusColor(s), color: statusText(s), border:`1px solid ${statusText(s)}33` }}>
                    {s.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Body */}
              {r && s !== "idle" && s !== "running" && (
                <div style={{ padding:"12px 18px" }}>
                  {r.error && <div style={{ color:"#dc2626", fontSize:12, fontFamily:"monospace", background:"#fef2f2", padding:"8px 12px", borderRadius:6, marginBottom:8 }}>{r.error}</div>}
                  {r.httpStatus && <div style={{ fontSize:12, color:"#374151", marginBottom:4 }}>HTTP Status: <strong>{r.httpStatus}</strong> {r.statusText}</div>}
                  {r.tokenPreview && <div style={{ fontSize:12, color:"#374151", marginBottom:4 }}>Token: <code style={{ fontSize:11, background:"#f3f4f6", padding:"2px 6px", borderRadius:4 }}>{r.tokenPreview}</code></div>}
                  {r.expiresIn && <div style={{ fontSize:12, color:"#374151", marginBottom:4 }}>Expires in: <strong>{r.expiresIn}s</strong> ({Math.round(r.expiresIn/60)} min)</div>}
                  {r.models && <div style={{ fontSize:12, color:"#374151", marginBottom:4 }}>Models: <strong>{Array.isArray(r.models) ? r.models.join(", ") : JSON.stringify(r.models)}</strong></div>}
                  {r.endpoint && <div style={{ fontSize:12, color:"#374151", marginBottom:4 }}>Working Endpoint: <code style={{ fontSize:11, background:"#f3f4f6", padding:"2px 6px", borderRadius:4 }}>{r.endpoint.replace(WO_BASE, "")}</code></div>}
                  {r.reply && (
                    <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#111827", marginTop:6 }}>
                      <span style={{ fontWeight:700, color:"#15803d" }}>AI Reply: </span>{r.reply}
                    </div>
                  )}
                  {r.note && <div style={{ fontSize:12, color:"#6b7280", fontStyle:"italic" }}>{r.note}</div>}
                  {r.response && !r.reply && (
                    <pre style={{ fontSize:11, background:"#f9fafb", padding:"8px 12px", borderRadius:6, overflow:"auto", maxHeight:120, color:"#374151" }}>
                      {JSON.stringify(r.response, null, 2).slice(0, 600)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live log */}
      {log.length > 0 && (
        <div style={{ background:"#111827", borderRadius:10, padding:"14px 18px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, textTransform:"uppercase", letterSpacing:.5 }}>Live Log</div>
          {log.map((l, i) => (
            <div key={i} style={{ fontSize:12, fontFamily:"monospace", marginBottom:3, color: l.type==="ok"?"#4ade80":l.type==="fail"?"#f87171":l.type==="warn"?"#fbbf24":"#e5e7eb" }}>
              <span style={{ opacity:.5 }}>[{l.ts}] </span>{l.msg}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:20, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:11, color:"#92400e" }}>
        ⚠️ This diagnostic runs from the browser. CORS restrictions may block direct IBM API calls in a browser context. If Step 1 fails with CORS, the API key works — it just needs a server-side proxy for production.
      </div>
    </div>
  );
}
