"use client";
import React from "react";

/**
 * Aceternity UI AuroraBackground Component
 * Creates animated, glowing aurora lights across the background.
 */
export const AuroraBackground = ({
  className = "",
  children,
  showRadialGradient = true,
  style = {},
  ...props
}) => {
  return (
    <div
      className={`aurora-background-root ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        ...style,
      }}
      {...props}
    >
      <div
        className="aurora-layers-container"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          className={`aurora-layer ${showRadialGradient ? "aurora-layer-mask" : ""}`}
        />
        <div className="aurora-layer-secondary" />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
