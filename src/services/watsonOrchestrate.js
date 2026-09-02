// ============================================================
//  IBM Watson Orchestrate API Service
//  Endpoint: https://api.au-syd.watson-orchestrate.cloud.ibm.com
//  Instance:  f538224f-3143-4dbd-b202-1d97bf14915a
// ============================================================

const WO_BASE_URL =
  "https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/f538224f-3143-4dbd-b202-1d97bf14915a";
const WO_API_KEY = "jWjYnClRhieS3ivfEsSsD_GwcS1Gixh17t73_WVF-TjT";

/**
 * Get an IAM bearer token using the API key.
 * Caches for 50 minutes.
 */
let _tokenCache = null;
let _tokenExpiry = 0;

async function getIAMToken() {
  const now = Date.now();
  if (_tokenCache && now < _tokenExpiry) return _tokenCache;

  const resp = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: WO_API_KEY,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`IAM token error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  _tokenCache = data.access_token;
  _tokenExpiry = now + 50 * 60 * 1000; // 50 min
  return _tokenCache;
}

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
 * Send a chat message to Watson Orchestrate and get a response.
 *
 * @param {string} userMessage  — farmer's question
 * @param {Array}  history      — [{role:"user"|"assistant", content:string}]
 * @param {Object} farmerProfile
 * @returns {Promise<string>}   — AI response text
 */
export async function chatWithWatsonOrchestrate(userMessage, history = [], farmerProfile = {}) {
  try {
    const token = await getIAMToken();

    // Build messages array
    const messages = [
      { role: "system", content: buildSystemPrompt(farmerProfile) },
      ...history.slice(-10), // keep last 10 turns for context
      { role: "user", content: userMessage },
    ];

    // Try Watson Orchestrate chat completions endpoint
    const response = await fetch(`${WO_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "ibm/granite-13b-chat-v2",
        messages,
        max_tokens: 512,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Watson Orchestrate error:", response.status, errText);
      throw new Error(`Watson Orchestrate API error ${response.status}`);
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content ||
      data?.result?.message?.content ||
      data?.output?.text ||
      null;

    if (!content) throw new Error("Empty response from Watson Orchestrate");
    return content;
  } catch (err) {
    console.warn("Watson Orchestrate unavailable, using local fallback:", err.message);
    // Return null to signal fallback to local agent logic
    return null;
  }
}
