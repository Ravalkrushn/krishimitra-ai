import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { GiFarmer, GiWheat, GiCottonFlower } from "react-icons/gi";
import { FaLeaf, FaShieldAlt, FaStar } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { copy } = useLanguage();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(form.username, form.password);
    if (!ok) setError("Invalid username or password. Please try again.");
    setLoading(false);
  };

  const fillDemo = (user) => {
    const creds = {
      farmer: { username: "farmer", password: "krishimitra123" },
      admin: { username: "admin", password: "admin123" },
    };
    setForm(creds[user]);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d3b1f 0%, #1a5c2a 40%, #2e7d32 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "5%",
          opacity: 0.06,
          fontSize: 120,
        }}
      >
        <GiWheat />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          opacity: 0.06,
          fontSize: 100,
        }}
      >
        <GiCottonFlower />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header / Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 32,
              color: "white",
            }}
          >
            <img
              src="/krishimitra-logo.svg"
              alt="KrishiMitra logo"
              style={{ width: 56, height: 56 }}
            />
          </div>
          <h1
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            KrishiMitra AI
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              marginTop: 6,
            }}
          >
            {copy.brandTagline}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#111827",
              margin: "0 0 4px",
            }}
          >
            {copy.signIn}
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>
            {copy.accessDashboard}
          </p>

          <form onSubmit={submit}>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                {copy.username}
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: 18,
                    display: "flex",
                  }}
                >
                  <MdEmail />
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handle}
                  placeholder={copy.enterUsername}
                  autoComplete="username"
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    border: error
                      ? "1.5px solid #ef4444"
                      : "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#f9fafb",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                {copy.password}
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: 18,
                    display: "flex",
                  }}
                >
                  <MdLock />
                </span>
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handle}
                  placeholder={copy.enterPassword}
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 42px",
                    border: error
                      ? "1.5px solid #ef4444"
                      : "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#f9fafb",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    fontSize: 18,
                    display: "flex",
                    padding: 0,
                  }}
                >
                  {showPw ? <MdVisibility /> : <MdVisibilityOff />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#dc2626",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FaShieldAlt style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #1a5c2a, #2e7d32)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.75s linear infinite",
                    }}
                  />
                  Signing In…
                </>
              ) : (
                <>
                  <FaLeaf />
                  Sign In to KrishiMitra AI
                </>
              )}
            </button>
          </form>

          {/* Quick demo fill */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Quick Demo Login
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => fillDemo("farmer")}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: "#f0faf0",
                  border: "1.5px solid #a5d6a7",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1a5c2a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <GiFarmer /> Farmer Demo
              </button>
              <button
                onClick={() => fillDemo("admin")}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: "#eff6ff",
                  border: "1.5px solid #bfdbfe",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1d4ed8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <FaStar /> Admin Demo
              </button>
            </div>
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 8,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#92400e",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                <strong>Demo:</strong> farmer / krishimitra123 &nbsp;|&nbsp;
                admin / admin123
              </p>
            </div>
          </div>
        </div>

        {/* Features row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginTop: 16,
          }}
        >
          {[
            { icon: <BiTrendingUp />, text: "Real-time Mandi Prices" },
            { icon: <GiFarmer />, text: "Direct Buyer Matching" },
            { icon: <HiSparkles />, text: "AI-Powered Decisions" },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 8px",
                textAlign: "center",
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{f.icon}</div>
              {f.text}
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
            fontSize: 11,
            marginTop: 16,
          }}
        >
          IBM Hackathon 2026 
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
