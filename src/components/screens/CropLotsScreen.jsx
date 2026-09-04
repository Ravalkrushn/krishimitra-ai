import React, { useState } from "react";
import { HiSparkles } from "react-icons/hi";
import {
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { GiPeanut, GiWheat } from "react-icons/gi";
import { MdAnalytics, MdInventory2, MdPeople, MdSell } from "react-icons/md";

const DEMO_LOTS = [
  {
    id: "LOT-KT-001",
    crop: "Cotton",
    quantity: 50,
    unit: "Quintals",
    location: "Gujarat",
    status: "Ready to Sell",
    quality: "AI-Assisted - Good",
    benchmark: 7420,
    createdDate: "12 Aug 2026",
    harvestStatus: "Harvested and ready",
    qualityInfo: "Good fibre strength; moisture 8.2%",
    buyers: "4 verified buyers",
    sellingStatus: "Decision pending",
    journey: 4,
  },
  {
    id: "LOT-KT-002",
    crop: "Groundnut",
    quantity: 32,
    unit: "Quintals",
    location: "Jamnagar, Gujarat",
    status: "Under Analysis",
    quality: "Quality check pending",
    benchmark: 5850,
    createdDate: "28 Aug 2026",
    harvestStatus: "Harvested",
    qualityInfo: "Awaiting quality assistant review",
    buyers: "2 potential buyers",
    sellingStatus: "Quality review pending",
    journey: 2,
  },
];
const emptyForm = {
  crop: "Cotton",
  quantity: "",
  unit: "Quintals",
  location: "",
  harvestDate: "",
  quality: "",
};
const journeySteps = [
  "Harvested",
  "Quality Checked",
  "Market Analysis",
  "Buyer Matching",
  "Sell/Store Decision",
  "Sold",
];
const money = (value) => `₹${value.toLocaleString("en-IN")}`;
function CropIcon({ crop }) {
  return crop === "Cotton" ? <GiWheat /> : <GiPeanut />;
}

export default function CropLotsScreen({ onNav }) {
  const [lots, setLots] = useState(DEMO_LOTS);
  const [selectedLot, setSelectedLot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const totalQuantity = lots.reduce(
    (sum, lot) => sum + Number(lot.quantity),
    0,
  );
  const readyCount = lots.filter(
    (lot) => lot.status === "Ready to Sell",
  ).length;
  const analysisCount = lots.filter(
    (lot) => lot.status === "Under Analysis",
  ).length;
  const updateForm = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const addLot = (event) => {
    event.preventDefault();
    if (!form.quantity || !form.location || !form.harvestDate) return;
    const nextNumber = String(lots.length + 1).padStart(3, "0");
    setLots([
      {
        ...form,
        id: `LOT-KT-${nextNumber}`,
        quantity: Number(form.quantity),
        status: "Under Analysis",
        quality: form.quality || "Quality check pending",
        benchmark: 0,
        createdDate: form.harvestDate,
        harvestStatus: "Harvested",
        qualityInfo: form.quality || "Awaiting quality assistant review",
        buyers: "Not matched yet",
        sellingStatus: "Analysis not started",
        journey: 1,
      },
      ...lots,
    ]);
    setForm(emptyForm);
    setShowForm(false);
  };
  return (
    <div className="screen crop-lots-screen">
      <div className="page-title-row crop-lots-header">
        <div>
          <h2>My Crop Lots</h2>
          <p className="page-sub">
            Track your harvested crop from farm to market.
          </p>
        </div>
        <div className="crop-lots-header-actions">
          <span className="demo-badge">
            <HiSparkles /> DEMO DATA
          </span>
          <button className="primary-action" onClick={() => setShowForm(true)}>
            <FiPlus /> Add Crop Lot
          </button>
        </div>
      </div>
      <div className="lot-summary-grid">
        <Summary
          icon={<MdInventory2 />}
          label="Total Active Lots"
          value={lots.length}
        />
        <Summary
          icon={<GiWheat />}
          label="Total Quantity"
          value={`${totalQuantity} qtl`}
        />
        <Summary
          icon={<MdSell />}
          label="Ready to Sell"
          value={readyCount}
          tone="green"
        />
        <Summary
          icon={<MdAnalytics />}
          label="Under Analysis"
          value={analysisCount}
          tone="amber"
        />
      </div>
      <div className="lot-section-heading">
        <div>
          <h3>Your Crop Lots</h3>
          <p>
            Each lot is tracked separately so you can choose the right time and
            buyer.
          </p>
        </div>
        <span className="sample-label">Sample lots</span>
      </div>
      <div className="crop-lot-grid">
        {lots.map((lot) => (
          <LotCard
            key={lot.id}
            lot={lot}
            onDetails={() => setSelectedLot(lot)}
            onNav={onNav}
          />
        ))}
      </div>
      {selectedLot && (
        <LotDetails
          lot={selectedLot}
          onClose={() => setSelectedLot(null)}
          onNav={onNav}
        />
      )}
      {showForm && (
        <div className="lot-modal-backdrop">
          <form className="lot-modal" onSubmit={addLot}>
            <div className="lot-modal-header">
              <div>
                <h3>Add Crop Lot</h3>
                <p>Enter the details of one harvested quantity.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <div className="lot-form-grid">
              <label>
                Crop
                <select name="crop" value={form.crop} onChange={updateForm}>
                  <option>Cotton</option>
                  <option>Groundnut</option>
                </select>
              </label>
              <label>
                Quantity
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  value={form.quantity}
                  onChange={updateForm}
                  placeholder="e.g. 50"
                />
              </label>
              <label>
                Unit
                <select name="unit" value={form.unit} onChange={updateForm}>
                  <option>Quintals</option>
                  <option>Kg</option>
                  <option>Tonnes</option>
                </select>
              </label>
              <label>
                Location
                <input
                  name="location"
                  required
                  value={form.location}
                  onChange={updateForm}
                  placeholder="Village, district"
                />
              </label>
              <label>
                Harvest date
                <input
                  name="harvestDate"
                  type="date"
                  required
                  value={form.harvestDate}
                  onChange={updateForm}
                />
              </label>
              <label className="lot-form-wide">
                Quality information
                <textarea
                  name="quality"
                  value={form.quality}
                  onChange={updateForm}
                  placeholder="Optional notes about moisture, grade, or appearance"
                />
              </label>
            </div>
            <div className="lot-modal-footer">
              <button
                type="button"
                className="secondary-action"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="primary-action" type="submit">
                Add Lot <FiArrowRight />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
function Summary({ icon, label, value, tone }) {
  return (
    <div className={`card lot-summary-card ${tone || ""}`}>
      <span className="lot-summary-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
function LotCard({ lot, onDetails, onNav }) {
  return (
    <article className="card crop-lot-card">
      <div className="lot-card-top">
        <div className="crop-lot-name">
          <span
            className={`crop-icon ${lot.crop === "Cotton" ? "cotton" : "groundnut"}`}
          >
            <CropIcon crop={lot.crop} />
          </span>
          <div>
            <h3>{lot.id}</h3>
            <span>{lot.crop}</span>
          </div>
        </div>
        <span
          className={`lot-status ${lot.status === "Ready to Sell" ? "ready" : "analysis"}`}
        >
          {lot.status}
        </span>
      </div>
      <div className="lot-facts">
        <div>
          <span>Quantity</span>
          <strong>
            {lot.quantity} {lot.unit}
          </strong>
        </div>
        <div>
          <span>Location</span>
          <strong>
            <FiMapPin /> {lot.location}
          </strong>
        </div>
        <div>
          <span>Quality</span>
          <strong>{lot.quality}</strong>
        </div>
        <div>
          <span>Market benchmark</span>
          <strong className="lot-price">
            {lot.benchmark ? `${money(lot.benchmark)}/qtl` : "Pending analysis"}
          </strong>
        </div>
      </div>
      <div className="lot-created">
        <FiCalendar /> Created {lot.createdDate}
        <span className="sample-label">Demo</span>
      </div>
      <div className="lot-actions">
        <button className="secondary-action" onClick={onDetails}>
          View Details
        </button>
        <button className="text-action" onClick={() => onNav("quality")}>
          <MdAnalytics /> Analyze Lot
        </button>
        <button className="text-action" onClick={() => onNav("buyers")}>
          <MdPeople /> Find Buyers
        </button>
        <button className="text-action" onClick={() => onNav("dashboard")}>
          <MdSell /> Make Decision
        </button>
      </div>
    </article>
  );
}
function LotDetails({ lot, onClose, onNav }) {
  const estimated = lot.benchmark ? lot.benchmark * lot.quantity : 0;
  return (
    <div className="lot-modal-backdrop">
      <section className="lot-modal lot-details-modal">
        <div className="lot-modal-header">
          <div>
            <span className="eyebrow">Crop lot details</span>
            <h3>
              {lot.id} <span className="lot-status ready">{lot.status}</span>
            </h3>
            <p>
              {lot.crop} · {lot.quantity} {lot.unit} · {lot.location}
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className="lot-detail-grid">
          <Detail label="Crop" value={lot.crop} />
          <Detail label="Quantity" value={`${lot.quantity} ${lot.unit}`} />
          <Detail label="Harvest status" value={lot.harvestStatus} />
          <Detail label="Quality information" value={lot.qualityInfo} />
          <Detail
            label="Current market"
            value={
              lot.benchmark
                ? `${money(lot.benchmark)} / qtl`
                : "Analysis pending"
            }
          />
          <Detail label="Matching buyers" value={lot.buyers} />
          <Detail label="Selling / storage" value={lot.sellingStatus} />
          <Detail
            label="Estimated gross value"
            value={estimated ? money(estimated) : "Available after analysis"}
          />
        </div>
        <div className="journey">
          <h4>Lot Journey</h4>
          <div className="journey-track">
            {journeySteps.map((step, index) => (
              <div
                className={`journey-step ${index < lot.journey ? "done" : ""}`}
                key={step}
              >
                <span>{index < lot.journey ? "✓" : index + 1}</span>
                <small>{step}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="lot-modal-footer">
          <button className="secondary-action" onClick={() => onNav("store")}>
            Sell or Store
          </button>
          <button className="primary-action" onClick={() => onNav("dashboard")}>
            Decision Center <FiArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}
function Detail({ label, value }) {
  return (
    <div className="lot-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
