import React, { useState } from "react";
import { useCRUD } from "../../context/CRUDContext";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdSave,
  MdLocationOn, MdPerson,
} from "react-icons/md";
import { GiFarmer, GiWheat, GiPeanut } from "react-icons/gi";

const emptyFarmer = {
  name: "", location: "", crop: "cotton", quantity: "", qualityTier: "medium",
};

export default function FarmersManagement({ onSelectProfile }) {
  const { farmerProfiles, addFarmer, updateFarmer, deleteFarmer } = useCRUD();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyFarmer);

  const openAdd = () => { setEditing(null); setForm(emptyFarmer); setShowModal(true); };
  const openEdit = (f) => { setEditing(f.id); setForm({ ...f }); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!form.name || !form.location) return;
    if (editing) updateFarmer(editing, form);
    else addFarmer(form);
    close();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this farmer profile?")) deleteFarmer(id);
  };

  const cropIcon = (c) => c === "cotton" ? <GiWheat /> : <GiPeanut />;
  const tierColor = { high:"#15803d", medium:"#d97706", low:"#9ca3af" };
  const tierBg    = { high:"#dcfce7", medium:"#fef3c7", low:"#f3f4f6" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#111827" }}>Farmer Profiles</h3>
          <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>{farmerProfiles.length} profiles registered</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"9px 16px", background:"#1a5c2a", color:"white",
            border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
          }}
        >
          <MdAdd /> Add Farmer
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 }}>
        {farmerProfiles.map(f => (
          <div key={f.id} style={{
            background:"white", border:"1.5px solid #e5e7eb", borderRadius:12,
            padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:42, height:42, borderRadius:"50%",
                  background:"linear-gradient(135deg, #1a5c2a, #4caf50)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"white", fontSize:20,
                }}>
                  <GiFarmer />
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{f.name}</div>
                  <div style={{ fontSize:11, color:"#6b7280", display:"flex", alignItems:"center", gap:3 }}>
                    <MdLocationOn style={{ color:"#ef4444" }} />{f.location}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <button
                  onClick={() => openEdit(f)}
                  style={{ padding:"5px 8px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:6, color:"#1d4ed8", cursor:"pointer", fontSize:13, display:"flex" }}
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  style={{ padding:"5px 8px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, color:"#dc2626", cursor:"pointer", fontSize:13, display:"flex" }}
                >
                  <MdDelete />
                </button>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {[
                { label:"Crop",     value: <span style={{ display:"flex", alignItems:"center", gap:3 }}>{cropIcon(f.crop)} {f.crop}</span> },
                { label:"Quantity", value: `${f.quantity} q` },
                { label:"Quality",  value: (
                  <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background: tierBg[f.qualityTier], color: tierColor[f.qualityTier], textTransform:"capitalize" }}>
                    {f.qualityTier}
                  </span>
                ) },
              ].map(item => (
                <div key={item.label} style={{ background:"#f9fafb", borderRadius:6, padding:"6px 8px" }}>
                  <div style={{ fontSize:10, color:"#9ca3af", marginBottom:2, textTransform:"uppercase", fontWeight:600 }}>{item.label}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {onSelectProfile && (
              <button
                onClick={() => onSelectProfile(f)}
                style={{
                  marginTop:10, width:"100%", padding:"8px",
                  background:"#f0faf0", border:"1.5px solid #a5d6a7",
                  borderRadius:7, fontSize:12, fontWeight:700, color:"#1a5c2a", cursor:"pointer",
                }}
              >
                Use This Profile
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000, padding:20,
        }}>
          <div style={{ background:"white", borderRadius:16, width:"100%", maxWidth:440, boxShadow:"0 24px 48px rgba(0,0,0,0.25)", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e7eb", background:"#f0faf0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:"#1a5c2a", display:"flex", alignItems:"center", gap:7 }}>
                {editing ? <><MdEdit /> Edit Profile</> : <><MdAdd /> New Farmer</>}
              </h3>
              <button onClick={close} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#6b7280", display:"flex" }}><MdClose /></button>
            </div>

            <div style={{ padding:20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { name:"name",     label:"Full Name *",      col:2 },
                { name:"location", label:"Location *",        col:2 },
                { name:"quantity", label:"Quantity (quintal)" },
              ].map(f => (
                <div key={f.name} style={{ gridColumn: f.col===2 ? "1 / -1" : "auto" }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:4 }}>{f.label}</label>
                  <input
                    name={f.name}
                    value={form[f.name] || ""}
                    onChange={handleChange}
                    style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, boxSizing:"border-box" }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:4 }}>Crop</label>
                <select name="crop" value={form.crop} onChange={handleChange} style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, boxSizing:"border-box" }}>
                  <option value="cotton">Cotton</option>
                  <option value="groundnut">Groundnut</option>
                </select>
              </div>

              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:4 }}>Quality Tier</label>
                <select name="qualityTier" value={form.qualityTier} onChange={handleChange} style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, boxSizing:"border-box" }}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ padding:"12px 20px", borderTop:"1px solid #e5e7eb", display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={close} style={{ padding:"9px 18px", background:"white", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", color:"#374151" }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.location}
                style={{
                  padding:"9px 18px",
                  background: (!form.name||!form.location) ? "#9ca3af" : "#1a5c2a",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:700,
                  cursor: (!form.name||!form.location) ? "not-allowed" : "pointer",
                  color:"white", display:"flex", alignItems:"center", gap:5,
                }}
              >
                <MdSave /> {editing ? "Update" : "Add Farmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
