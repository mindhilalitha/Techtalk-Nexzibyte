import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CourseCardImageSlider({ 
  images = [], 
  singleImage = null, 
  alt = "Course image",
  category = null,
  badge = null,
  autoSlideInterval = 3200
}) {
  const allImages = (images && images.length > 0) 
    ? images 
    : singleImage 
      ? [singleImage] 
      : ["/images/ai-course.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Auto-slide effect
  useEffect(() => {
    if (allImages.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, autoSlideInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [allImages.length, isHovered, autoSlideInterval]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleDotClick = (idx, e) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div 
      className="course-card-slider-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "inherit"
      }}
    >
      {/* Sliding Track */}
      <div 
        className="course-slider-track"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)"
        }}
      >
        {allImages.map((src, idx) => (
          <div 
            key={idx}
            style={{
              minWidth: "100%",
              width: "100%",
              height: "100%",
              flexShrink: 0,
              position: "relative"
            }}
          >
            <img 
              src={src} 
              alt={`${alt} slide ${idx + 1}`}
              className="course-card-img"
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/ai-course.jpg";
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay Badges */}
      <div className="course-image-overlay">
        {category && <span className="course-category-tag">{category}</span>}
        {badge && (
          <span className="course-badge-pill">
            {badge}
          </span>
        )}
      </div>

      {/* Navigation Arrows for Multiple Images (Visible on Hover) */}
      {allImages.length > 1 && (
        <>
          <button
            type="button"
            className={`course-slider-nav-btn prev ${isHovered ? "visible" : ""}`}
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className={`course-slider-nav-btn next ${isHovered ? "visible" : ""}`}
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="course-slider-dots-row">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`course-slider-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={(e) => handleDotClick(idx, e)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
