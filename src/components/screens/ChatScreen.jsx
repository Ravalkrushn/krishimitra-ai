// ============================================================
//  Screen: AI Assistant Chat Interface
//  Powered by IBM Watson Orchestrate API (with local fallback)
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import { chatWithWatsonOrchestrate } from "../../services/watsonOrchestrate";
import { runPriceAgent } from "../../agents/priceAgent";
import { runBuyerMatchingAgent } from "../../agents/buyerAgent";
import { runStorageAdvisorAgent } from "../../agents/storageAgent";
import { runQualityAgent } from "../../agents/qualityAgent";
import { runIncomeDashboardAgent } from "../../agents/incomeDashboardAgent";

const QUICK_QUESTIONS = [
  "Where should I sell my cotton?",
  "Should I sell now or store?",
  "Show me buyers for my groundnut",
  "What is the current mandi price?",
  "What is my expected income?",
  "What quality grade is my crop?",
  "Compare available markets",
  "What is the price trend?",
];

// Local fallback when Watson Orchestrate is unavailable
function localFallback(query, farmerProfile) {
  const q = query.toLowerCase();
  const crop = q.includes("groundnut") ? "groundnut" : (farmerProfile.crop || "cotton");
  const quantity = parseFloat(farmerProfile.quantity) || 50;

  if (q.includes("price") || q.includes("market") || q.includes("mandi") || q.includes("rate") || q.includes("trend") || q.includes("compare")) {
    const result = runPriceAgent(crop);
    const { summary } = result;
    return `📊 **Market Price (${crop.toUpperCase()})**\n\n` +
      `Best available price: **₹${summary.bestPrice}/qtl** at ${summary.bestMarket}\n` +
      `Average mandi price: ₹${summary.averagePrice}/qtl\n` +
      `MSP Reference: ₹${summary.msp}/qtl (₹${summary.premiumOverMSP} above MSP)\n\n` +
      `📈 Price Trend: **${summary.trend}**\n` +
      `🔭 Outlook: ${summary.outlook.statement}\n\n` +
      `*${result.disclaimer}*`;
  }

  if (q.includes("buyer") || (q.includes("sell") && q.includes("where")) || q.includes("where should")) {
    const result = runBuyerMatchingAgent({ crop, quantity, location: farmerProfile.location });
    const top = result.topRecommendation?.buyer;
    if (!top) return "No buyer data available. Please run a full analysis from the Home tab.";
    return `🤝 **Best Buyer Match for ${crop.toUpperCase()}**\n\n` +
      `⭐ **${top.name}**\n` +
      `📍 ${top.location} · ${top.distanceKm} km away\n` +
      `💰 Offering: **₹${top.priceOffered}/qtl**\n` +
      `📦 Requires: ${top.minQty}–${top.maxQty} quintals\n\n` +
      `💡 Why recommended: ${top.matchReason}\n\n` +
      `Total matches found: ${result.totalMatches} buyers\n\n` +
      `*${result.disclaimer}*`;
  }

  if (q.includes("store") || q.includes("storage") || q.includes("wait") || q.includes("hold")) {
    const priceResult = runPriceAgent(crop);
    const result = runStorageAdvisorAgent({
      crop, quantity,
      bestCurrentPrice: priceResult.summary.bestPrice,
      priceOutlook: priceResult.summary.outlook,
    });
    return `📦 **Sell Now vs Storage Analysis**\n\n` +
      `💸 **Sell Now:** ₹${result.sellNow.estimatedRevenue.toLocaleString("en-IN")} gross\n` +
      `📦 **Consider Storage (${result.storageMonths} months):** ₹${result.considerStorage.netRevenue.toLocaleString("en-IN")} net\n\n` +
      `🤖 **Recommendation: ${result.recommendationText}**\n\n` +
      result.reasoningSteps.map(s => `• ${s}`).join("\n") + "\n\n" +
      `*${result.disclaimer}*`;
  }

  if (q.includes("quality") || q.includes("grade")) {
    const result = runQualityAgent({ crop, qualityTier: farmerProfile.qualityTier || "medium" });
    return `🌾 **Quality Assessment (${crop.toUpperCase()})**\n\n` +
      `Estimated Grade: **${result.estimatedGrade}**\n` +
      `Buyer Impact: ${result.buyerImpact.impact} — ${result.buyerImpact.detail}\n\n` +
      (result.improvementTips.length > 0 ? `💡 Tips:\n${result.improvementTips.map(t => `• ${t}`).join("\n")}\n\n` : "") +
      `*${result.disclaimer}*`;
  }

  if (q.includes("income") || q.includes("revenue") || q.includes("money") || q.includes("earn") || q.includes("rupee") || q.includes("expected")) {
    const priceResult = runPriceAgent(crop);
    const buyerResult = runBuyerMatchingAgent({ crop, quantity, location: farmerProfile.location });
    const qualityResult = runQualityAgent({ crop, qualityTier: farmerProfile.qualityTier || "medium" });
    const storageResult = runStorageAdvisorAgent({
      crop, quantity,
      bestCurrentPrice: priceResult.summary.bestPrice,
      priceOutlook: priceResult.summary.outlook,
    });
    const dashboard = runIncomeDashboardAgent({
      farmerProfile: { ...farmerProfile, crop, quantity },
      priceResult, buyerResult, qualityResult, storageResult,
    });
    return `💰 **Income Estimate for ${quantity} qtl of ${crop.toUpperCase()}**\n\n` +
      `Best available price: ₹${dashboard.income.bestAvailablePrice}/qtl via ${dashboard.income.bestSource}\n` +
      `**Estimated Gross Revenue: ₹${dashboard.income.estimatedGrossRevenue.toLocaleString("en-IN")}**\n\n` +
      `📊 Revenue options:\n` +
      dashboard.income.breakdown.map(b => `• ${b.option}: ₹${b.totalRevenue?.toLocaleString("en-IN")}`).join("\n") + "\n\n" +
      `🤖 ${dashboard.finalRecommendation.summary}`;
  }

  return `Hello! I'm **KrishiMitra AI** 🌾\n\n` +
    `I can help you with:\n` +
    `• Current mandi prices & market comparison\n` +
    `• Finding buyers for your ${crop}\n` +
    `• Sell now vs. storage decision\n` +
    `• Crop quality assessment\n` +
    `• Income estimation\n\n` +
    `Try asking: *"Where should I sell my ${crop}?"*\nor *"What is my expected income?"*`;
}

