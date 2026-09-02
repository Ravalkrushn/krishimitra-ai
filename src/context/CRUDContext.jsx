import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { buyers as demoBuyers } from "../data/demoData";

const CRUDContext = createContext(null);

export function CRUDProvider({ children }) {
  // Buyers CRUD state (starts with demo data)
  const [buyersList, setBuyersList] = useState({
    cotton:   [...demoBuyers.cotton],
    groundnut: [...demoBuyers.groundnut],
  });

  // Farmer profiles CRUD state
  const [farmerProfiles, setFarmerProfiles] = useState([
    { id: "F1", name: "Rameshbhai Patel", crop: "cotton",    quantity: "50",  location: "Jamnagar, Gujarat",  qualityTier: "medium" },
    { id: "F2", name: "Hareshbhai Shah",  crop: "groundnut", quantity: "35",  location: "Rajkot, Gujarat",    qualityTier: "high"   },
    { id: "F3", name: "Bhaveshbhai Joshi",crop: "cotton",    quantity: "80",  location: "Gondal, Gujarat",    qualityTier: "low"    },
  ]);

  // ── BUYER CRUD ─────────────────────────────────────────────
  const addBuyer = (crop, buyer) => {
    const newBuyer = { ...buyer, id: `custom_${Date.now()}` };
    setBuyersList(prev => ({
      ...prev,
      [crop]: [...(prev[crop] || []), newBuyer],
    }));
    toast.success(`Buyer "${buyer.name}" added successfully!`);
  };

  const updateBuyer = (crop, id, updated) => {
    setBuyersList(prev => ({
      ...prev,
      [crop]: prev[crop].map(b => b.id === id ? { ...b, ...updated } : b),
    }));
    toast.success("Buyer updated successfully!");
  };

  const deleteBuyer = (crop, id) => {
    setBuyersList(prev => ({
      ...prev,
      [crop]: prev[crop].filter(b => b.id !== id),
    }));
    toast.success("Buyer removed.");
  };

  // ── FARMER PROFILE CRUD ───────────────────────────────────
  const addFarmer = (farmer) => {
    const newFarmer = { ...farmer, id: `F${Date.now()}` };
    setFarmerProfiles(prev => [...prev, newFarmer]);
    toast.success(`Farmer profile "${farmer.name}" created!`);
    return newFarmer;
  };

  const updateFarmer = (id, updated) => {
    setFarmerProfiles(prev =>
      prev.map(f => f.id === id ? { ...f, ...updated } : f)
    );
    toast.success("Farmer profile updated!");
  };

  const deleteFarmer = (id) => {
    setFarmerProfiles(prev => prev.filter(f => f.id !== id));
    toast.success("Farmer profile deleted.");
  };

  return (
    <CRUDContext.Provider value={{
      buyersList, addBuyer, updateBuyer, deleteBuyer,
      farmerProfiles, addFarmer, updateFarmer, deleteFarmer,
    }}>
      {children}
    </CRUDContext.Provider>
  );
}

export function useCRUD() {
  return useContext(CRUDContext);
}
