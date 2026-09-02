// ============================================================
//  AGENT 2 — Direct Buyer-Farmer Matching Agent
//  Purpose: Match farmer with suitable buyers based on
//           crop, quantity, location, and quality.
//  SAFETY: Never invents real buyers. Uses demo data only.
// ============================================================

import { buyers, DEMO_LABEL } from "../data/demoData";

/**
 * Score a buyer against farmer inputs.
 * Returns numeric score 0–100 and match tier.
 */
function scoreBuyer(buyer, farmerQty) {
  let score = 0;

  // Quantity fit (50 pts)
  if (farmerQty >= buyer.minQty && farmerQty <= buyer.maxQty) {
    score += 50;
  } else if (farmerQty < buyer.minQty) {
    // Under minimum — partial credit based on how close
    const gap = buyer.minQty - farmerQty;
    score += Math.max(0, 50 - gap * 2);
  } else {
    // Over maximum — can split, give partial credit
    score += 20;
  }

  // Distance preference (30 pts — closer is better)
  if (buyer.distanceKm <= 50) score += 30;
  else if (buyer.distanceKm <= 100) score += 20;
  else if (buyer.distanceKm <= 200) score += 10;

  // Price offered vs average (20 pts)
  // Higher price = better score
  score += 20; // baseline — all buyers are valid candidates

  return score;
}

function matchTier(score) {
  if (score >= 85) return "High";
  if (score >= 55) return "Medium";
  return "Low";
}

/**
 * MAIN AGENT 2 FUNCTION
 * Input: { crop, quantity, location }
 * Output: Ranked list of matched buyers with reasoning
 */
export function runBuyerMatchingAgent({ crop, quantity, location }) {
  const cropKey = crop.toLowerCase();
  const cropBuyers = buyers[cropKey];

  if (!cropBuyers || cropBuyers.length === 0) {
    return {
      status: "error",
      message: `No buyer data available for crop: ${crop}`,
    };
  }

  const qty = parseFloat(quantity) || 50;

  // Score and sort buyers
  const scoredBuyers = cropBuyers
    .map((buyer) => {
      const rawScore = scoreBuyer(buyer, qty);
      return {
        ...buyer,
        computedScore: rawScore,
        matchScore: matchTier(rawScore),
      };
    })
    .sort((a, b) => b.computedScore - a.computedScore);

  const topBuyer = scoredBuyers[0];

  return {
    status: "success",
    agent: "Buyer Matching Agent",
    dataLabel: DEMO_LABEL,
    crop: cropKey,
    farmerInputs: { crop, quantity: qty, location },
    totalMatches: scoredBuyers.length,
    buyers: scoredBuyers,
    topRecommendation: {
      buyer: topBuyer,
      reason: topBuyer.matchReason,
    },
    disclaimer:
      "⚠️ Buyer matches are based on demo/sample data and suitability criteria only. Verify buyer credentials independently before transacting.",
  };
}