export default function ChatScreen({ farmerProfile, onApiStatusChange }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Jai Kisan! 🌾 I'm **KrishiMitra AI**, powered by **IBM Watson Orchestrate** and **IBM Granite LLM**.\n\nI'm your agentic market decision copilot for ${farmerProfile.crop || "your crop"}.\n\nAsk me anything about prices, buyers, quality, storage, or your expected income.`,
      source: "system",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const historyRef = useRef([]); // tracks conversation for context

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (query) => {
    const q = query || input.trim();
    if (!q || loading) return;
    setInput("");

    const userMsg = { role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Maintain conversation history for Watson
    historyRef.current = [
      ...historyRef.current,
      { role: "user", content: q },
    ].slice(-10);

    try {
      // Try Watson Orchestrate first
      const watsonResponse = await chatWithWatsonOrchestrate(
        q,
        historyRef.current.slice(0, -1), // history without current message
        farmerProfile
      );

      let responseText;
      let source;

      if (watsonResponse) {
        responseText = watsonResponse;
        source = "watson";
        onApiStatusChange?.("connected");
        historyRef.current.push({ role: "assistant", content: watsonResponse });
      } else {
        // Fallback to local agent logic
        responseText = localFallback(q, farmerProfile);
        source = "local";
        onApiStatusChange?.("disconnected");
      }

      setMessages((prev) => [...prev, { role: "ai", text: responseText, source }]);
    } catch (err) {
      const fallback = localFallback(q, farmerProfile);
      setMessages((prev) => [...prev, { role: "ai", text: fallback, source: "local" }]);
      onApiStatusChange?.("disconnected");
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="screen-content" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>💬 AI Assistant</h2>
          <p>Powered by IBM Watson Orchestrate · IBM Granite LLM · Local Agent Fallback</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="ibm-badge" style={{ background: "#e3f2fd", color: "#1565c0", border: "1px solid #90caf9" }}>
            Watson Orchestrate API
          </span>
          <span className="demo-badge">DEMO DATA</span>
        </div>
      </div>

      {/* Quick questions */}
      <div className="quick-actions">
        {QUICK_QUESTIONS.map((q, i) => (
          <button key={i} className="quick-chip" onClick={() => handleSend(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="chat-container" style={{ flex: 1, minHeight: 0 }}>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              {msg.role === "ai" && (
                <div className="bubble-agent">
                  🤖 KrishiMitra AI
                  {msg.source === "watson" && (
                    <span className="watson-label">IBM Watson Orchestrate</span>
                  )}
                  {msg.source === "local" && (
                    <span className="watson-label" style={{ background: "#fff8e1", color: "#e65100" }}>
                      Local Agent
                    </span>
                  )}
                </div>
              )}
              <span dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
            </div>
          ))}
          {loading && (
            <div className="chat-bubble ai">
              <div className="bubble-agent">
                🤖 KrishiMitra AI
                <span className="watson-label">Thinking...</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#888" }}>
                <div className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Consulting IBM Watson Orchestrate...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask KrishiMitra AI about prices, buyers, quality, income..."
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            Send →
          </button>
        </div>
      </div>

      <div className="disclaimer" style={{ marginTop: 12 }}>
        🏷️ <strong>DEMO DATA</strong> — Responses use IBM Watson Orchestrate where available, with local agent fallback. All market data is sample/demo only.
      </div>
    </div>
  );
}
