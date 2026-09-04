// BuyersScreen — matches reference UI
import React, { useState } from "react";
import { GiWheat, GiPeanut } from "react-icons/gi";
import {
  FiMapPin,
  FiEdit2,
  FiSearch,
  FiFilter,
  FiStar,
  FiRefreshCw,
  FiPhone,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { MdAttachMoney, MdBusiness } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { useLanguage } from "../../context/LanguageContext";

const DEMO_BUYERS = [
  {
    rank: 1,
    name: "Shree Rang Agro Industries",
    matchLevel: "High Match",
    matchColor: "green",
    location: "Gondal, Gujarat",
    dist: 52,
    reqQty: "100+",
    price: 7560,
    distDisplay: "52 km",
    qualityReq: "SG-2 or Better",
    score: 96,
    scoreColor: "#166534",
    reasons: [
      "Your quantity fits their requirement",
      "High price match",
      "Within preferred distance",
      "Quality compatible",
    ],
  },
  {
    rank: 2,
    name: "Gujarat Cotton Traders LLP",
    matchLevel: "High Match",
    matchColor: "green",
    location: "Rajkot, Gujarat",
    dist: 65,
    reqQty: "50+",
    price: 7420,
    distDisplay: "65 km",
    qualityReq: "SG-2 or Better",
    score: 88,
    scoreColor: "#166534",
    reasons: [
      "Quantity matches",
      "Good price",
      "Near your location",
      "Quality fit",
    ],
  },
  {
    rank: 3,
    name: "Maruti Textiles Pvt. Ltd.",
    matchLevel: "Medium Match",
    matchColor: "amber",
    location: "Surat, Gujarat",
    dist: 210,
    reqQty: "200+",
    price: 7250,
    distDisplay: "210 km",
    qualityReq: "SG-2 or Better",
    score: 72,
    scoreColor: "#b45309",
    reasons: [
      "Higher quantity need",
      "Price slightly lower",
      "Farther location",
      "Quality compatible",
    ],
  },
  {
    rank: 4,
    name: "Kutch Cotton Exports",
    matchLevel: "Medium Match",
    matchColor: "amber",
    location: "Bhavnagar, Gujarat",
    dist: 160,
    reqQty: "75+",
    price: 7180,
    distDisplay: "160 km",
    qualityReq: "SG-2 or Better",
    score: 64,
    scoreColor: "#b45309",
    reasons: [
      "Quantity slightly high",
      "Lower price",
      "Location moderate",
      "Quality fit",
    ],
  },
];

const BEST_BUYER = DEMO_BUYERS[0];

function ScoreDonut({ score, color }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width="54" height="54" viewBox="0 0 54 54">
      <circle
        cx="27"
        cy="27"
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="5"
      />
      <circle
        cx="27"
        cy="27"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 27 27)"
      />
      <text
        x="27"
        y="31"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill="#1f2328"
      >
        {score}%
      </text>
    </svg>
  );
}

