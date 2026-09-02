// ============================================================
//  AI ORCHESTRATOR — KrishiMitra AI
//  Purpose: Coordinates all 5 agents into one unified
//           agentic workflow for farmer decision support.
//  Pattern: PRICE → MATCH → EVALUATE → DECIDE → EARN
// ============================================================

import { runPriceAgent } from "../agents/priceAgent";
import { runBuyerMatchingAgent } from "../agents/buyerAgent";
import { runStorageAdvisorAgent } from "../agents/storageAgent";
import { runQualityAgent } from "../agents/qualityAgent";
import { runIncomeDashboardAgent } from "../agents/incomeDashboardAgent";

/**
 * Available orchestration modes:
 *   "full"       — Run all 5 agents (complete selling decision)
 *   "price"      — Price agent only
 *   "buyers"     — Price + Buyer agents
 *   "quality"    — Quality agent only
 *   "storage"    — Price + Storage agents
 *   "dashboard"  — All agents → dashboard
 */

/**
 * MAIN ORCHESTRATOR
 *
 * @param {Object} farmerRequest
 *   {
 *     mode: "full"|"price"|"buyers"|"quality"|"storage"|"dashboard",
 *     crop: "cotton"|"groundnut",
 *     quantity: number (quintals),
 *     location: string,
 *     name: string,
 *     qualityTier: "high"|"medium"|"low",
 *     qualityNotes: string,
 *   }
 * @param {Function} onStepComplete   — callback(stepName, result) for streaming UI updates
 * @returns {Object} orchestration result with all agent outputs
 */
export async function runOrchestrator(farmerRequest, onStepComplete = null) {
  const {
    mode = "full",
    crop = "cotton",
    quantity = 50,
    location = "Gujarat",
    name = "Farmer",
    qualityTier = "medium",
    qualityNotes = "",
  } = farmerRequest;

  const farmerProfile = { name, crop, quantity, location };
  const results = {};
  const log = [];

  const notify = (step, data) => {
    log.push({ step, timestamp: new Date().toISOString() });
    if (onStepComplete) onStepComplete(step, data);
  };

  // ── STEP 1: Price Agent ──────────────────────────────────
  notify("price_start", { message: "Analysing available market prices..." });
  const priceResult = runPriceAgent(crop);
  results.price = priceResult;
  notify("price_done", priceResult);

  if (mode === "price") {
    return buildResponse("price_only", results, farmerProfile, log);
  }

  // ── STEP 2: Buyer Matching Agent ─────────────────────────
  notify("buyers_start", { message: "Finding suitable buyer options..." });
  const buyerResult = runBuyerMatchingAgent({ crop, quantity, location });
  results.buyers = buyerResult;
  notify("buyers_done", buyerResult);

  if (mode === "buyers") {
    return buildResponse("buyers_only", results, farmerProfile, log);
  }

  // ── STEP 3: Quality Agent ────────────────────────────────
  notify("quality_start", { message: "Evaluating quality information..." });
  const qualityResult = runQualityAgent({ crop, qualityTier, notes: qualityNotes });
  results.quality = qualityResult;
  notify("quality_done", qualityResult);

  if (mode === "quality") {
    return buildResponse("quality_only", results, farmerProfile, log);
  }

  // ── STEP 4: Storage & Selling Advisor Agent ───────────────
  notify("storage_start", { message: "Comparing selling now vs storage..." });
  const bestCurrentPrice = priceResult?.summary?.bestPrice || 0;
  const priceOutlook = priceResult?.summary?.outlook || { direction: "Stable" };
  const storageResult = runStorageAdvisorAgent({
    crop,
    quantity,
    bestCurrentPrice,
    priceOutlook,
  });
  results.storage = storageResult;
  notify("storage_done", storageResult);

  if (mode === "storage") {
    return buildResponse("storage_only", results, farmerProfile, log);
  }

  // ── STEP 5: Income Dashboard Agent ───────────────────────
  notify("dashboard_start", { message: "Calculating estimated revenue and final recommendation..." });
  const dashboardResult = runIncomeDashboardAgent({
    farmerProfile,
    priceResult,
    buyerResult,
    qualityResult,
    storageResult,
  });
  results.dashboard = dashboardResult;
  notify("dashboard_done", dashboardResult);

  return buildResponse("full", results, farmerProfile, log);
}

/**
 * Build the unified response object.
 */
function buildResponse(mode, results, farmerProfile, log) {
  return {
    orchestrationMode: mode,
    farmerProfile,
    completed: true,
    agentsRun: Object.keys(results),
    results,
    executionLog: log,
    finalAnswer: results.dashboard?.finalRecommendation || null,
    topLine:
      results.dashboard?.finalRecommendation?.summary ||
      results.price?.summary
        ? `Best available price: ₹${results.price?.summary?.bestPrice}/quintal at ${results.price?.summary?.bestMarket}`
        : "Analysis complete.",
  };
}
