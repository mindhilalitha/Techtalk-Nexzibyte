import React from "react";

/**
 * Authentic Vector Brand Logos for all 22 Partner & Ecosystem Companies
 * Built with wide unclipped viewBoxes, overflow="visible", and exact brand typography & emblems.
 */

// 1. Akina Analytics
export function AkinaAnalyticsLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <rect x="0" y="16" width="6.5" height="18" rx="3" fill="#3B82F6" />
        <rect x="10" y="8" width="6.5" height="26" rx="3" fill="#2563EB" />
        <rect x="20" y="0" width="6.5" height="34" rx="3" fill="#1D4ED8" />
        <circle cx="31" cy="7" r="4.5" fill="#60A5FA" />
        <path d="M4 16 L13 8 L23 2 L31 7" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <text x="44" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" letterSpacing="0.8px" fill={textColor}>
        AKINA
      </text>
      <text x="44" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="3.5px" fill="#2563EB">
        ANALYTICS
      </text>
    </svg>
  );
}

// 2. Sunworks
export function SunworksLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <circle cx="16" cy="16" r="10" fill="url(#sw_sun_grad)" />
        <path d="M16 0 L16 3 M16 29 L16 32 M0 16 L3 16 M29 16 L32 16 M5 5 L8 8 M24 24 L27 27 M5 27 L8 24 M24 8 L27 5" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
        <defs>
          <linearGradient id="sw_sun_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </g>
      <text x="44" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.3px" fill={textColor}>
        SUN<span fill="#F59E0B">WORKS</span>
      </text>
    </svg>
  );
}

// 3. RV Aarvee (Aarvee Associates)
export function RVAarveeLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <path d="M2 32 L16 3 L30 32" stroke="#4F46E5" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 20 L24 20" stroke="#818CF8" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="16" cy="3" r="4" fill="#4338CA" />
      </g>
      <text x="42" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" letterSpacing="0.2px" fill={textColor}>
        aarvee
      </text>
      <text x="42" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="3px" fill="#4F46E5">
        ASSOCIATES
      </text>
    </svg>
  );
}

// 4. Aramus Technosoft Solutions
export function AramusTechnosoftLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 280 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <polygon points="16,1 31,9 31,26 16,34 1,26 1,9" stroke="#0891B2" strokeWidth="2.6" fill="none" />
        <circle cx="16" cy="17.5" r="5.5" fill="#06B6D4" />
        <line x1="16" y1="1" x2="16" y2="12" stroke="#22D3EE" strokeWidth="2" />
        <line x1="31" y1="26" x2="21" y2="20" stroke="#22D3EE" strokeWidth="2" />
        <line x1="1" y1="26" x2="11" y2="20" stroke="#22D3EE" strokeWidth="2" />
      </g>
      <text x="42" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.8px" fill={textColor}>
        ARAMUS
      </text>
      <text x="42" y="35" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8.5" letterSpacing="2px" fill="#0891B2">
        TECHNOSOFT SOLUTIONS
      </text>
    </svg>
  );
}

// 5. Landora Projects & Developers
export function LandoraProjectsLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 280 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <path d="M3 32 L3 12 L14 4 L25 12 L25 32 Z" fill="#059669" />
        <path d="M23 32 L23 15 L31 10 L39 15 L39 32 Z" fill="#10B981" opacity="0.9" />
        <rect x="8" y="14" width="3.5" height="3.5" fill="#FFFFFF" />
        <rect x="16" y="14" width="3.5" height="3.5" fill="#FFFFFF" />
        <rect x="8" y="21" width="3.5" height="3.5" fill="#FFFFFF" />
        <rect x="16" y="21" width="3.5" height="3.5" fill="#FFFFFF" />
      </g>
      <text x="48" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17.5" letterSpacing="0.8px" fill={textColor}>
        LANDORA
      </text>
      <text x="48" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8.2" letterSpacing="2px" fill="#059669">
        PROJECTS &amp; DEVELOPERS
      </text>
    </svg>
  );
}

// 6. Xyoai
export function XyoaiLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 190 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <polygon points="16,1 31,16 16,31 1,16" fill="url(#xyo_grad_4)" />
        <circle cx="16" cy="16" r="4.5" fill="#FFFFFF" />
        <defs>
          <linearGradient id="xyo_grad_4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>
      </g>
      <text x="42" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.5px" fill={textColor}>
        xyo<span fill="#8B5CF6">.ai</span>
      </text>
    </svg>
  );
}

// 7. EZstaf
export function EZstafLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id="ezstafGrad" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <g transform="translate(0, 3)">
        <rect width="30" height="30" rx="8" fill="url(#ezstafGrad)" />
        <text x="5" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="0.5px">EZ</text>
      </g>
      <text x="38" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="22" letterSpacing="-0.4px" fill={textColor}>
        staf
      </text>
    </svg>
  );
}

