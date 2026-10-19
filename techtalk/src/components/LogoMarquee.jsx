import React, { useState } from "react";
import { PARTNER_COMPANIES } from "../data/mockData.js";

function BannerLogoItem({ comp }) {
  const [imgSrc, setImgSrc] = useState(comp.logoUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (comp.fallbackUrl && imgSrc !== comp.fallbackUrl) {
      setImgSrc(comp.fallbackUrl);
    } else {
      setHasError(true);
    }
  };

  const isInverted = Boolean(comp.invertOnLight);

  return (
    <div 
      className="marquee-logo-item"
      title={`${comp.fullName || comp.name} • ${comp.category || "Ecosystem Partner"}`}
    >
      {!hasError ? (
        <img
          src={imgSrc}
          alt={comp.name}
          onError={handleError}
          loading="lazy"
          style={{
            height: "40px",
            maxHeight: "42px",
            maxWidth: "150px",
            width: "auto",
            objectFit: "contain",
            display: "block",
            filter: isInverted 
              ? "invert(1) contrast(1.2) brightness(0.2)" 
              : "contrast(1.05) brightness(1.01)",
            imageRendering: "-webkit-optimize-contrast",
            transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
            opacity: 0.95
          }}
        />
      ) : (
        <span style={{ 
          fontWeight: 700, 
          fontSize: "14px", 
          color: comp.accentColor || "#1E293B",
          letterSpacing: "0.2px" 
        }}>
          {comp.name}
        </span>
      )}
    </div>
  );
}

export default function LogoMarquee() {
  // Seamless loop with unique partner companies
  const marqueeItems = [...PARTNER_COMPANIES, ...PARTNER_COMPANIES];

  return (
    <section className="trusted-section" aria-label="Ecosystem Partners & Innovators">
      <div className="container">
        <div className="marquee-container" aria-label="Partner Technology Companies & Ecosystem">
          <div className="marquee-content">
            {marqueeItems.map((comp, idx) => (
              <BannerLogoItem 
                key={`${comp.id}-${idx}`} 
                comp={comp} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}





