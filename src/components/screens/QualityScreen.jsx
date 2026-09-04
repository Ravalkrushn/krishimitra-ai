import React, { useState } from "react";
import toast from "react-hot-toast";
import { GiWheat, GiPeanut } from "react-icons/gi";
import {
  FiDroplet,
  FiCamera,
  FiEdit2,
  FiBarChart2,
  FiTrendingUp,
  FiShield,
  FiSun,
  FiLink,
} from "react-icons/fi";
import { MdOutlineStraighten, MdRotateRight, MdLabel } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoColorPaletteOutline, IoCloudUploadOutline } from "react-icons/io5";
import { HiSparkles, HiLightBulb } from "react-icons/hi";
import { FiStar as FiStarIcon } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const DEMO_QUALITY = {
  crop: "Cotton",
  parameters: [
    {
      icon: <FiDroplet style={{ color: "#3b82f6" }} />,
      label: "Moisture",
      value: "8.7%",
      status: "Good",
      statusColor: "green",
    },
    {
      icon: <MdOutlineStraighten style={{ color: "#8b5cf6" }} />,
      label: "Staple Length",
      value: "28.5 mm",
      status: "Good",
      statusColor: "green",
    },
    {
      icon: <MdRotateRight style={{ color: "#06b6d4" }} />,
      label: "Micronaire",
      value: "4.2",
      status: "Good",
      statusColor: "green",
    },
    {
      icon: <FaTrashAlt style={{ color: "#ef4444" }} />,
      label: "Trash Content",
      value: "2.8%",
      status: "Low",
      statusColor: "amber",
    },
    {
      icon: <IoColorPaletteOutline style={{ color: "#f59e0b" }} />,
      label: "Color Grade",
      value: "Whiteness",
      status: "Good",
      statusColor: "green",
    },
    {
      icon: <FiLink style={{ color: "#10b981" }} />,
      label: "Fiber Strength",
      value: "Strong",
      status: "Good",
      statusColor: "green",
    },
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
    {
      name: "Shree Rang Agro Industries",
      dist: 52,
      price: 7560,
      match: "Good Match",
      matchColor: "green",
    },
    {
      name: "Gujarat Cotton Traders LLP",
      dist: 65,
      price: 7420,
      match: "Good Match",
      matchColor: "green",
    },
    {
      name: "Maruti Textiles Pvt. Ltd.",
      dist: 210,
      price: 7250,
      match: "Medium Match",
      matchColor: "amber",
    },
  ],
  insight:
    "Your cotton quality (SG-2) is in high demand. You can target premium buyers and get ₹150 - ₹250 more per quintal compared to lower grades.\n\nLow moisture and low trash content increase buyer trust and reduce rejection risk.",
  recommendation:
    "We recommend selling in the next 2-3 days for better returns.",
};

function ScoreRing({ score }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="8"
      />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="#166534"
        strokeWidth="8"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text
        x="48"
        y="44"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fill="#1f2328"
      >
        {score}
      </text>
      <text x="48" y="58" textAnchor="middle" fontSize="10" fill="#57606a">
        /100
      </text>
    </svg>
  );
}

