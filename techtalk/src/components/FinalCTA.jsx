"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuroraBackground } from "./ui/aurora-background.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function FinalCTA() {
  const { openPassModal } = useApp();

  return (
    <AuroraBackground className="final-cta-aurora-section" style={{ minHeight: "650px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <section className="final-cta-section" id="join-techtalk" style={{ background: "transparent", width: "100%", padding: "80px 20px" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="final-cta-inner"
            style={{ textAlign: "center", maxWidth: "840px", margin: "0 auto" }}
          >
            <h2 
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
                marginBottom: "20px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif"
              }}
            >
              Your Next Connection Could Change Everything.
            </h2>

            <p 
              style={{
                fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                color: "rgba(241, 245, 249, 0.88)",
                lineHeight: 1.65,
                margin: "0 auto 40px auto",
                maxWidth: "680px"
              }}
            >
              Join NexziByte TechTalk and become part of a community building what's next in technology, startups, and engineering.
            </p>

            <div style={{ display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap" }}>
              <button 
                type="button" 
                className="btn-uiverse btn-uiverse-primary"
                style={{
                  "--color": "#e879f9",
                  "--color2": "#0D0A2B",
                  padding: "0.85em 2.2em",
                  fontSize: "15px"
                }}
                onClick={() => {
                  const el = document.getElementById("summits");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>Explore Upcoming Summits</span>
                <ArrowRight size={18} />
              </button>

              <button 
                type="button" 
                className="btn-uiverse btn-uiverse-purple"
                style={{
                  "--color": "#38bdf8",
                  "--color2": "#0D0A2B",
                  padding: "0.85em 2.2em",
                  fontSize: "15px"
                }}
                onClick={() => {
                  const el = document.getElementById("founder-meets");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>Connect at Founder Meets</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  );
}

