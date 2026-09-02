// ============================================================
//  AGENT 4 — Quality Grading Assistance Agent
//  Purpose: Help farmer understand crop quality parameters
//           and how quality affects buyer matching & price.
//  SAFETY: AI-assisted estimation only — NOT official cert.
// ============================================================

import { qualityGrades, DEMO_LABEL } from "../data/demoData";

/**
 * Map user-selected quality tier to grade label.
 * qualityTier: "high" | "medium" | "low"
 */
function resolveGrade(crop, qualityTier) {
  const grades = qualityGrades[crop]?.grades || {};
  const gradeKeys = Object.keys(grades);

  const tierMap = { high: 0, medium: 1, low: 2 };
  const idx = tierMap[qualityTier] ?? 1;
  return {
    gradeName: gradeKeys[idx] || gradeKeys[0],
    gradeSpec: grades[gradeKeys[idx]] || grades[gradeKeys[0]],
  };
}

/**
 * Returns how quality tier affects buyer suitability.
 */
function qualityImpactOnBuyers(crop, gradeName) {
  const crop_l = crop.toLowerCase();
  if (crop_l === "cotton") {
    if (gradeName === "Grade A")
      return {
        impact: "Positive",
        detail:
          "Grade A cotton attracts all buyer tiers including premium buyers requiring high staple length. Expect best prices.",
      };
    if (gradeName === "Grade B")
      return {
        impact: "Moderate",
        detail:
          "Grade B cotton is accepted by most mid-tier buyers. Slight price discount vs Grade A possible.",
      };
    return {
      impact: "Restrictive",
      detail:
        "Grade C cotton has limited buyer options. Consider improving moisture/drying before selling.",
    };
  }
  if (crop_l === "groundnut") {
    if (gradeName === "Export Grade")
      return {
        impact: "Positive",
        detail:
          "Export grade groundnut commands top prices and opens export buyer options.",
      };
    if (gradeName === "Domestic Grade A")
      return {
        impact: "Moderate",
        detail:
          "Domestic Grade A is accepted by most local buyers and oil mills at standard prices.",
      };
    return {
      impact: "Restrictive",
      detail:
        "Domestic Grade B has fewer buyers. Reducing moisture and aflatoxin levels could improve grade.",
    };
  }
  return { impact: "Unknown", detail: "Quality impact analysis not available for this crop." };
}

/**
 * MAIN AGENT 4 FUNCTION
 * Input: { crop, qualityTier: "high"|"medium"|"low", notes }
 *   - qualityTier: farmer's self-reported quality level
 *   - notes: any text description from farmer
 * Output: Quality assessment report
 */
export function runQualityAgent({ crop, qualityTier = "medium", notes = "" }) {
  const cropKey = crop.toLowerCase();
  const cropQuality = qualityGrades[cropKey];

  if (!cropQuality) {
    return {
      status: "error",
      message: `Quality data not available for crop: ${crop}`,
    };
  }

  const { gradeName, gradeSpec } = resolveGrade(cropKey, qualityTier);
  const buyerImpact = qualityImpactOnBuyers(cropKey, gradeName);

  const improvementTips = {
    cotton: {
      "Grade A": ["Maintain staple length. Ensure proper ginning. Store in dry conditions."],
      "Grade B": [
        "Reduce moisture to below 8% by sun-drying.",
        "Sort out short staple fibres if possible.",
        "Avoid wet or contaminated cotton.",
      ],
      "Grade C": [
        "Significant drying required — moisture must be below 10%.",
        "Consider professional ginning to improve fibre quality.",
        "Consult local agriculture officer for quality improvement advice.",
      ],
    },
    groundnut: {
      "Export Grade": ["Maintain dry storage. Clean thoroughly. Ensure bold variety separation."],
      "Domestic Grade A": [
        "Reduce moisture further to ≤ 7% for export eligibility.",
        "Clean to remove foreign matter.",
        "Test for aflatoxin if targeting export markets.",
      ],
      "Domestic Grade B": [
        "Priority: reduce moisture urgently — risk of aflatoxin.",
        "Clean and sort to remove damaged pods.",
        "Store in ventilated warehouse.",
        "Consult local agriculture department for aflatoxin testing.",
      ],
    },
  };

  const tips = improvementTips[cropKey]?.[gradeName] || [];

  return {
    status: "success",
    agent: "Quality Grading Assistance Agent",
    dataLabel: DEMO_LABEL,
    crop: cropKey,
    qualityTier,
    estimatedGrade: gradeName,
    gradeSpec,
    parameters: cropQuality.parameters,
    buyerImpact,
    improvementTips: tips,
    farmerNotes: notes,
    disclaimer:
      "⚠️ This is an AI-assisted quality estimate based on self-reported information only. It is NOT an official laboratory grade certification. For certified grading, contact an accredited testing laboratory or your APMC.",
  };
}
