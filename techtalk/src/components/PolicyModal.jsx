import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, ShieldCheck, FileText, CheckCircle2, Lock, Scale, Building2, ExternalLink } from "lucide-react";
import { TERMS_SECTIONS, PRIVACY_SECTIONS } from "./LegalPage.jsx";

export default function PolicyModal({ isOpen, onClose, initialTab = "terms", onAccept }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop-overlay" 
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(10, 15, 26, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div 
        className="modal-content-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="policy-modal-title"
        style={{
          maxWidth: "680px",
          width: "100%",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "20px",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid #E2E8F0",
          overflow: "hidden"
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: "24px 28px 18px",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "#F8FAFC"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: "#6C2BD9",
                background: "rgba(108, 43, 217, 0.1)",
                padding: "3px 10px",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <ShieldCheck size={13} />
                NEXZIBYTE LEGAL &amp; GOVERNANCE
              </span>
            </div>
            <h2 id="policy-modal-title" style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              {activeTab === "terms" ? "Terms of Service" : "Privacy Policy"}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "4px 0 0" }}>
              NexziByte Solutions Private Limited • TechTalk Platform
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#EDF2F7",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748B",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#E2E8F0"; e.currentTarget.style.color = "#0F172A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#EDF2F7"; e.currentTarget.style.color = "#64748B"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #E2E8F0",
          background: "#FFFFFF",
          padding: "0 28px"
        }}>
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            style={{
              padding: "14px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "terms" ? "2.5px solid #6C2BD9" : "2.5px solid transparent",
              color: activeTab === "terms" ? "#6C2BD9" : "#64748B",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease"
            }}
          >
            <Scale size={16} />
            <span>Terms of Service</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            style={{
              padding: "14px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "privacy" ? "2.5px solid #6C2BD9" : "2.5px solid transparent",
              color: activeTab === "privacy" ? "#6C2BD9" : "#64748B",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease"
            }}
          >
            <Lock size={16} />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div style={{
          padding: "24px 28px",
          overflowY: "auto",
          fontSize: "0.9rem",
          lineHeight: 1.65,
          color: "#334155"
        }}>
          {activeTab === "terms" ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#334155",
                  background: "#F1F5F9",
                  padding: "3px 10px",
                  borderRadius: "9999px"
                }}>
                  Legal
                </span>
              </div>

              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>
                Terms &amp; Conditions
              </h3>
              
              <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "20px" }}>
                Last updated: April 1, 2026 · Effective: April 1, 2026
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "12px", marginBottom: "8px" }}>
                  1. Acceptance of Terms
                </h4>
                <p style={{ margin: "0 0 16px 0", color: "#334155" }}>
                  By accessing or using our platform ("Service"), you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them. If you are using the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms. If you do not agree with any part of these Terms, you must discontinue use of the Service immediately.
                </p>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "20px", marginBottom: "8px" }}>
                  2. Account Registration &amp; Responsibilities
                </h4>
                <p style={{ margin: "0 0 10px 0", color: "#334155" }}>
                  To access certain features you must create an account. You agree to:
                </p>
                <ul style={{ listStyleType: "disc", paddingLeft: "22px", margin: "0 0 12px 0", color: "#334155" }}>
                  <li style={{ marginBottom: "6px" }}>Provide accurate, current, and complete information during registration.</li>
                  <li style={{ marginBottom: "6px" }}>Maintain the security of your password and immediately notify us of any unauthorised access.</li>
                  <li style={{ marginBottom: "6px" }}>Accept all responsibility for activity that occurs under your account.</li>
                  <li style={{ marginBottom: "6px" }}>Not share your credentials with any third party.</li>
                  <li style={{ marginBottom: "6px" }}>Notify us promptly if you become aware of any breach of security.</li>
                </ul>
                <p style={{ margin: "0 0 16px 0", color: "#334155" }}>
                  We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe are being used for fraudulent or harmful purposes.
                </p>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "20px", marginBottom: "8px" }}>
                  3. Permitted &amp; Prohibited Use
                </h4>
                <p style={{ margin: "0 0 10px 0", color: "#334155" }}>
                  You may use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
                </p>
                <ul style={{ listStyleType: "disc", paddingLeft: "22px", margin: "0 0 16px 0", color: "#334155" }}>
                  <li style={{ marginBottom: "6px" }}>Use the Service in any way that violates applicable local, state, national, or international law or regulation.</li>
                  <li style={{ marginBottom: "6px" }}>Transmit any material that is defamatory, obscene, fraudulent, or otherwise objectionable.</li>
                  <li style={{ marginBottom: "6px" }}>Attempt to gain unauthorised access to any portion of the Service or its related systems.</li>
                  <li style={{ marginBottom: "6px" }}>Use automated scripts, scrapers, or bots without our express written permission.</li>
                  <li style={{ marginBottom: "6px" }}>Introduce viruses, malware, or any other malicious code.</li>
                  <li style={{ marginBottom: "6px" }}>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
                </ul>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "20px", marginBottom: "8px" }}>
                  4. Intellectual Property
                </h4>
                <p style={{ margin: "0 0 16px 0", color: "#334155" }}>
                  All content on the Service — including text, graphics, logos, icons, images, audio clips, and software — is the exclusive property of our company or its licensors and is protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable licence to access and use the Service for your personal or internal business purposes. You may not reproduce, distribute, modify, or create derivative works without our express written consent.
                </p>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "20px", marginBottom: "8px" }}>
                  5. Subscription &amp; Payment Terms
                </h4>
                <p style={{ margin: "0 0 10px 0", color: "#334155" }}>
                  Certain features require a paid subscription. By subscribing you agree to:
                </p>
                <ul style={{ listStyleType: "disc", paddingLeft: "22px", margin: "0 0 12px 0", color: "#334155" }}>
                  <li style={{ marginBottom: "6px" }}>Pay all fees associated with your chosen plan in advance on a monthly or annual basis.</li>
                  <li style={{ marginBottom: "6px" }}>Provide valid payment information and keep it up to date.</li>
                  <li style={{ marginBottom: "6px" }}>Allow us to charge your payment method automatically upon each renewal date.</li>
                  <li style={{ marginBottom: "6px" }}>Accept that fees are non-refundable except as expressly stated in our Refund Policy.</li>
                </ul>
                <p style={{ margin: "0 0 16px 0", color: "#334155" }}>
                  We may change pricing at any time. We will provide at least 30 days' notice before any price change takes effect. Continued use of the Service after the change constitutes acceptance of the new pricing.
                </p>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "20px", marginBottom: "8px" }}>
                  6. Privacy &amp; Data Protection
                </h4>
                <p style={{ margin: "0 0 16px 0", color: "#334155" }}>
                  Your privacy matters to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#0284C7",
                  background: "rgba(56, 189, 248, 0.12)",
                  padding: "3px 10px",
                  borderRadius: "9999px"
                }}>
                  Legal
                </span>
              </div>

              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>
                Privacy Policy
              </h3>
              
              <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "20px" }}>
                Last updated: April 1, 2026 · Effective: April 1, 2026
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {PRIVACY_SECTIONS.map((sec) => (
                  <div key={sec.id}>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginTop: "10px", marginBottom: "8px" }}>
                      {sec.title}
                    </h4>
                    <div style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "#334155", whiteSpace: "pre-line", marginBottom: sec.bullets ? "10px" : "0" }}>
                      {sec.content}
                    </div>
                    {sec.bullets && (
                      <ul style={{ listStyleType: "disc", paddingLeft: "22px", margin: "0 0 10px 0", color: "#334155" }}>
                        {sec.bullets.map((b, idx) => (
                          <li key={idx} style={{ marginBottom: "6px" }}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {sec.contentAfter && (
                      <p style={{ margin: "6px 0 0 0", color: "#334155" }}>
                        {sec.contentAfter}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: "16px 28px",
          borderTop: "1px solid #E2E8F0",
          background: "#F8FAFC",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ fontSize: "0.825rem", color: "#64748B" }}>
            NexziByte Solutions Pvt. Ltd. • Dilsukhnagar, Hyderabad
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: "10px 18px", borderRadius: "10px" }}
            >
              Close
            </button>

            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="btn btn-primary btn-sm"
                style={{
                  background: "#6C2BD9",
                  color: "#FFFFFF",
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <CheckCircle2 size={15} />
                <span>I Understand &amp; Agree</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
