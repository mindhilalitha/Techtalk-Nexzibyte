import React from "react";
import { Link } from "react-router-dom";
import { 
  Globe, Mail, MapPin, Building, Rocket, Cpu, 
  CheckCircle2, ArrowRight, Calendar, HeartHandshake, 
  Award, Ticket
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { NexziByteLogo } from "./NexziByteLogo.jsx";

export default function AboutUsPage() {
  const { openPassModal } = useApp();

  return (
    <div className="about-page-luxury" style={{ color: "#FFFFFF", minHeight: "100vh", position: "relative" }}>
      {/* ── 1. HERO HEADER ── */}
      <section style={{
        position: "relative",
        padding: "90px 24px 70px 24px",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108, 43, 217, 0.25) 0%, transparent 100%)"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          


          {/* Main Headline */}
          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.035em",
            textAlign: "center",
            maxWidth: "980px",
            margin: "0 auto 20px auto",
            color: "#FFFFFF"
          }}>
            Empowering Innovation, <br />
            <span style={{
              background: "linear-gradient(135deg, #A78BFA 0%, #38BDF8 50%, #FF8866 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Delivering Excellence.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)",
            color: "rgba(226, 232, 240, 0.88)",
            textAlign: "center",
            maxWidth: "840px",
            margin: "0 auto 32px auto",
            lineHeight: 1.65
          }}>
            <strong style={{ color: "#FFFFFF" }}>NexziByte Solutions Private Limited</strong> is a next-generation technology-driven career and innovation platform focused on connecting ambitious engineers, founders, and students with future-ready opportunities in AI, Python, Cloud Infrastructure, and emerging technologies.
          </p>

          {/* Fast Fact Badge Strip */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            maxWidth: "980px",
            margin: "0 auto"
          }}>
            <a 
              href="https://www.nexzibyte.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "9999px",
                color: "#38BDF8",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                backdropFilter: "blur(10px)"
              }}
            >
              <Globe size={15} />
              <span>www.nexzibyte.com</span>
            </a>

            <a 
              href="mailto:connect@nexzibyte.com" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "9999px",
                color: "#FF8866",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                backdropFilter: "blur(10px)"
              }}
            >
              <Mail size={15} />
              <span>connect@nexzibyte.com</span>
            </a>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "9999px",
              color: "#34D399",
              fontSize: "0.875rem",
              fontWeight: 700,
              backdropFilter: "blur(10px)"
            }}>
              <MapPin size={15} />
              <span>Hyderabad, Telangana, India</span>
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "9999px",
              color: "#C084FC",
              fontSize: "0.875rem",
              fontWeight: 700,
              backdropFilter: "blur(10px)"
            }}>
              <Building size={15} />
              <span>IT Services &amp; Consulting</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. OVERVIEW & MISSION ── */}
      <section style={{ padding: "80px 24px", maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
          alignItems: "center"
        }}>
          {/* Left Column: Mission Narrative */}
          <div>

            
            <h2 style={{
              fontSize: "2.2rem",
              fontWeight: 850,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              marginBottom: "20px"
            }}>
              Bridging the gap between engineering talent and future-ready enterprise opportunities.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(226, 232, 240, 0.85)", lineHeight: 1.7, marginBottom: "16px" }}>
              At NexziByte Solutions, we believe technological progress happens when knowledge is liberated from silos. We bridge the gap between job seekers, students, and technology-driven organizations by delivering <strong style={{ color: "#FFFFFF" }}>intelligent job matching, industry-focused upskilling, and real-world project exposure</strong>.
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(226, 232, 240, 0.85)", lineHeight: 1.7, marginBottom: "24px" }}>
              Our platform is built with a strong foundation in Python development and modern Cloud infrastructure, enabling scalable, secure, and AI-powered learning and recruitment solutions across India and global technology hubs.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255, 255, 255, 0.9)", fontSize: "0.9375rem" }}>
                <CheckCircle2 size={18} style={{ color: "#34D399", flexShrink: 0 }} />
                <span>Industry-curated curriculums designed with senior enterprise architects</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255, 255, 255, 0.9)", fontSize: "0.9375rem" }}>
                <CheckCircle2 size={18} style={{ color: "#34D399", flexShrink: 0 }} />
                <span>Executive keynotes, panel discussions &amp; live founder roundtables</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255, 255, 255, 0.9)", fontSize: "0.9375rem" }}>
                <CheckCircle2 size={18} style={{ color: "#34D399", flexShrink: 0 }} />
                <span>100% verified digital verifiable certificates and internship letters</span>
              </div>
            </div>
          </div>

          {/* Right Column: Company Fact Card */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "20px",
            padding: "36px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <NexziByteLogo height={44} theme="dark" showTechTalk={false} />
            </div>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "16px" }}>
              NexziByte Solutions Private Limited
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.9375rem" }}>
              <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "12px" }}>
                <span style={{ color: "rgba(203, 213, 225, 0.65)", display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Industry</span>
                <span style={{ color: "#FFFFFF", fontWeight: 600 }}>IT Services &amp; IT Consulting &bull; AI Platforms</span>
              </div>

              <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "12px" }}>
                <span style={{ color: "rgba(203, 213, 225, 0.65)", display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Headquarters &amp; Registered Office</span>
                <span style={{ color: "#FFFFFF", fontWeight: 600 }}>
                  H. No. 19-125/A, Kodandaram Nagar, Saroornagar, K.V. Rangareddy, Hyderabad, Telangana 500060, India
                </span>
              </div>

              <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "12px" }}>
                <span style={{ color: "rgba(203, 213, 225, 0.65)", display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Official Contacts</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "2px" }}>
                  <span style={{ color: "#38BDF8", fontWeight: 600 }}>Website: www.nexzibyte.com</span>
                  <span style={{ color: "#FF8866", fontWeight: 600 }}>Email: connect@nexzibyte.com</span>
                </div>
              </div>

              <div>
                <span style={{ color: "rgba(203, 213, 225, 0.65)", display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Leadership &amp; Directors</span>
                <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Durga Prasad Nagunoori &bull; Narasaiah Nagunoori</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FOUR PILLARS OF TECHTALK ── */}
      <section style={{
        background: "rgba(255, 255, 255, 0.02)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "80px 24px"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.3rem", fontWeight: 900, color: "#FFFFFF", marginTop: "12px" }}>
              How We Create Impact Across the Tech Spectrum
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px"
          }}>
            {/* Pillar 1 */}
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              padding: "30px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(124, 58, 237, 0.2)", color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>AI &amp; Python Excellence</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.6 }}>
                Deep-dive training programs in Generative AI, Large Language Models, PyTorch, FastAPI microservices, and high-performance backend architecture.
              </p>
            </div>

            {/* Pillar 2 */}
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              padding: "30px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255, 136, 102, 0.2)", color: "#FF8866", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Tech Summits &amp; Stages</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.6 }}>
                Flagship technology conferences bringing together enterprise architects, AI researchers, and engineers for cutting-edge technical insights.
              </p>
            </div>

            {/* Pillar 3 */}
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              padding: "30px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.2)", color: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Founder &amp; Venture Circles</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.6 }}>
                Confidential, high-signal founder meetups focused on product execution, unit economics, co-founder pairing, and angel syndicate introductions.
              </p>
            </div>

            {/* Pillar 4 */}
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              padding: "30px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
            }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.2)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>23+ Internship Tracks</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.6 }}>
                Structured hands-on internships across AI, Cyber Security, Cloud, Full-Stack, Creative Media, and DevOps with real project capstones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CALL TO ACTION ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{
          maxWidth: "880px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: "24px",
          padding: "50px 30px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)"
        }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "16px" }}>
            Ready to shape the future with NexziByte TechTalk?
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(226, 232, 240, 0.85)", maxWidth: "600px", margin: "0 auto 30px auto" }}>
            Get your event pass, connect with verified peers, or join one of our 17+ industry upskilling tracks today.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => openPassModal("visitor-pass")}
            >
              <Ticket size={16} />
              <span>Claim Free Visitor Pass</span>
            </button>

            <Link
              to="/contact"
              className="btn btn-secondary btn-lg"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#FFFFFF",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
            >
              <span>Contact Us</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="https://www.nexzibyte.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              style={{
                background: "rgba(56, 189, 248, 0.12)",
                color: "#38BDF8",
                borderColor: "rgba(56, 189, 248, 0.35)",
                textDecoration: "none"
              }}
            >
              <Globe size={16} />
              <span>Visit nexzibyte.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
