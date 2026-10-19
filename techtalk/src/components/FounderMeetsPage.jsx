import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Rocket, Users, Shield, TrendingUp, Building2, Calendar, 
  MapPin, Clock, ArrowRight, CheckCircle2, ChevronRight, 
  Ticket, Coffee, Award, Lock, Star, MessageSquare
} from "lucide-react";
import { 
  FOUNDER_MEETS_LIST 
} from "../data/founderMeetsData.js";
import { useApp } from "../context/AppContext.jsx";

export default function FounderMeetsPage() {
  const navigate = useNavigate();
  const { openPassModal, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState("all"); // "all", "upcoming", "past"

  // Filtered Meets
  const filteredMeets = useMemo(() => {
    if (activeFilter === "all") return FOUNDER_MEETS_LIST;
    return FOUNDER_MEETS_LIST.filter((m) => m.status === activeFilter);
  }, [activeFilter]);

  const upcomingCount = FOUNDER_MEETS_LIST.filter(m => m.status === "upcoming").length;
  const pastCount = FOUNDER_MEETS_LIST.filter(m => m.status === "past").length;

  return (
    <div className="founder-meets-page-luxury">
      {/* ── 1. EXECUTIVE HERO BANNER ── */}
      <section className="founder-page-hero">
        {/* Background Founder Meets Lounge Image with Clean Neutral Overlay */}
        <div className="founder-hero-bg-wrap" aria-hidden="true">
          <img 
            src="/images/founder-meets-hero-bg.jpg" 
            alt="NexziByte Founder Meets & Executive Lounge" 
            className="founder-hero-bg-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="founder-hero-overlay" />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="founder-hero-header-wrap">
            <div className="founder-hero-badge-pill">
              <Users size={14} />
              <span>VENTURE SESSIONS &amp; FOUNDER CIRCLES</span>
            </div>

            <h1 className="founder-page-title">
              Founder Meets
            </h1>

            <p className="founder-page-subtitle">
              Closed-door founder roundtables, venture networking circles, and executive peer dialogues connecting visionary builders with high-signal capital and enterprise partners.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. FOUNDER MEETS DIRECTORY (UPCOMING & PAST) ── */}
      <section className="section-padding founder-meets-directory-section" id="meets-directory">
        <div className="container">
          {/* Section Header with Tabs - Center Aligned */}
          <div className="directory-header-row" style={{ textAlign: "center", margin: "0 auto 36px auto", maxWidth: "780px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ textAlign: "center", width: "100%" }}>
              <span className="section-label coral" style={{ margin: "0 auto 12px auto", display: "inline-flex" }}>
                <Calendar size={13} />
                VENTURE SESSIONS
              </span>
              <h2 className="section-heading" style={{ textAlign: "center", margin: "0 auto 12px auto" }}>
                Founder Meets Schedule
              </h2>
              <p className="section-subtitle" style={{ textAlign: "center", margin: "0 auto 16px auto" }}>
                Browse upcoming closed-door roundtables and recaps from past investor mixers.
              </p>
            </div>

            {/* Filter Tabs / Landmark Badge */}
            {pastCount > 0 ? (
              <div className="meets-filter-tabs" style={{ justifyContent: "center", margin: "8px auto 0 auto" }}>
                <button
                  type="button"
                  className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All Meets ({FOUNDER_MEETS_LIST.length})
                </button>
                <button
                  type="button"
                  className={`filter-tab-btn ${activeFilter === "upcoming" ? "active" : ""}`}
                  onClick={() => setActiveFilter("upcoming")}
                >
                  Upcoming Meets ({upcomingCount})
                </button>
                <button
                  type="button"
                  className={`filter-tab-btn ${activeFilter === "past" ? "active" : ""}`}
                  onClick={() => setActiveFilter("past")}
                >
                  Past Meets ({pastCount})
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "8px" }}>
                <div className="single-meet-status-pill">
                  <span>OFFICIAL LANDMARK FOUNDER MEET</span>
                </div>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="founder-meets-cards-grid">
            {filteredMeets.map((meet) => (
              <div 
                key={meet.id} 
                className={`founder-meet-card single-meet-spotlight ${meet.status === "past" ? "past-meet-card" : ""}`}
              >
                {/* Event Image Banner */}
                <div className="meet-card-img-wrap">
                  <img 
                    src={meet.image} 
                    alt={meet.name} 
                    className="meet-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                {/* Event Information */}
                <div className="meet-card-body">
                  <div className="meet-card-meta-row">
                    <div className="meet-meta-chip">
                      <Calendar size={14} style={{ color: "var(--coral)" }} />
                      <span>{meet.date}</span>
                    </div>
                    <div className="meet-meta-chip">
                      <Clock size={14} style={{ color: "var(--primary-purple)" }} />
                      <span>{meet.time.split("–")[0]}</span>
                    </div>
                  </div>

                  <h3 className="meet-card-title">{meet.name}</h3>

                  {meet.guestOfHonor && (
                    <div className="meet-guest-honor-tag">
                      <Award size={13} style={{ color: "#6C2BD9", flexShrink: 0 }} />
                      <span>{meet.guestOfHonor.honorific?.includes("Dignitary") ? "Chief Dignitary" : "Guest of Honor"}: <strong>{meet.guestOfHonor.name}</strong></span>
                    </div>
                  )}

                  <div className="meet-location-chip">
                    <MapPin size={14} style={{ color: "var(--electric-blue)", flexShrink: 0 }} />
                    <span>{meet.location}</span>
                  </div>

                  <p className="meet-card-desc">{meet.shortDescription}</p>

                  {/* Spots indicator */}
                  {meet.status === "upcoming" && (
                    <div className="meet-spots-indicator">
                      <div className="spots-bar-bg">
                        <div 
                          className="spots-bar-fill" 
                          style={{ width: `${Math.max(20, ((meet.spotsTotal - meet.spotsRemaining) / meet.spotsTotal) * 100)}%` }} 
                        />
                      </div>
                      <div className="spots-text">
                         {meet.spotsRemaining} of {meet.spotsTotal} seats left
                      </div>
                    </div>
                  )}

                  {/* Card Actions / Registration CTA */}
                  <div className="meet-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/founder-meets/${meet.id}`)}
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>

                    {meet.status === "upcoming" ? (
                      <button
                        type="button"
                        className="btn btn-amber btn-sm"
                        onClick={() => openPassModal(meet.registration?.passTypeId || "founder-pass")}
                      >
                        <Ticket size={14} />
                        <span>Get Founder Pass</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/founder-meets/${meet.id}`)}
                      >
                        <span>Read Recap</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOST A CIRCLE / PITCH APPLICATION CTA ── */}
      <section className="section-padding founder-host-cta-section">
        <div className="container">
          <div className="founder-host-cta-card">
            <div className="host-cta-content">
              <span className="section-label coral" style={{ marginBottom: "8px" }}>
                <Rocket size={13} />
                COMMUNITY INITIATIVE
              </span>
              <h2 className="host-cta-heading">
                Building something groundbreaking in AI, SaaS, or Cloud Infrastructure?
              </h2>
              <p className="host-cta-desc">
                Apply to host a closed-door founder roundtable or pitch your startup to NexziByte's angel syndicates and enterprise client network.
              </p>
              <div className="host-cta-features">
                <div className="feature-chip">
                  <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  <span>Vetted founder peer group</span>
                </div>
                <div className="feature-chip">
                  <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  <span>Direct introductions to enterprise decision makers</span>
                </div>
                <div className="feature-chip">
                  <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  <span>No upfront fees or equity requirements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
