import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { WavyBackground } from "./ui/wavy-background";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section-dark" id="hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", padding: 0, margin: 0, background: "transparent" }}>
      <WavyBackground
        className="max-w-5xl mx-auto px-4 pt-36 pb-24 text-center"
        containerClassName="min-h-screen flex items-center justify-center"
        backgroundFill="#0D0A2B"
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
        waveOpacity={0.45}
        blur={12}
        speed="fast"
      >
        <div className="hero-content-wavy" style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
          {/* Heading */}
          <h1 
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              fontFamily: "'Space Grotesk', 'Inter', sans-serif"
            }}
          >
            Where Technology Meets Ideas, People &amp; Possibilities.
          </h1>

          {/* Description */}
          <p 
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.6,
              maxWidth: "720px",
              margin: "0 auto 2.25rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400
            }}
          >
            Connect with developers, founders, innovators, and technology leaders. 
            Discover new ideas, experience powerful conversations, and build meaningful 
            connections that shape the future of technology.
          </p>

          {/* Buttons using Uiverse.io Button Design */}
          <div 
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.25rem",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2.5rem"
            }}
          >
            <button 
              type="button" 
              className="btn-uiverse-primary"
              onClick={() => navigate("/summits")}
            >
              <span>Explore Summits</span>
              <ArrowRight size={18} />
            </button>

            <button 
              type="button"
              className="btn-uiverse-cyan"
              onClick={() => {
                const el = document.getElementById("explore-tech");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>Explore TechTalk</span>
            </button>
          </div>

          {/* Supporting Trust text */}
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255, 255, 255, 0.75)",
              fontSize: "0.95rem"
            }}
          >
            <CheckCircle2 size={18} style={{ color: "#34D399" }} />
            <span>Join a growing community of technology enthusiasts, builders and innovators.</span>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
