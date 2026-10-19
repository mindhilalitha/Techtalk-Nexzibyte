import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Zap, Ticket, Sparkles, QrCode, Lock, CheckCircle2 } from "lucide-react";
import { PASSES } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function Passes() {
  const { openPassModal } = useApp();
  const navigate = useNavigate();

  const getPassTheme = (id) => {
    switch (id) {
      case "visitor-pass": return "theme-visitor";
      case "student-pass": return "theme-student";
      case "founder-pass": return "theme-founder";
      case "delegation-pass":
      case "delegate-pass": return "theme-delegation";
      default: return "theme-founder";
    }
  };

  const getAdmitNum = (index) => {
    return `0${index + 1}`;
  };

  return (
    <section 
      className="passes-section" 
      id="passes" 
      style={{ 
        background: "radial-gradient(ellipse at 50% 0%, #1c1448 0%, #0d0a2b 45%, #070518 100%)", 
        color: "#FFFFFF", 
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "100px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Dynamic Ambient Glowing Nebula Lights */}
      <div 
        aria-hidden="true" 
        style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          zIndex: 0,
          overflow: "hidden" 
        }}
      >
        <div 
          style={{ 
            position: "absolute", 
            top: "-10%", 
            left: "15%", 
            width: "550px", 
            height: "550px", 
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(109, 40, 217, 0.15) 50%, transparent 70%)", 
            filter: "blur(90px)", 
            borderRadius: "50%" 
          }} 
        />
        <div 
          style={{ 
            position: "absolute", 
            top: "30%", 
            right: "-5%", 
            width: "500px", 
            height: "500px", 
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(249, 115, 22, 0.1) 50%, transparent 70%)", 
            filter: "blur(100px)", 
            borderRadius: "50%" 
          }} 
        />
        <div 
          style={{ 
            position: "absolute", 
            bottom: "5%", 
            left: "-5%", 
            width: "520px", 
            height: "520px", 
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(16, 185, 129, 0.12) 50%, transparent 70%)", 
            filter: "blur(95px)", 
            borderRadius: "50%" 
          }} 
        />
        {/* Subtle Cyber Perspective Grid Texture */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.85) 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.85) 0%, transparent 80%)"
          }}
        />
      </div>

      <div className="container-wide" style={{ position: "relative", zIndex: 1 }}>
        {/* Header Block */}
        <div style={{ textAlign: "center", maxWidth: "840px", margin: "0 auto 56px auto", padding: "0 16px" }}>
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "9999px",
              background: "rgba(124, 58, 237, 0.18)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              color: "#D8B4FE",
              fontSize: "0.8125rem",
              fontWeight: 750,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "20px",
              boxShadow: "0 0 20px rgba(124, 58, 237, 0.25)"
            }}
          >
            <Sparkles size={14} style={{ color: "#F59E0B" }} />
            <span>Official Accreditation Tiers</span>
          </div>

          <h1 
            style={{
              fontSize: "clamp(2.3rem, 4.5vw, 3.6rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              marginBottom: "18px",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              lineHeight: 1.15
            }}
          >
            Choose Your <span style={{ background: "linear-gradient(135deg, #C084FC 0%, #F59E0B 50%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TechTalk Pass</span>
          </h1>
          <p 
            style={{
              fontSize: "clamp(1.02rem, 1.25vw, 1.2rem)",
              color: "#CBD5E1",
              lineHeight: 1.7,
              margin: "0 auto",
              maxWidth: "700px"
            }}
          >
            Four tailored accreditation paths designed for Students, Founders, Community Visitors, and Corporate Delegations.
          </p>
        </div>

        {/* 3D Holographic Tickets Grid */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            justifyItems: "center",
            alignItems: "stretch",
            maxWidth: "1360px",
            margin: "0 auto",
            padding: "0 16px"
          }}
        >
          {PASSES.map((pass, index) => {
            const themeClass = getPassTheme(pass.id);
            const admitNum = getAdmitNum(index);

            return (
              <div
                key={pass.id}
                className={`ticket-wrapper ${themeClass}`}
                onClick={() => openPassModal(pass.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openPassModal(pass.id)}
                aria-label={`Claim ${pass.type}`}
              >
                <div className="ticket">
                  {/* Main Ticket Body */}
                  <div className="t-main">
                    <div className="t-content">
                      <div className="t-header">
                        <div className="t-logo">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                          <span>TechTalk</span>
                        </div>
                        <div className="t-type">{pass.badge}</div>
                      </div>

                      <div className="t-title">{pass.price}</div>
                      <div className="t-subtitle">{pass.description}</div>

                      {/* Included Privileges */}
                      <ul className="t-features-list">
                        {pass.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="t-feature-item">
                            <Check size={14} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="t-details">
                        <div className="t-detail-item">
                          <span className="t-label">PASS TYPE</span>
                          <span className="t-value">{pass.type}</span>
                        </div>
                        <div className="t-detail-item">
                          <span className="t-label">ACCESS</span>
                          <span className="t-value">{pass.price === "FREE" ? "Standard" : "All-Access"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Perforation Line with notches */}
                  <div className="t-perforation">
                    <div className="t-perf-line" />
                  </div>

                  {/* Ticket Stub */}
                  <div className="t-stub">
                    <div className="t-barcode-container">
                      <div className="t-barcode" />
                      <div className="t-barcode-id">NXZB-2026-TT#{pass.id.toUpperCase().slice(0, 6)}</div>
                    </div>

                    <div className="t-admit">
                      <div className="t-admit-text">ADMIT</div>
                      <div className="t-admit-num">{admitNum}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Instant Accreditation Perks Bar */}
        <div 
          style={{
            maxWidth: "1100px",
            margin: "64px auto 0 auto",
            padding: "24px 32px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(16px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            textAlign: "left"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(124, 58, 237, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C084FC" }}>
              <QrCode size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#FFFFFF" }}>Instant Digital QR Pass</div>
              <div style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>Delivered directly to email &amp; profile</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34D399" }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#FFFFFF" }}>Verified Certificate</div>
              <div style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>Official skill credential &amp; accreditation</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38BDF8" }}>
              <Lock size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#FFFFFF" }}>Secure UPI &amp; Cards</div>
              <div style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>256-bit encrypted checkout &amp; GST bill</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FBBF24" }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#FFFFFF" }}>Priority Stage Access</div>
              <div style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>Keynotes, founder meets &amp; labs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
