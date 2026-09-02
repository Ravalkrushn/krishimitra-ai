// ============================================================
//  App.jsx — KrishiMitra AI Desktop App Shell
//  Auth routing, react-icons, Toaster, CRUD, Logout
// ============================================================
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./styles/main.css";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CRUDProvider } from "./context/CRUDContext";

// Screens
import LoginPage     from "./components/LoginPage";
import HomeScreen    from "./components/screens/HomeScreen";
import MarketScreen  from "./components/screens/MarketScreen";
import BuyersScreen  from "./components/screens/BuyersScreen";
import QualityScreen from "./components/screens/QualityScreen";
import StorageScreen from "./components/screens/StorageScreen";
import DashboardScreen from "./components/screens/DashboardScreen";
import ChatScreen    from "./components/screens/ChatScreen";
import BuyersManagement from "./components/screens/BuyersManagement";
import FarmersManagement from "./components/screens/FarmersManagement";
import WatsonTest from "./components/WatsonTest";

// Hooks
import { useOrchestrator } from "./hooks/useOrchestrator";

// ── react-icons ──────────────────────────────────────────────
import {
  MdHome, MdBarChart, MdPeople, MdVerifiedUser,
  MdScale, MdAccountBalanceWallet, MdSmartToy,
  MdNotifications, MdHelp, MdSettings, MdLogout,
  MdManageAccounts, MdStorefront,
} from "react-icons/md";
import { FaShieldAlt, FaLeaf } from "react-icons/fa";
import { GiFarmer, GiWheat } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";

// ── Nav config (react-icons, no emoji) ──────────────────────
const NAV = [
  { id: "home",      icon: <MdHome />,                  label: "Home"              },
  { id: "market",   icon: <MdBarChart />,               label: "Market Intelligence"},
  { id: "buyers",   icon: <MdPeople />,                 label: "Find Buyers"        },
  { id: "quality",  icon: <MdVerifiedUser />,           label: "Quality Assistant"  },
  { id: "store",    icon: <MdScale />,                  label: "Sell or Store"      },
  { id: "dashboard",icon: <MdAccountBalanceWallet />,   label: "Income Dashboard"   },
  { id: "chat",     icon: <MdSmartToy />,               label: "AI Farmer Assistant"},
];

const NAV2 = [
  { id: "farmers",  icon: <MdManageAccounts />,         label: "Manage Farmers",   badge: null },
  { id: "manage-buyers", icon: <MdStorefront />,        label: "Manage Buyers",    badge: null },
  { id: "notif",    icon: <MdNotifications />,          label: "Notifications",    badge: 3    },
  { id: "help",     icon: <MdHelp />,                   label: "Help & Support"                },
  { id: "settings", icon: <MdSettings />,               label: "Settings"                      },
  { id: "watson-test", icon: <MdBarChart />,             label: "Watson API Test"               },
];

const DEFAULT_PROFILE = {
  name: "Rameshbhai Patel",
  crop: "cotton",
  quantity: "50",
  location: "Jamnagar, Gujarat",
  qualityTier: "medium",
  qualityNotes: "",
};

