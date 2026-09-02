// ============================================================
//  WatsonTest.jsx — IBM Watson API Diagnostics via Local Proxy
//  Browser → http://localhost:3001 → IBM Cloud (no CORS issue)
// ============================================================
import React, { useState } from "react";

const PROXY = "http://localhost:3001";

const STEPS = [
  { id: "health", label: "Step 0 — Proxy Server",         desc: "Check local proxy is running on port 3001" },
  { id: "iam",    label: "Step 1 — IBM IAM Token",         desc: "Proxy fetches token from iam.cloud.ibm.com" },
  { id: "ping",   label: "Step 2 — Watson Instance Ping",  desc: "GET instance info to verify URL + auth" },
  { id: "models", label: "Step 3 — Available Models",      desc: "GET /v1/models from Watson Orchestrate" },
  { id: "chat",   label: "Step 4 — Chat Completions",      desc: "POST /v1/chat/completions with Granite LLM" },
];

export default function WatsonTest() {
  const [results, setResults]   = useState({});
  const [running, setRunning]   = useState(false);
  const [log, setLog]           = useState([]);

  const addLog  = (msg, type = "info") =>
    setLog(prev => [...prev, { msg, type, ts: new Date().toISOString().slice(11, 19) }]);
  const setR    = (id, data) =>
    setResults(prev => ({ ...prev, [id]: data }));

  const runAll = async () => {
    setRunning(true);
    setResults({});
    setLog([]);

    // ── STEP 0: Proxy health check ────────────────────────────
    addLog("Checking proxy server at localhost:3001...");
    setR("health", { status: "running" });
    try {
      const r = await fetch(`${PROXY}/health`, { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      setR("health", { status: "ok", httpStatus: r.status, ...d });
      addLog("Proxy server is running ✓", "ok");
    } catch (e) {
      setR("health", {
        status: "fail",
        error: "Proxy not running. Open a new terminal and run: npm run proxy",
      });
      addLog("Proxy server NOT reachable. Run: npm run proxy", "fail");
      setRunning(false);
      return;
    }

    // ── STEP 1: IAM Token ─────────────────────────────────────
    addLog("Fetching IAM token via proxy...");
    setR("iam", { status: "running" });
    try {
      const r = await fetch(`${PROXY}/api/token`);
      const d = await r.json();
      if (!d.ok) throw new Error(d.error);
      setR("iam", { status: "ok", ...d });
      addLog(`IAM token OK — expires in ${d.expiresIn}s (cached: ${d.cached})`, "ok");
    } catch (e) {
      setR("iam", { status: "fail", error: e.message });
      addLog(`IAM FAILED: ${e.message}`, "fail");
      setRunning(false);
      return;
    }

    // ── STEP 2: Instance ping ─────────────────────────────────
    addLog("Pinging Watson Orchestrate instance...");
    setR("ping", { status: "running" });
    try {
      const r = await fetch(`${PROXY}/api/ping`);
      const d = await r.json();
      setR("ping", {
        status: d.ok ? "ok" : "fail",
        httpStatus: d.httpStatus,
        statusText: d.statusText,
        response: d.data,
      });
      addLog(`Instance ping: HTTP ${d.httpStatus} ${d.statusText}`, d.ok ? "ok" : "fail");
    } catch (e) {
      setR("ping", { status: "fail", error: e.message });
      addLog(`Ping FAILED: ${e.message}`, "fail");
    }

    // ── STEP 3: Models ────────────────────────────────────────
    addLog("Checking /v1/models...");
    setR("models", { status: "running" });
    try {
      const r = await fetch(`${PROXY}/api/models`);
      const d = await r.json();
      const modelList = d.data?.data?.map(m => m.id) || d.data;
      setR("models", {
        status: d.ok ? "ok" : "warn",
        httpStatus: d.httpStatus,
        statusText: d.statusText,
        models: modelList,
        raw: d.data,
      });
      addLog(`Models: HTTP ${d.httpStatus}`, d.ok ? "ok" : "warn");
    } catch (e) {
      setR("models", { status: "warn", error: e.message, note: "Endpoint may not exist on this instance" });
      addLog(`Models endpoint: ${e.message}`, "warn");
    }

    // ── STEP 4: Chat completions ──────────────────────────────
    addLog("Testing chat completions (ibm/granite-13b-chat-v2)...");
    setR("chat", { status: "running" });
    try {
      const r = await fetch(`${PROXY}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "ibm/granite-13b-chat-v2",
          messages: [
            { role: "system", content: "You are KrishiMitra AI. Reply in one short sentence." },
            { role: "user",   content: "What is the best mandi for cotton in Gujarat?" },
          ],
          max_tokens: 80,
          temperature: 0.3,
        }),
      });
      const d = await r.json();
      if (d.ok) {
        const reply =
          d.data?.choices?.[0]?.message?.content ||
          d.data?.result?.message?.content ||
          d.data?.output?.text ||
          JSON.stringify(d.data).slice(0, 200);
        setR("chat", {
          status: "ok",
          httpStatus: d.httpStatus,
          endpoint: d.endpoint,
          reply,
          fullResponse: d.data,
        });
        addLog(`Chat OK — "${reply.slice(0, 80)}"`, "ok");
      } else {
        setR("chat", {
          status: "fail",
          httpStatus: d.httpStatus,
          error: d.error || JSON.stringify(d.lastError),
          raw: d,
        });
        addLog(`Chat FAILED: HTTP ${d.httpStatus || "?"} — ${d.error || ""}`, "fail");
      }
    } catch (e) {
      setR("chat", { status: "fail", error: e.message });
      addLog(`Chat error: ${e.message}`, "fail");
    }

    setRunning(false);
    addLog("Diagnostics complete.", "info");
  };

  const icon  = s => ({ ok:"✅", fail:"❌", warn:"⚠️", running:"⏳" }[s] || "⬜");
  const bg    = s => ({ ok:"#f0fdf4", fail:"#fef2f2", warn:"#fffbeb", running:"#eff6ff" }[s] || "#f9fafb");
  const bdr   = s => ({ ok:"#bbf7d0", fail:"#fecaca", warn:"#fde68a", running:"#bfdbfe" }[s] || "#e5e7eb");
  const txtC  = s => ({ ok:"#15803d", fail:"#dc2626", warn:"#b45309", running:"#1d4ed8" }[s] || "#374151");

  return (
    <div style={{ padding:"28px 32px", maxWidth:860, fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#0d3b1f,#2e7d32)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:"white" }}>🌐</div>
          <div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#111827" }}>Watson Orchestrate API Diagnostics</h2>
            <p style={{ margin:0, fontSize:12, color:"#6b7280" }}>Browser → Proxy (localhost:3001) → IBM Cloud · No CORS issues</p>
          </div>
        </div>

        {/* Proxy instruction box */}
        <div style={{ padding:"12px 16px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, fontSize:12, color:"#374151", marginBottom:12 }}>
          <strong style={{ color:"#b45309" }}>⚡ Before running:</strong> Open a <strong>second terminal</strong> in the project folder and run:
          <div style={{ marginTop:6, padding:"7px 12px", background:"#111827", borderRadius:6, fontFamily:"monospace", fontSize:13, color:"#4ade80", letterSpacing:.5 }}>
            npm run proxy
          </div>
          <div style={{ marginTop:6, color:"#6b7280" }}>Then click "Run Diagnostics" below. The proxy runs on port 3001.</div>
        </div>

        <div style={{ padding:"10px 14px", background:"#f0faf0", border:"1px solid #a5d6a7", borderRadius:8, fontSize:12, color:"#374151", display:"flex", gap:24, flexWrap:"wrap" }}>
          <span><strong>Instance:</strong> f538224f-3143-4dbd-b202-1d97bf14915a</span>
          <span><strong>Region:</strong> au-syd (Sydney)</span>
          <span><strong>Model:</strong> ibm/granite-13b-chat-v2</span>
          <span><strong>Proxy:</strong> localhost:3001</span>
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={runAll}
        disabled={running}
        style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"12px 28px",
          background: running ? "#9ca3af" : "linear-gradient(135deg,#1a5c2a,#2e7d32)",
          color:"white", border:"none", borderRadius:10,
          fontSize:14, fontWeight:700, cursor: running ? "not-allowed" : "pointer",
          marginBottom:24, boxShadow: running ? "none" : "0 4px 12px rgba(26,92,42,.3)",
        }}
      >
        {running
          ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"white", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> Running…</>
          : "▶ Run API Diagnostics"
        }
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Steps */}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {STEPS.map(step => {
          const r = results[step.id];
          const s = r?.status || "idle";
          return (
            <div key={step.id} style={{ background:"white", border:`1.5px solid ${bdr(s)}`, borderRadius:12, overflow:"hidden" }}>
              {/* Row header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background: bg(s) }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{icon(s)}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color: txtC(s) }}>{step.label}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>{step.desc}</div>
                </div>
                {r && s !== "running" && (
                  <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, background: bg(s), color: txtC(s), border:`1px solid ${bdr(s)}` }}>
                    {s.toUpperCase()}
                  </span>
                )}
                {s === "running" && (
                  <div style={{ width:14, height:14, border:"2px solid #bfdbfe", borderTopColor:"#1d4ed8", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                )}
              </div>

              {/* Detail body */}
              {r && s !== "idle" && s !== "running" && (
                <div style={{ padding:"10px 16px", borderTop:`1px solid ${bdr(s)}`, fontSize:12 }}>
                  {r.error && (
                    <div style={{ color:"#dc2626", background:"#fef2f2", border:"1px solid #fecaca", padding:"8px 12px", borderRadius:6, fontFamily:"monospace", marginBottom:6 }}>
                      {r.error}
                    </div>
                  )}
                  {r.httpStatus && (
                    <div style={{ color:"#374151", marginBottom:4 }}>
                      HTTP Status: <strong>{r.httpStatus}</strong> {r.statusText && <span style={{ color:"#6b7280" }}>{r.statusText}</span>}
                    </div>
                  )}
                  {r.tokenPreview && <div style={{ color:"#374151", marginBottom:4 }}>Token: <code style={{ background:"#f3f4f6", padding:"2px 6px", borderRadius:4, fontSize:11 }}>{r.tokenPreview}</code></div>}
                  {r.expiresIn    && <div style={{ color:"#374151", marginBottom:4 }}>Expires in: <strong>{r.expiresIn}s</strong> ({Math.round(r.expiresIn/60)} min)</div>}
                  {r.port         && <div style={{ color:"#15803d", marginBottom:4 }}>✓ Proxy running on port <strong>{r.port}</strong></div>}
                  {r.endpoint     && <div style={{ color:"#374151", marginBottom:4 }}>Endpoint: <code style={{ background:"#f3f4f6", padding:"2px 6px", borderRadius:4, fontSize:11 }}>{r.endpoint}</code></div>}

                  {/* Models list */}
                  {r.models && (
                    <div style={{ color:"#374151", marginBottom:4 }}>
                      Models: {Array.isArray(r.models)
                        ? r.models.map(m => <code key={m} style={{ background:"#f3f4f6", padding:"1px 6px", borderRadius:4, fontSize:11, marginRight:4 }}>{m}</code>)
                        : <span style={{ fontStyle:"italic", color:"#6b7280" }}>{JSON.stringify(r.models).slice(0, 120)}</span>
                      }
                    </div>
                  )}

                  {/* Chat reply */}
                  {r.reply && (
                    <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"10px 14px", color:"#111827", marginTop:6 }}>
                      <span style={{ fontWeight:700, color:"#15803d" }}>🤖 Granite LLM Reply: </span>{r.reply}
                    </div>
                  )}

                  {/* Raw response (collapsed) */}
                  {(r.response || r.raw) && !r.reply && (
                    <details style={{ marginTop:6 }}>
                      <summary style={{ cursor:"pointer", color:"#6b7280", fontSize:11 }}>Raw response</summary>
                      <pre style={{ fontSize:10, background:"#f9fafb", padding:"8px 12px", borderRadius:6, overflow:"auto", maxHeight:120, color:"#374151", marginTop:4 }}>
                        {JSON.stringify(r.response || r.raw, null, 2).slice(0, 800)}
                      </pre>
                    </details>
                  )}

                  {r.note && <div style={{ fontStyle:"italic", color:"#6b7280", marginTop:4 }}>{r.note}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live log */}
      {log.length > 0 && (
        <div style={{ background:"#111827", borderRadius:10, padding:"14px 18px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", marginBottom:8, textTransform:"uppercase", letterSpacing:.5 }}>Live Log</div>
          {log.map((l, i) => (
            <div key={i} style={{ fontSize:12, fontFamily:"monospace", marginBottom:2, color: l.type==="ok"?"#4ade80":l.type==="fail"?"#f87171":l.type==="warn"?"#fbbf24":"#d1d5db" }}>
              <span style={{ opacity:.5 }}>[{l.ts}]</span> {l.msg}
            </div>
          ))}
        </div>
      )}

      {/* Final result summary */}
      {!running && Object.keys(results).length > 0 && (() => {
        const allDone = STEPS.every(s => results[s.id]?.status);
        const chatOk  = results.chat?.status === "ok";
        const iamOk   = results.iam?.status  === "ok";
        if (!allDone) return null;
        return (
          <div style={{ marginTop:16, padding:"14px 18px", borderRadius:10, background: chatOk ? "#f0fdf4" : "#fef2f2", border:`1.5px solid ${chatOk?"#bbf7d0":"#fecaca"}` }}>
            <div style={{ fontWeight:800, fontSize:14, color: chatOk?"#15803d":"#dc2626", marginBottom:6 }}>
              {chatOk ? "✅ Watson Orchestrate is WORKING!" : iamOk ? "⚠️ IAM Token OK but Chat endpoint not responding" : "❌ API connection failed"}
            </div>
            <div style={{ fontSize:12, color:"#374151" }}>
              {chatOk
                ? "The app will use IBM Watson Orchestrate + Granite LLM for the AI Assistant chat."
                : iamOk
                  ? "API key is valid. The chat endpoint may need a different path or model name for this Watson instance."
                  : "Check your API key and instance ID in watsonOrchestrate.js"}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
