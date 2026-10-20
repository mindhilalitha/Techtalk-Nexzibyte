import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronDown, ChevronUp, Menu, X, ArrowRight, User, ShieldCheck, 
  Calendar, Users, Rocket, Mic, BookOpen, Layers, CheckCircle2, Ticket,
  Handshake, Cpu, Globe, Bell, Plus, LogOut
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

import { NexziByteLogo } from "./NexziByteLogo.jsx";

// Official NexziByte Brand Logo + TechTalk Wordmark
export function TechTalkBrandedLogo({ height = 44, theme = "dark", showSubtitle = true }) {
  return (
    <div className="techtalk-brand-logo-wrap" aria-label="NexziByte TechTalk">
      <NexziByteLogo height={height} theme={theme} showTechTalk={true} showSubtitle={showSubtitle} />
    </div>
  );
}

export const TechLogoSymbol = TechTalkBrandedLogo;

// Custom Right Arrow SVG icon matching the boxed arrow button in reference images
function DropdownArrowIcon() {
  return (
    <svg 
      width="20" 
      height="15" 
      viewBox="0 0 20 15" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="dropdown-editorial-svg"
    >
      <path d="M1 7.5h17M12 2l6 5.5-6 5.5" />
    </svg>
  );
}

export default function Navbar() {
  const { setLoginModalOpen, openPassModal, user, isLoggedIn, logout, unreadNotificationCount } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".nav-dropdown-wrapper")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Universal navigation handler (smooth scroll if on home, navigate otherwise)
  const handleNavigation = (path, hashId) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (location.pathname === "/") {
      if (hashId) {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${hashId}`);
          return;
        }
      }
      navigate(path);
    } else {
      navigate(path);
    }
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <header className={`site-header-dark ${isHomePage ? "header-on-image" : "header-inner-page"} ${scrolled ? "scrolled" : "transparent"}`}>
      <div className="container-wide">
        <div className="navbar-inner-dark">
          {/* LEFT: Logo */}
          <Link to="/" className="brand-logo-link" style={{ flexShrink: 0, textDecoration: "none", display: "inline-flex", alignItems: "center", marginRight: "28px" }}>
            <TechTalkBrandedLogo />
          </Link>

          {/* CENTER: Navigation with Dropdown Cards matching reference screenshots */}
          <nav className="nav-center-menu-dark" aria-label="Main Navigation">
            {/* 1. COMMUNITY (Events & Pricing) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("community")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "community" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("community");
                }}
                aria-expanded={activeDropdown === "community"}
              >
                <span>COMMUNITY</span>
                {activeDropdown === "community" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "community" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <Link 
                    to="/events"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Events</div>
                      <div className="dropdown-editorial-desc">Explore career-growth events</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <Link 
                    to="/summits"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Summits</div>
                      <div className="dropdown-editorial-desc">Flagship tech conferences &amp; stages</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <Link 
                    to="/founder-meets"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Founder Meets</div>
                      <div className="dropdown-editorial-desc">Venture networking &amp; founder circles</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <Link 
                    to="/passes"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Pricing</div>
                      <div className="dropdown-editorial-desc">Find out pricing options</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. SERVICES (Courses & Internship in place of CV & Individual Coaching) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "services" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("services");
                }}
                aria-expanded={activeDropdown === "services"}
              >
                <span>SERVICES</span>
                {activeDropdown === "services" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "services" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <Link 
                    to="/courses"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Courses</div>
                      <div className="dropdown-editorial-desc">Industry-aligned tech courses &amp; tracks</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <Link 
                    to="/internship"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Internship</div>
                      <div className="dropdown-editorial-desc">Gain real-world experience &amp; get hired (23 Tracks)</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. RESOURCES (Resource center & Success stories) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "resources" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("resources");
                }}
                aria-expanded={activeDropdown === "resources"}
              >
                <span>RESOURCES</span>
                {activeDropdown === "resources" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "resources" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <Link 
                    to="/explore"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Resource center</div>
                      <div className="dropdown-editorial-desc">Download our free resources</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <Link 
                    to="/#testimonials"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                      const el = document.getElementById("testimonials");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Success stories</div>
                      <div className="dropdown-editorial-desc">Inspiring job search journeys</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. ABOUT (About us & Contact us) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "about" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("about");
                }}
                aria-expanded={activeDropdown === "about"}
              >
                <span>ABOUT</span>
                {activeDropdown === "about" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "about" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <Link 
                    to="/about"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">About us</div>
                      <div className="dropdown-editorial-desc">The story behind TechTalk</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <Link 
                    to="/contact"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Contact us</div>
                      <div className="dropdown-editorial-desc">Need help? Reach out to us</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </Link>

                  <a 
                    href="https://www.nexzibyte.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title" style={{ color: "#38BDF8" }}>Official Website</div>
                      <div className="dropdown-editorial-desc">Visit nexzibyte.com portal</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 5. PARTNER (Lime accent matching Screenshot 4) */}
            <Link 
              to="/partner" 
              className={`nav-partner-btn ${location.pathname === "/partner" ? "is-active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <span>PARTNER</span>
            </Link>
          </nav>

          {/* RIGHT: Login & Account Actions + Join Community CTA */}
          <div className="nav-right-actions-dark">
            {/* Login button only shown when NOT logged in */}
            {!isLoggedIn && (
              <Link 
                to="/login"
                className="nav-login-btn-header"
                id="nav-login-btn"
                title="Log in to account"
                style={{ textDecoration: "none" }}
              >
                <User size={15} />
                <span>Log In</span>
              </Link>
            )}

            {/* Admin Portal Shortcut Button strictly for nexzibyte@gmail.com */}
            {isLoggedIn && (user?.email?.toLowerCase().trim() === "nexzibyte@gmail.com" || user?.email?.toLowerCase().trim() === "nexzibyteadmin@gmail.com") && (
              <Link
                to="/admin"
                className="nav-admin-btn-header"
                id="nav-admin-btn"
                title="Admin Command Center"
              >
                <ShieldCheck size={14} className="nav-admin-btn-icon" />
                <span>Admin</span>
              </Link>
            )}

            {isLoggedIn ? (
              <Link 
                to="/profile" 
                className={`nav-profile-pill-link ${location.pathname === "/profile" ? "is-active" : ""}`}
                title="My Account / Profile Page"
                aria-label="My Account / Profile"
                id="nav-account-btn"
              >
                <div className="nav-profile-avatar-tiny">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || "Profile"} 
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <User size={14} color="#0284C7" strokeWidth={2.5} />
                  )}
                </div>
                <span className="nav-profile-name-tiny">
                  {user?.name ? (user.name.length > 18 ? user.name.split(" ")[0] : user.name) : "Account"}
                </span>
              </Link>
            ) : null}

            <button 
              type="button" 
              className="nav-join-community-btn"
              onClick={() => openPassModal("visitor-pass")}
            >
              Join Community
            </button>

            {/* Mobile Menu Button */}
            <button 
              type="button"
              className="mobile-toggle-btn-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-dark">
          {/* USER PROFILE Section */}
          {isLoggedIn ? (
            <div className="mobile-drawer-section" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "14px" }}>
              <div className="mobile-drawer-category">TECHNOLOGY PROFILE &amp; ACTIONS</div>
              <Link 
                to="/profile"
                className={`mobile-nav-link-dark ${location.pathname === "/profile" ? "active-mobile-blue" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38BDF8", fontWeight: 700 }}
              >
                <User size={18} />
                <span>{user?.name || "M. L. S. V. Aiswarya"} (View Profile)</span>
              </Link>
              {/* ADMIN COMMAND CENTER strictly for nexzibyte@gmail.com */}
              {isLoggedIn && (user?.email?.toLowerCase().trim() === "nexzibyte@gmail.com" || user?.email?.toLowerCase().trim() === "nexzibyteadmin@gmail.com") && (
                <Link 
                  to="/admin"
                  className="mobile-nav-link-dark"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", color: "#C084FC", fontWeight: 800, marginTop: "6px" }}
                >
                  <ShieldCheck size={18} />
                  <span> Admin Portal &amp; Member Analytics</span>
                </Link>
              )}
              <Link 
                to="/create-post"
                className="mobile-nav-link-dark"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--coral)", fontWeight: 700, marginTop: "6px" }}
              >
                <Plus size={18} />
                <span>+ Create Technical Dispatch</span>
              </Link>
              <Link 
                to="/profile?tab=notifications"
                className="mobile-nav-link-dark"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}
              >
                <Bell size={18} />
                <span>Notifications {unreadNotificationCount > 0 ? `(${unreadNotificationCount} unread)` : ""}</span>
              </Link>
            </div>
          ) : (
            <div className="mobile-drawer-section" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "14px" }}>
              <div className="mobile-drawer-category">COMMUNITY ACCOUNT</div>
              <Link 
                to="/login"
                className="mobile-nav-link-dark"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38BDF8", fontWeight: 700 }}
              >
                <User size={18} />
                <span>Sign In to NexziByte TechTalk</span>
              </Link>
            </div>
          )}

          {/* COMMUNITY Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">COMMUNITY</div>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname === "/events" ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/events", null)}
            >
              Events (Upcoming &amp; Discovery)
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname.startsWith("/summits") ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/summits", null)}
            >
              Summits (Flagship Conferences)
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname.startsWith("/founder-meets") ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/founder-meets", null)}
            >
              Founder Meets (Venture Network)
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/pricing", null)}
            >
              Pricing &amp; Passes
            </button>
          </div>

          {/* SERVICES Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">SERVICES</div>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname === "/courses" ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/courses", "tech-topics")}
            >
              Courses (65+ Tracks)
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname === "/internship" ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/internship", null)}
            >
              Internship (23 Specialized Tracks)
            </button>
          </div>

          {/* RESOURCES Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">RESOURCES</div>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/explore", null)}
            >
              Resource Center &amp; Articles
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/#testimonials", "testimonials")}
            >
              Success Stories
            </button>
          </div>

          {/* ABOUT & PARTNER Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">ABOUT &amp; PARTNER</div>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/about", null)}
            >
              About Us
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/contact", null)}
            >
              Contact Us
            </button>
            <a 
              href="https://www.nexzibyte.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-nav-link-dark"
              style={{ color: "#38BDF8", textDecoration: "none" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Official Website (nexzibyte.com) ↗
            </a>
            <Link 
              to="/partner" 
              className="mobile-nav-link-dark"
              style={{ textDecoration: "none" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Partner With Us
            </Link>
          </div>
          
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {isLoggedIn ? (
              <Link 
                to="/profile"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", textDecoration: "none" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={15} />
                <span>My Account</span>
              </Link>
            ) : (
              <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                <Link 
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  style={{ 
                    flex: 1, 
                    textAlign: "center", 
                    textDecoration: "none", 
                    borderRadius: "9999px", 
                    border: "2px solid #4F75FF", 
                    background: "#0B0F19", 
                    color: "#FFFFFF", 
                    fontWeight: 700,
                    boxShadow: "0 0 10px rgba(79, 117, 255, 0.25)"
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
            <button 
              type="button" 
              className="nav-join-community-btn"
              style={{ flex: 1 }}
              onClick={() => { setMobileMenuOpen(false); openPassModal("visitor-pass"); }}
            >
              Join Community
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
