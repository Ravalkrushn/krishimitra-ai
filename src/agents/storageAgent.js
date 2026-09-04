// ============================================================
//  AGENT 3 — Storage & Selling Timing Advisor Agent
//  Purpose: Evaluate "Sell Now" vs "Store" options.
//  SAFETY: Never guarantees future prices or profits.
// ============================================================

import { storageCosts, DEMO_LABEL } from "../data/demoData";

/**
 * MAIN AGENT 3 FUNCTION
 * Input: { crop, quantity, bestCurrentPrice, priceOutlook }
 *   - bestCurrentPrice: ₹/quintal from Price Agent
 *   - priceOutlook: { direction, statement, confidence } from Price Agent
 * Output: Sell Now vs Store comparison + recommendation
 */
export function runStorageAdvisorAgent({
  crop,
  quantity,
  bestCurrentPrice,
  priceOutlook,
}) {
  const qty = parseFloat(quantity) || 50;
  const currentPrice = parseFloat(bestCurrentPrice) || 0;

  // --- Sell Now Scenario ---
  const sellNowRevenue = qty * currentPrice;
  const sellNowCost = 0; // immediate sale, no storage cost
  const sellNowNet = sellNowRevenue;

  // --- Store Scenario (2 months) ---
  const storageMonths = 2;
  const storagePerUnit = storageCosts.perQuintalPerMonth * storageMonths + storageCosts.handlingCharge;
  const totalStorageCost = qty * storagePerUnit;

  // Estimate future price based on outlook direction
  let estimatedFuturePrice = currentPrice;
  let priceChangeAssumption = "";

  const direction = priceOutlook?.direction || "Stable";

  if (direction === "Increasing") {
    estimatedFuturePrice = Math.round(currentPrice * 1.04); // ~4% upside estimate
    priceChangeAssumption = "Estimated ~4% upside based on rising trend (not guaranteed)";
  } else if (direction === "Decreasing") {
    estimatedFuturePrice = Math.round(currentPrice * 0.97); // ~3% downside
    priceChangeAssumption = "Estimated ~3% downside risk based on falling trend (not guaranteed)";
  } else {
    estimatedFuturePrice = Math.round(currentPrice * 1.01); // marginal upside
    priceChangeAssumption = "Estimated ~1% marginal change based on stable trend (not guaranteed)";
  }

  const storeRevenue = qty * estimatedFuturePrice;
  const storeNet = storeRevenue - totalStorageCost;
  const netDifference = storeNet - sellNowNet;

  // --- Recommendation Logic ---
  let recommendation = "sell_now";
  let recommendationText = "";
  let reasoningSteps = [];

  if (direction === "Increasing" && netDifference > 0) {
    recommendation = "consider_storage";
    recommendationText = "Consider Storage";
    reasoningSteps = [
      `Price trend is Rising — estimated future price ₹${estimatedFuturePrice}/quintal.`,
      `Estimated storage cost: ₹${totalStorageCost.toLocaleString("en-IN")} for ${storageMonths} months.`,
      `Estimated net gain from storage: ₹${netDifference.toLocaleString("en-IN")} (after storage costs).`,
      `If estimates hold, storage may provide a better outcome.`,
      `However, this depends on actual future prices — which are not guaranteed.`,
    ];
  } else {
    recommendation = "sell_now";
    recommendationText = "Sell Now";
    reasoningSteps = [
      `Current best price is ₹${currentPrice}/quintal — ${direction === "Decreasing" ? "prices are trending down" : "prices are stable"}.`,
      `Storage cost of ₹${totalStorageCost.toLocaleString("en-IN")} for ${storageMonths} months reduces net revenue.`,
      `Estimated net difference in favour of selling now: ₹${Math.abs(netDifference).toLocaleString("en-IN")}.`,
      `Selling now locks in the current market price and avoids storage risk.`,
    ];
  }

  return {
    status: "success",
    agent: "Storage & Selling Advisor Agent",
    dataLabel: DEMO_LABEL,
    crop,
    quantity: qty,
    storageMonths,
    sellNow: {
      pricePerQuintal: currentPrice,
      estimatedRevenue: sellNowRevenue,
      storageCost: 0,
      netRevenue: sellNowNet,
    },
    considerStorage: {
      estimatedFuturePrice,
      estimatedRevenue: storeRevenue,
      storageCost: totalStorageCost,
      netRevenue: storeNet,
      priceChangeAssumption,
    },
    netDifference,
    recommendation,
    recommendationText,
    reasoningSteps,
    disclaimer:
      "Storage scenario uses estimated future prices based on trend only. Actual prices cannot be guaranteed. Storage costs are estimates. Make the final decision based on your own assessment.",
  };
}
