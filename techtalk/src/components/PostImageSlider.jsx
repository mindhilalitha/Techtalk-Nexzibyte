import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function PostImageSlider({ images = [], singleImage = null, alt = "Post image" }) {
  const allImages = images && images.length > 0 ? images : singleImage ? [singleImage] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (allImages.length === 0) return null;

  if (allImages.length === 1) {
    return (
      <div className="single-post-media-container" style={{ margin: "16px 0", borderRadius: "14px", overflow: "hidden", border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
        <img
          src={allImages[0]}
          alt={alt}
          className="single-post-image"
          style={{ width: "100%", maxHeight: "520px", objectFit: "contain", display: "block", background: "#F8FAFC" }}
          loading="lazy"
        />
      </div>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="post-slider-wrapper" style={{ position: "relative", margin: "16px 0", borderRadius: "14px", overflow: "hidden", border: "1px solid #E2E8F0", background: "#0F172A" }}>
      {/* Slider Viewport */}
      <div
        style={{
          display: "flex",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${currentIndex * 100}%)`,
          width: "100%"
        }}
      >
        {allImages.map((src, idx) => (
          <div
            key={idx}
            style={{
              minWidth: "100%",
              width: "100%",
              height: "440px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0F172A",
              overflow: "hidden"
            }}
          >
            <img
              src={src}
              alt={`${alt} ${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block"
              }}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Image"
        style={{
          position: "absolute",
          top: "50%",
          left: "12px",
          transform: "translateY(-50%)",
          background: "rgba(15, 23, 42, 0.65)",
          color: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          zIndex: 5
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108, 43, 217, 0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(15, 23, 42, 0.65)")}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Image"
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          background: "rgba(15, 23, 42, 0.65)",
          color: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          zIndex: 5
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108, 43, 217, 0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(15, 23, 42, 0.65)")}
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide Badge Counter */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          color: "#FFFFFF",
          fontSize: "0.75rem",
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: "9999px",
          letterSpacing: "0.03em",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 5
        }}
      >
        {currentIndex + 1} / {allImages.length}
      </div>

      {/* Pagination Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(6px)",
          padding: "5px 10px",
          borderRadius: "9999px",
          zIndex: 5
        }}
      >
        {allImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: currentIndex === idx ? "20px" : "7px",
              height: "7px",
              borderRadius: "9999px",
              background: currentIndex === idx ? "#6C2BD9" : "rgba(255, 255, 255, 0.5)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.25s ease"
            }}
          />
        ))}
      </div>
    </div>
  );
}
