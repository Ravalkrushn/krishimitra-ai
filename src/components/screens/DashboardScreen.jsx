// ============================================================
//  Screen: Income Dashboard (Agent 5 Output) — THE MAIN RESULT
// ============================================================

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaRobot } from "react-icons/fa";
import {
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiTag,
  FiTrendingDown,
  FiTrendingUp,
  FiArrowRight,
  FiPrinter,
  FiMessageCircle,
} from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import { useLanguage } from "../../context/LanguageContext";

export default function DashboardScreen({
  results,
  farmerProfile,
  isRunning,
  completedSteps,
  activeStep,
  onLaunch,
}) {
  const { copy } = useLanguage();
  const dashboard = results?.results?.dashboard;

  // --- Workflow Step display ---
  const AGENT_STEPS = [
    {
      key: "price_done",
      icon: <FiBarChart2 />,
      label: "Market Price Analysis",
    },
    { key: "buyers_done", icon: <FiMessageCircle />, label: "Buyer Matching" },
    { key: "quality_done", icon: <GiWheat />, label: "Quality Evaluation" },
    {
      key: "storage_done",
      icon: <FiPackage />,
      label: "Sell vs Store Analysis",
    },
    {
      key: "dashboard_done",
      icon: <FiDollarSign />,
      label: "Income & Recommendation",
    },
  ];

  const isStepDone = (key) => completedSteps.includes(key);
  const isStepActive = (key) =>
    activeStep?.step?.startsWith(key.replace("_done", ""));

  if (isRunning) {
    const progress = (completedSteps.length / AGENT_STEPS.length) * 100;
    return (
      <div className="screen-content">
        <div className="card">
          <div className="card-title">
            <FaRobot /> KrishiMitra AI — Running Analysis
          </div>
          <div style={{ marginBottom: 14 }}>
            {AGENT_STEPS.map((step) => (
              <div key={step.key} className="agent-step">
                <span className="step-icon">{step.icon}</span>
                <span>{step.label}</span>
                <span
                  className={`step-status ${isStepDone(step.key) ? "done" : isStepActive(step.key) ? "running" : "pending"}`}
                >
                  {isStepDone(step.key) ? (
                    <>
                      <FiCheckCircle /> Done
                    </>
                  ) : isStepActive(step.key) ? (
                    <>
                      <FiClock /> Running...
                    </>
                  ) : (
                    "Pending"
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#888",
              marginTop: 6,
            }}
          >
            {activeStep?.label || "Initialising..."}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div className="loading-spinner" />
          <p style={{ fontSize: 13, color: "#888", marginTop: 10 }}>
            Analysing your crop...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="screen-content">
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            <FiDollarSign />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            Your Dashboard
          </div>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
            Fill in your crop details on the Home tab and tap
            <br />
            "Get My Best Market Decision" to see your complete analysis.
          </p>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "12px 24px" }}
            onClick={() => onLaunch && onLaunch(farmerProfile)}
          >
            <FiRefreshCw /> Run Analysis Now
          </button>
        </div>

        {/* Architecture preview */}
        <div className="card">
          <div className="card-title">
            <FiRefreshCw /> How KrishiMitra AI Works
          </div>
          {AGENT_STEPS.map((step, i) => (
            <div key={step.key} className="agent-step">
              <span className="step-icon">{step.icon}</span>
              <span style={{ fontSize: 13 }}>{step.label}</span>
              <span className="step-status pending">Ready</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Revenue comparison chart ---
  const incomeBreakdown = dashboard.income?.breakdown || [];
  const chartData = incomeBreakdown.map((b) => ({
    name: b.option.replace(" (Mandi)", "").replace(" (Direct Buyer)", ""),
    revenue: b.totalRevenue,
  }));
  const CHART_COLORS = ["#2e7d32", "#1565c0", "#ff8f00"];

  return (
    <div className="screen-content">
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2>
            <FiDollarSign /> {copy.dashboardTitle}
          </h2>
          <p>
            Agent 5 — Farmer Income Dashboard · Final recommendation & revenue
            estimate
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="btn-secondary"
            style={{
              padding: "6px 12px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => {
              const text = encodeURIComponent(
                `KrishiMitra AI Report\n\nFarmer: ${dashboard.farmerProfile.name}\nCrop: ${dashboard.farmerProfile.crop}\n\nRecommended Action: ${dashboard.finalRecommendation?.summary}\nEstimated Revenue: ₹${dashboard.income?.estimatedGrossRevenue?.toLocaleString("en-IN")}\n\nGenerated by KrishiMitra AI`,
              );
              window.open(`https://wa.me/?text=${text}`, "_blank");
            }}
          >
            <FiMessageCircle style={{ color: "#25D366", fontSize: 16 }} /> Share
            via WhatsApp
          </button>
          <button
            className="btn-secondary"
            style={{
              padding: "6px 12px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => window.print()}
          >
            <FiPrinter /> Print / Save PDF
          </button>
          <span className="demo-badge">
            <FiTag /> DEMO DATA
          </span>
        </div>
      </div>

      {/* KPI Tiles — 4 across */}
      <div className="metric-grid">
        <div className="metric-tile">
          <div className="metric-value">
            ₹{dashboard.income?.estimatedGrossRevenue?.toLocaleString("en-IN")}
          </div>
          <div className="metric-label">Estimated Gross Revenue</div>
          <div className="metric-sub">{dashboard.income?.bestSource}</div>
        </div>
        <div className="metric-tile">
          <div className="metric-value">
            ₹{dashboard.marketSnapshot?.bestPrice}
          </div>
          <div className="metric-label">Best Mandi Price / Qtl</div>
          <div className="metric-sub">
            {dashboard.marketSnapshot?.bestMarket}
          </div>
        </div>
        <div className="metric-tile">
          <div className="metric-value" style={{ fontSize: 18 }}>
            {dashboard.marketSnapshot?.outlook === "Increasing" ? (
              <>
                <FiTrendingUp /> Rising
              </>
            ) : dashboard.marketSnapshot?.outlook === "Decreasing" ? (
              <>
                <FiTrendingDown /> Falling
              </>
            ) : (
              <>
                <FiArrowRight /> Stable
              </>
            )}
          </div>
          <div className="metric-label">Price Outlook</div>
        </div>
        <div className="metric-tile">
          <div className="metric-value">
            {dashboard.buyerSummary?.totalMatches}
          </div>
          <div className="metric-label">Buyers Matched</div>
          <div className="metric-sub">
            {dashboard.qualitySummary?.estimatedGrade}
          </div>
        </div>
      </div>

      {/* Two-column desktop layout */}
      <div className="grid-2" style={{ marginBottom: 20, alignItems: "start" }}>
        {/* LEFT COL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Main Recommendation */}
          <div className="recommendation-box">
            <h3>
              <FaRobot /> AI Final Recommendation
            </h3>
            <div className="rec-main">
              {dashboard.finalRecommendation?.summary}
            </div>
            <div
              style={{
                marginTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.3)",
                paddingTop: 12,
                display: "flex",
                gap: 40,
              }}
            >
              <div>
                <div className="rec-label">Estimated Gross Revenue</div>
                <div className="rec-revenue">
                  ₹
                  {dashboard.income?.estimatedGrossRevenue?.toLocaleString(
                    "en-IN",
                  )}
                </div>
              </div>
              <div>
                <div className="rec-label">Storage Decision</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {dashboard.storageSummary?.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* MY FARM */}
          <div
            className="card"
            style={{ background: "#f0f4ff", border: "1px solid #c5cae9" }}
          >
            <div className="card-title" style={{ color: "#1565c0" }}>
              <GiWheat /> MY FARM
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                fontSize: 14,
              }}
            >
              <div>
                <span style={{ color: "#888", fontSize: 12 }}>Farmer</span>
                <br />
                <strong>{dashboard.farmerProfile.name}</strong>
              </div>
              <div>
                <span style={{ color: "#888", fontSize: 12 }}>Crop</span>
                <br />
                <strong>
                  {dashboard.farmerProfile.crop.charAt(0).toUpperCase() +
                    dashboard.farmerProfile.crop.slice(1)}
                </strong>
              </div>
              <div>
                <span style={{ color: "#888", fontSize: 12 }}>Quantity</span>
                <br />
                <strong>{dashboard.farmerProfile.quantity} quintals</strong>
              </div>
              <div>
                <span style={{ color: "#888", fontSize: 12 }}>Location</span>
                <br />
                <strong>{dashboard.farmerProfile.location}</strong>
              </div>
            </div>
          </div>

          {/* Why */}
          <div className="card">
            <div className="card-title">
              <FaRobot /> Why This Decision?
            </div>
            <ul className="steps-list">
              {dashboard.finalRecommendation?.steps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          {/* Assumptions */}
          <div className="card">
            <div className="card-title">
              <FiTag /> Assumptions Used
            </div>
            <ul className="assumption-list">
              {dashboard.finalRecommendation?.assumptions?.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Revenue Chart */}
          <div className="card">
            <div className="card-title">
              <FiDollarSign /> Revenue Comparison
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  width={50}
                />
                <Tooltip
                  formatter={(v) => [
                    `₹${v.toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Before storage/transport costs ·{" "}
              {dashboard.farmerProfile.quantity} quintals
            </div>
          </div>

          {/* Agentic Workflow */}
          <div className="card">
            <div className="card-title">
              <FiRefreshCw /> Agentic Workflow — All Complete
            </div>
            {AGENT_STEPS.map((step) => (
              <div key={step.key} className="agent-step">
                <span className="step-icon">{step.icon}</span>
                <span style={{ fontSize: 13 }}>{step.label}</span>
                <span className="step-status done">✓ Done</span>
              </div>
            ))}
          </div>

          {/* Storage Decision */}
          <div className="card">
            <div className="card-title">
              <FiPackage /> Storage Decision
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                padding: "8px 0",
              }}
            >
              <span style={{ fontSize: 32 }}>
                <FiPackage />
              </span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {dashboard.storageSummary?.recommendation}
                </div>
                {dashboard.storageSummary?.netDifference > 0 && (
                  <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                    Storage net gain estimate: ₹
                    {dashboard.storageSummary.netDifference.toLocaleString(
                      "en-IN",
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end grid-2 */}

      <div className="disclaimer">
        <FiTag /> <strong>DEMO DATA</strong> — All figures are estimates based
        on sample market data. The final selling decision is yours. KrishiMitra
        AI provides decision support, not financial guarantees.
      </div>
    </div>
  );
}