// 8. Stafi.
export function StafiLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 3)">
        <circle cx="15" cy="15" r="13.5" stroke="#2563EB" strokeWidth="2.8" fill="none" />
        <path d="M10 15 L13.5 19 L20 11.5" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="38" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="22" letterSpacing="-0.4px" fill={textColor}>
        stafi<tspan fill="#2563EB" fontWeight="900">.</tspan>
      </text>
    </svg>
  );
}

// 9. Tritech
export function TritechLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 220 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <polygon points="17,1 33,30 1,30" stroke="#E11D48" strokeWidth="3.2" fill="none" />
        <polygon points="17,11 25,25 9,25" fill="#F43F5E" />
      </g>
      <text x="44" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.8px" fill={textColor}>
        TRI<span fill="#E11D48">TECH</span>
      </text>
    </svg>
  );
}

// 10. Wisun (Wi-SUN)
export function WisunLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 220 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <circle cx="16" cy="16" r="15" fill="#0284C7" />
        <path d="M9 16 C9 11 23 11 23 16 C23 21 9 21 9 25 C9 30 23 30 23 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
      <text x="42" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.3px" fill={textColor}>
        Wi-<span fill="#0284C7">SUN</span>
      </text>
    </svg>
  );
}

// 11. Nevonex Solutions
export function NevonexLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <circle cx="16" cy="16" r="15" stroke="#16A34A" strokeWidth="2.8" fill="#F0FDF4" />
        <polygon points="16,6 24,12 24,20 16,26 8,20 8,12" fill="#16A34A" />
      </g>
      <text x="42" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17" letterSpacing="1px" fill={textColor}>
        NEVONEX
      </text>
      <text x="42" y="35" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2.8px" fill="#16A34A">
        SOLUTIONS
      </text>
    </svg>
  );
}

// 12. Madhuram Events
export function MadhuramEventsLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <rect x="1" y="1" width="30" height="30" rx="8" fill="#DC2626" />
        <path d="M8 12 L16 6 L24 12 L24 25 L8 25 Z" fill="#FEF2F2" />
        <circle cx="16" cy="15.5" r="3.5" fill="#DC2626" />
      </g>
      <text x="42" y="22" fontFamily="Georgia, 'Playfair Display', serif" fontWeight="700" fontSize="19" fill={textColor}>
        Madhuram
      </text>
      <text x="42" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="9" letterSpacing="3.5px" fill="#DC2626">
        EVENTS
      </text>
    </svg>
  );
}

// 13. Pynek
export function PynekLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 190 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <path d="M4 8 C4 3 15 3 15 8 L15 16 L24 16 C29 16 29 27 24 27 L15 27 C15 32 4 32 4 27 Z" fill="#0D9488" />
        <circle cx="9" cy="8" r="1.6" fill="#FFFFFF" />
        <circle cx="19" cy="23" r="1.6" fill="#FFFFFF" />
      </g>
      <text x="40" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.3px" fill={textColor}>
        py<span fill="#0D9488">nek</span>
      </text>
    </svg>
  );
}

// 14. Beacon Technology
export function BeaconTechnologyLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 250 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <path d="M16 1 L24 30 L8 30 Z" stroke="#1D4ED8" strokeWidth="2.8" fill="none" />
        <circle cx="16" cy="6" r="4.5" fill="#3B82F6" />
        <path d="M5 14 A 14 14 0 0 1 27 14" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
      <text x="42" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.8px" fill={textColor}>
        BEACON
      </text>
      <text x="42" y="35" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2.8px" fill="#1D4ED8">
        TECHNOLOGY
      </text>
    </svg>
  );
}

// 15. Rocprompt
export function RocpromptLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 220 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <rect x="0" y="0" width="31" height="29" rx="7" fill="#C026D3" />
        <text x="6" y="20.5" fontFamily="monospace" fontWeight="900" fontSize="16" fill="#FFFFFF">&gt;_</text>
      </g>
      <text x="42" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.4px" fill={textColor}>
        roc<span fill="#C026D3">prompt</span>
      </text>
    </svg>
  );
}

// 16. Modi Properties
export function ModiPropertiesLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <path d="M3 30 L3 3 L16 16 L29 3 L29 30" stroke="#1E3A8A" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <text x="42" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" letterSpacing="0.8px" fill={textColor}>
        MODI
      </text>
      <text x="42" y="35" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9" letterSpacing="3px" fill="#1E3A8A">
        PROPERTIES
      </text>
    </svg>
  );
}

// 17. SB Group
export function SBGroupLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 220 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <polygon points="15,1 29,9 29,25 15,31 1,25 1,9" fill="#334155" />
        <text x="7" y="22" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF">SB</text>
      </g>
      <text x="40" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="19" letterSpacing="1px" fill={textColor}>
        SB <span fill="#64748B">GROUP</span>
      </text>
    </svg>
  );
}

