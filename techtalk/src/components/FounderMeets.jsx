import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Layers, Users, Zap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const SHOWCASE_EVENTS = [
  {
    id: "founder-roundtable-circle",
    title: "NexziByte Founder Meets & Executive Roundtable",
    category: "Business Networking",
    tag: "Founder Circle",
    image: "/images/founder-meets-hero-bg.jpg",
    subtitle: "Closed-Door Leadership Dialogue & Venture Networking"
  },
  {
    id: "vertofi-partnership",
    title: "Vertofi × NexziByte Technology Partnership",
    category: "Technology",
    tag: "FinTech Alliance",
    image: "/images/event-vertofi-partnership.jpg",
    subtitle: "Building the Financial Operating System & AI Infrastructure"
  },
  {
    id: "ktr-launch",
    title: "NexziByte Product Launch with Sri K. T. Rama Rao (KTR)",
    category: "Technology",
    tag: "Platform Launch",
    image: "/images/ktr-nexzibyte-launch.jpg",
    subtitle: "Dignitary Meet & Official Platform Launch"
  },
  {
    id: "namrata-shirodkar",
    title: "VIP Leadership Meet with Namrata Shirodkar",
    category: "Industry Leaders",
    tag: "VIP Leadership",
    image: "/images/event-namrata-shirodkar.jpg",
    subtitle: "Cultural & Enterprise Leadership Dialogue"
  },
  {
    id: "synergy-group",
    title: "Synergy Group Solar Infrastructure Alliance",
    category: "Collaboration",
    tag: "Enterprise MoU",
    image: "/images/event-synergy-group.jpg",
    subtitle: "Clean Tech & Infrastructure Partnership"
  },
  {
    id: "atirath-holdings",
    title: "Atirath Holdings Green Energy MoU",
    category: "Innovation",
    tag: "Strategic Alliance",
    image: "/images/event-atirath-holdings.jpg",
    subtitle: "Powering Sustainable Technology Ecosystems"
  },
  {
    id: "landora-projects",
    title: "Landora Projects & Developers Strategic Alliance",
    category: "Business Networking",
    tag: "Commercial Partnership",
    image: "/images/event-landora-projects.jpg",
    subtitle: "Landmark Urban Tech & Development"
  },
  {
    id: "global-partners",
    title: "International Technology Leadership Exchange",
    category: "Technology",
    tag: "Global Network",
    image: "/images/event-global-partners.png",
    subtitle: "Cross-Border Architectural Synergy"
  },
  {
    id: "delegates-networking",
    title: "TechTalk Summit & Executive Delegate Networking",
    category: "Business Networking",
    tag: "Executive Summit",
    image: "/images/event-delegates-networking.jpg",
    subtitle: "Founders, Architects & Innovators"
  }
];

const FILTER_KEYWORDS = [
  "Industry Leaders",
  "Business Networking",
  "Collaboration",
  "Innovation",
  "Technology"
];

export default function FounderMeets() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const autoPlayRef = useRef(null);

  const total = SHOWCASE_EVENTS.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx) => {
    setActiveIndex(idx);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4200);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, total]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Keyboard arrow controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section 
      className="founder-showcase-section" 
      id="founder-meets"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container-wide" style={{ position: "relative", zIndex: 2 }}>
        {/* Simplified Header with requested keywords only */}
        <div className="showcase-header">
          <div className="showcase-badge-chip">
            <Users size={13} />
            <span>FOUNDER MEETS &amp; VENTURE CIRCLES</span>
          </div>

          <h2 className="showcase-main-title">
            Industry Leaders · Business Networking · Collaboration · Innovation · Technology
          </h2>

          {/* Minimal Tag Pills */}
          <div className="showcase-tags-strip">
            <button 
              type="button" 
              className={`showcase-tag-pill ${selectedTag === "All" ? "active" : ""}`}
              onClick={() => setSelectedTag("All")}
            >
              All Moments
            </button>
            {FILTER_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                className={`showcase-tag-pill ${selectedTag === kw ? "active" : ""}`}
                onClick={() => {
                  setSelectedTag(kw);
                  const foundIdx = SHOWCASE_EVENTS.findIndex(e => e.category.toLowerCase().includes(kw.toLowerCase()));
                  if (foundIdx !== -1) setActiveIndex(foundIdx);
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* ─── 3D COVERFLOW FILMSTRIP CAROUSEL ─── */}
        <div className="coverflow-stage-wrapper">
          <button 
            type="button" 
            className="coverflow-nav-btn prev"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="coverflow-track">
            {SHOWCASE_EVENTS.map((item, index) => {
              // Calculate relative offset from active index in a circular loop
              let offset = index - activeIndex;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              const isCenter = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={item.id}
                  className={`coverflow-card-item ${isCenter ? "active-center" : "inactive-side"} offset-${offset}`}
                  style={{
                    "--offset": offset,
                    zIndex: 20 - Math.abs(offset)
                  }}
                  onClick={() => goToSlide(index)}
                  title={`Click to view: ${item.title}`}
                >
                  <div className="coverflow-card-frame">
                    {/* The Image (Color when center, Grayscale when on sides) */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="coverflow-card-img"
                      loading="lazy"
                    />

                    {/* Glossy Sheen Overlay */}
                    <div className="coverflow-sheen-overlay" />

                    {/* Card Overlay Meta (Only active on center or hover) */}
                    <div className="coverflow-card-overlay">
                      <div className="coverflow-category-badge">
                        <span>{item.category}</span>
                      </div>
                      <h4 className="coverflow-card-title">{item.title}</h4>
                      <p className="coverflow-card-subtitle">{item.subtitle}</p>
                    </div>

                    {/* Active Spotlight Glow Border */}
                    {isCenter && <div className="coverflow-active-glow" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            type="button" 
            className="coverflow-nav-btn next"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* ─── DOT PAGINATION ─── */}
        <div className="showcase-bottom-controls">
          <div className="showcase-dots">
            {SHOWCASE_EVENTS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`showcase-dot ${idx === activeIndex ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
