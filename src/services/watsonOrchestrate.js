// ============================================================
//  IBM Watson Orchestrate API Service
//  Uses local proxy (localhost:3001) to avoid browser CORS.
//  Proxy: node proxy.js  |  npm run proxy
//  Instance: f538224f-3143-4dbd-b202-1d97bf14915a  (au-syd)
// ============================================================

// In dev: route through local proxy to avoid CORS
// In prod: use direct IBM endpoint (server-side rendering / Node env)
const IS_DEV   = import.meta.env?.DEV ?? true;
const PROXY    = "http://localhost:3001";

/**
 * Build the KrishiMitra system prompt for Watson Orchestrate.
 */
function buildSystemPrompt(farmerProfile) {
  return `You are KrishiMitra AI, an Agentic AI Market Decision Copilot for Gujarat cotton and groundnut farmers.

Farmer context:
- Name: ${farmerProfile.name || "Farmer"}
- Crop: ${farmerProfile.crop || "cotton"}
- Quantity: ${farmerProfile.quantity || 50} quintals
- Location: ${farmerProfile.location || "Gujarat"}
- Quality tier: ${farmerProfile.qualityTier || "medium"}

You have the following demo market data (clearly label it as DEMO DATA):
- Cotton best mandi price: ₹6,850/quintal at Rajkot APMC (trending up)
- Groundnut best mandi price: ₹5,800/quintal at Junagadh APMC (trending up)
- MSP Cotton: ₹6,620 | MSP Groundnut: ₹5,550
- Top cotton buyer: Shree Ram Cotton Industries, Rajkot, ₹6,880/qtl, 38 km
- Top groundnut buyer: Saurashtra Oil Mills, Junagadh, ₹5,850/qtl, 45 km

Rules:
1. NEVER guarantee future prices or profits.
2. NEVER invent real buyers or prices outside demo data.
3. Always label estimates and forecasts clearly.
4. Quality estimates are AI-assisted only, not official certification.
5. Support the farmer's decision — don't make it for them.
6. Be concise, farmer-friendly, no technical jargon.`;
}

/**
 * Send a chat message to Watson Orchestrate via local proxy.
 * Falls back to null (triggers local agent logic) on any failure.
 */
export async function chatWithWatsonOrchestrate(userMessage, history = [], farmerProfile = {}) {
  if (!IS_DEV) {
    // In production build, skip proxy attempt and use local fallback
    return null;
  }

  try {
    const messages = [
      { role: "system", content: buildSystemPrompt(farmerProfile) },
      ...history.slice(-10),
      { role: "user", content: userMessage },
    ];

    const response = await fetch(`${PROXY}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "ibm/granite-13b-chat-v2",
        messages,
        max_tokens: 512,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) throw new Error(`Proxy error ${response.status}`);

    const data = await response.json();

    if (!data.ok) throw new Error(data.error || "Proxy returned error");

    const content =
      data?.data?.choices?.[0]?.message?.content ||
      data?.data?.result?.message?.content ||
      data?.data?.output?.text ||
      null;

    if (!content) throw new Error("Empty response from Watson Orchestrate");
    return content;

  } catch (err) {
    console.warn("Watson Orchestrate proxy unavailable, using local fallback:", err.message);
    return null;
  }
}
