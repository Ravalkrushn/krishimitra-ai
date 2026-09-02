// QualityScreen — matches reference UI
import React, { useState } from "react";

const DEMO_QUALITY = {
  crop: "Cotton",
  parameters: [
    { icon: "💧", label: "Moisture",      value: "8.7%",    status: "Good",  statusColor: "green" },
    { icon: "📏", label: "Staple Length", value: "28.5 mm", status: "Good",  statusColor: "green" },
    { icon: "🌀", label: "Micronaire",    value: "4.2",     status: "Good",  statusColor: "green" },
    { icon: "🗑️", label: "Trash Content", value: "2.8%",    status: "Low",   statusColor: "amber" },
    { icon: "🎨", label: "Color Grade",   value: "Whiteness",status:"Good",  statusColor: "green" },
    { icon: "🔗", label: "Fiber Strength",value: "Strong",  status: "Good",  statusColor: "green" },
  ],
  score: 84,
  grade: "SG-2",
  gradeLabel: "Good Quality Cotton",
  marketGrade: "Good for Premium Markets",
  confidence: "High",
  indicators: [
    { text: "Low moisture - good for storing & transport" },
    { text: "Staple length suitable for textile mills" },
    { text: "Low trash content - cleaner cotton" },
    { text: "Good strength - better yield for buyers" },
  ],
  compatibility: "High Compatibility",
  suitableFor: ["SG-2 or Better", "Mills & Exporters"],
  priceMin: 7400,
  priceMax: 7700,
  demand: "High",
  buyers: [
    { name: "Shree Rang Agro Industries", dist: 52, price: 7560, match: "Good Match",   matchColor: "green" },
    { name: "Gujarat Cotton Traders LLP",  dist: 65, price: 7420, match: "Good Match",   matchColor: "green" },
    { name: "Maruti Textiles Pvt. Ltd.",   dist: 210, price: 7250, match: "Medium Match", matchColor: "amber" },
  ],
  insight: "Your cotton quality (SG-2) is in high demand. You can target premium buyers and get ₹150 - ₹250 more per quintal compared to lower grades.\n\nLow moisture and low trash content increase buyer trust and reduce rejection risk.",
  recommendation: "We recommend selling in the next 2-3 days for better returns.",
};

function ScoreRing({ score }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke="#166534" strokeWidth="8"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text x="48" y="44" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1f2328">{score}</text>
      <text x="48" y="58" textAnchor="middle" fontSize="10" fill="#57606a">/100</text>
    </svg>
  );
}

