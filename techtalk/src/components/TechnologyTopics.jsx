import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, ArrowUpRight, Search, X, RotateCcw, 
  Clock, MapPin, Briefcase, GraduationCap, ChevronLeft, ChevronRight, BookOpen 
} from "lucide-react";
import { COURSES, COURSE_CATEGORIES } from "../data/coursesData.js";
import { useApp } from "../context/AppContext.jsx";

export default function TechnologyTopics() {
  const { openCourseModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Filter courses based on active category and search query
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" ||
        course.categoryGroup === selectedCategory ||
        (course.categoryGroups && course.categoryGroups.includes(selectedCategory));

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchSubtitle = course.subtitle?.toLowerCase().includes(q);
      const matchDesc = course.shortDesc?.toLowerCase().includes(q);
      const matchCategory = course.category?.toLowerCase().includes(q);
      const matchTags = course.tags?.some((tag) => tag.toLowerCase().includes(q));
      const matchRoles = course.roles?.some((role) => role.toLowerCase().includes(q));

      return matchTitle || matchSubtitle || matchDesc || matchCategory || matchTags || matchRoles;
    });
  }, [selectedCategory, searchQuery]);

  // Dynamic counts for each category
  const categoryCounts = useMemo(() => {
    const counts = { all: COURSES.length };
    COURSES.forEach((course) => {
      const groups = new Set([course.categoryGroup, ...(course.categoryGroups || [])]);
      groups.forEach((group) => {
        if (group) {
          counts[group] = (counts[group] || 0) + 1;
        }
      });
    });
    return counts;
  }, []);

  // Reset current index when category or search changes
  useEffect(() => {
    setCurrentIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [selectedCategory, searchQuery]);

  // Handle scroll synchronization
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.offsetWidth || 380;
    const gap = 24;
    const itemFullWidth = cardWidth + gap;
    const newIndex = Math.round(scrollLeft / itemFullWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < filteredCourses.length) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollToSlide = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const clampedIndex = Math.max(0, Math.min(index, filteredCourses.length - 1));
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

  const totalCards = filteredCourses.length;

  return (
    <section className="courses-showcase-section" id="tech-topics">
      <div className="container">
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
          <div style={{ maxWidth: "780px" }}>
            <span className="section-label">
              INDUSTRY-READY CAREER TRACKS
            </span>
            <h2 className="section-heading" style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)" }}>
              Professional Courses &amp; Internship Cohorts
            </h2>
            <p className="section-subtitle">
              Comprehensive hands-on training, enterprise project architectures, and active internship recruitment across {COURSES.length}+ high-growth technology disciplines in Hyderabad and Online.
            </p>
          </div>

          <div className="courses-recruitment-callout">
            <div className="pulse-dot-green"></div>
            <div>
              <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--text-main)" }}>
                Active Internship Hiring
              </strong>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {COURSES.length}+ Specialized Engineering Cohorts Open in Hyderabad &amp; Online
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="courses-filter-controls">
          <div className="courses-filter-top-row">
            <div className="courses-search-bar">
              <Search size={16} className="courses-search-icon" />
              <input
                type="text"
                placeholder="Search courses, tools, or skills (e.g., Python, AWS, Docker)..."
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
              Showing {filteredCourses.length} of {COURSES.length} Courses
            </div>
          </div>

          {/* Category Tabs */}
          <div className="courses-category-pills" role="tablist">
            {COURSE_CATEGORIES.map((cat) => {
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

        {/* Courses Horizontal Carousel */}
        {filteredCourses.length > 0 ? (
          <div className="courses-carousel-wrapper">
            <div 
              className="courses-carousel-track" 
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {filteredCourses.map((course, idx) => {
                return (
                  <div 
                    key={course.id} 
                    className="course-carousel-card"
                    onClick={() => openCourseModal(course, "curriculum")}
                    style={{ cursor: "pointer" }}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openCourseModal(course, "curriculum");
                      }
                    }}
                  >
                    {/* Course Image */}
                    <div className="course-carousel-img-wrap">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="course-carousel-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/ai-course.jpg";
                        }}
                      />
                    </div>

                    {/* Course Card Body */}
                    <div className="course-carousel-body">
                      {/* Badge / Category Pill */}
                      <div className="course-carousel-tag-wrap">
                        <span className="course-carousel-badge">
                          {course.category || "TECHNOLOGY"}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="course-carousel-title" title={course.title}>
                        {course.title}
                      </h3>
                      
                      <p className="course-carousel-desc">
                        {course.subtitle || course.shortDesc}
                      </p>

                      {/* Read More Action Button */}
                      <div className="course-carousel-footer">
                        <button
                          type="button"
                          className="course-read-more-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openCourseModal(course, "curriculum");
                          }}
                          aria-label={`Read more about ${course.title}`}
                        >
                          <span>Read More</span>
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Carousel Controls (← [index / total] →) */}
            {totalCards > 1 && (
              <div className="courses-carousel-nav-bar">
                <button
                  type="button"
                  className="carousel-nav-arrow-btn"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Previous Course"
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
                  aria-label="Next Course"
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
              No Courses Found
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              We couldn't find any courses matching "{searchQuery}" in this category. Try adjusting your search query or view all available courses.
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
  );
}
