// ============================================================
//  useOrchestrator Hook — manages full agentic workflow state
// ============================================================

import { useState, useCallback } from "react";
import { runOrchestrator } from "../orchestrator/orchestrator";

export function useOrchestrator() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const STEP_LABELS = {
    price_start: "Analysing market prices...",
    price_done: "Market prices analysed ✓",
    buyers_start: "Finding buyer matches...",
    buyers_done: "Buyer matches found ✓",
    quality_start: "Evaluating crop quality...",
    quality_done: "Quality evaluated ✓",
    storage_start: "Comparing sell vs store...",
    storage_done: "Sell/Store analysis done ✓",
    dashboard_start: "Calculating income & recommendation...",
    dashboard_done: "Final recommendation ready ✓",
  };

  const run = useCallback(async (farmerRequest) => {
    setIsRunning(true);
    setActiveStep(null);
    setCompletedSteps([]);
    setResults(null);
    setError(null);

    try {
      const output = await runOrchestrator(farmerRequest, (step, data) => {
        setActiveStep({ step, label: STEP_LABELS[step] || step });
        if (step.endsWith("_done")) {
          setCompletedSteps((prev) => [...prev, step]);
        }
      });
      setResults(output);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsRunning(false);
      setActiveStep(null);
    }
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setActiveStep(null);
    setCompletedSteps([]);
    setResults(null);
    setError(null);
  }, []);

  return { isRunning, activeStep, completedSteps, results, error, run, reset };
}
