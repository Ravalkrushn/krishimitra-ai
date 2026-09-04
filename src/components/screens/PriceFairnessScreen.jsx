import React, { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiMapPin,
  FiMessageCircle,
  FiTrendingDown,
} from "react-icons/fi";
import { GiPeanut, GiWheat } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import {
  MdCompareArrows,
  MdPeople,
  MdSell,
  MdStorefront,
} from "react-icons/md";

const BENCHMARKS = {
  Cotton: {
    benchmark: 7420,
    options: [7560, 7420, 7250],
    markets: [
      "Best available option",
      "Gujarat market benchmark",
      "Nearby mandi option",
    ],
  },
  Groundnut: {
    benchmark: 5850,
    options: [6120, 5980, 5750],
    markets: [
      "Saurashtra market option",
      "Gujarat market benchmark",
      "Nearby mandi option",
    ],
  },
};
const money = (value) => `₹${Math.max(0, value).toLocaleString("en-IN")}`;

export default function PriceFairnessScreen({ onNav, profile }) {
  const [crop, setCrop] = useState(
    profile?.crop === "groundnut" ? "Groundnut" : "Cotton",
  );
  const [quantity, setQuantity] = useState(profile?.quantity || "50");
  const [offer, setOffer] = useState("7000");
  const [location, setLocation] = useState(
    profile?.location || "Jamnagar, Gujarat",
  );
  const [buyer, setBuyer] = useState("");
  const data = BENCHMARKS[crop];
  const analysis = useMemo(
    () => ({
      difference: data.benchmark - Number(offer || 0),
      totalDifference:
        (data.benchmark - Number(offer || 0)) * Number(quantity || 0),
      gross: Number(offer || 0) * Number(quantity || 0),
    }),
    [data.benchmark, offer, quantity],
  );
  const below = analysis.difference > 0;
  return (
    <div className="screen fairness-screen">
      <div className="page-title-row fairness-header">
        <div>
          <h2>Price Fairness Checker</h2>
          <p className="page-sub">
            Compare a buyer&apos;s offer with available market benchmarks.
          </p>
        </div>
        <span className="demo-badge">
          <HiSparkles /> DEMO DATA
        </span>
      </div>
      <div className="card fairness-inputs">
        <label>
          Crop
          <select
            value={crop}
            onChange={(event) => setCrop(event.target.value)}
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
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>
        <label>
          Buyer Offer (₹/Quintal)
          <input
            type="number"
            min="0"
            value={offer}
            onChange={(event) => setOffer(event.target.value)}
          />
        </label>
        <label>
          Farmer Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>
        <label>
          Buyer / Market <span className="optional-label">Optional</span>
          <input
            value={buyer}
            onChange={(event) => setBuyer(event.target.value)}
            placeholder="e.g. local trader"
          />
        </label>
      </div>
      <div className={`fairness-result ${below ? "warning" : "positive"}`}>
        <div className="fairness-result-copy">
          <span className="fairness-kicker">
            <HiSparkles /> AI Available Benchmark Comparison
          </span>
          <h3>
            {below
              ? "Below Available Market Benchmark"
              : "At or Above Available Market Benchmark"}
          </h3>
          <p>
            {below
              ? `The entered offer is ${money(analysis.difference)}/qtl below the selected market benchmark. Consider comparing other available selling options.`
              : "The entered offer is at or above the selected available market benchmark. Compare the complete offer before deciding."}
          </p>
          <div className="fairness-values">
            <div>
              <span>Buyer offer</span>
              <strong>
                {money(Number(offer))}
                <small>/qtl</small>
              </strong>
            </div>
            <div className="difference-value">
              <span>Difference</span>
              <strong>
                {below ? "-" : "+"}
                {money(Math.abs(analysis.difference))}
                <small>/qtl</small>
              </strong>
            </div>
            <div>
              <span>For {quantity} Quintals</span>
              <strong>
                {below ? "-" : "+"}
                {money(Math.abs(analysis.totalDifference))}
              </strong>
            </div>
          </div>
        </div>
        <div className="fairness-status">
          <FiTrendingDown />
          <span>Available benchmark</span>
          <strong>
            {money(data.benchmark)}
            <small>/qtl</small>
          </strong>
        </div>
      </div>
      <section className="benchmark-card card">
        <div className="section-heading">
          <div>
            <h3>Benchmark Analysis</h3>
            <p>
              Sample available data for {crop} near {location}.
            </p>
          </div>
          <span className="sample-label">Demo Data</span>
        </div>
        <div className="benchmark-visual">
          <div className="benchmark-line">
            <i
              className="offer-marker"
              style={{
                left: `${Math.min(86, Math.max(8, (Number(offer) / (data.options[0] * 1.08)) * 100))}%`,
              }}
            >
              <b>Buyer Offer</b>
              <strong>{money(Number(offer))}</strong>
            </i>
            <i
              className="benchmark-marker"
              style={{
                left: `${Math.min(92, (data.benchmark / (data.options[0] * 1.08)) * 100)}%`,
              }}
            >
              <b>Market Benchmark</b>
              <strong>{money(data.benchmark)}</strong>
            </i>
            <span />
          </div>
          <div className="benchmark-labels">
            <span>Lower available price</span>
            <span>Better available options</span>
          </div>
        </div>
        <div className="price-options">
          {data.options.map((price, index) => (
            <div key={price}>
              <span>{data.markets[index]}</span>
              <strong>
                {money(price)}
                <small>/qtl</small>
              </strong>
              <em>
                {price >= data.benchmark
                  ? "Available option"
                  : "Reference price"}
              </em>
            </div>
          ))}
        </div>
      </section>
      <section className="fairness-bottom-grid">
        <div className="card negotiation-card">
          <span className="fairness-kicker">
            <FiMessageCircle /> AI Negotiation Insight
          </span>
          <h3>What should I ask the buyer?</h3>
          <p>
            Ask whether the buyer can revise the offer closer to the available
            market benchmark.
          </p>
          <button
            className="secondary-action"
            onClick={() =>
              alert(
                "Ask whether the buyer can revise the offer closer to the available market benchmark.",
              )
            }
          >
            <FiMessageCircle /> Show suggestion
          </button>
        </div>
        <div className="card impact-card">
          <h3>Quantity Impact</h3>
          <div className="impact-row">
            <span>Estimated offer value</span>
            <strong>{money(analysis.gross)}</strong>
          </div>
          <div className="impact-row">
            <span>Benchmark value</span>
            <strong>{money(data.benchmark * Number(quantity || 0))}</strong>
          </div>
          <div className="impact-row total">
            <span>Gross value difference</span>
            <strong className={below ? "negative" : "positive-text"}>
              {below ? "-" : "+"}
              {money(Math.abs(analysis.totalDifference))}
            </strong>
          </div>
        </div>
      </section>
      <div className="fairness-actions">
        <button className="text-action" onClick={() => onNav("buyers")}>
          <MdPeople /> Find Better Buyers
        </button>
        <button className="text-action" onClick={() => onNav("market")}>
          <MdCompareArrows /> Compare Markets
        </button>
        <button className="text-action" onClick={() => onNav("market")}>
          <MdStorefront /> View Market Intelligence
        </button>
        <button className="primary-action" onClick={() => onNav("dashboard")}>
          <MdSell /> Add to Decision Center <FiArrowRight />
        </button>
      </div>
      <p className="fairness-disclaimer">
        <FiCheck /> This tool compares an offer with available market
        benchmarks. It does not guarantee a fair price; final value may vary by
        quality, timing, transport, and buyer terms.
      </p>
    </div>
  );
}
