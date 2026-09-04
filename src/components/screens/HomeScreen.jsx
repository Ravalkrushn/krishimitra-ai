// HomeScreen — matches reference UI exactly
import React, { useState } from "react";
import { mandiPrices, msp } from "../../data/demoData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { historicalTrend } from "../../data/demoData";
import { GiFarmer, GiWheat, GiPeanut } from "react-icons/gi";
import { MdVerifiedUser, MdLocationOn, MdPeople, MdScale, MdLabel } from "react-icons/md";
import { FaShieldAlt, FaStar, FaRobot } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import { FiSun, FiDollarSign, FiCalendar, FiInfo, FiAlertTriangle, FiStar as FiStarIcon, FiMapPin, FiZap, FiUsers, FiAward, FiCheckCircle, FiTrendingUp, FiShield } from "react-icons/fi";
import { MdRocketLaunch } from "react-icons/md";

const PRICE_SPARK = historicalTrend.cotton.map((d, i) => ({ ...d, x: i }));

export default function HomeScreen({ profile, onProfileChange, onLaunch, results, onNav }) {
  const [local, setLocal] = useState(profile);

  const upd = (k, v) => {
    const p = { ...local, [k]: v };
    setLocal(p);
    onProfileChange(p);
  };

  const cottonBest = mandiPrices.cotton.reduce((b, m) => m.price > b.price ? m : b);
  const gnBest     = mandiPrices.groundnut.reduce((b, m) => m.price > b.price ? m : b);
  const cropBest   = local.crop === "cotton" ? cottonBest : gnBest;

  return (
    <div className="screen">
      {/* DEMO badge row */}
      <div className="mb-16">
        <span className="demo-badge"><HiSparkles /> DEMO DATA</span>
      </div>

      {/* Farmer hero card */}
      <div className="farmer-hero-card">
        <div className="farmer-hero-left">
          <div className="farmer-hero-avatar" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <GiFarmer style={{ fontSize:28, color:"white" }} />
          </div>
          <div>
            <div className="farmer-hero-name">
              {local.name} <MdVerifiedUser style={{color:"#2196f3",fontSize:16}} />
            </div>
            <div className="farmer-hero-loc"><MdLocationOn style={{fontSize:14,color:"#ef4444"}} /> {local.location}</div>
            <div style={{marginTop:8}}>
              <span className="chip chip-green"><FaShieldAlt style={{fontSize:9}} /> Verified Farmer</span>
            </div>
          </div>
        </div>
        <div className="weather-widget">
          <span className="w-icon"><FiSun style={{fontSize:22,color:"#f59e0b"}} /></span>
          <div>
            <div className="w-temp">32°C</div>
            <div className="w-desc">Sunny</div>
          </div>
        </div>
      </div>

      {/* Crop info bar */}
      <div className="crop-info-bar">
        <div className="crop-info-item">
          <div className="cii-icon">{local.crop === "cotton" ? <GiWheat style={{fontSize:20,color:"#1a5c2a"}} /> : <GiPeanut style={{fontSize:20,color:"#d97706"}} />}</div>
          <div>
            <div className="cii-label">Selected Crop</div>
            <div className="cii-value">{local.crop === "cotton" ? "Cotton" : "Groundnut"}</div>
          </div>
        </div>
        <div className="crop-info-item">
          <div className="cii-icon"><FiDollarSign style={{fontSize:20,color:"#1a5c2a"}} /></div>
          <div>
            <div className="cii-label">Quantity</div>
            <div className="cii-value">{local.quantity} Quintals</div>
          </div>
        </div>
        <div className="crop-info-item">
          <div className="cii-icon"><FiCalendar style={{fontSize:20,color:"#1a5c2a"}} /></div>
          <div>
            <div className="cii-label">Season</div>
            <div className="cii-value">Kharif 2024</div>
          </div>
        </div>
      </div>

      {/* Market Price + Trend Chart */}
      <div className="market-price-section mb-16">
        <div className="current-price-card">
          <div className="card-label mb-8">Current Market Price <FiInfo style={{fontSize:13,verticalAlign:"middle"}} /></div>
          <div className="price-hero mb-4">
            ₹{cropBest.price}<span>/Quintal</span>
          </div>
          <div style={{fontSize:13,color:"var(--text-3)",marginBottom:10}}>{cropBest.market}</div>
          <div className="row-8">
            <span className="price-delta up">↑ ₹{cropBest.delta || 120} ({((cropBest.delta||120)/cropBest.price*100).toFixed(2)}%)</span>
            <span style={{fontSize:12,color:"var(--text-3)"}}>vs yesterday</span>
          </div>
          <div style={{marginTop:12,padding:"10px 12px",background:"var(--g-50)",borderRadius:8}}>
            <div style={{fontSize:11,color:"var(--text-3)"}}>MSP Reference</div>
            <div style={{fontSize:15,fontWeight:700,color:"var(--g-800)"}}>₹{msp[local.crop]}/qtl</div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-label mb-12">Price Trend (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={PRICE_SPARK} margin={{top:4,right:4,bottom:0,left:0}}>
              <defs>
                <linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={["auto","auto"]} tick={{fontSize:11}} width={52} tickFormatter={v=>`₹${v}`} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v)=>[`₹${v}`,"Price"]}/>
              <Area type="monotone" dataKey="price" stroke="#2e7d32" strokeWidth={2.5} fill="url(#gGrad)" dot={{fill:"#2e7d32",r:4,strokeWidth:2,stroke:"white"}}/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{fontSize:11,color:"var(--text-3)",marginTop:4}}>
            <FiAlertTriangle style={{fontSize:13,verticalAlign:"middle",marginRight:4}} /> Forecast values are estimates only — not guaranteed future prices.
          </div>
        </div>
      </div>

      {/* Best Available Selling Option */}
      <div className="best-option-card mb-16">
        <div>
          <div className="best-option-label"><FiStarIcon style={{fontSize:14,verticalAlign:"middle",marginRight:4}} /> Best Available Selling Option</div>
          <div className="best-option-name">Shree Rang Agro Industries</div>
          <div className="best-option-sub">
            <FiMapPin style={{fontSize:13,verticalAlign:"middle",marginRight:3}} /> Gondal, Gujarat &nbsp;•&nbsp; 52 km from you
          </div>
          <div className="row-8" style={{gap:8}}>
            <span className="chip chip-amber"><FiStarIcon style={{fontSize:11,verticalAlign:"middle",marginRight:3}} /> Top Rated Buyer</span>
            <span className="chip chip-blue"><FiZap style={{fontSize:11,verticalAlign:"middle",marginRight:3}} /> Fast Payment</span>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:12,color:"var(--text-3)",marginBottom:4}}>Offered Price</div>
          <div className="best-option-price">₹{cropBest.price + 30}<span style={{fontSize:15,fontWeight:500,color:"var(--text-3)"}}>/Quintal</span></div>
          <button className="btn-ai-recommend" style={{marginTop:10}}>
            <FaRobot style={{fontSize:13,verticalAlign:"middle",marginRight:4}} /> Recommended by AI
          </button>
        </div>
      </div>

      {/* 3 KPI tiles */}
      <div className="g3 mb-16">
        <div className="stat-tile">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:24,background:"#e3f2fd",borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}><FiUsers style={{color:"#1565c0"}} /></div>
            <div>
              <div className="st-val green">18</div>
              <div className="st-lbl">Buyer Matches</div>
              <div className="st-sub">Active Buyers</div>
            </div>
          </div>
        </div>
        <div className="stat-tile">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:24,background:"var(--g-50)",borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}><FiDollarSign style={{color:"#1a5c2a"}} /></div>
            <div>
              <div className="st-val green">₹{(parseInt(local.quantity||50)*(cropBest.price+30)).toLocaleString("en-IN")}</div>
              <div className="st-lbl">Estimated Gross Value</div>
              <div className="st-sub">At best price</div>
            </div>
          </div>
        </div>
        <div className="stat-tile">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:24,background:"var(--amber-100)",borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}><FiAward style={{color:"#d97706"}} /></div>
            <div>
              <div className="st-val amber">₹{cropBest.price + 200}</div>
              <div className="st-lbl">Best Price Potential</div>
              <div className="st-sub">Highest in 7 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sell Now vs Store & Sell Later */}
      <div className="sell-store-grid mb-16">
        <div className="sell-store-card">
          <div className="ss-title"><GiWheat style={{fontSize:16,verticalAlign:"middle",marginRight:4}} /> Sell Now</div>
          <div className="ss-row"><span className="ss-lbl">Price</span><span className="ss-val">₹{cropBest.price+30} /Quintal</span></div>
          <div className="ss-row"><span className="ss-lbl">Total Value</span><span className="ss-val">₹{(parseInt(local.quantity||50)*(cropBest.price+30)).toLocaleString("en-IN")}</span></div>
          <div className="ss-row"><span className="ss-lbl">Payment</span><span className="ss-val">Within 24–48 hrs</span></div>
          <div className="ss-conclusion"><FiCheckCircle style={{fontSize:14,verticalAlign:"middle",marginRight:4}} /> Best for immediate cash flow</div>
        </div>
        <div className="sell-store-vs">VS</div>
        <div className="sell-store-card store-card">
          <div className="ss-title"><MdScale style={{fontSize:16,verticalAlign:"middle",marginRight:4}} /> Store & Sell Later</div>
          <div className="ss-row"><span className="ss-lbl">Expected Price</span><span className="ss-val">₹{cropBest.price+300} – ₹{cropBest.price+450}</span></div>
          <div className="ss-row"><span className="ss-lbl">Est. Value</span><span className="ss-val">₹{(parseInt(local.quantity||50)*(cropBest.price+300)).toLocaleString("en-IN")} – ₹{(parseInt(local.quantity||50)*(cropBest.price+450)).toLocaleString("en-IN")}</span></div>
          <div className="ss-row"><span className="ss-lbl">Storage Cost</span><span className="ss-val">₹120 /Quintal /Month</span></div>
          <div className="ss-conclusion amber-bg"><FiAlertTriangle style={{fontSize:14,verticalAlign:"middle",marginRight:4}} /> Better returns with storage</div>
        </div>
      </div>

      {/* Quality + AI Insight */}
      <div className="quality-insight-grid mb-16">
        <div className="quality-card">
          <div className="row-between mb-12">
            <div style={{fontWeight:700,fontSize:15}}>Crop Quality Status</div>
            <span className="chip chip-green">Good Quality</span>
          </div>
          <div className="quality-content">
            <div className="quality-img">{local.crop==="cotton"?<GiWheat style={{fontSize:28,color:"#1a5c2a"}} />:<GiPeanut style={{fontSize:28,color:"#d97706"}} />}</div>
            <div>
              <div className="qc-row"><span className="qc-lbl">Moisture</span><span className="qc-val">8.2%</span></div>
              <div className="qc-row"><span className="qc-lbl">Grade</span><span className="qc-val">SG-2</span></div>
              <div className="qc-row"><span className="qc-lbl">Color</span><span className="qc-val">Good</span></div>
              <div className="qc-row"><span className="qc-lbl">Fiber Strength</span><span className="qc-val">Strong</span></div>
            </div>
          </div>
        </div>
        <div className="ai-insight-card">
          <div className="row-between mb-8">
            <div style={{fontWeight:700,fontSize:15}}>Recent AI Recommendation</div>
            <span className="chip chip-green" style={{fontSize:10,padding:"3px 8px"}}>New</span>
          </div>
          <div className="ai-insight-body">
            <span className="ai-insight-icon"><HiSparkles style={{fontSize:20,color:"#f59e0b"}} /></span>
            <div className="ai-insight-text">
              Market trend is positive. Prices may increase by <strong>₹150–₹200</strong> in next 5 days. Consider selling in parts for better returns.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div style={{fontWeight:800,fontSize:18,marginBottom:12}}>Quick Actions</div>
        <div className="quick-actions-grid">
          <button className="qa-btn" onClick={()=>onNav("market")}>
            <div className="qa-icon green"><FiTrendingUp /></div>
            <div className="qa-label">Check Market</div>
          </button>
          <button className="qa-btn" onClick={()=>onNav("buyers")}>
            <div className="qa-icon blue"><FiUsers /></div>
            <div className="qa-label">Find Buyers</div>
          </button>
          <button className="qa-btn" onClick={()=>onNav("quality")}>
            <div className="qa-icon purple"><FiShield /></div>
            <div className="qa-label">Quality Check</div>
          </button>
          <button className="qa-btn" onClick={()=>onNav("store")}>
            <div className="qa-icon orange"><MdScale /></div>
            <div className="qa-label">Sell or Store</div>
          </button>
        </div>
      </div>

      {/* Safety banner */}
      <div className="safety-banner">
        <div className="sb-left">
          <span className="sb-icon"><FiShield style={{fontSize:20,color:"#1a5c2a"}} /></span>
          <div>
            <div className="sb-title">Stay Safe & Stay Informed</div>
            <div className="sb-sub">Avoid middlemen fraud. Verify buyers & prices on KrishiMitra AI.</div>
          </div>
        </div>
        <span style={{color:"var(--text-3)",fontSize:18}}>›</span>
      </div>

      {/* Run Analysis CTA */}
      <div style={{marginTop:20}}>
        <button
          className="btn-primary full"
          onClick={()=>onLaunch(local)}
          disabled={!local.crop || !local.quantity}
          style={{fontSize:16,padding:"16px"}}
        >
          <MdRocketLaunch style={{fontSize:18,verticalAlign:"middle",marginRight:6}} /> Run Full AI Market Analysis
        </button>
      </div>

      <div className="disclaimer" style={{marginTop:16}}>
        <MdLabel style={{fontSize:15,verticalAlign:"middle",marginRight:4}} /> <strong>DEMO DATA</strong> — All prices, buyers and market data shown are sample/demo data for demonstration purposes only.
      </div>
    </div>
  );
}
