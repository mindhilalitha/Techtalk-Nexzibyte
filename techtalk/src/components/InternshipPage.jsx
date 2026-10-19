import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, X, RotateCcw, Clock, MapPin, DollarSign, 
  ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, GraduationCap, CheckCircle2, 
  Award, Users, Rocket, Layers, ShieldCheck
} from "lucide-react";
import { 
  INTERNSHIPS, 
  INTERNSHIP_CATEGORIES, 
  INTERNSHIP_HIGHLIGHTS, 
  INTERNSHIP_STEPS
} from "../data/internshipsData.js";
import { useApp } from "../context/AppContext.jsx";

export default function InternshipPage() {
  const { openInternshipModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Filter internships based on category & search query
  const filteredInternships = useMemo(() => {
    return INTERNSHIPS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryGroup === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.shortDesc?.toLowerCase().includes(q);
      const matchSkills = item.skills?.some(s => s.toLowerCase().includes(q));

      return matchTitle || matchCat || matchDesc || matchSkills;
    });
  }, [selectedCategory, searchQuery]);

  // Dynamic counts for category tabs
  const categoryCounts = useMemo(() => {
    const counts = { all: INTERNSHIPS.length };
    INTERNSHIPS.forEach((item) => {
      if (item.categoryGroup) {
        counts[item.categoryGroup] = (counts[item.categoryGroup] || 0) + 1;
      }
    });
    return counts;
  }, []);

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [selectedCategory, searchQuery]);

  // Scroll sync handler
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.offsetWidth || 380;
    const gap = 24;
    const itemFullWidth = cardWidth + gap;
    const newIndex = Math.round(scrollLeft / itemFullWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredInternships.length) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollToSlide = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const clampedIndex = Math.max(0, Math.min(index, filteredInternships.length - 1));
    const cardWidth = container.firstElementChild?.offsetWidth || 380;
    const gap = 24;
    const scrollTarget = clampedIndex * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollTarget,
      behavior: "smooth"
    });
    setCurrentIndex(clampedIndex);
  };

  const handlePrev = () => {
    scrollToSlide(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToSlide(currentIndex + 1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const totalCards = filteredInternships.length;

  return (
    <div className="inner-page-wrapper internship-page-container">
      {/* 1. Page Hero Banner */}
      <div className="page-hero-banner internship-hero-banner">
        <div className="container">
          <div className="page-hero-badge">
            <span>ENTERPRISE INTERNSHIPS &amp; CAREER TRACKS</span>
          </div>

          <h1 className="page-hero-title" style={{ marginBottom: 0 }}>
            Specialized Industry Internship Tracks &amp; Live Projects
          </h1>
        </div>
      </div>

      {/* 2. Main Internship Discovery Section */}
      <section className="courses-showcase-section" id="internship-catalog" style={{ background: "transparent", padding: "60px 0" }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
            <div style={{ maxWidth: "780px" }}>
              <span className="section-label">
                ACTIVE HIRING COHORTS (HYDERABAD &amp; REMOTE)
              </span>
              <h2 className="section-heading" style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)" }}>
                Explore Open Internship Positions
              </h2>
              <p className="section-subtitle">
                Select your domain of interest to discover active openings, curriculum requirements, and application deadlines.
              </p>
            </div>

            <div className="courses-recruitment-callout">
              <div className="pulse-dot-green"></div>
              <div>
                <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--text-main)" }}>
                  2024 - 2027 Batches Eligible
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Fast-Track 48-Hour Technical Screening
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="courses-filter-controls">
            <div className="courses-filter-top-row">
              <div className="courses-search-bar">
                <Search size={16} className="courses-search-icon" />
                <input
                  type="text"
                  placeholder="Search by role, skills or tools (e.g. Python, AI, React, HR, DevOps, Data Science)..."
                  className="courses-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="courses-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="courses-count-badge">
                Showing {filteredInternships.length} of {INTERNSHIPS.length} Tracks
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="courses-category-pills" role="tablist">
              {INTERNSHIP_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`course-filter-pill-btn ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <span>{cat.label}</span>
                    <span className="course-filter-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Internships Horizontal Carousel */}
          {filteredInternships.length > 0 ? (
            <div className="courses-carousel-wrapper">
              <div 
                className="courses-carousel-track" 
                ref={scrollContainerRef}
                onScroll={handleScroll}
              >
                {filteredInternships.map((item) => (
                  <div 
                    key={item.id} 
                    className="course-carousel-card"
                    onClick={() => openInternshipModal(item, "overview")}
                    style={{ cursor: "pointer" }}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openInternshipModal(item, "overview");
                      }
                    }}
                  >
                    {/* Image Banner */}
                    <div className="course-carousel-img-wrap">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="course-carousel-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/ai-course.jpg";
                        }}
                      />
                    </div>

                    {/* Card Body */}
                    <div className="course-carousel-body">
                      {/* Badge / Category */}
                      <div className="course-carousel-tag-wrap">
                        <span className="course-carousel-badge">
                          {item.category || "INTERNSHIP"}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="course-carousel-title" title={item.title}>
                        {item.title}
                      </h3>

                      <p className="course-carousel-desc">
                        {item.shortDesc}
                      </p>

                      {/* Action Button */}
                      <div className="course-carousel-footer">
                        <button
                          type="button"
                          className="course-read-more-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openInternshipModal(item, "overview");
                          }}
                        >
                          <span>Read More</span>
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Carousel Controls (← [index / total] →) */}
              {totalCards > 1 && (
                <div className="courses-carousel-nav-bar">
                  <button
                    type="button"
                    className="carousel-nav-arrow-btn"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Previous Internship"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="carousel-nav-counter">
                    <span className="carousel-nav-current">{currentIndex + 1}</span>
                    <span className="carousel-nav-sep">/</span>
                    <span className="carousel-nav-total">{totalCards}</span>
                  </div>

                  <button
                    type="button"
                    className="carousel-nav-arrow-btn"
                    onClick={handleNext}
                    disabled={currentIndex >= totalCards - 1}
                    aria-label="Next Internship"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="courses-empty-state">
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--soft-lavender)",
                color: "var(--primary-purple)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <Search size={26} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                No Internship Track Found
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                We couldn't find any internships matching "{searchQuery}" in this category. Try adjusting your search query or view all available tracks.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Program Value Pillars & Benefits */}
      <section className="section-padding" style={{ background: "transparent", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 50px" }}>
            <span className="section-label">
              WHY INTERN AT NEXZIBYTE
            </span>
            <h2 className="section-heading">
              More Than An Internship. A Real Career Launchpad.
            </h2>
            <p className="section-subtitle">
              We reject trivial tasks and busywork. You will build and deploy mission-critical features with active engineering feedback from industry veterans.
            </p>
          </div>

          <div className="internship-benefits-grid">
            {INTERNSHIP_HIGHLIGHTS.map((item) => (
              <div key={item.number} className="internship-benefit-card">
                <span className="internship-benefit-number">{item.number}</span>
                <h3 className="internship-benefit-title">{item.title}</h3>
                <p className="internship-benefit-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Four-Step Application Roadmap */}
      <section className="section-padding" style={{ background: "transparent", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 50px" }}>
            <span className="section-label">
              SIMPLE, TRANSPARENT PROCESS
            </span>
            <h2 className="section-heading">
              How The Hiring Journey Works
            </h2>
            <p className="section-subtitle">
              Our 4-step selection journey moves fast — from initial application to offer letter in as few as 5 business days.
            </p>
          </div>

          <div className="internship-steps-grid">
            {INTERNSHIP_STEPS.map((step) => (
              <div key={step.step} className="internship-step-card">
                <div className="internship-step-badge">Step {step.step}</div>
                <h3 className="internship-step-title">{step.title}</h3>
                <p className="internship-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom Final CTA */}
      <section className="internship-bottom-cta">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="page-hero-badge" style={{ margin: "0 auto 16px" }}>
            <span>APPLICATIONS OPEN FOR UPCOMING BATCH</span>
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.8vw, 3rem)", fontWeight: 850, color: "#FFFFFF", marginBottom: "16px" }}>
            Ready to Build Your Tech Career?
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "640px", margin: "0 auto 30px", lineHeight: 1.6 }}>
            Join hundreds of ambitious students and graduates currently gaining real production experience across our 23 engineering and business cohorts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a 
              href="#internship-catalog" 
              className="btn btn-primary"
              style={{ background: "#FFFFFF", color: "#0F172A", fontWeight: 800 }}
            >
              <span>Explore All 23 Tracks</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
