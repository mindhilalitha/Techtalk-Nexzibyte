import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className = "",
  containerClassName = "",
  colors,
  waveWidth,
  backgroundFill = "#0a0a14",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const noiseRef = useRef(null);
  if (!noiseRef.current) {
    noiseRef.current = createNoise3D();
  }

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationIdRef = useRef(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.0015;
    }
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = (ctx.canvas.width = container.offsetWidth || window.innerWidth);
    let h = (ctx.canvas.height = container.offsetHeight || window.innerHeight);
    let nt = 0;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationIdRef.current) {
          render();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleResize = () => {
      if (!canvas || !ctx || !container) return;
      w = ctx.canvas.width = (container.offsetWidth || window.innerWidth) + 120;
      h = ctx.canvas.height = (container.offsetHeight || window.innerHeight) + 60;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const drawWave = (n) => {
      nt += getSpeed();
      const noise = noiseRef.current;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 45;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = -100; x <= w + 100; x += 8) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      if (!isVisible) {
        animationIdRef.current = null;
        return;
      }
      ctx.fillStyle = backgroundFill || "#0D0A2B";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(-50, -30, w + 100, h + 60);
      drawWave(5);
      animationIdRef.current = requestAnimationFrame(render);
    };

    handleResize();
    render();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [backgroundFill, blur, speed, waveOpacity, waveWidth, waveColors]);

  return (
    <div
      ref={containerRef}
      className={`wavy-bg-container ${containerClassName}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundFill || "#0D0A2B",
      }}
    >
      <canvas
        ref={canvasRef}
        id="wavy-canvas"
        style={{
          position: "absolute",
          top: "-30px",
          left: "-60px",
          width: "calc(100% + 120px)",
          height: "calc(100% + 60px)",
          zIndex: 1,
          pointerEvents: "none",
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div
        className={`wavy-bg-content ${className}`}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
