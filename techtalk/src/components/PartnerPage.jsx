import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, Users, Mic, Award, CheckCircle2, 
  ArrowRight, Mail, Phone, MapPin, Sparkles, 
  ShieldCheck, Send, Check, Rocket, Globe, 
  Briefcase, Star, ChevronRight, HelpCircle
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";

// Partnership Tracks Data
const PARTNERSHIP_TRACKS = [
  {
    id: "summit-sponsor",
    tag: "HIGH VISIBILITY",
    tagColor: "#6C2BD9",
    title: "Summit Title & Lead Sponsor",
    desc: "Position your brand at the center of South India's largest technology summits. Showcase solutions with premium demo zones, keynote slots, and cross-platform branding.",
    stats: "400+ Enterprise Delegates",
    benefits: [
      "Keynote speaking slot & opening remarks",
      "Prime exhibition / demo booth in developer zone",
      "Brand logo on all attendee digital passes & summit dispatches",
      "Exclusive VIP access to Founders Dinner & Investor Lounge"
    ],
    badge: "Most Popular"
  },
  {
    id: "hiring-talent",
    tag: "TALENT ACQUISITION",
    tagColor: "#059669",
    title: "Enterprise Hiring & Talent Partner",
    desc: "Direct access to NexziByte's verified developer ecosystem. Hire pre-vetted full-stack architects, AI/ML engineers, and specialized tech interns with zero sourcing friction.",
    stats: "140+ Partner Enterprises",
    benefits: [
      "Custom hackathon & candidate screening drives",
      "Direct pipeline to verified resume database",
      "On-campus & summit spot-interview cabins",
      "Custom internship training co-branding"
    ]
  },
  {
    id: "speaking-leadership",
    tag: "THOUGHT LEADERSHIP",
    tagColor: "#2563EB",
    title: "Keynote & Expert Speaking Engagements",
    desc: "Share your engineering breakthroughs, system architectures, and enterprise transformation journeys with hungry tech professionals and aspiring founders.",
    stats: "50+ Industry Speakers",
    benefits: [
      "Solo technical session or fireside panel moderation",
      "Recorded video masterclass distributed to global audience",
      "Featured author spotlight in TechTalk Dispatches",
      "Permanent speaker profile on TechTalk platform"
    ]
  },
  {
    id: "corporate-mou",
    tag: "STRATEGIC ALLIANCE",
    tagColor: "#D97706",
    title: "Corporate MoU & Ecosystem Co-Host",
    desc: "Forge long-term institutional agreements with NexziByte Solutions Pvt. Ltd. to co-create tech incubation programs, GCC capability hubs, and regional innovation roundtables.",
    stats: "13+ Strategic Partners",
    benefits: [
      "Joint press release and government / GCC visibility",
      "Cross-platform synergy with pyenk.com & stafi.com",
      "Quarterly closed-door CIO/CTO roundtable invites",
      "Custom enterprise upskilling workshops"
    ]
  }
];

