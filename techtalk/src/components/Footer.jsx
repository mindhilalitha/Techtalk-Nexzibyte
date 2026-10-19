import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TechLogoSymbol } from "./Navbar.jsx";
import { useApp } from "../context/AppContext.jsx";
import { NexziByteLogo } from "./NexziByteLogo.jsx";
import PolicyModal from "./PolicyModal.jsx";

function LinkedInIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
    </svg>
  );
}

function InstagramIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function GlobeIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

export default function Footer() {
  const { openPassModal, showToast } = useApp();
  const [policyModal, setPolicyModal] = useState(null);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Logo & Tagline Column */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo-link" style={{ display: "inline-block", textDecoration: "none", marginBottom: "8px" }}>
              <NexziByteLogo height={48} theme="dark" showTechTalk={true} showSubtitle={true} />
            </Link>

            <div className="footer-tagline">
              Where Technology Meets Ideas, People &amp; Possibilities.
            </div>

            <p className="footer-about-text">
              TechTalk is an executive innovation &amp; technology community powered by <strong>NexziByte Solutions</strong> — connecting founders, engineers, and digital innovators across India and globally.
            </p>

            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.84rem", color: "rgba(226, 232, 240, 0.78)" }}>
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.55)", marginRight: "6px" }}>Official Website:</span>
                <a 
                  href="https://www.nexzibyte.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 700 }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >
                  www.nexzibyte.com ↗
                </a>
              </div>
              <div>
                <span style={{ color: "rgba(255, 255, 255, 0.55)", marginRight: "6px" }}>Contact Email:</span>
                <a 
                  href="mailto:connect@nexzibyte.com" 
                  style={{ color: "#FF8866", textDecoration: "none", fontWeight: 600 }}
                >
                  connect@nexzibyte.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/events" className="footer-link" style={{ color: "var(--electric-blue)", fontWeight: 600 }}>Events</Link></li>
              <li><Link to="/summits" className="footer-link">Tech Talks</Link></li>
              <li><Link to="/courses" className="footer-link">Courses</Link></li>
              <li><Link to="/courses" className="footer-link">Internships</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li>
                <a 
                  href="https://www.nexzibyte.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer-link" 
                  style={{ color: "#38BDF8", fontWeight: 600 }}
                >
                  Official Website (nexzibyte.com) ↗
                </a>
              </li>
              <li><Link to="/partner" className="footer-link" style={{ color: "#CCFF00", fontWeight: 700 }}>Partner With Us</Link></li>
            </ul>
          </div>

          {/* Column 2: Learn */}
          <div>
            <h4 className="footer-col-title">Courses &amp; Tracks</h4>
            <ul className="footer-links-list">
              <li><Link to="/courses" className="footer-link">All 17 Technology Tracks</Link></li>
              <li><Link to="/explore?category=python-ai" className="footer-link">Python &amp; AI/ML</Link></li>
              <li><Link to="/explore?category=creative-media" className="footer-link">Creative Media (Internships)</Link></li>
              <li><Link to="/explore?category=fullstack" className="footer-link">Full-Stack Web</Link></li>
              <li><Link to="/explore?category=cloud" className="footer-link">Cloud Computing</Link></li>
            </ul>
          </div>

          {/* Column 3: Events */}
          <div>
            <h4 className="footer-col-title">Events Discovery</h4>
            <ul className="footer-links-list">
              <li><Link to="/events" className="footer-link">Upcoming Events</Link></li>
              <li><Link to="/events" className="footer-link">Tech Innovation Summit</Link></li>
              <li><Link to="/founder-meets" className="footer-link">Founder Meets</Link></li>
              <li><Link to="/speakers" className="footer-link">Distinguished Speakers</Link></li>
            </ul>
          </div>

          {/* Column 4: Passes */}
          <div>
            <h4 className="footer-col-title">Passes</h4>
            <ul className="footer-links-list">
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("visitor-pass")}
                >
                  Visitor Pass (Free)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("student-pass")}
                >
                  Student Pass (₹99)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("founder-pass")}
                >
                  Founder Pass (₹499)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("delegation-pass")}
                >
                  Delegation Pass (₹250)
                </button>
              </li>
              <li><a href="/#scanner" className="footer-link">QR Check-in</a></li>
              <li><a href="/#digital-pass" className="footer-link">My Digital Pass</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="footer-bottom-bar">
          <div>
            © NexziByte TechTalk — Where Technology Meets Ideas, People &amp; Possibilities.
          </div>

          <div style={{ display: "flex", gap: "20px", fontSize: "0.8125rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              to="/privacy-policy"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Terms &amp; Conditions
            </Link>

            <Link 
              to="/contact" 
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Contact Us
            </Link>

            <a 
              href="https://www.nexzibyte.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#38BDF8", textDecoration: "none", fontWeight: 600 }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
              title="NexziByte Solutions Official Website"
            >
              nexzibyte.com ↗
            </a>
          </div>

          <div className="footer-social-row">
            <a 
              href="https://www.nexzibyte.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-icon-btn" 
              aria-label="Official Website"
              title="NexziByte Official Website (https://www.nexzibyte.com/)"
              style={{ textDecoration: "none" }}
            >
              <GlobeIcon size={17} />
            </a>
            <a 
              href="https://www.linkedin.com/company/nexzibyte-solutions/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-icon-btn" 
              aria-label="LinkedIn"
              title="NexziByte Solutions on LinkedIn"
              style={{ textDecoration: "none" }}
            >
              <LinkedInIcon size={17} />
            </a>
            <a 
              href="https://www.instagram.com/nexzibyte_solutions_pvt_ltd?xtok=MW16amY4dG5ycDIxNQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-icon-btn" 
              aria-label="Instagram"
              title="NexziByte Solutions on Instagram"
              style={{ textDecoration: "none" }}
            >
              <InstagramIcon size={17} />
            </a>
          </div>
        </div>
      </div>

      {/* Global Interactive Policy Modal */}
      <PolicyModal
        isOpen={Boolean(policyModal)}
        initialTab={policyModal || "terms"}
        onClose={() => setPolicyModal(null)}
      />
    </footer>
  );
}
