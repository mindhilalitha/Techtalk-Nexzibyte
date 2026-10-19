import React from "react";

export function UiverseFlipBox({
  badge = "Featured",
  title = "Tech Topic",
  author = "NexziByte",
  footer = "Hover to flip",
  backTitle = "Discover More",
  backDescription = "Click to explore details",
  icon: Icon,
  glowColor = "#ff9966",
  circleColor1 = "#ffbb66",
  circleColor2 = "#ff8866",
  circleColor3 = "#ff2233",
  imageSrc,
  width = "190px",
  height = "254px",
  onClick,
  style = {},
  className = "",
}) {
  return (
    <div
      className={`uiverse-card-box ${className}`}
      onClick={onClick}
      style={{
        width,
        height,
        cursor: onClick ? "pointer" : "default",
        "--box-glow": glowColor,
        "--circle-1": circleColor1,
        "--circle-2": circleColor2,
        "--circle-3": circleColor3,
        ...style,
      }}
    >
      <div className="content">
        {/* Front side */}
        <div className="front">
          {imageSrc && (
            <img src={imageSrc} alt={title} className="img" />
          )}
          <div className="front-content">
            <small className="badge">{badge}</small>
            <div className="description">
              <div className="title">
                <p>
                  <strong>{title}</strong>
                </p>
                {Icon && <Icon size={16} color="#ffffff" />}
              </div>
              <p className="card-footer">
                {author} &nbsp;|&nbsp; {footer}
              </p>
            </div>
          </div>
        </div>

        {/* Back side (with rotating glow and floating circles) */}
        <div className="back">
          <div className="back-content">
            <div className="circle"></div>
            <div className="circle" id="bottom"></div>
            <div className="circle" id="right"></div>

            <div style={{ position: "relative", zIndex: 10 }}>
              {Icon && (
                <div
                  style={{
                    display: "inline-flex",
                    padding: "10px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(5px)",
                    marginBottom: "8px",
                  }}
                >
                  <Icon size={24} color="#ffffff" />
                </div>
              )}
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  margin: "0 0 6px 0",
                  color: "#ffffff",
                }}
              >
                {backTitle}
              </h4>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.75)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {backDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UiverseFlipBox;