export default function QualityScreen({ results, profile }) {
  const { copy } = useLanguage();
  const crop = profile?.crop || "cotton";

  // Interactive State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [q, setQ] = useState(DEMO_QUALITY);

  const statusStyle = (color) =>
    ({
      green: { color: "#166534" },
      amber: { color: "#b45309" },
      red: { color: "#b91c1c" },
    })[color] || { color: "#57606a" };

  const handleSimulateUpload = () => {
    setIsAnalyzing(true);
    setAnalysisDone(false);
    setShowManualForm(false);
    toast("Uploading image to AI...");

    setTimeout(() => {
      toast("Analyzing crop parameters...");
    }, 1500);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
      toast.success("Quality Analysis Complete");
    }, 3500);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const m = fd.get("moisture");
    const t = fd.get("trash");

    const newQ = JSON.parse(JSON.stringify(DEMO_QUALITY)); // deep copy
    // Re-assign icons since they don't survive JSON parse
    newQ.parameters = DEMO_QUALITY.parameters.map((p, i) => ({
      ...p,
      value: newQ.parameters[i].value,
    }));

    if (m) {
      const p = newQ.parameters.find((x) => x.label === "Moisture");
      if (p) p.value = m + "%";
    }
    if (t) {
      const p = newQ.parameters.find((x) => x.label === "Trash Content");
      if (p) p.value = t + "%";
    }

    let scoreMod = 0;
    if (parseFloat(m) > 10) scoreMod -= 10;
    if (parseFloat(t) > 5) scoreMod -= 8;

    newQ.score = Math.max(0, DEMO_QUALITY.score + scoreMod);
    if (newQ.score < 75) {
      newQ.grade = "Grade B";
      newQ.marketGrade = "Medium Quality";
      newQ.priceMin -= 200;
      newQ.priceMax -= 200;
      newQ.statusColor = "amber";
    }

    setQ(newQ);
    setShowManualForm(false);
    setAnalysisDone(true);
    toast.success("Quality manually updated");
  };

  return (
    <div className="screen">
      {/* ── Header ── */}
      <div className="qs-header-row">
        <div className="qs-back-btn">←</div>
        <div className="qs-header-text">
          <h2 className="qs-title">{copy.qualityTitle}</h2>
          <p className="qs-sub">
            Check crop quality and get AI insights for better prices
          </p>
        </div>
        <span className="demo-badge demo-badge-gold">
          <FiSun
            style={{ fontSize: 13, verticalAlign: "middle", marginRight: 3 }}
          />{" "}
          DEMO ANALYSIS
        </span>
      </div>

      {/* ── Crop Selector ── */}
      <div className="qs-crop-row">
        <span className="qs-crop-label">Selected Crop</span>
        <div className="qs-crop-select">
          <span className="qs-crop-icon">
            {crop === "cotton" ? (
              <GiWheat style={{ fontSize: 18, color: "#1a5c2a" }} />
            ) : (
              <GiPeanut style={{ fontSize: 18, color: "#d97706" }} />
            )}
          </span>
          <span className="qs-crop-name">
            {crop.charAt(0).toUpperCase() + crop.slice(1)}
          </span>
        </div>
      </div>

      {/* ── Upload Card ── */}
      <div className="card card-pad qs-upload-card mb-16">
        <div className="qs-upload-title">Evaluate Crop Quality</div>
        <div className="qs-upload-body">
          <div
            className="qs-upload-left"
            onClick={handleSimulateUpload}
            style={{
              cursor: "pointer",
              border: isAnalyzing ? "2px solid #2e7d32" : "",
            }}
          >
            <div className="qs-img-placeholder">
              <div className="qs-img-inner">
                {isAnalyzing ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      className="loading-spinner"
                      style={{
                        width: 24,
                        height: 24,
                        borderColor: "#2e7d32",
                        borderTopColor: "transparent",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 12,
                        color: "#2e7d32",
                        fontWeight: 600,
                      }}
                    >
                      AI Analyzing...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="qs-cotton-img">
                      <div className="qs-cotton-emoji">
                        {crop === "cotton" ? (
                          <GiWheat style={{ fontSize: 32, color: "#1a5c2a" }} />
                        ) : (
                          <GiPeanut
                            style={{ fontSize: 32, color: "#d97706" }}
                          />
                        )}
                      </div>
                    </div>
                    {analysisDone && <div className="qs-img-check">✓</div>}
                  </>
                )}
              </div>
            </div>
            <button className="qs-retake-btn" disabled={isAnalyzing}>
              <FiCamera
                style={{
                  fontSize: 14,
                  verticalAlign: "middle",
                  marginRight: 4,
                }}
              />{" "}
              {analysisDone ? "Retake Photo" : "Upload Photo"}
            </button>
            <div className="qs-img-hint">
              Tap to upload and let AI estimate quality
            </div>
          </div>

          <div className="qs-upload-right">
            <div className="qs-manual-icon">
              <FiEdit2 style={{ fontSize: 20, color: "#6b7280" }} />
            </div>
            <div className="qs-manual-title">Or Enter Details Manually</div>
            <div className="qs-manual-sub">Don't have a good image?</div>
            <button
              className="qs-manual-btn"
              onClick={() => setShowManualForm(!showManualForm)}
            >
              {showManualForm ? "Cancel Manual Entry" : "Enter Quality Details"}{" "}
              <span>›</span>
            </button>
          </div>
        </div>

        {/* Manual Entry Form */}
        {showManualForm && (
          <form
            className="manual-quality-form mt-16"
            onSubmit={handleManualSubmit}
            style={{
              background: "#f9fafb",
              padding: 16,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{ fontWeight: 600, marginBottom: 12, color: "#374151" }}
            >
              Manual Quality Entry
            </div>
            <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#6b7280",
                  }}
                >
                  Moisture %
                </label>
                <input
                  name="moisture"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 8.5"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#6b7280",
                  }}
                >
                  Trash Content %
                </label>
                <input
                  name="trash"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.5"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                  }}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "10px" }}
            >
              Save & Update Analysis
            </button>
          </form>
        )}
      </div>

      {/* ── Show Results ONLY if analysis is done ── */}
      {analysisDone && (
        <div className="results-animate-in">
          {/* ── AI Quality Assessment ── */}
          <div className="card card-pad mb-16 qs-ai-card">
            <div className="qs-ai-header">
              <span className="qs-ai-icon">
                <FiStarIcon style={{ fontSize: 18, color: "#f59e0b" }} />
              </span>
              <span className="qs-ai-title">
                AI-Assisted Quality Assessment
              </span>
            </div>
            <div className="qs-ai-body">
              <div className="qs-ai-score-col">
                <ScoreRing score={q.score} />
                <div className="qs-score-label">Quality Score</div>
              </div>
              <div className="qs-ai-grade-col">
                <div className="qs-ai-grade-sub">Estimated Quality Level</div>
                <div
                  className="qs-ai-grade-badge"
                  style={{
                    background: q.score < 75 ? "#fef3c7" : "",
                    color: q.score < 75 ? "#b45309" : "",
                  }}
                >
                  {q.grade}
                </div>
                <div className="qs-ai-grade-label">{q.gradeLabel}</div>
              </div>
              <div className="qs-ai-market-col">
                <div className="qs-ai-market-sub">Market Grade Equivalent</div>
                <div className="qs-ai-market-val">{q.marketGrade}</div>
                <div className="qs-ai-confidence">
                  <span className="qs-conf-icon">
                    <FiBarChart2 style={{ fontSize: 14, color: "#2e7d32" }} />
                  </span>
                  <span className="qs-conf-label">Confident Analysis</span>
                  <span className="qs-conf-val">{q.confidence}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quality Parameters ── */}
          <div className="card card-pad mb-16">
            <div className="qs-params-header">
              <span className="qs-params-title">Quality Parameters</span>
            </div>
            <div className="qs-params-grid">
              {q.parameters.map((p, i) => (
                <div key={i} className="qs-param-item">
                  <div className="qs-param-icon">{p.icon}</div>
                  <div className="qs-param-label">{p.label}</div>
                  <div className="qs-param-value">{p.value}</div>
                  <div
                    className="qs-param-status"
                    style={statusStyle(p.statusColor)}
                  >
                    {p.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Buyer Compatibility ── */}
          <div className="card card-pad mb-16">
            <div className="qs-compat-header">
              <span className="qs-compat-title">Buyer Compatibility</span>
              <span
                className={`chip ${q.score < 75 ? "chip-amber" : "chip-green"} qs-compat-chip`}
              >
                {q.compatibility}
              </span>
            </div>
            <div className="qs-compat-grid">
              <div className="qs-compat-item">
                <div className="qs-compat-label">Suitable for</div>
                {q.suitableFor.map((s, i) => (
                  <div key={i} className="qs-compat-val">
                    {s}
                  </div>
                ))}
              </div>
              <div className="qs-compat-item">
                <div className="qs-compat-label">Price Potential</div>
                <div className="qs-compat-val">
                  ₹{q.priceMin.toLocaleString("en-IN")} - ₹
                  {q.priceMax.toLocaleString("en-IN")}
                </div>
                <div className="qs-compat-sub">/ Quintal</div>
              </div>
              <div className="qs-compat-item">
                <div className="qs-compat-label">Demand</div>
                <div className="qs-compat-val qs-demand-high">{q.demand}</div>
                <div className="qs-compat-sub">in your region</div>
                <div className="qs-demand-chart">
                  <FiTrendingUp style={{ fontSize: 20, color: "#2e7d32" }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── AI Insight ── */}
          <div className="card card-pad mb-16 qs-insight-card">
            <div className="qs-insight-header">
              <span className="qs-insight-icon">
                <HiLightBulb style={{ fontSize: 20, color: "#f59e0b" }} />
              </span>
              <span className="qs-insight-title">
                How Quality Affects Your Selling Options (AI Insight)
              </span>
            </div>
            <div className="qs-insight-body">
              <div className="qs-insight-text">
                {q.insight.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p>
                  <strong>{q.recommendation}</strong>
                </p>
              </div>
              <div className="qs-insight-img">
                {crop === "cotton" ? (
                  <GiWheat style={{ fontSize: 28, color: "#1a5c2a" }} />
                ) : (
                  <GiPeanut style={{ fontSize: 28, color: "#d97706" }} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="disclaimer qs-disclaimer mt-16">
        <span className="qs-disc-icon">
          <FiShield style={{ fontSize: 18, color: "#b45309" }} />
        </span>
        <span>
          <strong style={{ color: "#b45309" }}>Disclaimer:</strong> AI-assisted
          estimation — not official laboratory certification. For official
          quality certification, please contact authorized labs or mandi
          authorities.
        </span>
      </div>
    </div>
  );
}
