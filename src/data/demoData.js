// ============================================================
//  KrishiMitra AI — Demo / Sample Data
//  NOTE: All data is clearly labelled DEMO/SAMPLE data.
//  In production, replace with live mandi APIs and buyer DB.
// ============================================================

export const DEMO_LABEL = "DEMO DATA";

// --- Mandi Prices (₹/quintal) ---
export const mandiPrices = {
  cotton: [
    { market: "Rajkot APMC",      price: 6850, district: "Rajkot",   trend: "up",   delta: +120 },
    { market: "Gondal APMC",      price: 6780, district: "Rajkot",   trend: "up",   delta: +90  },
    { market: "Bhavnagar APMC",   price: 6700, district: "Bhavnagar",trend: "flat", delta: 0    },
    { market: "Surendranagar APMC",price:6620, district: "Surendranagar",trend:"down",delta:-50  },
    { market: "Amreli APMC",      price: 6750, district: "Amreli",   trend: "up",   delta: +60  },
    { market: "Junagadh APMC",    price: 6800, district: "Junagadh", trend: "up",   delta: +80  },
  ],
  groundnut: [
    { market: "Junagadh APMC",    price: 5800, district: "Junagadh", trend: "up",   delta: +200 },
    { market: "Rajkot APMC",      price: 5750, district: "Rajkot",   trend: "up",   delta: +150 },
    { market: "Amreli APMC",      price: 5680, district: "Amreli",   trend: "flat", delta: 0    },
    { market: "Bhavnagar APMC",   price: 5600, district: "Bhavnagar",trend: "down", delta: -80  },
    { market: "Jamnagar APMC",    price: 5720, district: "Jamnagar", trend: "up",   delta: +100 },
    { market: "Porbandar APMC",   price: 5650, district: "Porbandar",trend: "flat", delta: +20  },
  ],
};

// --- Historical Price Trend (last 6 months) ---
export const historicalTrend = {
  cotton: [
    { month: "Apr", price: 6200 },
    { month: "May", price: 6350 },
    { month: "Jun", price: 6500 },
    { month: "Jul", price: 6600 },
    { month: "Aug", price: 6720 },
    { month: "Sep", price: 6850 },
  ],
  groundnut: [
    { month: "Apr", price: 5200 },
    { month: "May", price: 5350 },
    { month: "Jun", price: 5480 },
    { month: "Jul", price: 5560 },
    { month: "Aug", price: 5680 },
    { month: "Sep", price: 5800 },
  ],
};

// --- Price Forecast (next 2 months, estimated) ---
export const priceForecast = {
  cotton: [
    { month: "Oct", price: 6950, type: "forecast" },
    { month: "Nov", price: 7100, type: "forecast" },
  ],
  groundnut: [
    { month: "Oct", price: 5950, type: "forecast" },
    { month: "Nov", price: 6050, type: "forecast" },
  ],
};

// --- Buyers ---
export const buyers = {
  cotton: [
    {
      id: "B1",
      name: "Shree Ram Cotton Industries",
      location: "Rajkot",
      distanceKm: 38,
      priceOffered: 6880,
      minQty: 20,
      maxQty: 200,
      requirements: "Staple length ≥ 28mm, moisture ≤ 10%",
      matchScore: "High",
      matchReason: "Best price, accepts your quantity, 38 km away, good staple requirement fit.",
      contact: "Demo Contact Only",
    },
    {
      id: "B2",
      name: "Gujarat Ginning Co.",
      location: "Gondal",
      distanceKm: 52,
      priceOffered: 6820,
      minQty: 30,
      maxQty: 150,
      requirements: "Grade A preferred, no wet cotton",
      matchScore: "High",
      matchReason: "Competitive price, 52 km, accepts standard quality cotton.",
      contact: "Demo Contact Only",
    },
    {
      id: "B3",
      name: "Amreli Textile Processors",
      location: "Amreli",
      distanceKm: 95,
      priceOffered: 6790,
      minQty: 10,
      maxQty: 100,
      requirements: "Any grade accepted",
      matchScore: "Medium",
      matchReason: "Further distance (95 km) but accepts smaller quantities and any grade.",
      contact: "Demo Contact Only",
    },
    {
      id: "B4",
      name: "National Cotton Corp (Demo)",
      location: "Ahmedabad",
      distanceKm: 180,
      priceOffered: 6950,
      minQty: 100,
      maxQty: 1000,
      requirements: "Grade A only, bulk supplier",
      matchScore: "Low",
      matchReason: "Highest price but requires 100 quintal minimum and bulk grade A quality.",
      contact: "Demo Contact Only",
    },
  ],
  groundnut: [
    {
      id: "G1",
      name: "Saurashtra Oil Mills",
      location: "Junagadh",
      distanceKm: 45,
      priceOffered: 5850,
      minQty: 10,
      maxQty: 300,
      requirements: "Moisture ≤ 9%, clean batch",
      matchScore: "High",
      matchReason: "Best local price, 45 km, accepts your quantity.",
      contact: "Demo Contact Only",
    },
    {
      id: "G2",
      name: "Rajkot Groundnut Exports",
      location: "Rajkot",
      distanceKm: 60,
      priceOffered: 5800,
      minQty: 20,
      maxQty: 200,
      requirements: "Bold variety preferred",
      matchScore: "High",
      matchReason: "Strong export-quality buyer, 60 km.",
      contact: "Demo Contact Only",
    },
    {
      id: "G3",
      name: "Gujarat Agro Processors",
      location: "Amreli",
      distanceKm: 88,
      priceOffered: 5720,
      minQty: 5,
      maxQty: 80,
      requirements: "Any variety",
      matchScore: "Medium",
      matchReason: "Accepts small batches, any variety — useful for partial selling.",
      contact: "Demo Contact Only",
    },
  ],
};

// --- Quality Grades ---
export const qualityGrades = {
  cotton: {
    parameters: ["Staple Length (mm)", "Micronaire Value", "Strength (g/tex)", "Uniformity (%)", "Moisture (%)"],
    grades: {
      "Grade A": { staple: "≥ 30mm", micronaire: "3.5–4.5", strength: "≥ 29", uniformity: "≥ 83%", moisture: "≤ 8%" },
      "Grade B": { staple: "28–29mm", micronaire: "4.5–5.5", strength: "27–29", uniformity: "81–83%", moisture: "8–10%" },
      "Grade C": { staple: "< 28mm", micronaire: "> 5.5", strength: "< 27", uniformity: "< 81%", moisture: "> 10%" },
    },
  },
  groundnut: {
    parameters: ["Oil Content (%)", "Moisture (%)", "Shelling % (bold)", "Aflatoxin (ppb)", "Foreign matter (%)"],
    grades: {
      "Export Grade": { oil: "≥ 50%", moisture: "≤ 7%", shelling: "≥ 70%", aflatoxin: "< 4 ppb", foreign: "< 0.5%" },
      "Domestic Grade A": { oil: "48–50%", moisture: "7–9%", shelling: "60–70%", aflatoxin: "< 8 ppb", foreign: "< 1%" },
      "Domestic Grade B": { oil: "< 48%", moisture: "> 9%", shelling: "< 60%", aflatoxin: "< 15 ppb", foreign: "< 2%" },
    },
  },
};

// --- Storage Cost Assumptions ---
export const storageCosts = {
  perQuintalPerMonth: 25,   // ₹ per quintal per month (warehouse)
  handlingCharge: 15,        // ₹ per quintal one-time
};

// --- MSP (Minimum Support Price) for reference ---
export const msp = {
  cotton: 6620,
  groundnut: 5550,
};