export default function BuyersScreen({ results, profile }) {
  const { copy } = useLanguage();
  const [search, setSearch] = useState("");
  const crop = profile?.crop || "cotton";
  const qty = profile?.quantity || "50";
  const loc = profile?.location || "Jamnagar, Gujarat";

  const buyers = DEMO_BUYERS.filter(
    (b) =>
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="screen">
      {/* ── Header ── */}
      <div className="bs-header-row">
        <div>
          <h2 className="bs-title">{copy.buyersTitle}</h2>
          <p className="bs-sub">
            Connect with verified buyers and get the best price for your
            produce.
          </p>
        </div>
        <span className="demo-badge demo-badge-gold">
          <HiSparkles /> DEMO DATA
        </span>
      </div>

      {/* ── Requirement Summary Bar ── */}
      <div className="card card-pad bs-req-bar mb-16">
        <div className="bs-req-item">
          <span className="bs-req-icon">
            {crop === "cotton" ? <GiWheat /> : <GiPeanut />}
          </span>
          <div>
            <div className="bs-req-label">Crop</div>
            <div className="bs-req-val">
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </div>
          </div>
        </div>
        <div className="bs-req-item">
          <span className="bs-req-icon">
            <MdAttachMoney />
          </span>
          <div>
            <div className="bs-req-label">Quantity</div>
            <div className="bs-req-val">{qty} Quintals</div>
          </div>
        </div>
        <div className="bs-req-item">
          <span className="bs-req-icon">
            <FiMapPin />
          </span>
          <div>
            <div className="bs-req-label">Location</div>
            <div className="bs-req-val">{loc}</div>
          </div>
        </div>
        <button className="bs-edit-btn">
          <FiEdit2 /> Edit Requirement
        </button>
      </div>

      {/* ── Search & Filter ── */}
      <div className="bs-search-row mb-16">
        <div className="bs-search-wrap">
          <span className="bs-search-icon">
            <FiSearch />
          </span>
          <input
            className="bs-search-input"
            placeholder="Search buyers, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="bs-sort-btn">Sort by Match Score ▾</div>
        <button className="bs-filter-btn">
          <FiFilter /> Filters
        </button>
      </div>

      {/* ── Buyer Cards ── */}
      <div className="bs-cards-stack">
        {buyers.map((b) => (
          <div
            key={b.rank}
            className={`card bs-buyer-card bs-match-${b.matchColor}`}
          >
            {/* Rank badge */}
            <div className={`bs-rank-badge bs-rank-${b.matchColor}`}>
              {b.rank}
            </div>

            {/* Match chip + name */}
            <div className="bs-card-header">
              <span className={`bs-match-chip bs-match-chip-${b.matchColor}`}>
                {b.matchColor === "green" ? <FiStar /> : <HiSparkles />}{" "}
                {b.matchLevel}
              </span>
            </div>
            <div className="bs-card-name-row">
              <div className="bs-card-icon">
                <MdBusiness />
              </div>
              <div>
                <div className="bs-card-name">
                  {b.name} <span className="bs-demo-tag">Demo Buyer</span>
                </div>
                <div className="bs-card-loc">
                  <FiMapPin /> {b.location} &nbsp;•&nbsp; {b.distDisplay} from
                  you
                </div>
              </div>
            </div>

            {/* Details row */}
            <div className="bs-details-row">
              <div className="bs-detail-item">
                <div className="bs-dl">Required Quantity</div>
                <div className="bs-dv">{b.reqQty} Quintals</div>
              </div>
              <div className="bs-detail-item">
                <div className="bs-dl">Indicative Offer</div>
                <div className="bs-dv bs-price">
                  ₹{b.price.toLocaleString("en-IN")}
                  <span className="bs-per">/Quintal</span>
                </div>
              </div>
              <div className="bs-detail-item">
                <div className="bs-dl">Distance</div>
                <div className="bs-dv">{b.distDisplay}</div>
              </div>
              <div className="bs-detail-item">
                <div className="bs-dl">Quality Requirement</div>
                <div className="bs-dv">{b.qualityReq}</div>
              </div>
              <div className="bs-detail-item bs-score-col">
                <div className="bs-dl">Match Score</div>
                <ScoreDonut score={b.score} color={b.scoreColor} />
              </div>
            </div>

            {/* Reasons + CTA */}
            <div className="bs-reasons-row">
              <div className="bs-reasons-left">
                <span className="bs-why-label">Why matched?</span>
                <div className="bs-reason-chips">
                  {b.reasons.map((r, i) => (
                    <span key={i} className="bs-reason-chip">
                      ✓ {r}
                    </span>
                  ))}
                </div>
              </div>
              <button className="bs-contact-btn">
                View Details &amp; Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Best Match Recommendation ── */}
      <div className="card bs-ai-rec-card mb-16">
        <div className="bs-ai-rec-label">
          <span>
            <FiRefreshCw />
          </span>{" "}
          AI Recommendation
        </div>
        <div className="bs-ai-rec-body">
          <div className="bs-ai-rec-left">
            <div className="bs-ai-rec-title">Best Available Match</div>
            <div className="bs-ai-rec-name-row">
              <span className="bs-ai-rec-name">{BEST_BUYER.name}</span>
              <span className="bs-demo-tag">Demo Buyer</span>
            </div>
            <p className="bs-ai-rec-desc">
              This buyer offers the best price ₹
              {BEST_BUYER.price.toLocaleString("en-IN")}/quintal for your {qty}{" "}
              quintals of cotton. They are located {BEST_BUYER.dist} km from you
              and match your quality requirement (SG-2 or Better) perfectly.
            </p>
          </div>
          <div className="bs-ai-rec-right">
            <div className="bs-ai-stat">
              <div className="bs-ai-stat-l">Offered Price</div>
              <div className="bs-ai-stat-v">
                ₹{BEST_BUYER.price.toLocaleString("en-IN")} /Quintal
              </div>
            </div>
            <div className="bs-ai-stat">
              <div className="bs-ai-stat-l">Expected Value</div>
              <div className="bs-ai-stat-v">
                ₹{(BEST_BUYER.price * parseFloat(qty)).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bs-ai-stat">
              <div className="bs-ai-stat-l">Distance</div>
              <div className="bs-ai-stat-v">{BEST_BUYER.dist} km</div>
            </div>
            <div className="bs-ai-stat">
              <div className="bs-ai-stat-l">Match Score</div>
              <div className="bs-ai-stat-v">{BEST_BUYER.score}%</div>
            </div>
            <button className="bs-contact-buyer-btn">
              <FiPhone /> Contact This Buyer
            </button>
          </div>
        </div>
      </div>

      {/* ── Timestamp ── */}
      <div className="bs-timestamp">
        <span>
          <FiClock /> Data as on: 17 Jun 2025, 09:30 AM
        </span>
        <span>Buyers are shown based on your requirement and AI matching</span>
      </div>

      {/* ── Disclaimer ── */}
      <div className="disclaimer bs-disclaimer">
        <span className="bs-disc-icon">
          <FiShield />
        </span>
        <span>
          <strong style={{ color: "#b45309" }}>Disclaimer:</strong> All buyers
          and prices shown here are <strong>DEMO DATA</strong> for educational
          purposes only. Actual market prices and buyer details may vary.
        </span>
      </div>
    </div>
  );
}
