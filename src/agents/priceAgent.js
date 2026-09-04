// ============================================================
//  AGENT 1 — Mandi Price Forecasting Agent
//  Purpose: Retrieve current mandi prices, compare markets,
//           analyse trend, produce forecast/outlook.
//  SAFETY: Clearly distinguishes actual vs. forecast data.
// ============================================================

import { mandiPrices, historicalTrend, priceForecast, msp, DEMO_LABEL } from "../data/demoData";

/**
 * Returns the best (highest) mandi price for a given crop.
 */
function getBestPrice(crop) {
  const markets = mandiPrices[crop];
  if (!markets || markets.length === 0) return null;
  return markets.reduce((best, m) => (m.price > best.price ? m : best));
}

/**
 * Returns average mandi price across all markets for a crop.
 */
function getAveragePrice(crop) {
  const markets = mandiPrices[crop];
  if (!markets || markets.length === 0) return 0;
  const total = markets.reduce((sum, m) => sum + m.price, 0);
  return Math.round(total / markets.length);
}

/**
 * Determines overall trend direction from historical data.
 * Returns: "Rising", "Falling", "Stable"
 */
function detectTrend(crop) {
  const history = historicalTrend[crop];
  if (!history || history.length < 2) return "Insufficient Data";
  const recent = history[history.length - 1].price;
  const older = history[0].price;
  const change = recent - older;
  if (change > 200) return "Rising";
  if (change < -200) return "Falling";
  return "Stable";
}

/**
 * Derives a price outlook statement from trend + forecast.
 * Returns an object: { direction, statement, confidence }
 */
function getPriceOutlook(crop) {
  const trend = detectTrend(crop);
  const forecast = priceForecast[crop];
  const currentBest = getBestPrice(crop);
  const forecastNext = forecast && forecast.length > 0 ? forecast[0].price : null;

  let direction = "Stable";
  let statement = "";
  let confidence = "Moderate";

  if (trend === "Rising" && forecastNext && forecastNext > currentBest.price) {
    direction = "Increasing";
    statement = `Prices have been rising over the past 6 months and the estimated outlook for the coming months is continued upward movement (~₹${forecastNext}/quintal). Storing may be worth considering if storage costs are manageable.`;
    confidence = "Moderate";
  } else if (trend === "Falling") {
    direction = "Decreasing";
    statement = `Prices have shown a downward trend. The estimated outlook suggests further softening. Selling sooner may reduce risk.`;
    confidence = "Low";
  } else {
    direction = "Stable";
    statement = `Prices have been broadly stable. No strong signal to defer selling. Immediate selling at the best available price is a reasonable option.`;
    confidence = "Moderate";
  }

  return { direction, statement, confidence };
}

/**
 * MAIN AGENT 1 FUNCTION
 * Input: { crop: "cotton"|"groundnut" }
 * Output: Full price intelligence report object
 */
export function runPriceAgent(crop) {
  const cropKey = crop.toLowerCase();

  if (!mandiPrices[cropKey]) {
    return {
      status: "error",
      message: `Price data not available for crop: ${crop}`,
    };
  }

  const markets = mandiPrices[cropKey];
  const bestMarket = getBestPrice(cropKey);
  const avgPrice = getAveragePrice(cropKey);
  const trend = detectTrend(cropKey);
  const outlook = getPriceOutlook(cropKey);
  const history = historicalTrend[cropKey];
  const forecast = priceForecast[cropKey];
  const mspValue = msp[cropKey];

  // Build combined chart data (history + forecast clearly labelled)
  const chartData = [
    ...history.map((h) => ({ ...h, type: "actual" })),
    ...forecast.map((f) => ({ ...f, type: "forecast" })),
  ];

  return {
    status: "success",
    agent: "Price Forecasting Agent",
    dataLabel: DEMO_LABEL,
    crop: cropKey,
    summary: {
      bestMarket: bestMarket.market,
      bestPrice: bestMarket.price,
      averagePrice: avgPrice,
      msp: mspValue,
      premiumOverMSP: bestMarket.price - mspValue,
      trend,
      outlook,
    },
    markets,
    chartData,
    forecast,
    disclaimer:
      "Price forecasts are estimates based on available trend data. Actual future prices may differ. Do not treat this as a guaranteed price.",
  };
}
