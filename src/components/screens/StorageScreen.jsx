// StorageScreen — reference style
import React from "react";

const Rs = "\u20B9";

export default function StorageScreen({ results }) {
  const s = results?.results?.storage;

  if (!s) return (
    <div className="screen">
      <div className="page-title-row">
        <div><h2>Sell or Store</h2><p className="page-sub">Agent 3 — Storage &amp; Selling Timing Advisor</p></div>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="card card-pad" style={{textAlign:"center",padding:60}}>
        <div style={{fontSize:48,marginBottom:16}}>⚖️</div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:8}}>No Analysis Yet</div>
        <p style={{color:"var(--text-3)"}}>Run your market analysis first from the Home tab.</p>
      </div>
    </div>
  );

  const { sellNow, considerStorage, recommendation, recommendationText, reasoningSteps, netDifference, storageMonths } = s;
  const isStore = recommendation === "consider_storage";

  return (
    <div className="screen">
      <div className="page-title-row">
        <div>
          <h2>Sell or Store</h2>
          <p className="page-sub">Agent 3 — Storage &amp; Selling Timing Advisor · Compare your options</p>
        </div>
        <span className="demo-badge">DEMO DATA</span>
      </div>

      {/* AI Recommendation */}
      <div className="rec-box">
        <div className="rec-box-sub">AI Recommendation</div>
        <div className="rec-box-main">
          {isStore ? "Consider Storage (~2 months)" : "Sell Now — Best Available Option"}
        </div>
        <div className="rec-box-divider">
          <div>
            <div className="rec-box-label">Sell Now Revenue</div>
            <div className="rec-box-revenue">{Rs}{sellNow.estimatedRevenue.toLocaleString("en-IN")}</div>
          </div>
          {isStore && (
            <div>
              <div className="rec-box-label">Storage Net Revenue</div>
              <div className="rec-box-revenue">{Rs}{considerStorage.netRevenue.toLocaleString("en-IN")}</div>
            </div>
          )}
          <div>
            <div className="rec-box-label">{isStore?"Extra Gain with Storage":"Savings vs Storage"}</div>
            <div style={{fontSize:22,fontWeight:800}}>{Rs}{Math.abs(netDifference).toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="sell-store-grid mb-20">
        <div className="sell-store-card">
          <div className="ss-title">Sell Now</div>
          <div className="ss-row"><span className="ss-lbl">Price / Qtl</span><span className="ss-val">{Rs}{sellNow.pricePerQuintal}</span></div>
          <div className="ss-row"><span className="ss-lbl">Gross Revenue</span><span className="ss-val">{Rs}{sellNow.estimatedRevenue.toLocaleString("en-IN")}</span></div>
          <div className="ss-row"><span className="ss-lbl">Storage Cost</span><span className="ss-val">{Rs}0</span></div>
          <div className="ss-row"><span className="ss-lbl">Net Revenue</span><span className="ss-val" style={{color:"var(--g-700)",fontSize:16}}>{Rs}{sellNow.netRevenue.toLocaleString("en-IN")}</span></div>
          {!isStore && <div className="ss-conclusion">Recommended — lock in current price</div>}
        </div>
        <div className="sell-store-vs">VS</div>
        <div className="sell-store-card store-card">
          <div className="ss-title">Store &amp; Sell Later ({storageMonths} months)</div>
          <div className="ss-row"><span className="ss-lbl">Est. Future Price</span><span className="ss-val" style={{color:"var(--amber-600)"}}>{Rs}{considerStorage.estimatedFuturePrice}</span></div>
          <div className="ss-row"><span className="ss-lbl">Gross Revenue</span><span className="ss-val">{Rs}{considerStorage.estimatedRevenue.toLocaleString("en-IN")}</span></div>
          <div className="ss-row"><span className="ss-lbl">Storage Cost</span><span className="ss-val" style={{color:"var(--red-600)"}}>-{Rs}{considerStorage.storageCost.toLocaleString("en-IN")}</span></div>
          <div className="ss-row"><span className="ss-lbl">Net Revenue</span><span className="ss-val" style={{color:"var(--g-700)",fontSize:16}}>{Rs}{considerStorage.netRevenue.toLocaleString("en-IN")}</span></div>
          {isStore && <div className="ss-conclusion amber-bg">Recommended — better returns if price holds</div>}
        </div>
      </div>

      {/* Reasoning + Cost Breakdown */}
      <div className="g2 mb-20">
        <div className="card card-pad">
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Why This Recommendation?</div>
          <ul className="steps-list">
            {reasoningSteps.map((step, i) => <li key={i}>{step}</li>)}
          </ul>
        </div>
        <div className="card card-pad">
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Storage Cost Breakdown</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <tbody>
              {[
                ["Warehouse cost", Rs + "25/qtl/month x " + storageMonths + " months"],
                ["Handling charge", Rs + "15/qtl (one-time)"],
                ["Total storage cost", "-" + Rs + considerStorage.storageCost.toLocaleString("en-IN")],
              ].map(([l,v],i)=>(
                <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                  <td style={{padding:"9px 0",color:"var(--text-3)"}}>{l}</td>
                  <td style={{padding:"9px 0",fontWeight:700,textAlign:"right",color:i===2?"var(--red-600)":"var(--text)"}}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{fontSize:11,color:"var(--text-3)",marginTop:10}}>
            Price assumption: {considerStorage.priceChangeAssumption}
          </div>
        </div>
      </div>

      <div className="disclaimer">{s.disclaimer}</div>
    </div>
  );
}
