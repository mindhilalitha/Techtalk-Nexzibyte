"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p
        className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center"
        style={{
          fontSize: "clamp(2rem, 5vw, 4.5rem)",
          color: "#ffffff",
          fontWeight: 700,
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.2,
          margin: 0,
          padding: "0 1rem"
        }}
      >
        Hero waves are cool
      </p>
      <p
        className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          marginTop: "1rem",
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: 400,
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 1rem"
        }}
      >
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  );
}

export default WavyBackgroundDemo;