export default function QualityScreen({ results, profile }) {
  const [imageUploaded, setImageUploaded] = useState(true);
  const crop = profile?.crop || "cotton";
  const q = DEMO_QUALITY;

  const statusStyle = (color) => ({
    green: { color: "#166534" },
    amber: { color: "#b45309" },
    red:   { color: "#b91c1c" },
  }[color] || { color: "#57606a" });

  return (
    <div className="screen">
      {/* ── Header ── */}
      <div className="qs-header-row">
        <div className="qs-back-btn">←</div>
        <div className="qs-header-text">
          <h2 className="qs-title">Quality Assistant</h2>
          <p className="qs-sub">Check crop quality and get AI insights for better prices</p>
        </div>
        <span className="demo-badge demo-badge-gold">🔆 DEMO ANALYSIS</span>
      </div>

      {/* ── Crop Selector ── */}
      <div className="qs-crop-row">
        <span className="qs-crop-label">Select Crop</span>
        <div className="qs-crop-select">
          <span className="qs-crop-icon">🌿</span>
          <span className="qs-crop-name">{q.crop}</span>
          <span className="qs-crop-chevron">▾</span>
        </div>
      </div>

      {/* ── Upload Card ── */}
      <div className="card card-pad qs-upload-card mb-16">
        <div className="qs-upload-title">Upload Crop Image</div>
        <div className="qs-upload-body">
          <div className="qs-upload-left">
            <div className="qs-img-placeholder">
              <div className="qs-img-inner">
                {/* Cotton image placeholder */}
                <div className="qs-cotton-img">
                  <div className="qs-cotton-emoji">🌾</div>
                </div>
                <div className="qs-img-check">✓</div>
              </div>
            </div>
            <button className="qs-retake-btn">📷 Retake Photo</button>
            <div className="qs-img-hint">Best results with clear, close-up images</div>
          </div>
          <div className="qs-upload-right">
            <div className="qs-manual-icon">✏️</div>
            <div className="qs-manual-title">Or Enter Quality Manually</div>
            <div className="qs-manual-sub">Don't want to upload image?</div>
            <button className="qs-manual-btn">Enter Quality Details <span>›</span></button>
          </div>
        </div>
      </div>

      {/* ── Quality Parameters ── */}
      <div className="card card-pad mb-16">
        <div className="qs-params-header">
          <span className="qs-params-title">Quality Parameters</span>
          <span className="qs-params-sub">Based on Image Analysis</span>
        </div>
        <div className="qs-params-grid">
          {q.parameters.map((p, i) => (
            <div key={i} className="qs-param-item">
              <div className="qs-param-icon">{p.icon}</div>
              <div className="qs-param-label">{p.label}</div>
              <div className="qs-param-value">{p.value}</div>
              <div className="qs-param-status" style={statusStyle(p.statusColor)}>{p.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Quality Assessment ── */}
      <div className="card card-pad mb-16 qs-ai-card">
        <div className="qs-ai-header">
          <span className="qs-ai-icon">⭐</span>
          <span className="qs-ai-title">AI-Assisted Quality Assessment</span>
        </div>
        <div className="qs-ai-body">
          <div className="qs-ai-score-col">
            <ScoreRing score={q.score} />
            <div className="qs-score-label">Quality Score</div>
          </div>
          <div className="qs-ai-grade-col">
            <div className="qs-ai-grade-sub">Estimated Quality Level</div>
            <div className="qs-ai-grade-badge">{q.grade}</div>
            <div className="qs-ai-grade-label">{q.gradeLabel}</div>
          </div>
          <div className="qs-ai-market-col">
            <div className="qs-ai-market-sub">Market Grade Equivalent</div>
            <div className="qs-ai-market-val">{q.marketGrade}</div>
            <div className="qs-ai-confidence">
              <span className="qs-conf-icon">📊</span>
              <span className="qs-conf-label">Confident Analysis</span>
              <span className="qs-conf-val">{q.confidence}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Important Quality Indicators ── */}
      <div className="card card-pad mb-16">
        <div className="qs-ind-header">
          <span className="qs-ind-title">Important Quality Indicators</span>
          <span className="qs-ind-link">View Details</span>
        </div>
        <div className="qs-ind-grid">
          {q.indicators.map((ind, i) => (
            <div key={i} className="qs-ind-item">
              <span className="qs-ind-check">✓</span>
              <span className="qs-ind-text">{ind.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Buyer Compatibility ── */}
      <div className="card card-pad mb-16">
        <div className="qs-compat-header">
          <span className="qs-compat-title">Buyer Compatibility</span>
          <span className="chip chip-green qs-compat-chip">{q.compatibility}</span>
        </div>
        <div className="qs-compat-grid">
          <div className="qs-compat-item">
            <div className="qs-compat-label">Suitable for</div>
            {q.suitableFor.map((s, i) => (
              <div key={i} className="qs-compat-val">{s}</div>
            ))}
          </div>
          <div className="qs-compat-item">
            <div className="qs-compat-label">Price Potential</div>
            <div className="qs-compat-val">₹{q.priceMin.toLocaleString("en-IN")} - ₹{q.priceMax.toLocaleString("en-IN")}</div>
            <div className="qs-compat-sub">/ Quintal</div>
          </div>
          <div className="qs-compat-item">
            <div className="qs-compat-label">Demand</div>
            <div className="qs-compat-val qs-demand-high">{q.demand}</div>
            <div className="qs-compat-sub">in your region</div>
            <div className="qs-demand-chart">📈</div>
          </div>
        </div>
      </div>

      {/* ── Potentially Suitable Buyers ── */}
      <div className="card card-pad mb-16">
        <div className="qs-buyers-header">
          <span className="qs-buyers-title">Potentially Suitable Buyers</span>
          <span className="qs-buyers-link">View All Buyers ›</span>
        </div>
        <div className="qs-buyers-row">
          {q.buyers.map((b, i) => (
            <div key={i} className="qs-buyer-card">
              <div className="qs-buyer-badge">DEMO BUYER</div>
              <div className="qs-buyer-icon">🏢</div>
              <div className="qs-buyer-name">{b.name}</div>
              <div className="qs-buyer-dist">{b.dist} km from you</div>
              <div className="qs-buyer-price">₹{b.price.toLocaleString("en-IN")} /Quintal</div>
              <div className={`qs-buyer-match qs-buyer-match-${b.matchColor}`}>
                <span>⭐</span> {b.match}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Insight ── */}
      <div className="card card-pad mb-16 qs-insight-card">
        <div className="qs-insight-header">
          <span className="qs-insight-icon">💡</span>
          <span className="qs-insight-title">How Quality Affects Your Selling Options (AI Insight)</span>
        </div>
        <div className="qs-insight-body">
          <div className="qs-insight-text">
            {q.insight.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
            <p><strong>{q.recommendation}</strong></p>
          </div>
          <div className="qs-insight-img">🌾</div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="disclaimer qs-disclaimer">
        <span className="qs-disc-icon">🛡️</span>
        <span>
          <strong style={{color:"#b45309"}}>Disclaimer:</strong> AI-assisted estimation — not official laboratory certification.
          For official quality certification, please contact authorized labs or mandi authorities.
        </span>
      </div>
    </div>
  );
}
