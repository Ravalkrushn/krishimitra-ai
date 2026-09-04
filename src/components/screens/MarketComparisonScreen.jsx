import React, { useMemo, useState } from "react";
import { FiArrowRight, FiCheck, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { GiPeanut, GiWheat } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import {
  MdCompareArrows,
  MdPeople,
  MdSell,
  MdStorefront,
} from "react-icons/md";

const MARKET_DATA = {
  Cotton: [
    {
      name: "Rajkot APMC",
      price: 7420,
      distance: 32,
      trend: "Rising",
      demand: "High",
      score: 91,
    },
    {
      name: "Gondal APMC",
      price: 7480,
      distance: 48,
      trend: "Rising",
      demand: "High",
      score: 93,
    },
    {
      name: "Bhavnagar APMC",
      price: 7350,
      distance: 22,
      trend: "Stable",
      demand: "Medium",
      score: 86,
    },
    {
      name: "Amreli APMC",
      price: 7290,
      distance: 58,
      trend: "Stable",
      demand: "Medium",
      score: 78,
    },
  ],
  Groundnut: [
    {
      name: "Junagadh APMC",
      price: 5800,
      distance: 35,
      trend: "Rising",
      demand: "High",
      score: 92,
    },
    {
      name: "Rajkot APMC",
      price: 5750,
      distance: 48,
      trend: "Rising",
      demand: "High",
      score: 87,
    },
    {
      name: "Jamnagar APMC",
      price: 5720,
      distance: 22,
      trend: "Stable",
      demand: "Medium",
      score: 85,
    },
    {
      name: "Amreli APMC",
      price: 5680,
      distance: 58,
      trend: "Falling",
      demand: "Medium",
      score: 76,
    },
  ],
};
const money = (value) => `₹${value.toLocaleString("en-IN")}`;
function CropIcon({ crop }) {
  return crop === "Cotton" ? <GiWheat /> : <GiPeanut />;
}

export default function MarketComparisonScreen({ profile, onNav }) {
  const [crop, setCrop] = useState(
    profile?.crop === "groundnut" ? "Groundnut" : "Cotton",
  );
  const [quantity, setQuantity] = useState(Number(profile?.quantity || 50));
  const [location, setLocation] = useState(
    profile?.location || "Jamnagar, Gujarat",
  );
  const [selected, setSelected] = useState([0, 1]);
  const markets = MARKET_DATA[crop];
  const highest = [...markets].sort((a, b) => b.price - a.price)[0];
  const closest = [...markets].sort((a, b) => a.distance - b.distance)[0];
  const best = [...markets].sort((a, b) => b.score - a.score)[0];
  const maxPrice = Math.max(...markets.map((market) => market.price));
  const selectedMarkets = useMemo(
    () => selected.map((index) => markets[index]),
    [markets, selected],
  );
  const toggle = (index) =>
    setSelected((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  const changeCrop = (value) => {
    setCrop(value);
    setSelected([0, 1]);
  };
  return (
    <div className="screen comparison-screen">
      <div className="page-title-row comparison-page-header">
        <div>
          <h2>Market Comparison</h2>
          <p className="page-sub">
            Compare available markets before deciding where to sell.
          </p>
        </div>
        <span className="demo-badge">
          <HiSparkles /> DEMO DATA
        </span>
      </div>
      <div className="card comparison-controls">
        <label>
          Crop
          <select
            value={crop}
            onChange={(event) => changeCrop(event.target.value)}
          >
            <option>Cotton</option>
            <option>Groundnut</option>
          </select>
        </label>
        <label>
          Quantity (Quintals)
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 0)}
          />
        </label>
        <label>
          Farmer Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>
        <span className="comparison-location">
          <FiMapPin /> Comparing sample markets near {location}
        </span>
      </div>
      <section className="market-insight card">
        <div>
          <span className="comparison-kicker">
            <HiSparkles /> AI Market Insight
          </span>
          <h3>Find the right market for your crop</h3>
          <p>
            Sample prices are compared with travel distance, demand, and
            opportunity score. These are not live prices.
          </p>
        </div>
        <div className="insight-highlights">
          <div>
            <span>Highest Price</span>
            <strong>{highest.name}</strong>
            <b>{money(highest.price)}/qtl</b>
          </div>
          <div>
            <span>Closest Market</span>
            <strong>{closest.name}</strong>
            <b>{closest.distance} km</b>
          </div>
          <div className="best-highlight">
            <span>Best Overall Option</span>
            <strong>{best.name}</strong>
            <b>{best.score}/100 score</b>
          </div>
        </div>
        <p className="insight-explanation">
          <FiCheck /> {best.name} has the strongest overall opportunity after
          considering price and distance. {closest.name} is closer, while{" "}
          {highest.name} offers the highest available price.
        </p>
      </section>
      <div className="comparison-section-heading">
        <div>
          <h3>Available Markets</h3>
          <p>Select two or more markets to compare side-by-side.</p>
        </div>
        <span className="sample-label">Sample data</span>
      </div>
      <div className="market-table-wrap card">
        <div className="market-table market-table-head">
          <span>Market Name</span>
          <span>Price / Quintal</span>
          <span>Distance</span>
          <span>Price Trend</span>
          <span>Demand</span>
          <span>Gross Value</span>
          <span>Opportunity</span>
          <span>Select</span>
        </div>
        {markets.map((market, index) => (
          <div
            className={`market-table market-table-row ${index === 0 ? "top-market" : ""}`}
            key={market.name}
          >
            <strong>
              <CropIcon crop={crop} /> {market.name}
            </strong>
            <b className="market-price">{money(market.price)}/qtl</b>
            <span>{market.distance} km</span>
            <span
              className={
                market.trend === "Rising"
                  ? "trend-up"
                  : market.trend === "Falling"
                    ? "trend-down"
                    : "trend-stable"
              }
            >
              <FiTrendingUp /> {market.trend}
            </span>
            <span>{market.demand}</span>
            <span>{money(market.price * quantity)}</span>
            <strong className="market-score">{market.score}/100</strong>
            <button
              className={`select-market ${selected.includes(index) ? "selected" : ""}`}
              onClick={() => toggle(index)}
              aria-label={`Select ${market.name}`}
            >
              {selected.includes(index) ? <FiCheck /> : "+"}
            </button>
          </div>
        ))}
      </div>
      <div className="visual-comparison-grid">
        <section className="card visual-card">
          <h3>Price Comparison</h3>
          <div className="bar-chart">
            {markets.map((market) => (
              <div className="chart-column" key={market.name}>
                <strong>{money(market.price)}</strong>
                <i
                  style={{
                    height: `${Math.max(28, (market.price / maxPrice) * 100)}%`,
                  }}
                />
                <span>{market.name.replace(" APMC", "")}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card visual-card">
          <h3>Distance Comparison</h3>
          <div className="distance-chart">
            {markets.map((market) => (
              <div key={market.name}>
                <span>{market.name.replace(" APMC", "")}</span>
                <i>
                  <em
                    style={{
                      width: `${Math.max(20, 100 - market.distance / 1.3)}%`,
                    }}
                  />
                </i>
                <b>{market.distance} km</b>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="card comparison-selected">
        <div className="comparison-selected-header">
          <div>
            <span className="comparison-kicker">
              <MdCompareArrows /> Side-by-side comparison
            </span>
            <h3>Selected markets</h3>
          </div>
          <span>{selected.length} selected</span>
        </div>
        {selectedMarkets.length < 2 ? (
          <p className="empty-compare">
            Select at least two markets above to compare them side-by-side.
          </p>
        ) : (
          <div className="selected-market-grid">
            {selectedMarkets.map((market) => (
              <div key={market.name}>
                <strong>{market.name}</strong>
                <span>
                  Price <b>{money(market.price)}/qtl</b>
                </span>
                <span>
                  Distance <b>{market.distance} km</b>
                </span>
                <span>
                  Estimated gross value <b>{money(market.price * quantity)}</b>
                </span>
                <span>
                  Opportunity score <b>{market.score}/100</b>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="comparison-actions">
        <button className="text-action" onClick={() => onNav("market")}>
          <MdStorefront /> View Market
        </button>
        <button className="text-action" onClick={() => onNav("buyers")}>
          <MdPeople /> Find Buyers
        </button>
        <button className="text-action" onClick={() => onNav("fairness")}>
          <MdCompareArrows /> Check Price Fairness
        </button>
        <button className="primary-action" onClick={() => onNav("dashboard")}>
          <MdSell /> Add Market to Decision <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
