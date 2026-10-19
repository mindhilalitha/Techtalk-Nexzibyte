import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, QrCode, Copy, Check, Download, 
  Smartphone, ExternalLink, Calendar, MapPin, Phone 
} from "lucide-react";
import QRCode from "qrcode";
import { useApp } from "../context/AppContext.jsx";

// Standards-compliant scannable QR Code generator for the digital pass
export function PassQRCodeSVG({ value, size = 130 }) {
  const [qrUrl, setQrUrl] = React.useState("");

  React.useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(String(value), {
      width: Math.max(260, size * 2),
      margin: 1,
      color: {
        dark: "#18181B",
        light: "#FFFFFF"
      },
      errorCorrectionLevel: "M"
    })
      .then((url) => setQrUrl(url))
      .catch((err) => {
        console.error("Pass QR Generation Error:", err);
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&margin=4&data=${encodeURIComponent(String(value))}`);
      });
  }, [value, size]);

  return (
    <div style={{ display: "inline-block", background: "#FFFFFF", padding: "6px", borderRadius: "8px" }}>
      {qrUrl ? (
        <img 
          src={qrUrl} 
          alt={`Pass QR: ${value}`} 
          width={size} 
          height={size} 
          style={{ display: "block", borderRadius: "4px" }}
        />
      ) : (
        <div style={{ width: size, height: size, background: "#F4F4F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "#71717A" }}>Generating QR...</span>
        </div>
      )}
    </div>
  );
}

export default function DigitalPass() {
  const { activePass, showToast } = useApp();

  const handleCopyId = () => {
    navigator.clipboard?.writeText(activePass.passId);
    showToast(`Copied Pass ID ${activePass.passId} to clipboard.`);
  };

  const handleDownload = () => {
    showToast(`Downloading digital ticket for ${activePass.holder} (${activePass.passId})...`);
  };

  return (
    <section className="section-padding digital-pass-section" id="digital-pass">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            
            CONTACTLESS ACCREDITATION
          </span>
          <h2 className="section-heading">Your TechTalk Pass, Always With You</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Every registered attendee receives a secure digital pass for fast and simple event check-in.
          </p>
        </div>

        <div className="ticket-showcase-container">
          <div className="digital-pass-card">
            {/* Ticket Header Brand Band */}
            <div className="ticket-top-band">
              <div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.9 }}>
                  {activePass.org}
                </div>
                <div className="ticket-brand-title">
                  {activePass.event}
                </div>
              </div>

              <div className="ticket-edition-tag">
                {activePass.price}
              </div>
            </div>

            {/* Ticket Main Body */}
            <div className="ticket-body">
              <div className="ticket-info-block">
                <div>
                  <span className={`ticket-pass-type-badge ${
                    activePass.passType?.includes("STUDENT") ? "student" :
                    activePass.passType?.includes("FOUNDER") ? "founder" :
                    activePass.passType?.includes("DELEGAT") ? "delegate" : "visitor"
                  }`}>
                    {activePass.passType}
                  </span>
                </div>

                <div>
                  <div className="ticket-field-label">PASS HOLDER</div>
                  <div className="ticket-field-value">{activePass.holder}</div>
                  {(activePass.contact || activePass.phone) && (
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <Phone size={12} style={{ color: "var(--coral)" }} />
                      <span>{activePass.contact || activePass.phone}</span>
                    </div>
                  )}
                  {(activePass.role || activePass.organization) && (
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px", fontWeight: 600 }}>
                      {[activePass.role, activePass.organization].filter(Boolean).join(" • ")}
                    </div>
                  )}
                </div>

                <div>
                  <div className="ticket-field-label">PASS ID NO.</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="ticket-id-value">{activePass.passId}</span>
                    <button 
                      type="button"
                      onClick={handleCopyId} 
                      style={{ color: "var(--text-secondary)", padding: "4px" }}
                      title="Copy Pass ID"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={13} style={{ color: "var(--coral)" }} />
                    <span>Hyderabad, IN</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} style={{ color: "#16A34A" }} />
                    <span>2026 Season</span>
                  </div>
                </div>
              </div>

              {/* QR Code & Status */}
              <div className="ticket-qr-block">
                <div className="ticket-qr-svg-wrap">
                  <PassQRCodeSVG value={activePass.qrData} size={120} />
                </div>

                <div className="ticket-valid-tag">
                  <Check size={13} />
                  <span>{activePass.validation}</span>
                </div>
              </div>
            </div>

            {/* Ticket Perforated Tear Row & Badges */}
            <div className="ticket-pills-row">
              <div className="ticket-pill-item">
                <ShieldCheck size={15} style={{ color: "#16A34A" }} />
                <span>Secure</span>
              </div>
              <div className="ticket-pill-item">
                
                <span>Unique</span>
              </div>
              <div className="ticket-pill-item">
                <Smartphone size={15} style={{ color: "var(--electric-blue)" }} />
                <span>Contactless</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Actions */}
        <div className="ticket-actions-bar">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleDownload}
          >
            <Download size={15} />
            <span>Download Pass (PDF)</span>
          </button>

          <a href="/#scanner" className="btn btn-primary btn-sm">
            <QrCode size={15} />
            <span>Test In QR Scanner Below ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
