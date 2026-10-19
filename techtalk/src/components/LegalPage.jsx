import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, FileText, Lock, Scale, CheckCircle2, 
  ArrowRight, Mail, Globe, MapPin, AlertCircle, Sparkles, ChevronRight 
} from "lucide-react";

export const TERMS_SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using our platform ("Service"), you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them. If you are using the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.\n\nIf you do not agree with any part of these Terms, you must discontinue use of the Service immediately.`
  },
  {
    id: "account",
    title: "2. Account Registration & Responsibilities",
    content: "To access certain features you must create an account. You agree to:",
    bullets: [
      "Provide accurate, current, and complete information during registration.",
      "Maintain the security of your password and immediately notify us of any unauthorised access.",
      "Accept all responsibility for activity that occurs under your account.",
      "Not share your credentials with any third party.",
      "Notify us promptly if you become aware of any breach of security."
    ],
    contentAfter: "We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe are being used for fraudulent or harmful purposes."
  },
  {
    id: "use",
    title: "3. Permitted & Prohibited Use",
    content: "You may use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:",
    bullets: [
      "Use the Service in any way that violates applicable local, state, national, or international law or regulation.",
      "Transmit any material that is defamatory, obscene, fraudulent, or otherwise objectionable.",
      "Attempt to gain unauthorised access to any portion of the Service or its related systems.",
      "Use automated scripts, scrapers, or bots without our express written permission.",
      "Introduce viruses, malware, or any other malicious code.",
      "Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service."
    ]
  },
  {
    id: "ip",
    title: "4. Intellectual Property",
    content: `All content on the Service — including text, graphics, logos, icons, images, audio clips, and software — is the exclusive property of our company or its licensors and is protected by applicable intellectual property laws.\n\nYou are granted a limited, non-exclusive, non-transferable licence to access and use the Service for your personal or internal business purposes. You may not reproduce, distribute, modify, or create derivative works without our express written consent.`
  },
  {
    id: "payment",
    title: "5. Subscription & Payment Terms",
    content: "Certain features require a paid subscription. By subscribing you agree to:",
    bullets: [
      "Pay all fees associated with your chosen plan in advance on a monthly or annual basis.",
      "Provide valid payment information and keep it up to date.",
      "Allow us to charge your payment method automatically upon each renewal date.",
      "Accept that fees are non-refundable except as expressly stated in our Refund Policy."
    ],
    contentAfter: "We may change pricing at any time. We will provide at least 30 days' notice before any price change takes effect. Continued use of the Service after the change constitutes acceptance of the new pricing."
  },
  {
    id: "privacy-link",
    title: "6. Privacy & Data Protection",
    content: "Your privacy matters to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference."
  }
];

export const PRIVACY_SECTIONS = [
  {
    id: "intro",
    title: "1. Introduction",
    content: `NexziByte Solutions Private Limited ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services ("Service").\n\nIf you have any questions or concerns about this policy, please contact us at privacy@nexzibyte.com or connect@nexzibyte.com.`
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    content: "We collect information in the following ways:",
    bullets: [
      "Personal Identification: Name, email address, phone number, and billing address provided during registration.",
      "Usage Data: IP address, browser type, pages visited, time spent, and referring URLs collected automatically.",
      "Device Data: Device identifiers, operating system, and browser version.",
      "Payment Data: Processed securely by our PCI-DSS compliant payment processors; we do not store full card numbers.",
      "Communications: Messages you send us via email, support tickets, or chat.",
      "Cookies & Tracking: See Section 7 for details on our cookie practices."
    ]
  },
  {
    id: "use",
    title: "3. How We Use Your Information",
    content: "We use the information we collect to:",
    bullets: [
      "Provide, operate, and maintain our Service.",
      "Process transactions and send related information, including purchase confirmations and invoices.",
      "Personalise your experience and deliver content relevant to your interests.",
      "Send administrative information, such as updates to our Terms or security alerts.",
      "Respond to your inquiries and provide customer support.",
      "Analyse usage patterns to improve our products and develop new features.",
      "Send marketing communications (you may opt out at any time).",
      "Detect, prevent, and respond to fraud, abuse, and security incidents.",
      "Comply with legal obligations."
    ]
  },
  {
    id: "sharing",
    title: "4. Sharing Your Information",
    content: "We do not sell your personal information. We may share your data with:",
    bullets: [
      "Service Providers: Trusted third-party vendors (cloud hosting, payment processing, analytics, email delivery) who are contractually bound to keep your data confidential.",
      "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
      "Legal Compliance: When required by applicable law, court order, or government authority.",
      "With Your Consent: For any other purpose disclosed to you at the time of collection with your prior consent."
    ]
  },
  {
    id: "retention",
    title: "5. Data Retention",
    content: "We retain personal data for as long as necessary to fulfil the purposes outlined in this Policy unless a longer retention period is required or permitted by law:",
    bullets: [
      "Account data: Retained while your account is active and for 90 days after deletion to allow reactivation.",
      "Transaction records: Retained for 7 years for accounting and tax compliance.",
      "Analytics data: Aggregated and anonymised after 24 months.",
      "Support communications: Retained for 3 years."
    ]
  },
  {
    id: "rights",
    title: "6. Your Privacy Rights",
    content: "Depending on your location, you may have the following rights:",
    bullets: [
      "Access: Request a copy of the personal data we hold about you.",
      "Rectification: Request correction of inaccurate or incomplete data.",
      'Erasure: Request deletion of your personal data ("right to be forgotten").',
      "Portability: Request your data in a machine-readable format.",
      "Objection: Object to processing based on legitimate interests.",
      "Restriction: Request restriction of processing in certain circumstances.",
      "Withdraw Consent: Withdraw consent at any time where we rely on consent to process data."
    ],
    contentAfter: "To exercise any of these rights, email us at privacy@nexzibyte.com. We will respond within 30 days."
  },
  {
    id: "cookies",
    title: "7. Cookies & Tracking Technologies",
    content: "We use cookies and similar tracking technologies to enhance your experience on the Service:",
    bullets: [
      "Essential Cookies: Required for core functionality such as session management and authentication.",
      "Analytics Cookies: Help us understand how users interact with the Service (e.g., Google Analytics, Mixpanel).",
      "Marketing Cookies: Used to deliver targeted advertisements and measure campaign effectiveness."
    ],
    contentAfter: "You can control cookies through your browser settings or our Cookie Preferences Centre. Disabling certain cookies may affect Service functionality."
  },
  {
    id: "security",
    title: "8. Security Measures",
    content: "We implement industry-standard technical and organisational measures to protect your data, including:",
    bullets: [
      "TLS/SSL encryption for all data in transit.",
      "AES-256 encryption for data at rest.",
      "Regular security audits and penetration testing.",
      "Strict access controls and employee training.",
      "Incident response procedures with 72-hour breach notification."
    ],
    contentAfter: "No method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security."
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: "Our Service is not directed to children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children. If we learn we have collected such information, we will delete it promptly. If you believe we may have data from a child, please contact us at privacy@nexzibyte.com."
  },
  {
    id: "international",
    title: "10. International Data Transfers",
    content: "We operate globally. If you are located outside India, your information may be transferred to and processed in India or other countries where our service providers operate. We ensure adequate safeguards through standard contractual clauses or other legally recognised mechanisms."
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: "We may update this Privacy Policy periodically. Material changes will be communicated via email and a prominent notice on our website at least 30 days before the changes take effect. We encourage you to review this Policy regularly."
  },
  {
    id: "contact",
    title: "12. Contact Our Privacy Team",
    content: `For any privacy-related questions, requests, or concerns, please contact:

