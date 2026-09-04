import React from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiPackage,
  FiTrendingUp,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import {
  MdCompareArrows,
  MdPeople,
  MdSell,
  MdStorage,
  MdVerifiedUser,
} from "react-icons/md";

const DEMO = {
  crop: "Cotton",
  quantity: 50,
  location: "Gujarat",
  benchmark: 7420,
  trend: "Rising",
  outlook: "Positive",
  market: "Rajkot APMC",
  buyer: "Shree Ram Cotton Industries",
  offer: 6880,
  buyerMatch: 94,
  distance: 38,
  quality: "Grade B - AI-assisted",
  qualityMatch: "Compatible",
  sellNow: 344000,
  storageValue: 355000,
  storageCost: 12500,
};
const money = (value) => `₹${value.toLocaleString("en-IN")}`;
const pipeline = [
  ["Market Price", <FiTrendingUp />],
  ["Buyer Matching", <MdPeople />],
  ["Quality", <MdVerifiedUser />],
  ["Sell vs Store", <MdStorage />],
  ["Income", <FiDollarSign />],
  ["Final Decision", <FiCheckCircle />],
];

export default function DecisionCenterScreen({ results, profile, onNav }) {
  const context = {
    ...DEMO,
    crop: profile?.crop === "groundnut" ? "Groundnut" : DEMO.crop,
    quantity: Number(profile?.quantity || DEMO.quantity),
    location: profile?.location || DEMO.location,
  };
  const income = (context.sellNow / DEMO.quantity) * context.quantity;
  return (
    <div className="screen decision-screen">
      <div className="page-title-row decision-header">
        <div>
          <h2>
            <FaRobot /> Decision Center
          </h2>
          <p className="page-sub">
            One clear view of price, buyers, quality, storage, and income.
          </p>
        </div>
        <span className="demo-badge">
          <HiSparkles /> DEMO DATA
        </span>
      </div>
      <section className="decision-context card">
        <div>
          <span>Crop</span>
          <strong>{context.crop}</strong>
        </div>
        <div>
          <span>Quantity</span>
          <strong>{context.quantity} Quintals</strong>
        </div>
        <div>
          <span>Location</span>
          <strong>
            <FiMapPin /> {context.location}
          </strong>
        </div>
        <div className="context-status">
          <HiSparkles /> Multiple AI agents combined
        </div>
      </section>
      <section className="decision-pipeline card">
        <h3>Decision Pipeline</h3>
        <div className="pipeline-track">
          {pipeline.map(([label, icon], index) => (
            <React.Fragment key={label}>
              <div className="pipeline-step">
                <span>{icon}</span>
                <small>{label}</small>
              </div>
              {index < pipeline.length - 1 && (
                <i>
                  <FiArrowRight />
                </i>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
      <div className="decision-columns">
        <div className="decision-main">
          <section className="decision-recommendation">
            <span className="decision-kicker">
              <HiSparkles /> FINAL AI RECOMMENDATION
            </span>
            <h3>Your Market Decision</h3>
            <p>
              {context.buyer} is currently the strongest available option based
              on price, buyer compatibility, quality information, distance and
              storage considerations.
            </p>
            <div className="decision-recommendation-actions">
              <button
                className="decision-light-action"
                onClick={() => onNav("buyers")}
              >
                <MdPeople /> View Buyer
              </button>
              <button
                className="decision-light-action"
                onClick={() => onNav("market")}
              >
                <MdCompareArrows /> Compare Options
              </button>
            </div>
          </section>
          <section className="decision-evidence card">
            <div className="decision-section-title">
              <div>
                <span className="decision-kicker">
                  <HiSparkles /> Why this recommendation?
                </span>
                <h3>Strongest available option</h3>
              </div>
              <span className="decision-score">91/100</span>
            </div>
            <div className="reason-grid">
              {[
                ["Price", "₹6,880 offer vs ₹7,420 benchmark"],
                ["Buyer Match", "94% quantity and requirement fit"],
                ["Quality", "Grade B compatible with buyer"],
                ["Distance", "38 km from farmer location"],
                ["Storage", "Selling now avoids ₹12,500 scenario cost"],
              ].map(([label, value]) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="decision-side">
          <section className="card decision-mini-card">
            <h3>Market Analysis</h3>
            <div className="decision-metric">
              <span>Available benchmark</span>
              <strong>{money(DEMO.benchmark)}/qtl</strong>
            </div>
            <div className="decision-metric">
              <span>Market trend</span>
              <b className="decision-positive">
                <FiTrendingUp /> {DEMO.trend}
              </b>
            </div>
            <div className="decision-metric">
              <span>Price outlook</span>
              <strong>{DEMO.outlook}</strong>
            </div>
            <div className="decision-metric">
              <span>Best available market</span>
              <strong>{DEMO.market}</strong>
            </div>
            <button className="link-action" onClick={() => onNav("market")}>
              View Full Market Analysis <FiArrowRight />
            </button>
          </section>
          <section className="card decision-mini-card">
            <h3>Buyer Analysis</h3>
            <div className="buyer-highlight">
              <span className="buyer-icon">
                <MdPeople />
              </span>
              <div>
                <strong>{DEMO.buyer}</strong>
                <small>Indicative offer: {money(DEMO.offer)}/qtl</small>
              </div>
            </div>
            <div className="decision-metric">
              <span>Quantity compatibility</span>
              <strong>50-200 Quintals</strong>
            </div>
            <div className="decision-metric">
              <span>Distance</span>
              <strong>{DEMO.distance} km</strong>
            </div>
            <div className="decision-metric">
              <span>Buyer match score</span>
              <strong className="decision-positive">{DEMO.buyerMatch}%</strong>
            </div>
          </section>
        </div>
      </div>
      <div className="decision-lower-grid">
        <section className="card decision-mini-card">
          <h3>Quality Analysis</h3>
          <div className="quality-result">
            <GiWheat />
            <div>
              <strong>{DEMO.quality}</strong>
              <span>Buyer compatibility: {DEMO.qualityMatch}</span>
            </div>
          </div>
          <p className="decision-note">
            AI-assisted estimation - not official certification.
          </p>
        </section>
        <section className="card decision-mini-card">
          <h3>Sell vs Store</h3>
          <div className="scenario-grid">
            <div>
              <span>Sell Now</span>
              <strong>{money(income)}</strong>
              <small>Recommended scenario</small>
            </div>
            <div>
              <span>Consider Storage</span>
              <strong>
                {money((DEMO.storageValue / DEMO.quantity) * context.quantity)}
              </strong>
              <small>Storage cost: {money(DEMO.storageCost)}</small>
            </div>
          </div>
          <p className="decision-note">
            Future values are scenarios, not guaranteed prices.
          </p>
        </section>
        <section className="card decision-mini-card">
          <h3>Income Snapshot</h3>
          <div className="income-number">{money(income)}</div>
          <div className="decision-metric">
            <span>Quantity</span>
            <strong>{context.quantity} Quintals</strong>
          </div>
          <div className="decision-metric">
            <span>Applicable price</span>
            <strong>{money(DEMO.offer)}/qtl</strong>
          </div>
          <p className="decision-note">
            Estimate uses indicative buyer offer before transport or other
            deductions.
          </p>
        </section>
      </div>
      <section className="decision-data card">
        <div>
          <h3>Decision Confidence &amp; Data Used</h3>
          <p>
            Sample data combines market price, buyer matching, quality, storage,
            and income estimates from the available demo agents.
          </p>
        </div>
        <div className="data-facts">
          <span>
            <b>Assumptions</b>Current indicative offer and benchmark
          </span>
          <span>
            <b>Uncertainty</b>Quality, timing, transport, and buyer terms
          </span>
          <span>
            <b>Timestamp</b>04 Sep 2026 · Demo snapshot
          </span>
        </div>
      </section>
      <div className="decision-actions">
        <button className="text-action" onClick={() => onNav("fairness")}>
          <MdCompareArrows /> Check Price Fairness
        </button>
        <button className="primary-action" onClick={() => onNav("buyers")}>
          <MdPeople /> View Buyer <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