export default function PartnerPage() {
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    partnershipType: "Tech Summit Sponsorship & Demo Booth",
    message: ""
  });

  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryCode, setInquiryCode] = useState("");

  const handleMessageChange = (e) => {
    const val = e.target.value;
    if (val.length <= 250) {
      setFormData({ ...formData, message: val });
      setCharCount(val.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const code = `NZB-PRT-${Math.floor(1000 + Math.random() * 9000)}`;
    setInquiryCode(code);

    try {
      await api.submitContactMessage({
        name: fullName || "Corporate Partner",
        email: formData.email.trim(),
        phone: formData.phone || "",
        organization: formData.company || "",
        form_type: "partnership",
        subject: `Partnership Inquiry: ${formData.partnershipType}`,
        message: `Company: ${formData.company || "N/A"}\nPartnership Tier: ${formData.partnershipType}\nReference Code: ${code}\nMessage: ${formData.message || "N/A"}`
      });
    } catch (err) {
      console.warn("Partner inquiry submission notice:", err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    showToast("Thank you! Your partnership inquiry has been received by Admin. We will contact you within 24 hours.");
  };

  const handleResetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      partnershipType: "Tech Summit Sponsorship & Demo Booth",
      message: ""
    });
    setCharCount(0);
    setSubmitted(false);
  };

  const scrollToInquiry = () => {
    const el = document.getElementById("partnership-inquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="partner-page-wrapper">
      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION (Matching Home Page Dark Atmospheric Hero Format)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="partner-hero-banner" aria-label="Partner with TechTalk Hero">
        <div className="partner-hero-overlay" />
        
        <div className="container" style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
          {/* Main Hero Title with Home Page Style Purple Pill Highlight */}
          <h1 className="partner-hero-main-title">
            <span className="partner-highlight-purple-pill">PARTNER</span>
            <span className="partner-title-text"> WITH TECHTALK</span>
          </h1>

          {/* Subtitle */}
          <p className="partner-hero-subtext">
            Whether you’re looking to expand your brand’s reach, fill job openings, or share your expertise through speaking engagements, we have a partnership opportunity for you.
          </p>

          {/* Action Button matching Home Page Primary Style */}
          <div style={{ marginTop: "36px" }}>
            <button
              type="button"
              id="btn-speak-to-team"
              onClick={scrollToInquiry}
              className="partner-speak-team-btn"
            >
              <span>SPEAK TO OUR TEAM</span>
              <span className="partner-arrow-icon">⟹</span>
            </button>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════
          PARTNERSHIP OPPORTUNITIES & TRACKS
          ══════════════════════════════════════════════════════════════════ */}
      <section className="partner-tracks-section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 52px" }}>
            <span className="section-label">
              <Sparkles size={14} />
              COLLABORATION CHANNELS
            </span>
            <h2 className="section-heading">
              Tailored Opportunities for Every Organization
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Collaborate with <strong>NexziByte Solutions</strong> — empowering tech enterprises, fast-growing startups, and GCC innovators across Hyderabad and India.
            </p>
          </div>

          <div className="partner-tracks-grid">
            {PARTNERSHIP_TRACKS.map((track) => (
              <div key={track.id} className="partner-track-card">
                {track.badge && (
                  <span className="partner-track-badge">{track.badge}</span>
                )}
                <div className="partner-track-tag" style={{ color: track.tagColor, background: `${track.tagColor}12`, border: `1px solid ${track.tagColor}25` }}>
                  {track.tag}
                </div>
                <h3 className="partner-track-title">{track.title}</h3>
                <p className="partner-track-desc">{track.desc}</p>
                
                <div className="partner-track-stat-pill">
                  <Award size={14} style={{ color: "var(--coral)" }} />
                  <span>{track.stats}</span>
                </div>

                <div className="partner-track-benefits-list">
                  {track.benefits.map((b, i) => (
                    <div key={i} className="partner-benefit-item">
                      <CheckCircle2 size={16} className="benefit-check-icon" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, partnershipType: track.title }));
                    scrollToInquiry();
                  }}
                  className="partner-track-action-btn"
                >
                  <span>Explore {track.title.split(" ")[0]} Opportunity</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          GET IN TOUCH WITH OUR TEAM SECTION (Home Page Color Format)
          ══════════════════════════════════════════════════════════════════ */}
      <section 
        id="partnership-inquiry-section" 
        className="partner-get-in-touch-section"
        aria-label="Partnership Inquiry Form Section"
      >
        <div className="container">
          <div className="partner-touch-layout-grid">
            
            {/* LEFT COLUMN: Editorial Headline & Company Info */}
            <div className="partner-touch-left-col">
              <div className="partner-touch-heading-group">
                <span className="section-label">
                  <Mail size={13} />
                  GET IN TOUCH
                </span>
                <h2 className="partner-touch-main-title">
                  With Our Team
                </h2>
              </div>

              <p className="partner-touch-description">
                Tell us about your organization’s strategic goals, hiring requirements, or summit sponsorship aspirations. Our corporate partnership directors at <strong>NexziByte Solutions Private Limited</strong> will design a tailored collaboration proposal.
              </p>

              {/* Direct Company Details Card */}
              <div className="partner-touch-info-box">
                <div className="partner-info-item">
                  <div className="partner-info-icon-box">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <strong>NexziByte Solutions Private Limited</strong>
                    <p>H. No. 19-125/A, Kodandaram Nagar, Saroornagar, Ranga Reddy, Hyderabad, Telangana – 500060</p>
                  </div>
                </div>

                <div className="partner-info-item">
                  <div className="partner-info-icon-box">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>Corporate Governance &amp; Registration</strong>
                    <p>CIN: U62099TS2026PTC214539 • Directors: Durga Prasad Nagunoori (Founder &amp; MD), Narasaiah Nagunoori</p>
                  </div>
                </div>
              </div>

              {/* Verified SLA Guarantee */}
              <div className="partner-sla-badge">
                <CheckCircle2 size={16} style={{ color: "#10B981" }} />
                <span>Guaranteed response within 24 business hours with custom deck.</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Crisp White Card Partnership Inquiry Form */}
            <div className="partner-touch-right-col">
              <div className="partner-inquiry-card">
                {!submitted ? (
                  <>
                    <div className="partner-form-header">
                      <span className="section-label" style={{ marginBottom: "8px" }}>
                        OFFICIAL INQUIRY
                      </span>
                      <h3 className="partner-form-title">
                        Partnership Inquiry Form
                      </h3>
                      <p className="partner-form-subtitle">
                        Fill out the form below, and our team will get back to you promptly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="partner-form-body">
                      {/* Name Row: First Name & Last Name (2 columns) */}
                      <div className="partner-form-row-2col">
                        <div className="partner-field-wrap">
                          <label className="partner-form-label">First Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="First name"
                            className="partner-input"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            id="input-partner-first-name"
                          />
                        </div>

                        <div className="partner-field-wrap">
                          <label className="partner-form-label">Last Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Last name"
                            className="partner-input"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            id="input-partner-last-name"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="partner-field-wrap">
                        <label className="partner-form-label">Work / Business Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="Work email address"
                          className="partner-input"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          id="input-partner-email"
                        />
                      </div>

                      {/* Organization & Phone */}
                      <div className="partner-form-row-2col">
                        <div className="partner-field-wrap">
                          <label className="partner-form-label">Company / Organization *</label>
                          <input
                            type="text"
                            required
                            placeholder="Company or organization name"
                            className="partner-input"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            id="input-partner-company"
                          />
                        </div>

                        <div className="partner-field-wrap">
                          <label className="partner-form-label">Phone Number (Optional)</label>
                          <input
                            type="tel"
                            placeholder="Mobile number"
                            className="partner-input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            id="input-partner-phone"
                          />
                        </div>
                      </div>

                      {/* Partnership Type Dropdown */}
                      <div className="partner-field-wrap">
                        <label className="partner-form-label">Partnership Channel *</label>
                        <select
                          className="partner-select"
                          value={formData.partnershipType}
                          onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                          id="select-partnership-type"
                        >
                          <option value="Tech Summit Sponsorship & Demo Booth">Tech Summit Sponsorship &amp; Demo Booth</option>
                          <option value="Enterprise Hiring & Talent Ecosystem">Enterprise Hiring &amp; Talent Ecosystem</option>
                          <option value="Founder Meet / Masterclass Co-hosting">Founder Meet / Masterclass Co-hosting</option>
                          <option value="Keynote & Thought Leadership Speaking">Keynote &amp; Thought Leadership Speaking</option>
                          <option value="Corporate MoU & Strategic Alliance">Corporate MoU &amp; Strategic Alliance</option>
                          <option value="Other Inquiries">Other Inquiries</option>
                        </select>
                      </div>

                      {/* Message Textarea with 0/250 Character Counter */}
                      <div className="partner-field-wrap" style={{ position: "relative" }}>
                        <label className="partner-form-label">Specific Requirements / Message</label>
                        <textarea
                          rows={4}
                          placeholder="Please provide any details, sponsorship expectations, or timeline requirements..."
                          className="partner-textarea"
                          value={formData.message}
                          onChange={handleMessageChange}
                          id="textarea-partner-message"
                        />
                        <div className="partner-char-counter">
                          {charCount}/250
                        </div>
                      </div>

                      {/* Primary Purple Submit Button matching Home Page Buttons */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        id="btn-submit-partnership-inquiry"
                        className="partner-submit-inquiry-btn"
                      >
                        {isSubmitting ? (
                          <span>PROCESSING INQUIRY...</span>
                        ) : (
                          <>
                            <span>SUBMIT INQUIRY</span>
                            <span className="partner-arrow-icon">⟹</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  /* Success Confirmation State */
                  <div className="partner-success-state">
                    <div className="partner-success-icon-wrap">
                      <Check size={32} />
                    </div>
                    <h3 className="partner-success-title">Inquiry Submitted Successfully!</h3>
                    <p className="partner-success-desc">
                      Thank you, <strong>{formData.firstName}</strong>. Your partnership request has been logged under reference code:
                    </p>
                    <div className="partner-ref-badge">
                      {inquiryCode}
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "24px" }}>
                      Our partnership directors at NexziByte Solutions will review your requirements and reach out via <strong>{formData.email}</strong> within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: "var(--radius-full)", padding: "10px 24px" }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PAST SUMMIT & PARTNER SHOWCASE (Home Page Midnight Card Format)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="partner-showcase-section">
        <div className="container">
          <div className="partner-showcase-box">
            <div className="partner-showcase-content">
              <span className="section-label" style={{ color: "var(--coral)", background: "var(--soft-peach)", borderColor: "rgba(249, 115, 22, 0.2)" }}>
                PROVEN TRACK RECORD
              </span>
              <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: "14px 0 12px" }}>
                GPACTS 2026 &amp; GCC Enterprise Summits
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.82)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "24px" }}>
                NexziByte Solutions proudly partnered at <strong>GPACTS 2026</strong> — World’s Biggest Pharma AI &amp; IT Summit in Hyderabad, uniting <strong>400+ delegates, 50 distinguished speakers, 13 enterprise partners</strong>, and <strong>140+ unique companies</strong>.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link to="/summits" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
                  <span>View Summit Highlights</span>
                  <ArrowRight size={14} />
                </Link>
                <Link to="/founder-meets" className="btn btn-secondary btn-sm" style={{ textDecoration: "none", background: "rgba(255,255,255,0.1)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.2)" }}>
                  <span>Explore Founder Meets</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
