import React, { useState } from "react";
import { useCRUD } from "../../context/CRUDContext";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdPerson,
  MdLocationOn, MdAttachMoney,
} from "react-icons/md";
import { FaBuilding, FaTruck } from "react-icons/fa";
import { GiWheat, GiPeanut } from "react-icons/gi";

const emptyBuyer = {
  name: "", location: "", distanceKm: "", priceOffered: "",
  minQty: "", maxQty: "", requirements: "", matchScore: "Medium",
  matchReason: "", contact: "",
};

export default function BuyersManagement({ crop = "cotton" }) {
  const { buyersList, addBuyer, updateBuyer, deleteBuyer } = useCRUD();
  const [activeCrop, setActiveCrop] = useState(crop);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // buyer id or null (for add)
  const [form, setForm] = useState(emptyBuyer);

  const list = buyersList[activeCrop] || [];

  const openAdd = () => {
    setEditing(null);
    setForm(emptyBuyer);
    setShowModal(true);
  };

  const openEdit = (buyer) => {
    setEditing(buyer.id);
    setForm({ ...buyer });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!form.name || !form.location) return;
    if (editing) {
      updateBuyer(activeCrop, editing, form);
    } else {
      addBuyer(activeCrop, form);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this buyer?")) deleteBuyer(activeCrop, id);
  };

  const scoreColor = { High:"#15803d", Medium:"#d97706", Low:"#dc2626" };
  const scoreBg   = { High:"#dcfce7", Medium:"#fef3c7", Low:"#fee2e2" };

  return (
    <div>
      {/* Crop Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, alignItems:"center" }}>
        {[
          { id:"cotton",    icon:<GiWheat />,   label:"Cotton" },
          { id:"groundnut", icon:<GiPeanut />,  label:"Groundnut" },
        ].map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCrop(c.id)}
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"9px 18px", borderRadius:8, border:"1.5px solid",
              borderColor: activeCrop===c.id ? "#1a5c2a" : "#e5e7eb",
              background: activeCrop===c.id ? "#1a5c2a" : "white",
              color: activeCrop===c.id ? "white" : "#374151",
              fontSize:14, fontWeight:600, cursor:"pointer",
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
        <button
          onClick={openAdd}
          style={{
            marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
            padding:"9px 18px", background:"#1a5c2a", color:"white",
            border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer",
          }}
        >
          <MdAdd /> Add Buyer
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#f0faf0" }}>
              {["Buyer Name","Location","Distance","Offer (₹/q)","Qty Range","Match","Actions"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:"#374151", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((b, i) => (
              <tr key={b.id} style={{ background: i%2===0 ? "white" : "#fafafa", transition:"background 0.1s" }}>
                <td style={{ padding:"11px 14px", fontWeight:700, color:"#111827" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <FaBuilding style={{ color:"#6b7280", fontSize:12 }} />
                    {b.name}
                  </div>
                </td>
                <td style={{ padding:"11px 14px", color:"#374151" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <MdLocationOn style={{ color:"#ef4444", fontSize:14 }} />{b.location}
                  </div>
                </td>
                <td style={{ padding:"11px 14px", color:"#374151" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <FaTruck style={{ color:"#6b7280", fontSize:12 }} />{b.distanceKm} km
                  </div>
                </td>
                <td style={{ padding:"11px 14px", fontWeight:800, color:"#1a5c2a" }}>₹{Number(b.priceOffered).toLocaleString("en-IN")}</td>
                <td style={{ padding:"11px 14px", color:"#374151" }}>{b.minQty}–{b.maxQty} q</td>
                <td style={{ padding:"11px 14px" }}>
                  <span style={{
                    padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
                    background: scoreBg[b.matchScore] || "#f3f4f6",
                    color: scoreColor[b.matchScore] || "#374151",
                  }}>
                    {b.matchScore}
                  </span>
                </td>
                <td style={{ padding:"11px 14px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button
                      onClick={() => openEdit(b)}
                      title="Edit"
                      style={{ padding:"6px 10px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:6, color:"#1d4ed8", cursor:"pointer", fontSize:14, display:"flex" }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      title="Delete"
                      style={{ padding:"6px 10px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, color:"#dc2626", cursor:"pointer", fontSize:14, display:"flex" }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding:32, textAlign:"center", color:"#9ca3af", fontSize:14 }}>
                  No buyers yet. Click "Add Buyer" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, padding:20,
        }}>
          <div style={{
            background:"white", borderRadius:16, width:"100%", maxWidth:520,
            boxShadow:"0 24px 48px rgba(0,0,0,0.25)", overflow:"hidden",
          }}>
            {/* Modal Header */}
            <div style={{
              padding:"18px 24px", borderBottom:"1px solid #e5e7eb",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              background: "#f0faf0",
            }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#1a5c2a", display:"flex", alignItems:"center", gap:8 }}>
                {editing ? <><MdEdit /> Edit Buyer</> : <><MdAdd /> Add New Buyer</>}
              </h3>
              <button onClick={closeModal} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#6b7280", display:"flex" }}>
                <MdClose />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding:24, display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[
                { name:"name",         label:"Buyer Name *",     icon:<FaBuilding />,     col:2 },
                { name:"location",     label:"Location *",        icon:<MdLocationOn /> },
                { name:"distanceKm",   label:"Distance (km)",     icon:<FaTruck /> },
                { name:"priceOffered", label:"Price (₹/quintal)", icon:<MdAttachMoney /> },
                { name:"minQty",       label:"Min Qty (quintal)", icon:<GiWheat /> },
                { name:"maxQty",       label:"Max Qty (quintal)", icon:<GiWheat /> },
                { name:"contact",      label:"Contact",           icon:<MdPerson />,       col:2 },
                { name:"requirements", label:"Requirements",      icon:<MdPerson />,       col:2, type:"textarea" },
                { name:"matchReason",  label:"Match Reason",      icon:<MdPerson />,       col:2, type:"textarea" },
              ].map(f => (
                <div key={f.name} style={{ gridColumn: f.col===2 ? "1 / -1" : "auto" }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      value={form[f.name] || ""}
                      onChange={handleChange}
                      rows={2}
                      style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, resize:"vertical", boxSizing:"border-box" }}
                    />
                  ) : (
                    <input
                      name={f.name}
                      value={form[f.name] || ""}
                      onChange={handleChange}
                      style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, boxSizing:"border-box" }}
                    />
                  )}
                </div>
              ))}

              {/* Match Score select */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Match Score</label>
                <select
                  name="matchScore"
                  value={form.matchScore}
                  onChange={handleChange}
                  style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, boxSizing:"border-box" }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding:"14px 24px", borderTop:"1px solid #e5e7eb", display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={closeModal} style={{ padding:"10px 20px", background:"white", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.location}
                style={{
                  padding:"10px 20px", background: (!form.name||!form.location) ? "#9ca3af" : "#1a5c2a",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor: (!form.name||!form.location) ? "not-allowed" : "pointer",
                  color:"white", display:"flex", alignItems:"center", gap:6,
                }}
              >
                <MdSave /> {editing ? "Update Buyer" : "Add Buyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
