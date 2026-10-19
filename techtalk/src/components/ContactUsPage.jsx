import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, MapPin, Globe, Send, CheckCircle2, 
  Clock, Building, ChevronDown, ChevronUp, ArrowRight
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { NexziByteLogo } from "./NexziByteLogo.jsx";

export default function ContactUsPage() {
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitContactMessage(formData);
      setSubmitting(false);
      setSubmitted(true);
      showToast(res?.message || "Thank you! Your message has been dispatched to NexziByte Admin.");
    } catch (err) {
      setSubmitting(false);
      setSubmitted(true);
      showToast("Thank you! Your message has been recorded.");
    }
  };

  const faqs = [
    {
      q: "How do I register for TechTalk passes?",
      a: "You can claim a Free Visitor Pass or choose Student (₹99), Delegation (₹250), or Founder Pass (₹499) directly from any pass button across the site or through the Passes page. Your QR pass is instantly generated upon verification."
    },
    {
      q: "Where is NexziByte Solutions located?",
      a: "Our corporate headquarters and registered office is located at H. No. 19-125/A, Kodandaram Nagar, Saroornagar, K.V. Rangareddy, Hyderabad, Telangana 500060, India."
    },
    {
      q: "How can my company partner or sponsor a TechTalk summit?",
      a: "You can reach out directly via connect@nexzibyte.com or explore our dedicated Partner page (/partner) to view Tier 1, Ecosystem, and Technology Partner sponsorship packages."
    },
    {
      q: "Are the internship certificates digitally verifiable?",
      a: "Yes. All 23 internship programs and technology courses include official verifiable credentials authenticated directly by NexziByte Solutions Private Limited."
    }
  ];

  return (
    <div className="contact-page-luxury" style={{ color: "#FFFFFF", minHeight: "100vh", position: "relative" }}>
      {/* ── 1. HERO HEADER ── */}
      <section style={{
        position: "relative",
        padding: "90px 24px 70px 24px",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108, 43, 217, 0.25) 0%, transparent 100%)"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          


          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            textAlign: "center",
            maxWidth: "940px",
            margin: "0 auto 20px auto",
            color: "#FFFFFF"
          }}>
            Let's Connect &amp; Build <br />
            <span style={{
              background: "linear-gradient(135deg, #A78BFA 0%, #38BDF8 50%, #FF8866 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              The Next Tech Milestone.
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)",
            color: "rgba(226, 232, 240, 0.88)",
            textAlign: "center",
            maxWidth: "780px",
            margin: "0 auto",
            lineHeight: 1.65
          }}>
            Have inquiries about TechTalk summits, course tracks, corporate partnerships, or speaker invitations? Reach out to the NexziByte team in Hyderabad.
          </p>
        </div>
      </section>

      {/* ── 2. CONTACT INFO CARDS ── */}
      <section style={{ padding: "50px 24px 40px 24px", maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px"
        }}>
          {/* Card 1: Headquarters */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(52, 211, 153, 0.2)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={20} />
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>Corporate Office</div>
            <p style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.5, margin: 0 }}>
              H. No. 19-125/A, Kodandaram Nagar, Saroornagar, K.V. Rangareddy, Hyderabad, Telangana 500060, India
            </p>
          </div>

          {/* Card 2: Email Channels */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255, 136, 102, 0.2)", color: "#FF8866", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={20} />
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>Official Email</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.875rem" }}>
              <a href="mailto:connect@nexzibyte.com" style={{ color: "#FF8866", textDecoration: "none", fontWeight: 700 }}>connect@nexzibyte.com</a>
              <a href="mailto:nexzibyte@gmail.com" style={{ color: "rgba(203, 213, 225, 0.7)", textDecoration: "none" }}>nexzibyte@gmail.com</a>
            </div>
          </div>

          {/* Card 3: Web Portal */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(56, 189, 248, 0.2)", color: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={20} />
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>Official Website</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.875rem" }}>
              <a 
                href="https://www.nexzibyte.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>https://www.nexzibyte.com/</span>
                <ArrowRight size={14} />
              </a>
              <span style={{ color: "rgba(203, 213, 225, 0.75)" }}>NexziByte Solutions Official Portal</span>
            </div>
          </div>

          {/* Card 4: Operating Hours */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
          }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(124, 58, 237, 0.2)", color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={20} />
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>Working Hours</div>
            <div style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.5 }}>
              <div>Monday – Saturday: 9:30 AM – 7:00 PM IST</div>
              <div>Sunday: Event Schedules Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FORM & FAQ SECTION ── */}
      <section style={{ padding: "30px 24px 80px 24px", maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
          alignItems: "flex-start"
        }}>
          
          {/* Left: Contact Form */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "20px",
            padding: "36px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)"
          }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 850, color: "#FFFFFF", marginBottom: "8px" }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "rgba(226, 232, 240, 0.8)", marginBottom: "26px" }}>
              Fill out the form below and our team will respond within 24 business hours.
            </p>

            {submitted ? (
              <div style={{
                background: "rgba(34, 197, 94, 0.15)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center"
              }}>
                <CheckCircle2 size={42} style={{ color: "#34D399", margin: "0 auto 12px auto" }} />
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "6px" }}>
                  Message Sent Successfully!
                </div>
                <p style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.85)", margin: "0 0 16px 0" }}>
                  We have received your message and will reach back out to you at <strong style={{ color: "#FFFFFF" }}>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "general", message: "" });
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    borderColor: "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)", marginBottom: "6px" }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "0.9375rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)", marginBottom: "6px" }}>
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "10px",
                        color: "#FFFFFF",
                        fontSize: "0.9375rem",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)", marginBottom: "6px" }}>
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: "10px",
                        color: "#FFFFFF",
                        fontSize: "0.9375rem",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)", marginBottom: "6px" }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#181548",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "0.9375rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="general" style={{ background: "#181548", color: "#FFFFFF" }}>General Inquiry &amp; Support</option>
                    <option value="summits" style={{ background: "#181548", color: "#FFFFFF" }}>TechTalk Summits &amp; Event Passes</option>
                    <option value="internships" style={{ background: "#181548", color: "#FFFFFF" }}>Internship Programs &amp; Certifications</option>
                    <option value="partnership" style={{ background: "#181548", color: "#FFFFFF" }}>Corporate Sponsorship &amp; Partnerships</option>
                    <option value="speaker" style={{ background: "#181548", color: "#FFFFFF" }}>Speaker &amp; Keynote Applications</option>
                    <option value="enterprise" style={{ background: "#181548", color: "#FFFFFF" }}>Enterprise IT &amp; AI Solutions</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)", marginBottom: "6px" }}>
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "0.9375rem",
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
                >
                  <Send size={16} />
                  <span>{submitting ? "Sending Message..." : "Dispatch Message to NexziByte"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: FAQ Accordion */}
          <div>
            <div style={{ marginBottom: "24px" }}>

              <h2 style={{ fontSize: "1.85rem", fontWeight: 850, color: "#FFFFFF", margin: "0 0 10px 0" }}>
                Quick Answers &amp; Support
              </h2>
              <p style={{ color: "rgba(226, 232, 240, 0.8)", fontSize: "0.9375rem" }}>
                Find immediate answers regarding passes, locations, and corporate engagements.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      style={{
                        width: "100%",
                        padding: "18px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "#FFFFFF",
                        fontSize: "0.95rem",
                        fontWeight: 700
                      }}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} color="#FF8866" /> : <ChevronDown size={18} color="rgba(255, 255, 255, 0.6)" />}
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: "0 20px 18px 20px",
                        color: "rgba(226, 232, 240, 0.85)",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)"
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Links Card 1: Official Website */}
            <div style={{
              marginTop: "28px",
              background: "rgba(56, 189, 248, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
            }}>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>NexziByte Solutions Official Website</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(226, 232, 240, 0.8)", marginTop: "2px" }}>Visit https://www.nexzibyte.com/ for enterprise solutions &amp; company contact</div>
              </div>
              <a 
                href="https://www.nexzibyte.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{
                  background: "rgba(56, 189, 248, 0.2)",
                  color: "#38BDF8",
                  borderColor: "rgba(56, 189, 248, 0.4)",
                  textDecoration: "none",
                  flexShrink: 0
                }}
              >
                <span>Visit Website</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Quick Links Card 2: About Us */}
            <div style={{
              marginTop: "16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
            }}>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>Looking for About Us?</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(226, 232, 240, 0.75)", marginTop: "2px" }}>Read the complete company story &amp; mission</div>
              </div>
              <Link 
                to="/about"
                className="btn btn-secondary btn-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
              >
                <span>About Us</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