Data Protection Officer
📧 privacy@nexzibyte.com / connect@nexzibyte.com
📍 NexziByte Solutions Private Limited, H. No. 19-125/A, Kodandaram Nagar, Saroornagar, K.V. Rangareddy, Hyderabad, Telangana 500060, India.

We aim to respond to all enquiries within 30 days.`
  }
];

export default function LegalPage({ initialTab = "terms" }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSectionId, setActiveSectionId] = useState("");

  // Determine active tab based on pathname if navigated
  useEffect(() => {
    if (location.pathname.includes("privacy")) {
      setActiveTab("privacy");
    } else {
      setActiveTab("terms");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const currentSections = activeTab === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  // Active section scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      for (const section of currentSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSectionId(id);
    }
  };

  return (
    <div 
      className="legal-policy-page-luxury"
      style={{
        color: "#FFFFFF",
        minHeight: "100vh",
        position: "relative",
        background: "#0D0A2B"
      }}
    >
      {/* ── 1. LUXURY HERO HEADER ── */}
      <section style={{
        position: "relative",
        padding: "85px 24px 60px 24px",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108, 43, 217, 0.35) 0%, transparent 100%)"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          
          {/* Badge & Pill */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: "rgba(108, 43, 217, 0.25)",
              border: "1px solid rgba(167, 139, 250, 0.35)",
              color: "#C084FC",
              fontSize: "0.8125rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase"
            }}>
              <ShieldCheck size={14} color="#38BDF8" />
              <span>NexziByte Legal &amp; Compliance</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            textAlign: "center",
            maxWidth: "960px",
            margin: "0 auto 16px auto",
            color: "#FFFFFF"
          }}>
            {activeTab === "terms" ? (
              <>
                Terms &amp;{" "}
                <span style={{
                  background: "linear-gradient(135deg, #A78BFA 0%, #38BDF8 50%, #FF8866 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Conditions
                </span>
              </>
            ) : (
              <>
                Privacy{" "}
                <span style={{
                  background: "linear-gradient(135deg, #38BDF8 0%, #34D399 50%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Policy
                </span>
              </>
            )}
          </h1>

          {/* Subtitle & Dates */}
          <p style={{
            fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
            color: "rgba(226, 232, 240, 0.85)",
            textAlign: "center",
            maxWidth: "760px",
            margin: "0 auto 30px auto",
            lineHeight: 1.6
          }}>
            Last updated: <strong style={{ color: "#FFFFFF" }}>April 1, 2026</strong> · Effective: <strong style={{ color: "#FFFFFF" }}>April 1, 2026</strong>
            <br />
            Official policy of <strong style={{ color: "#38BDF8" }}>NexziByte Solutions Private Limited</strong>
          </p>

          {/* Fast Policy Switcher Tabs */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "9999px",
                border: activeTab === "terms" ? "1px solid rgba(167, 139, 250, 0.6)" : "1px solid rgba(255, 255, 255, 0.14)",
                background: activeTab === "terms" ? "linear-gradient(135deg, rgba(108, 43, 217, 0.7) 0%, rgba(79, 70, 229, 0.7) 100%)" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "terms" ? "#FFFFFF" : "rgba(226, 232, 240, 0.75)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: activeTab === "terms" ? "0 4px 20px rgba(108, 43, 217, 0.35)" : "none"
              }}
            >
              <Scale size={16} />
              <span>Terms &amp; Conditions</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "9999px",
                border: activeTab === "privacy" ? "1px solid rgba(56, 189, 248, 0.6)" : "1px solid rgba(255, 255, 255, 0.14)",
                background: activeTab === "privacy" ? "linear-gradient(135deg, rgba(14, 165, 233, 0.7) 0%, rgba(16, 185, 129, 0.7) 100%)" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "privacy" ? "#FFFFFF" : "rgba(226, 232, 240, 0.75)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: activeTab === "privacy" ? "0 4px 20px rgba(56, 189, 248, 0.35)" : "none"
              }}
            >
              <Lock size={16} />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. TWO-COLUMN LAYOUT: SIDEBAR TABLE OF CONTENTS + CONTENT ── */}
      <section style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "50px 24px 90px 24px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "36px",
          alignItems: "flex-start"
        }}>
          
          {/* ── LEFT SIDEBAR (STICKY TOC) ── */}
          <aside style={{
            position: "sticky",
            top: "95px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {/* TOC Card */}
            <div style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "18px",
              padding: "24px 20px",
              backdropFilter: "blur(14px)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)"
            }}>
              <div style={{
                fontSize: "0.8125rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: "#A78BFA",
                textTransform: "uppercase",
                marginBottom: "14px"
              }}>
                Table of Contents
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {currentSections.map((sec, idx) => {
                  const isActive = activeSectionId === sec.id || (!activeSectionId && idx === 0);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      style={{
                        textAlign: "left",
                        background: isActive ? "rgba(108, 43, 217, 0.25)" : "transparent",
                        border: isActive ? "1px solid rgba(167, 139, 250, 0.35)" : "1px solid transparent",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        color: isActive ? "#FFFFFF" : "rgba(226, 232, 240, 0.75)",
                        fontSize: "0.85rem",
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#FFFFFF";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "rgba(226, 232, 240, 0.75)";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sec.title}
                      </span>
                      {isActive && <ChevronRight size={14} color="#38BDF8" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust & Compliance Badge Card */}
            <div style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "18px",
              padding: "22px",
              backdropFilter: "blur(14px)"
            }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "8px" }}>
                Corporate Governance
              </div>
              <p style={{ fontSize: "0.8125rem", color: "rgba(226, 232, 240, 0.75)", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                Governed under Indian Information Technology (IT) Acts &amp; Digital Personal Data Protection (DPDP) guidelines.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8125rem", color: "rgba(203, 213, 225, 0.85)" }}>
                <div>📍 Hyderabad, Telangana, India</div>
                <div>🏢 NexziByte Solutions Pvt. Ltd.</div>
                <div>
                  🌐{" "}
                  <a href="https://www.nexzibyte.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 700 }}>
                    www.nexzibyte.com ↗
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN DOCUMENT CONTENT ── */}
          <main style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "24px",
            padding: "clamp(26px, 4vw, 50px)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.3)"
          }}>
            
            {/* Document Header Line */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "20px",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <div>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: "#38BDF8",
                  background: "rgba(56, 189, 248, 0.12)",
                  padding: "4px 12px",
                  borderRadius: "9999px"
                }}>
                  OFFICIAL LEGAL DOCUMENT
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(226, 232, 240, 0.7)" }}>
                NexziByte Solutions Private Limited
              </div>
            </div>

            {/* Render All Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {currentSections.map((sec, idx) => (
                <div 
                  key={sec.id} 
                  id={sec.id}
                  style={{
                    borderBottom: idx < currentSections.length - 1 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                    paddingBottom: idx < currentSections.length - 1 ? "32px" : "0"
                  }}
                >
                  <h2 style={{
                    fontSize: "clamp(1.25rem, 2vw, 1.55rem)",
                    fontWeight: 850,
                    color: "#FFFFFF",
                    marginBottom: "14px",
                    letterSpacing: "-0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <span>{sec.title}</span>
                  </h2>

                  {/* Primary Paragraph Content */}
                  <div style={{
                    fontSize: "0.96rem",
                    lineHeight: 1.75,
                    color: "rgba(241, 245, 249, 0.9)",
                    whiteSpace: "pre-line",
                    marginBottom: sec.bullets ? "16px" : "0"
                  }}>
                    {sec.content}
                  </div>

                  {/* Bullets List if Present */}
                  {sec.bullets && (
                    <ul style={{
                      listStyleType: "none",
                      padding: 0,
                      margin: "0 0 16px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      {sec.bullets.map((b, bIdx) => (
                        <li 
                          key={bIdx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            fontSize: "0.9375rem",
                            lineHeight: 1.65,
                            color: "rgba(226, 232, 240, 0.88)"
                          }}
                        >
                          <span style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "#38BDF8",
                            marginTop: "8px",
                            flexShrink: 0
                          }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Post-Bullets Followup Paragraph */}
                  {sec.contentAfter && (
                    <p style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: "rgba(226, 232, 240, 0.9)",
                      margin: 0
                    }}>
                      {sec.contentAfter}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Help & Contact Box */}
            <div style={{
              marginTop: "48px",
              padding: "28px",
              borderRadius: "16px",
              background: "rgba(108, 43, 217, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.25)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px"
            }}>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "4px" }}>
                  Have questions about our legal policies?
                </div>
                <div style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)" }}>
                  Contact our compliance and legal team directly at <strong style={{ color: "#38BDF8" }}>connect@nexzibyte.com</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <Link
                  to="/contact"
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  <span>Contact Us</span>
                  <ArrowRight size={14} />
                </Link>

                <a
                  href="https://www.nexzibyte.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#FFFFFF",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    textDecoration: "none"
                  }}
                >
                  <Globe size={14} />
                  <span>nexzibyte.com ↗</span>
                </a>
              </div>
            </div>

          </main>
        </div>
      </section>
    </div>
  );
}
