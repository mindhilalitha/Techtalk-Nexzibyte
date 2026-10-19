import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, ArrowRight, Clock, Users, 
  Tag, ExternalLink, Filter, BookOpen, Search, X, Ticket, ChevronRight
} from "lucide-react";
import { UPCOMING_EVENTS } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

const CATEGORY_TABS = [
  { id: "all", label: "All Summits & Meets", count: UPCOMING_EVENTS.length },
  { id: "summits", label: "Global Summits", count: UPCOMING_EVENTS.filter(e => e.category === "summits").length },
  { id: "launches", label: "Product Launches", count: UPCOMING_EVENTS.filter(e => e.category === "launches").length },
  { id: "roundtables", label: "Executive Meets", count: UPCOMING_EVENTS.filter(e => e.category === "roundtables").length },
  { id: "partnerships", label: "Strategic MoUs", count: UPCOMING_EVENTS.filter(e => e.category === "partnerships").length },
];

export default function SummitsPage() {
  const navigate = useNavigate();
  const { openPassModal, openSummitModal, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredEvents = useMemo(() => {
    return UPCOMING_EVENTS.filter((ev) => {
      // Category filter
      const matchesCategory = activeFilter === "all" || ev.category === activeFilter;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        ev.title?.toLowerCase().includes(q) ||
        ev.type?.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q) ||
        ev.venue?.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q) ||
        (ev.hashtags && ev.hashtags.some(tag => tag.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="summits-page-luxury">
      {/* ── 1. SUMMITS HERO BANNER ── */}
      <section className="summits-banner-section">
        {/* Background Summit Conference Image with Clean Minimal Overlay */}
        <div className="summits-banner-bg-wrap" aria-hidden="true">
          <img 
            src="/images/summit-hero-bg.jpg" 
            alt="NexziByte Grand Tech Summit & Executive Conference" 
            className="summits-banner-bg-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="summits-banner-overlay" />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="events-banner-content">
            <div className="events-page-badge">
              <span>SUMMITS, MEETS &amp; MILESTONES</span>
            </div>

            <h1 className="events-page-main-heading">
              NexziByte Summits &amp; Executive Meets
            </h1>

            <p className="events-page-main-subheading">
              Explore our landmark product unveilings, global capability summits, leadership roundtables, and strategic business collaborations.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. SUMMITS SEARCH & FILTER SECTION (MATCHING EVENTS SEARCH & FILTER CARD) ── */}
      <section className="events-search-filter-section" id="summits-browser">
        <div className="container">
          <div className="events-search-filter-card">
            {/* Search Input Bar */}
            <div className="events-search-bar-wrap">
              <div className="events-search-input-box">
                <Search size={20} className="events-search-icon" />
                <input
                  type="text"
                  className="events-search-input"
                  placeholder="Search summits by title, venue, executive dignitaries, hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="events-search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills & Counter */}
            <div className="events-category-filters-row" style={{ marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div className="events-filter-pills-wrap">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`events-filter-pill-btn ${activeFilter === tab.id ? "active" : ""}`}
                    onClick={() => setActiveFilter(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className="events-filter-pill-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* Active Count Badge */}
              <div className="events-count-pill" style={{ margin: 0, padding: "6px 14px" }}>
                <span className="events-count-number">{filteredEvents.length}</span>
                <span>Summits Listed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SUMMITS CONTENT GRID SECTION ── */}
      <section className="summits-content-section" id="summits-page-main" style={{ paddingTop: "24px" }}>
        <div className="container">

          {/* Summits & Events Grid */}
          <div className="upcoming-events-grid" style={{ marginTop: "32px" }}>
            {filteredEvents.map((ev) => (
              <div 
                key={ev.id} 
                className="event-card summit-card-enhanced"
                onClick={() => openSummitModal(ev)}
                tabIndex={0}
                role="button"
                aria-label={`View announcement for ${ev.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openSummitModal(ev);
                  }
                }}
              >
                {/* Card Image Banner */}
                <div className="event-card-image-wrap">
                  <img 
                    src={ev.image} 
                    alt={ev.title} 
                    className="event-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/renewable-energy.jpg";
                    }}
                  />
                  <span className="event-type-tag">{ev.type}</span>
                  {ev.number && (
                    <span className="event-index-tag">#{ev.number}</span>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="event-card-body">
                  <div className="event-meta-header">
                    <div className="event-date-row">
                      <Calendar size={14} />
                      <span>{ev.date}</span>
                    </div>
                    {ev.spotsLeft && (
                      <span className="event-status-pill">
                        {ev.spotsLeft} Open
                      </span>
                    )}
                  </div>

                  <h3 className="event-card-heading">{ev.title}</h3>

                  <div className="event-location-row">
                    <MapPin size={14} style={{ color: "var(--coral)", flexShrink: 0 }} />
                    <span>{ev.venue || ev.location}</span>
                  </div>

                  {ev.dignitaries && (
                    <div className="event-dignitary-badge">
                      <Users size={14} className="dignitary-icon" style={{ flexShrink: 0 }} />
                      <span>{ev.dignitaries}</span>
                    </div>
                  )}

                  <p className="event-card-text">{ev.description}</p>

                  {/* Hashtags Preview */}
                  {ev.hashtags && ev.hashtags.length > 0 && (
                    <div className="event-hashtags-preview">
                      {ev.hashtags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="event-mini-tag">
                          {tag}
                        </span>
                      ))}
                      {ev.hashtags.length > 3 && (
                        <span className="event-mini-tag-more">
                          +{ev.hashtags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="event-card-footer">
                    <button
                      type="button"
                      className="view-event-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSummitModal(ev);
                      }}
                    >
                      <span>Read Full Announcement</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      type="button"
                      className="event-secondary-link-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSummitModal(ev);
                      }}
                      title="View full summit agenda and delegate passes"
                    >
                      <span>Agenda &amp; Passes</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty Filter State */}
          {filteredEvents.length === 0 && (
            <div className="events-empty-state">
              <BookOpen size={40} style={{ opacity: 0.4, marginBottom: "12px" }} />
              <h3>No summits found matching your criteria</h3>
              <p>Try clearing your search query or switching category filters.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "16px" }}
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. ATTENDANCE & PASSES BANNER ── */}
      <section className="summits-bottom-cta-section">
        <div className="container">
          <div className="summits-cta-banner-card">
            <div className="cta-banner-content">
              <span className="section-label" style={{ marginBottom: "10px" }}>
                <Ticket size={13} />
                DELEGATE &amp; VISITOR REGISTRATION
              </span>
              <h2 className="cta-banner-title">
                Planning to Attend a NexziByte Summit?
              </h2>
              <p className="cta-banner-desc">
                Gain verified digital passes for our physical conferences, access closed-door leadership roundtables, and network with enterprise architects and startup founders.
              </p>
            </div>

            <div className="cta-banner-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => openPassModal("delegate-pass")}
              >
                <span>Reserve Summit Pass</span>
                <ArrowRight size={16} />
              </button>
              <Link to="/passes" className="btn btn-secondary btn-lg">
                <span>View All Pass Types</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
