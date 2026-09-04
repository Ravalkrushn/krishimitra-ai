// MarketScreen — matches reference Market Intelligence screen
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  mandiPrices,
  historicalTrend,
  priceForecast,
  msp,
} from "../../data/demoData";
import { GiWheat, GiPeanut } from "react-icons/gi";
import { MdLabel, MdCompareArrows } from "react-icons/md";
import {
  FiMapPin,
  FiTrendingUp,
  FiBarChart2,
  FiInfo,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function MarketScreen({ results, crop: initialCrop }) {
  const { copy } = useLanguage();
  const [crop, setCrop] = useState(initialCrop || "cotton");

  const markets = mandiPrices[crop] || [];
  const history = historicalTrend[crop] || [];
  const forecast = priceForecast[crop] || [];
  const allTrend = [
    ...history.map((d) => ({ ...d, type: "actual" })),
    ...forecast.map((d) => ({ ...d, type: "forecast" })),
  ];

  const best = markets.reduce(
    (b, m) => (m.price > b.price ? m : b),
    markets[0] || {},
  );
  const avg = Math.round(
    markets.reduce((s, m) => s + m.price, 0) / markets.length,
  );
  const priceResult = results?.results?.price?.summary;

  return (
    <div className="screen">
      {/* Header */}
      <div className="page-title-row">
        <div>
          <h2>{copy.marketTitle}</h2>
          <p className="page-sub">
            Live market prices, trends &amp; smart insights for better selling
            decisions.
          </p>
        </div>
        <span className="demo-badge">
          <MdLabel
            style={{ fontSize: 14, verticalAlign: "middle", marginRight: 3 }}
          />{" "}
          DEMO DATA
        </span>
      </div>

      {/* Crop Tabs */}
      <div className="crop-tabs">
        <button
          className={`crop-tab-btn ${crop === "cotton" ? "active" : ""}`}
          onClick={() => setCrop("cotton")}
        >
          <GiWheat
            style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }}
          />{" "}
          Cotton
        </button>
        <button
          className={`crop-tab-btn ${crop === "groundnut" ? "active" : ""}`}
          onClick={() => setCrop("groundnut")}
        >
          <GiPeanut
            style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }}
          />{" "}
          Groundnut
        </button>
        <div className="location-dropdown">
          <FiMapPin
            style={{ fontSize: 14, verticalAlign: "middle", marginRight: 3 }}
          />{" "}
          Gujarat ▾
        </div>
      </div>

      {/* Current Price + Trend */}
      <div className="market-price-section mb-16">
        <div className="current-price-card">
          <div className="card-label mb-8">
            Current Available Price{" "}
            <FiInfo style={{ fontSize: 13, verticalAlign: "middle" }} />
          </div>
          <div className="price-hero mb-4">
            ₹{best.price}
            <span>/Quintal</span>
          </div>
          <div
            style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 10 }}
          >
            {best.market}
          </div>
          <div className="row-8 mb-12">
            <span className="price-delta up">
              ↑ ₹{Math.abs(best.delta || 120)} (
              {((Math.abs(best.delta || 120) / best.price) * 100).toFixed(2)}%)
            </span>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              vs yesterday
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>
            Date: 17 Jun 2025, 09:30 AM
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              background: "var(--blue-100)",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--blue-700)",
                fontSize: 13,
              }}
            >
              MSP: ₹{msp[crop]}/qtl
            </span>
            <span
              style={{ fontSize: 11, color: "var(--blue-700)", marginLeft: 8 }}
            >
              ₹{best.price - msp[crop]} above MSP
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div
              style={{
                flex: 1,
                background: "var(--g-50)",
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                Avg Price
              </div>
              <div
                style={{ fontWeight: 800, color: "var(--g-800)", fontSize: 15 }}
              >
                ₹{avg}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "var(--amber-100)",
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                Markets
              </div>
              <div
                style={{
                  fontWeight: 800,
                  color: "var(--amber-600)",
                  fontSize: 15,
                }}
              >
                {markets.length}
              </div>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-label mb-12">Price Trend (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart
              data={history}
              margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#eee"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 11 }}
                width={55}
                tickFormatter={(v) => `₹${v}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(v) => [`₹${v}/qtl`, "Price"]} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#2e7d32"
                strokeWidth={2.5}
                fill="url(#trendGrad)"
                dot={{ fill: "#2e7d32", r: 4, stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--text-3)",
              marginTop: 6,
            }}
          >
            <span>
              <FiClock
                style={{
                  fontSize: 12,
                  verticalAlign: "middle",
                  marginRight: 3,
                }}
              />{" "}
              Data as on: 17 Jun 2025, 09:30 AM
            </span>
            <span>
              Source: AGMARKNET + Local Mandis{" "}
              <FiInfo style={{ fontSize: 12, verticalAlign: "middle" }} />
            </span>
          </div>
        </div>
      </div>

      {/* Market Comparison */}
      <div className="mb-20">
        <div className="row-between mb-12">
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>
              Market Comparison
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              Compare mandi prices in Gujarat
            </div>
          </div>
          <button className="btn-outline">
            <MdCompareArrows
              style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }}
            />{" "}
            Compare Markets
          </button>
        </div>
        <div className="market-cards-row">
          {[...markets]
            .sort((a, b) => b.price - a.price)
            .map((m, i) => (
              <div key={i} className={`market-card ${i === 0 ? "best" : ""}`}>
                <div className="market-card-top">
                  {i === 0 && (
                    <span className="best-price-chip">
                      <FiAward
                        style={{
                          fontSize: 12,
                          verticalAlign: "middle",
                          marginRight: 3,
                        }}
                      />{" "}
                      Best Price
                    </span>
                  )}
                  {i === 0 && (
                    <span style={{ fontSize: 16 }}>
                      <FiAward style={{ color: "#d97706" }} />
                    </span>
                  )}
                  {i !== 0 && m.district?.toLowerCase() === "jamnagar" && (
                    <span className="your-location-chip">Your Location</span>
                  )}
                </div>
                <div className="mc-name">{m.market.replace(" APMC", "")}</div>
                <div className="mc-loc">{m.district}, Gujarat</div>
                <div className="mc-price">
                  ₹{m.price}{" "}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-3)",
                    }}
                  >
                    / Quintal
                  </span>
                </div>
                <span
                  className={`price-delta ${m.delta > 0 ? "up" : m.delta < 0 ? "down" : "flat"}`}
                  style={{ fontSize: 11 }}
                >
                  {m.delta > 0 ? "↑" : "↓"} ₹{Math.abs(m.delta)} (
                  {((Math.abs(m.delta) / m.price) * 100).toFixed(2)}%)
                </span>
                <div className="mc-dist">
                  <FiMapPin
                    style={{
                      fontSize: 12,
                      verticalAlign: "middle",
                      marginRight: 3,
                    }}
                  />{" "}
                  {40 + i * 25} km
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Price Outlook + AI Insight */}
      <div className="outlook-insight-row">
        <div className="card card-pad">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
            Price Outlook (Next 7 Days){" "}
            <FiInfo style={{ fontSize: 13, verticalAlign: "middle" }} />
          </div>
          <div className="row-8 mb-12">
            <span className="chip chip-green">
              <FiTrendingUp
                style={{
                  fontSize: 13,
                  verticalAlign: "middle",
                  marginRight: 3,
                }}
              />{" "}
              Increasing
            </span>
          </div>
          <div
            style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 8 }}
          >
            Prices likely to increase by
            <br />
            <strong style={{ fontSize: 18 }}>₹100 – ₹200 /Quintal</strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            High demand and low arrival expected.
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span style={{ fontSize: 32 }}>
              <FiBarChart2 style={{ color: "#2e7d32" }} />
            </span>
          </div>
        </div>
        <div className="card card-pad">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
            <FaRobot
              style={{ fontSize: 15, verticalAlign: "middle", marginRight: 5 }}
            />{" "}
            AI Market Insight
          </div>
          <div
            style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}
          >
            {crop === "cotton"
              ? "Cotton arrival is low in most mandis of Saurashtra. Rajkot and Gondal markets are showing strong demand from textile mills. Selling in next 2–3 days may give better returns."
              : "Groundnut oil demand is rising. Junagadh and Rajkot mandis showing upward price movement. Export-quality groundnut commanding premium prices this week."}
          </div>
          <button
            className="btn-outline"
            style={{
              marginTop: 14,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            View Full Insight <span>›</span>
          </button>
        </div>
      </div>

      {/* Best Market For You Banner */}
      <div className="best-market-banner">
        <div className="bmb-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 14 }}>
              <FiAward style={{ color: "#ffd700" }} />
            </span>
            <span style={{ fontWeight: 800, fontSize: 16 }}>
              {best.market?.replace(" APMC", "")}
            </span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {best.district}, Gujarat
          </div>
          <div style={{ marginTop: 6 }}>
            <span
              className="chip"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: 10,
                border: "none",
              }}
            >
              <FiMapPin
                style={{
                  fontSize: 10,
                  verticalAlign: "middle",
                  marginRight: 3,
                }}
              />{" "}
              Recommended by AI
            </span>
          </div>
        </div>
        <div className="bmb-section">
          <div className="bmb-label">Expected Price</div>
          <div className="bmb-value">₹{best.price} /Quintal</div>
        </div>
        <div className="bmb-section">
          <div className="bmb-label">Distance</div>
          <div className="bmb-value">65 km</div>
          <div className="bmb-sub">Transport Cost (Est.): ₹80/qtl</div>
        </div>
        <div className="bmb-section">
          <div className="bmb-label">Potential Gain</div>
          <div className="bmb-value">₹{best.price - avg} /Quintal more</div>
        </div>
        <button className="btn-view-options">View Selling Options ›</button>
      </div>

      {/* 30-day trend chart */}
      <div className="card card-pad mb-16">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
          Price Trend (Last 30 Days)
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={allTrend}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="grad30" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eee"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              width={55}
              tickFormatter={(v) => `₹${v}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v, n, p) => [
                `₹${v}`,
                p.payload.type === "forecast"
                  ? "Forecast (Est.)"
                  : "Actual Price",
              ]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2e7d32"
              strokeWidth={2.5}
              fill="url(#grad30)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    key={`d-${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={payload.type === "forecast" ? "#ff8f00" : "#2e7d32"}
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "var(--text-3)",
            marginTop: 8,
          }}
        >
          <span>
            <FiClock
              style={{ fontSize: 12, verticalAlign: "middle", marginRight: 3 }}
            />{" "}
            Data as on: 17 Jun 2025, 09:30 AM
          </span>
          <span style={{ display: "flex", gap: 14 }}>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#2e7d32",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />{" "}
              Actual
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ff8f00",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />{" "}
              Forecast (Est.)
            </span>
          </span>
        </div>
      </div>

      <div className="disclaimer">
        <strong>Disclaimer:</strong> Current prices are demo/sample data.
        Forecasts and outlooks are AI-generated based on historical trend data.
        Actual prices may vary. <strong>Not real-time AGMARKNET data.</strong>
      </div>
    </div>
  );
}