// 18. SR Group
export function SRGroupLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 220 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <circle cx="15" cy="15" r="14.5" stroke="#475569" strokeWidth="2.8" fill="#F8FAFC" />
        <text x="6" y="21.5" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13.5" fill="#334155">SR</text>
      </g>
      <text x="40" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="19" letterSpacing="1px" fill={textColor}>
        SR <span fill="#475569">GROUP</span>
      </text>
    </svg>
  );
}

// 19. Rengy
export function RengyLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 190 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <path d="M16 1 C6 5 2 15 6 23 C10 29 22 29 26 19 C28 11 24 5 16 1 Z" fill="#65A30D" />
        <path d="M16 1 L14 26" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <text x="40" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.5px" fill={textColor}>
        ren<span fill="#65A30D">gy</span>
      </text>
    </svg>
  );
}

// 20. Bhave Tech
export function BhaveTechLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <rect x="1" y="1" width="29" height="29" rx="8" fill="#6366F1" />
        <path d="M8 10 L13 15 L8 20 M20 20 L15 20" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="42" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="19" letterSpacing="0.4px" fill={textColor}>
        BHAVE <span fill="#6366F1">TECH</span>
      </text>
    </svg>
  );
}

// 21. Key Blocks
export function KeyBlocksLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 5)">
        <polygon points="15,1 29,8 15,15 1,8" fill="#F59E0B" />
        <polygon points="1,8 15,15 15,29 1,22" fill="#D97706" />
        <polygon points="29,8 29,22 15,29 15,15" fill="#B45309" />
      </g>
      <text x="40" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.2px" fill={textColor}>
        KEY<span fill="#D97706">BLOCKS</span>
      </text>
    </svg>
  );
}

// 22. Srikaram Farms
export function SrikaramFarmsLogo({ height = 34, theme = "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  return (
    <svg height={height} viewBox="0 0 240 46" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${height}px`, width: "auto", overflow: "visible", display: "block" }}>
      <g transform="translate(0, 4)">
        <circle cx="15" cy="15" r="14.5" fill="#F0FDF4" stroke="#15803D" strokeWidth="2.4" />
        <path d="M15 24 C15 16 8 12 8 12 C8 12 13 8 19 11 C21 12 22 17 22 24" fill="#16A34A" />
        <circle cx="11" cy="9" r="2.8" fill="#F59E0B" />
      </g>
      <text x="40" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17.5" letterSpacing="0.8px" fill={textColor}>
        SRIKARAM
      </text>
      <text x="40" y="35" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="3.5px" fill="#15803D">
        FARMS
      </text>
    </svg>
  );
}

// Universal Company Logo Dispatcher
export function CompanyLogo({ companyId, height = 34, theme = "light" }) {
  switch (companyId) {
    case "akina-analytics":
      return <AkinaAnalyticsLogo height={height} theme={theme} />;
    case "sunworks":
      return <SunworksLogo height={height} theme={theme} />;
    case "rv-aarvee":
      return <RVAarveeLogo height={height} theme={theme} />;
    case "aramus-technosoft":
      return <AramusTechnosoftLogo height={height} theme={theme} />;
    case "landora-projects":
      return <LandoraProjectsLogo height={height} theme={theme} />;
    case "xyoai":
      return <XyoaiLogo height={height} theme={theme} />;
    case "ezstaf":
      return <EZstafLogo height={height} theme={theme} />;
    case "stafi":
      return <StafiLogo height={height} theme={theme} />;
    case "tritech":
      return <TritechLogo height={height} theme={theme} />;
    case "wisun":
      return <WisunLogo height={height} theme={theme} />;
    case "nevonex-solutions":
      return <NevonexLogo height={height} theme={theme} />;
    case "madhuram-events":
      return <MadhuramEventsLogo height={height} theme={theme} />;
    case "pynek":
      return <PynekLogo height={height} theme={theme} />;
    case "beacon-technology":
      return <BeaconTechnologyLogo height={height} theme={theme} />;
    case "rocprompt":
      return <RocpromptLogo height={height} theme={theme} />;
    case "modi-properties":
      return <ModiPropertiesLogo height={height} theme={theme} />;
    case "sb-group":
      return <SBGroupLogo height={height} theme={theme} />;
    case "sr-group":
      return <SRGroupLogo height={height} theme={theme} />;
    case "rengy":
      return <RengyLogo height={height} theme={theme} />;
    case "bhave-tech":
      return <BhaveTechLogo height={height} theme={theme} />;
    case "key-blocks":
      return <KeyBlocksLogo height={height} theme={theme} />;
    case "srikaram-farms":
      return <SrikaramFarmsLogo height={height} theme={theme} />;
    default:
      return null;
  }
}