// ── Inner app (needs useAuth) ────────────────────────────────
function AppInner() {
  const { user, logout } = useAuth();
  const [tab, setTab]           = useState("home");
  const [profile, setProfile]   = useState(DEFAULT_PROFILE);
  const [apiStatus, setApiStatus] = useState("disconnected");
  const { isRunning, activeStep, completedSteps, results, error, run } = useOrchestrator();

  if (!user) return <LoginPage />;

  const launch = async (p) => {
    setProfile(p);
    await run({ mode:"full", crop:p.crop, quantity:p.quantity,
                location:p.location, name:p.name,
                qualityTier:p.qualityTier, qualityNotes:p.qualityNotes });
    setTab("dashboard");
  };

  const go = (id) => setTab(id);

  const renderScreen = () => {
    switch (tab) {
      case "home":           return <HomeScreen profile={profile} onProfileChange={setProfile} onLaunch={launch} results={results} onNav={go} />;
      case "market":         return <MarketScreen results={results} crop={profile.crop} />;
      case "buyers":         return <BuyersScreen results={results} profile={profile} />;
      case "quality":        return <QualityScreen results={results} profile={profile} />;
      case "store":          return <StorageScreen results={results} />;
      case "dashboard":      return <DashboardScreen results={results} profile={profile} farmerProfile={profile} isRunning={isRunning} completedSteps={completedSteps} activeStep={activeStep} onLaunch={launch} />;
      case "chat":           return <ChatScreen profile={profile} farmerProfile={profile} onApiStatusChange={setApiStatus} />;
      case "manage-buyers":  return (
        <div className="screen">
          <div className="page-title-row" style={{ marginBottom:24 }}>
            <div>
              <h2 style={{ display:"flex", alignItems:"center", gap:10 }}><MdStorefront style={{ color:"#1a5c2a" }} /> Manage Buyers</h2>
              <p className="page-sub">Add, edit, or remove buyer records for cotton and groundnut.</p>
            </div>
            <span className="demo-badge"><HiSparkles /> DEMO DATA</span>
          </div>
          <div className="card card-pad-lg"><BuyersManagement crop={profile.crop} /></div>
        </div>
      );
      case "farmers": return (
        <div className="screen">
          <div className="page-title-row" style={{ marginBottom:24 }}>
            <div>
              <h2 style={{ display:"flex", alignItems:"center", gap:10 }}><GiFarmer style={{ color:"#1a5c2a" }} /> Manage Farmer Profiles</h2>
              <p className="page-sub">View, add, edit, or remove farmer profiles.</p>
            </div>
            <span className="demo-badge"><HiSparkles /> DEMO DATA</span>
          </div>
          <div className="card card-pad-lg">
            <FarmersManagement onSelectProfile={(f) => {
              setProfile({ ...DEFAULT_PROFILE, ...f });
              setTab("home");
            }} />
          </div>
        </div>
      );
      case "watson-test": return <WatsonTest />;
      default: return null;
    }
  };

  return (
    <div className="app-shell">
      {/* ── TOP BAR ─── */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <div className="topbar-logo-icon">
              <GiWheat style={{ fontSize:20, color:"white" }} />
            </div>
            <div className="topbar-brand">
              <h1>KrishiMitra AI</h1>
              <p>From Farm to Best Market Decision</p>
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <button className="topbar-notif" onClick={() => go("notif")}>
            <MdNotifications style={{ fontSize:22 }} />
            <span className="notif-badge">3</span>
          </button>
          <div className="topbar-safe-badge">
            <FaShieldAlt style={{ fontSize:15, color:"#1a5c2a" }} />
            <div>
              <div style={{fontSize:10,opacity:.7}}>Your Data</div>
              <div style={{fontWeight:800,fontSize:13}}>Safe</div>
            </div>
          </div>
          <span className="demo-badge">
            <HiSparkles /> DEMO DATA
          </span>
        </div>
      </header>

      {/* ── BODY ─── */}
      <div className="app-body">
        {/* ── SIDEBAR ─── */}
        <aside className="sidebar">
          {/* Farmer card */}
          <div className="sidebar-farmer">
            <div className="farmer-row">
              <div className="farmer-avatar">
                <GiFarmer style={{ fontSize:24, color:"white" }} />
              </div>
              <div className="farmer-info">
                <h3>
                  {profile.name}
                  <span className="verified-icon" style={{ fontSize:14 }}>
                    <MdVerifiedUser style={{ color:"#2196f3" }} />
                  </span>
                </h3>
                <div className="farmer-loc">
                  <MdHome style={{ fontSize:12, color:"#9ca3af" }} /> {profile.location}
                </div>
                <div className="verified-badge">
                  <FaShieldAlt style={{ fontSize:9 }} /> Verified Farmer
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            {NAV.map(n => (
              <button key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={() => go(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            ))}
            <div className="nav-divider" />
            {NAV2.map(n => (
              <button key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={() => go(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </button>
            ))}
            <div className="nav-divider" />
            {/* Logout */}
            <button
              className="nav-item"
              style={{color:"#ef4444"}}
              onClick={() => {
                logout();
              }}
            >
              <span className="nav-icon"><MdLogout /></span>
              Logout
            </button>
          </nav>

          {/* Promo card */}
          <div className="sidebar-promo">
            <h4>Empowering Farmers with<br/>AI &amp; Real-time Market Data</h4>
            <p>Make the best decisions. Maximize your earnings.</p>
          </div>

          {/* API status */}
          <div style={{padding:"0 16px 16px"}}>
            <div style={{
              display:"flex",alignItems:"center",gap:8,padding:"8px 12px",
              borderRadius:8,fontSize:11,
              background: apiStatus==="connected" ? "#e8f5e9":"#fff3e0",
              border: `1px solid ${apiStatus==="connected"?"#a5d6a7":"#ffcc80"}`,
              color: apiStatus==="connected" ? "#1a5c2a":"#e65100",
            }}>
              <FaLeaf style={{ fontSize:14, color: apiStatus==="connected" ? "#1a5c2a" : "#e65100" }} />
              <div>
                <div style={{fontWeight:700}}>Watson Orchestrate</div>
                <div>{apiStatus==="connected"?"API Connected":"Local Fallback Active"}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ─── */}
        <main className="app-main">
          {isRunning && (
            <div className="status-bar running">
              <div className="loading-spinner" style={{width:14,height:14,borderWidth:2}}/>
              {activeStep?.label || "Running agentic analysis…"}
            </div>
          )}
          {error && <div className="status-bar error"><FaShieldAlt /> {error}</div>}
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

// ── Root export — wraps everything in providers ──────────────
export default function App() {
  return (
    <AuthProvider>
      <CRUDProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            },
            success: {
              iconTheme: { primary: "#1a5c2a", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#dc2626", secondary: "white" },
            },
          }}
        />
        <AppInner />
      </CRUDProvider>
    </AuthProvider>
  );
}
