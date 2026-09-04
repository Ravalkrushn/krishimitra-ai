// ============================================================
//  AGENT 5 — Farmer Income Dashboard Agent
//  Purpose: Combine all agent outputs into one unified
//           income and decision dashboard for the farmer.
// ============================================================

import { DEMO_LABEL } from "../data/demoData";

/**
 * Format ₹ Indian rupees with comma notation.
 */
export function formatINR(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * MAIN AGENT 5 FUNCTION
 * Input: All four agent results combined
 * Output: Unified farmer income dashboard object
 */
export function runIncomeDashboardAgent({
  farmerProfile,
  priceResult,
  buyerResult,
  qualityResult,
  storageResult,
}) {
  const { crop, quantity, location, name } = farmerProfile;
  const qty = parseFloat(quantity) || 50;

  // --- Best available option calculation ---
  const topBuyer = buyerResult?.topRecommendation?.buyer;
  const bestMarketPrice = priceResult?.summary?.bestPrice || 0;
  const topBuyerPrice = topBuyer?.priceOffered || bestMarketPrice;

  // Choose best price between mandi and top buyer
  const bestAvailablePrice = Math.max(topBuyerPrice, bestMarketPrice);
  const bestSource =
    topBuyerPrice >= bestMarketPrice
      ? `${topBuyer?.name} (Direct Buyer)`
      : `${priceResult?.summary?.bestMarket} (Mandi)`;

  const estimatedGrossRevenue = qty * bestAvailablePrice;
  const storageSuggestion = storageResult?.recommendationText || "Sell Now";
  const qualityGrade = qualityResult?.estimatedGrade || "Not assessed";
  const priceOutlookDir = priceResult?.summary?.outlook?.direction || "Stable";

  // --- Final AI Recommendation ---
  const finalRecommendation = buildFinalRecommendation({
    crop,
    quantity: qty,
    bestSource,
    bestAvailablePrice,
    estimatedGrossRevenue,
    storageSuggestion,
    qualityGrade,
    priceOutlookDir,
    topBuyer,
    storageResult,
  });

  return {
    status: "success",
    agent: "Farmer Income Dashboard Agent",
    dataLabel: DEMO_LABEL,
    farmerProfile: { name, crop, quantity: qty, location },
    marketSnapshot: {
      bestPrice: priceResult?.summary?.bestPrice,
      bestMarket: priceResult?.summary?.bestMarket,
      averagePrice: priceResult?.summary?.averagePrice,
      msp: priceResult?.summary?.msp,
      premiumOverMSP: priceResult?.summary?.premiumOverMSP,
      trend: priceResult?.summary?.trend,
      outlook: priceOutlookDir,
    },
    buyerSummary: {
      totalMatches: buyerResult?.totalMatches || 0,
      topBuyer: topBuyer || null,
    },
    qualitySummary: {
      estimatedGrade: qualityGrade,
      buyerImpact: qualityResult?.buyerImpact?.impact || "Unknown",
    },
    storageSummary: {
      recommendation: storageSuggestion,
      netDifference: storageResult?.netDifference || 0,
    },
    income: {
      bestAvailablePrice,
      bestSource,
      estimatedGrossRevenue,
      breakdown: [
        { option: "Best Buyer / Market", pricePerQ: bestAvailablePrice, totalRevenue: estimatedGrossRevenue },
        { option: "Best Mandi Price", pricePerQ: bestMarketPrice, totalRevenue: qty * bestMarketPrice },
        { option: "MSP Reference", pricePerQ: priceResult?.summary?.msp, totalRevenue: qty * (priceResult?.summary?.msp || 0) },
      ],
    },
    finalRecommendation,
  };
}

/**
 * Build the final human-readable AI recommendation text.
 */
function buildFinalRecommendation({
  crop,
  quantity,
  bestSource,
  bestAvailablePrice,
  estimatedGrossRevenue,
  storageSuggestion,
  qualityGrade,
  priceOutlookDir,
  topBuyer,
  storageResult,
}) {
  const cropLabel = crop.charAt(0).toUpperCase() + crop.slice(1);
  const revenueFormatted = `₹${Math.round(estimatedGrossRevenue).toLocaleString("en-IN")}`;
  const priceFormatted = `₹${bestAvailablePrice}/quintal`;

  const steps = [
    `Market Analysis: Current best ${cropLabel} price is ₹${bestAvailablePrice}/quintal at ${bestSource}. Price outlook is ${priceOutlookDir}.`,
    `Best Buyer Match: ${topBuyer ? `${topBuyer.name} (${topBuyer.location}, ${topBuyer.distanceKm}km away) offering ${priceFormatted} — ${topBuyer.matchScore} match.` : "No buyer data available."}`,
    `Quality: Estimated grade is ${qualityGrade}. ${qualityGrade.includes("A") || qualityGrade.includes("Export") ? "This supports access to premium buyer options." : "Some buyers may offer lower prices due to quality grade."}`,
    `Sell vs Store: Based on current market data, recommendation is to ${storageSuggestion}. ${storageResult?.netDifference > 0 ? `Storage could add ~₹${Math.round(storageResult.netDifference).toLocaleString("en-IN")} net after storage costs.` : `Selling now avoids storage cost and price uncertainty.`}`,
    `Estimated Gross Revenue: ${revenueFormatted} for ${quantity} quintals at ${priceFormatted}.`,
  ];

  const summary = storageSuggestion === "Sell Now"
    ? `Based on available market and buyer data, selling ${quantity} quintals of ${cropLabel} to ${topBuyer?.name || "the best available market"} now at ${priceFormatted} is the best available option. Estimated gross revenue: ${revenueFormatted}.`
    : `Based on available market trends, considering storage for approximately 2 months may improve your outcome. Estimated gross revenue after storage: ₹${Math.round(storageResult?.considerStorage?.netRevenue || 0).toLocaleString("en-IN")} vs selling now: ₹${Math.round(storageResult?.sellNow?.netRevenue || 0).toLocaleString("en-IN")}.`;

  return {
    summary,
    steps,
    assumptions: [
      "All prices are based on demo/sample data.",
      "Storage cost estimated at ₹25/quintal/month + ₹15 handling.",
      "Future price forecast is an estimate, not a guarantee.",
      "Quality grade is AI-estimated from self-reported information.",
      "Transport costs are not included in revenue estimates.",
    ],
  };
}
