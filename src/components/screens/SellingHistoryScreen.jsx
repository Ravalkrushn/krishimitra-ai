import React, { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiMapPin,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { GiPeanut, GiWheat } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import { MdCompareArrows, MdHistory, MdPeople, MdSell } from "react-icons/md";

const DEMO_SALES = [
  {
    id: "SALE-001",
    date: "28 Aug 2026",
    crop: "Cotton",
    quantity: 50,
    price: 7560,
    buyer: "Buyer A (Sample)",
    market: "Rajkot APMC",
    status: "Completed",
    quality: "Grade B - AI-assisted",
    decision: "Sold after comparing two buyer offers.",
    notes: "Recorded as sample transaction data.",
  },
  {
    id: "SALE-002",
    date: "14 May 2026",
    crop: "Cotton",
    quantity: 35,
    price: 7210,
    buyer: "Gujarat Cotton Traders (Sample)",
    market: "Gondal APMC",
    status: "Completed",
    quality: "Standard cotton",
    decision: "Sold immediately based on available price.",
    notes: "Buyer and price are sample records.",
  },
  {
    id: "SALE-003",
    date: "02 Mar 2026",
    crop: "Groundnut",
    quantity: 28,
    price: 5680,
    buyer: "Saurashtra Oil Mills (Sample)",
    market: "Junagadh APMC",
    status: "Completed",
    quality: "Domestic Grade A",
    decision: "Stored briefly before selling.",
    notes: "Sample data, not verified transaction data.",
  },
];
const money = (value) => `₹${value.toLocaleString("en-IN")}`;
function CropIcon({ crop }) {
  return crop === "Cotton" ? <GiWheat /> : <GiPeanut />;
}

export default function SellingHistoryScreen({ onNav }) {
  const [crop, setCrop] = useState("All crops");
  const [buyer, setBuyer] = useState("");
  const [market, setMarket] = useState("All markets");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(
    () =>
      DEMO_SALES.filter(
        (sale) =>
          (crop === "All crops" || sale.crop === crop) &&
          (market === "All markets" || sale.market === market) &&
          (!buyer || sale.buyer.toLowerCase().includes(buyer.toLowerCase())) &&
          (!date || sale.date.toLowerCase().includes(date.toLowerCase())),
      ),
    [crop, market, buyer, date],
  );
  const totalQuantity = filtered.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalValue = filtered.reduce(
    (sum, sale) => sum + sale.quantity * sale.price,
    0,
  );
  const averagePrice = totalQuantity
    ? Math.round(totalValue / totalQuantity)
    : 0;
  return (
    <div className="screen history-screen">
      <div className="page-title-row history-header">
        <div>
          <h2>
            <MdHistory /> Selling History
          </h2>
          <p className="page-sub">
            Review your previous crop-selling decisions and recorded
            transactions.
          </p>
        </div>
        <span className="demo-badge">
          <HiSparkles /> DEMO DATA
        </span>
      </div>
      <div className="history-summary-grid">
        <Summary label="Total Sales" value={filtered.length} />
        <Summary label="Total Quantity Sold" value={`${totalQuantity} qtl`} />
        <Summary
          label="Total Estimated / Recorded Value"
          value={money(totalValue)}
        />
        <Summary
          label="Average Selling Price"
          value={`${money(averagePrice)}/qtl`}
        />
      </div>
      <div className="card history-filters">
        <label>
          Crop
          <select
            value={crop}
            onChange={(event) => setCrop(event.target.value)}
          >
            <option>All crops</option>
            <option>Cotton</option>
            <option>Groundnut</option>
          </select>
        </label>
        <label>
          Date
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            placeholder="e.g. Aug 2026"
          />
        </label>
        <label>
          Buyer
          <input
            value={buyer}
            onChange={(event) => setBuyer(event.target.value)}
            placeholder="Search buyer"
          />
        </label>
        <label>
          Market
          <select
            value={market}
            onChange={(event) => setMarket(event.target.value)}
          >
            <option>All markets</option>
            <option>Rajkot APMC</option>
            <option>Gondal APMC</option>
            <option>Junagadh APMC</option>
          </select>
        </label>
        <FiSearch className="history-search-icon" />
      </div>
      <section className="history-list-section">
        <div className="history-section-heading">
          <div>
            <h3>Recorded Transactions</h3>
            <p>
              Sample records are shown for demonstration and are not verified
              transactions.
            </p>
          </div>
          <span className="sample-label">Demo Data</span>
        </div>
        <div className="history-list">
          {filtered.length ? (
            filtered.map((sale) => (
              <article className="card sale-row" key={sale.id}>
                <div className="sale-date">
                  <FiCalendar />
                  <strong>{sale.date}</strong>
                  <small>{sale.id}</small>
                </div>
                <div className="sale-crop">
                  <span>
                    <CropIcon crop={sale.crop} />
                  </span>
                  <div>
                    <strong>{sale.crop}</strong>
                    <small>{sale.quantity} Quintals</small>
                  </div>
                </div>
                <div>
                  <small>Price / Quintal</small>
                  <strong>{money(sale.price)}</strong>
                </div>
                <div>
                  <small>Buyer / Market</small>
                  <strong>{sale.buyer}</strong>
                  <small>
                    <FiMapPin /> {sale.market}
                  </small>
                </div>
                <div>
                  <small>Total Value</small>
                  <strong className="sale-value">
                    {money(sale.quantity * sale.price)}
                  </strong>
                </div>
                <span className="sale-status">
                  <FiCheck /> {sale.status}
                </span>
                <button
                  className="secondary-action"
                  onClick={() => setSelected(sale)}
                >
                  View Details
                </button>
              </article>
            ))
          ) : (
            <div className="card history-empty">
              No matching transactions found.
            </div>
          )}
        </div>
      </section>
      <section className="history-insights card">
        <div>
          <span className="history-kicker">
            <HiSparkles /> AI Historical Insights
          </span>
          <h3>What KrishiMitra learned from your selling history</h3>
          <p>
            Your latest recorded selling price was higher than your previous
            recorded cotton sale. Your sample records show a preference for
            nearby Gujarat markets and quantities between 28 and 50 quintals.
          </p>
        </div>
        <div className="history-insight-grid">
          <div>
            <span>Average cotton price</span>
            <strong>
              {money(Math.round((7560 * 50 + 7210 * 35) / 85))}/qtl
            </strong>
          </div>
          <div>
            <span>Latest vs previous cotton</span>
            <strong className="history-positive">+{money(350)}/qtl</strong>
          </div>
          <div>
            <span>Preferred sample market</span>
            <strong>Rajkot APMC</strong>
          </div>
          <div>
            <span>Typical quantity</span>
            <strong>28-50 qtl</strong>
          </div>
        </div>
      </section>
      <div className="history-actions">
        <button className="text-action" onClick={() => onNav("market")}>
          <MdCompareArrows /> Compare with Current Market
        </button>
        <button className="text-action" onClick={() => onNav("fairness")}>
          <MdSell /> Use Previous Sale as Reference
        </button>
        <button className="primary-action" onClick={() => onNav("dashboard")}>
          <MdPeople /> Open Decision Center <FiArrowRight />
        </button>
      </div>
      {selected && (
        <div className="history-modal-backdrop">
          <section className="history-modal">
            <div className="history-modal-header">
              <div>
                <span className="history-kicker">Transaction details</span>
                <h3>
                  {selected.crop} sale{" "}
                  <span className="sale-status">
                    <FiCheck /> {selected.status}
                  </span>
                </h3>
                <p>
                  {selected.date} · {selected.id}
                </p>
              </div>
              <button
                className="history-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <div className="history-detail-grid">
              <Detail label="Crop" value={selected.crop} />
              <Detail
                label="Quantity"
                value={`${selected.quantity} Quintals`}
              />
              <Detail
                label="Selling price"
                value={`${money(selected.price)}/qtl`}
              />
              <Detail
                label="Market / buyer"
                value={`${selected.market} · ${selected.buyer}`}
              />
              <Detail
                label="Total value"
                value={money(selected.price * selected.quantity)}
              />
              <Detail label="Quality information" value={selected.quality} />
              <Detail label="Decision information" value={selected.decision} />
              <Detail label="Relevant notes" value={selected.notes} />
            </div>
            <div className="history-modal-actions">
              <button
                className="secondary-action"
                onClick={() => onNav("market")}
              >
                Compare with Current Market
              </button>
              <button
                className="primary-action"
                onClick={() => onNav("dashboard")}
              >
                Open Decision Center <FiArrowRight />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function Summary({ label, value }) {
  return (
    <div className="card history-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Detail({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
