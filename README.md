# KrishiMitra AI 🌾

### _"From Farm to Best Market Decision."_

> **Agentic AI Market Decision Copilot for Cotton & Groundnut Farmers in Gujarat**

[![IBM Bob](https://img.shields.io/badge/IBM-Bob-0f62fe?style=flat-square&logo=ibm)](https://www.ibm.com)
[![IBM Granite](https://img.shields.io/badge/IBM-Granite%20LLM-0f62fe?style=flat-square&logo=ibm)](https://www.ibm.com/granite)
[![IBM Cloud](https://img.shields.io/badge/IBM-Cloud-0f62fe?style=flat-square&logo=ibm)](https://cloud.ibm.com)
[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Challenge](https://img.shields.io/badge/Challenge%2013-IBM%20Hackathon%202024-green?style=flat-square)](https://github.com/Ravalkrushn/krishimitra-ai)

---

## 🏆 Challenge 13 — AI-Powered Cotton & Groundnut Market Linkage Platform

**Domain:** Economic Development

**Problem:** Gujarat is a leading producer of cotton and groundnut, yet farmers frequently face price exploitation by middlemen, lack access to real-time mandi prices, and have limited bargaining power in direct market linkages.

**Solution:** KrishiMitra AI — An Agentic AI solution that provides real-time price intelligence, connects farmers directly with buyers, and supports informed selling and storage decisions.

**Technology Stack:**

- 🤖 **IBM Bob** — Agentic AI application builder & workflow coordinator
- 💎 **IBM Granite LLM** — Natural language understanding & farmer-facing AI
- ☁️ **IBM Cloud / Watson Orchestrate** — Backend API & deployment

---

## 🌟 Product Vision

KrishiMitra AI is **NOT** a simple chatbot or basic mandi-price app.

It is an **intelligent decision-support platform** that helps a Gujarat farmer answer:

1. What is the current market price?
2. What is the price trend/forecast?
3. Which buyers are suitable for my crop?
4. What selling options are available?
5. Should I sell now or store?
6. What is the quality of my crop?
7. What could my expected revenue be?
8. Why is the AI recommending a particular option?

### Core Philosophy

```
PRICE → MATCH → EVALUATE → DECIDE → EARN
```

---

## 🤖 Five Specialized AI Agents

| Agent                                    | Purpose                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| **Agent 1 — Mandi Price Forecasting**    | Current mandi prices, market comparison, trend analysis, price outlook |
| **Agent 2 — Buyer-Farmer Matching**      | Match farmers with suitable buyers, ranked by suitability score        |
| **Agent 3 — Storage & Selling Advisor**  | Sell Now vs Store comparison with reasoning                            |
| **Agent 4 — Quality Grading Assistance** | AI-assisted crop quality estimate and buyer impact                     |
| **Agent 5 — Income Dashboard**           | Combined revenue estimate + final AI recommendation                    |

---

## 🔄 Agentic Workflow

```
FARMER REQUEST
      ↓
AI ORCHESTRATOR (orchestrator.js)
      ↓
[Agent 1] Mandi Price Forecasting
      ↓
[Agent 2] Buyer Matching
      ↓
[Agent 3] Storage & Selling Advisor
      ↓
[Agent 4] Quality Grading
      ↓
[Agent 5] Income Dashboard
      ↓
FINAL FARMER DECISION SUPPORT
```

The orchestrator coordinates all agents and supports multiple modes:

- `full` — Complete selling decision (all 5 agents)
- `price` — Price intelligence only
- `buyers` — Price + Buyer matching
- `quality` — Quality assessment only
- `storage` — Price + Storage analysis

---

## 📁 Project Structure

```
krishimitra-ai/
├── src/
│   ├── agents/
│   │   ├── priceAgent.js          # Agent 1 — Mandi Price Forecasting
│   │   ├── buyerAgent.js          # Agent 2 — Buyer Matching
│   │   ├── storageAgent.js        # Agent 3 — Storage Advisor
│   │   ├── qualityAgent.js        # Agent 4 — Quality Grading
│   │   └── incomeDashboardAgent.js # Agent 5 — Income Dashboard
│   ├── orchestrator/
│   │   └── orchestrator.js        # Main AI orchestrator
│   ├── components/
│   │   ├── LoginPage.jsx           # Login / Auth
│   │   ├── WatsonTest.jsx          # IBM Watson API diagnostics
│   │   └── screens/
│   │       ├── HomeScreen.jsx      # Farmer profile & launch
│   │       ├── MarketScreen.jsx    # Market Intelligence
│   │       ├── BuyersScreen.jsx    # Find Buyers
│   │       ├── QualityScreen.jsx   # Quality Assistant
│   │       ├── StorageScreen.jsx   # Sell or Store
│   │       ├── DashboardScreen.jsx # Income Dashboard
│   │       ├── ChatScreen.jsx      # AI Farmer Assistant
│   │       ├── BuyersManagement.jsx # CRUD — Buyers
│   │       └── FarmersManagement.jsx # CRUD — Farmers
│   ├── context/
│   │   ├── AuthContext.jsx         # Login / Logout state
│   │   └── CRUDContext.jsx         # Buyers & Farmers CRUD
│   ├── data/
│   │   └── demoData.js             # Demo mandi prices, buyers, quality data
│   ├── hooks/
│   │   └── useOrchestrator.js      # React hook for orchestrator state
│   ├── services/
│   │   └── watsonOrchestrate.js    # IBM Watson Orchestrate API service
│   ├── styles/
│   │   └── main.css                # Complete design system
│   └── App.jsx                     # App shell with auth routing
├── bob/
│   └── system-prompt.md            # IBM Bob system prompt
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Ravalkrushn/krishimitra-ai.git
cd krishimitra-ai

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🔐 Login Credentials (Demo)

| Role   | Username | Password         |
| ------ | -------- | ---------------- |
| Farmer | `farmer` | `krishimitra123` |
| Admin  | `admin`  | `admin123`       |

---

## 🖥️ Application Screens

| Screen                     | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| **🏠 Home**                | Farmer profile setup, crop selection, launch analysis   |
| **📊 Market Intelligence** | Live mandi prices, trend charts, AI market insight      |
| **👥 Find Buyers**         | Buyer cards with match score, price offer, distance     |
| **🛡️ Quality Assistant**   | Crop quality parameters, AI grade estimation            |
| **⚖️ Sell or Store**       | Side-by-side comparison with AI recommendation          |
| **💰 Income Dashboard**    | Revenue comparison chart, final AI recommendation       |
| **🤖 AI Assistant**        | Conversational AI powered by IBM Watson Orchestrate     |
| **🏢 Manage Buyers**       | Full CRUD — Add/Edit/Delete buyers (Cotton & Groundnut) |
| **👤 Manage Farmers**      | Full CRUD — Add/Edit/Delete farmer profiles             |
| **🌐 Watson API Test**     | Live IBM Watson Orchestrate API diagnostics             |

---

## 🌐 IBM Watson Orchestrate Integration

KrishiMitra AI integrates with **IBM Watson Orchestrate** and **IBM Granite LLM** for the AI chat assistant:

- **Endpoint:** `https://api.au-syd.watson-orchestrate.cloud.ibm.com`
- **Model:** `ibm/granite-13b-chat-v2`
- **Auth:** IBM IAM Token (cached 50 min)
- **Fallback:** If Watson API is unavailable, the app automatically falls back to local agent logic — the app **always works**

---

## 🛡️ AI Safety Rules

| Rule                             | Status                                         |
| -------------------------------- | ---------------------------------------------- |
| Never guarantee future prices    | ✅ Disclaimers on all agents                   |
| Never guarantee profit           | ✅ All figures labeled as estimates            |
| Never invent buyers              | ✅ Uses only labeled demo data                 |
| Distinguish actual vs forecast   | ✅ Chart data typed as `actual` / `forecast`   |
| Quality estimate ≠ certification | ✅ Explicit disclaimer on Quality Agent        |
| Farmer makes final decision      | ✅ "Decision support, not financial guarantee" |
| Demo data clearly labeled        | ✅ DEMO DATA badge on every screen             |

---

## 🌍 Production Upgrade Blueprint

The current React app is a working decision-support prototype. For real farmer use, keep React as the farmer-facing client and add a Python service layer. Do not present demo values as live prices until the source, timestamp, and freshness have been verified.

### Recommended backend stack

- **FastAPI**: typed REST APIs and WebSocket endpoints for the React client
- **PostgreSQL**: farmers, farms, crops, mandi observations, buyers, offers, alerts, and audit logs
- **Pandas**: cleaning, aggregation, missing-value checks, and market comparisons
- **Scikit-learn/XGBoost**: price forecasting with confidence intervals, never guaranteed prices
- **Celery + Redis**: scheduled mandi/weather ingestion and asynchronous image/audio jobs
- **Whisper**: Hindi, Gujarati, and English farmer voice transcription
- **IndicTTS, Google Cloud TTS, or Azure Speech**: localized voice responses
- **OpenWeather API**: weather and harvest/storage risk signals
- **AGMARKNET or another verified mandi source**: live price observations with source and timestamp

### Production agents

1. **Mandi Price Agent**: validates current observations, compares MSP and mandis, and exposes source timestamps.
2. **Price Forecast Agent**: forecasts a range from historical prices, arrivals, seasonality, and weather; returns confidence and uncertainty.
3. **Buyer Matching Agent**: ranks verified buyers by crop, grade, quantity, price, distance, payment history, and capacity.
4. **Quality Agent**: combines photo analysis and farmer inputs; clearly labels estimates as non-certified.
5. **Sell-or-Store Agent**: compares net revenue after storage, transport, spoilage, and price uncertainty.
6. **Income Agent**: combines the other agents and explains every recommendation in farmer-friendly language.
7. **Weather Risk Agent**: sends rain, heat, humidity, and harvest-window alerts.
8. **Voice Assistant Agent**: transcribes speech, identifies intent, calls the correct agent, and replies in the selected language.
9. **Scheme and Advisory Agent**: retrieves verified government scheme information with eligibility date and source.
10. **Trust and Logistics Agent**: checks buyer risk, transport cost, route distance, and net realized price.

### Delivery steps

1. Create a `backend/` FastAPI service with `/api/v1/prices`, `/buyers/matches`, `/quality/analyze`, `/storage/compare`, `/income/summary`, and `/voice/query` endpoints.
2. Add PostgreSQL migrations and store every market observation with `source`, `observed_at`, `location`, and `is_forecast` fields.
3. Move the existing JavaScript agents behind Python service interfaces, keeping the current local fallback during migration.
4. Add Celery jobs for mandi/weather ingestion and data-quality checks; reject stale or incomplete observations.
5. Add Whisper plus TTS with a language code on every request and response. Keep text response available when a device has no microphone or voice.
6. Add authentication, farmer consent, encrypted secrets, rate limits, audit logs, and explicit demo/live badges.
7. Evaluate forecasts and matching using held-out historical data before enabling recommendations for real transactions.

### Multilingual product rule

The language selector must control all user-facing copy, agent prompts, error messages, notifications, and voice output. Store language as `en`, `hi`, or `gu`; send it to every backend agent; and keep numbers, rupee values, dates, and source names locale-aware. The current frontend already provides centralized English, Hindi, Gujarati copy and browser voice guidance; the next production step is passing the selected language into Watson/Python requests.

---

## 📦 Tech Stack

| Technology             | Version     | Purpose                      |
| ---------------------- | ----------- | ---------------------------- |
| React                  | 18.2        | UI framework                 |
| Vite                   | 5.0         | Build tool & dev server      |
| Recharts               | 2.8         | Price trend & revenue charts |
| react-icons            | 5.7         | UI icons (no emoji icons)    |
| react-hot-toast        | 2.6         | Toast notifications          |
| react-toastify         | latest      | Extended toast support       |
| IBM Watson Orchestrate | —           | AI chat backend              |
| IBM Granite LLM        | 13b-chat-v2 | Language model               |

---

## 🏅 Winning Differentiator

❌ Not positioned as: _"An AI chatbot for farmers."_

❌ Not positioned as: _"A mandi price app."_

✅ Positioned as: **"An Agentic AI Market Decision Copilot for Cotton & Groundnut Farmers."**

| Traditional    | KrishiMitra AI                                                               |
| -------------- | ---------------------------------------------------------------------------- |
| Price → Farmer | Price + Buyer + Quality + Storage + Income → Better-Informed Farmer Decision |

---

## 🎯 Demo Scenario

A Gujarat farmer has **50 quintals of Cotton** and asks:

> _"I want to sell my cotton. What is my best available option?"_

KrishiMitra AI automatically:

1. **Price Agent** → Shows ₹6,850/qtl best at Rajkot APMC, Rising trend
2. **Buyer Agent** → Finds Shree Ram Cotton Industries, ₹6,880/qtl, 38 km, High Match
3. **Quality Agent** → Estimates Grade B, gives improvement tips
4. **Storage Agent** → Sell Now vs 2-month storage comparison
5. **Income Agent** → Estimates ₹3,44,000 gross revenue, recommends best option

---

## 📄 License

This project was built for the **IBM Hackathon 2024 — Challenge 13**.

> _"We don't just tell farmers today's price. We help them understand their available market options and make a better-informed selling decision."_

---

<div align="center">
  <strong>Built with ❤️ for Gujarat's Farmers</strong><br/>
  <sub>Powered by IBM Bob · IBM Granite LLM · IBM Cloud · Watson Orchestrate</sub>
</div>
