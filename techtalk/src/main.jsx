import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate, useSearchParams, useLocation } from "react-router-dom";
import { 
  Search, Filter, ArrowLeft, ArrowRight, Calendar, MapPin, 
  Clock, Mic, QrCode, CheckCircle2, BookOpen, Layers, ShieldCheck 
} from "lucide-react";

import { AppProvider, useApp } from "./context/AppContext.jsx";
import { 
  CATEGORIES, TECHNICAL_ARTICLES, UPCOMING_EVENTS, SPEAKERS, 
  PASSES, FEATURED_SUMMIT, FOUNDER_MEETS_DATA 
} from "./data/mockData.js";
import "./styles.css";

// Reusable Components
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import LogoMarquee from "./components/LogoMarquee.jsx";
import CommunityIntro from "./components/CommunityIntro.jsx";
import Stats from "./components/Stats.jsx";
import ExploreTechTalk from "./components/ExploreTechTalk.jsx";
import TechnologyTopics from "./components/TechnologyTopics.jsx";
import SummitsPage from "./components/SummitsPage.jsx";
import UpcomingEvents from "./components/UpcomingEvents.jsx";
import Speakers from "./components/Speakers.jsx";
import Passes from "./components/Passes.jsx";
import DigitalPass from "./components/DigitalPass.jsx";
import QRScanner from "./components/QRScanner.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import TechnicalContent from "./components/TechnicalContent.jsx";
import FounderMeets from "./components/FounderMeets.jsx";
import Testimonials from "./components/Testimonials.jsx";
import CommunityImpact from "./components/CommunityImpact.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import FAQ from "./components/FAQ.jsx";
import Newsletter from "./components/Newsletter.jsx";
import Footer from "./components/Footer.jsx";
import EventsPage from "./components/EventsPage.jsx";
import InternshipPage from "./components/InternshipPage.jsx";
import UserProfilePage from "./components/UserProfilePage.jsx";
import SummitDetailsPage from "./components/SummitDetailsPage.jsx";
import FounderMeetsPage from "./components/FounderMeetsPage.jsx";
import FounderMeetDetailsPage from "./components/FounderMeetDetailsPage.jsx";
import PostDetailsPage from "./components/PostDetailsPage.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import CreatePostPage from "./components/CreatePostPage.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ForgotPasswordPage from "./components/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./components/ResetPasswordPage.jsx";
import VerifyEmailPage from "./components/VerifyEmailPage.jsx";
import CreateProfilePage from "./components/CreateProfilePage.jsx";
import AdminDashboardPage from "./components/AdminDashboardPage.jsx";
import PartnerPage from "./components/PartnerPage.jsx";
import CommunityPage from "./components/CommunityPage.jsx";
import AboutUsPage from "./components/AboutUsPage.jsx";
import ContactUsPage from "./components/ContactUsPage.jsx";
import TermsPage from "./components/TermsPage.jsx";
import LegalPage from "./components/LegalPage.jsx";
import ArticleCard3D from "./components/ArticleCard3D.jsx";
import { AuroraBackground } from "./components/ui/aurora-background.jsx";
import { WavyBackground } from "./components/ui/wavy-background.jsx";

// Modals
import PassRegistrationModal from "./components/PassRegistrationModal.jsx";
import VideoModal from "./components/VideoModal.jsx";
import ArticleModal from "./components/ArticleModal.jsx";
import SummitModal from "./components/SummitModal.jsx";
import CourseModal from "./components/CourseModal.jsx";
import InternshipModal from "./components/InternshipModal.jsx";
import LoginModal from "./components/LoginModal.jsx";

// Route Guard: Enforce Member Authentication
function RequireVerifiedMember({ children }) {
  const { isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <AuthPage defaultMode="login" />;
  }

  return children;
}

// Route Guard: Enforce Admin Role & Authentication (strictly nexzibyte@gmail.com)
function RequireAdmin({ children }) {
  const { user, isLoggedIn } = useApp();
  const emailClean = (user?.email || "").toLowerCase().trim();
  const isStrictAdmin = isLoggedIn && (emailClean === "nexzibyte@gmail.com" || emailClean === "nexzibyteadmin@gmail.com");

  if (!isStrictAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}


/* ══════════════════════════════════════════════════════════════════
   PAGES
   ══════════════════════════════════════════════════════════════════ */

// 1. HOME PAGE
function HomePage() {
  return (
    <main className="home-page-luxury" style={{ position: "relative", overflowX: "hidden" }}>
      {/* Unified Continuous Warm Ambient Mesh Atmosphere across all sections */}
      <div className="mesh-ambient-glow-wrap" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="mesh-ambient-orb mesh-orb-amber" style={{ top: "3%", left: "-80px" }} />
        <div className="mesh-ambient-orb mesh-orb-coral" style={{ top: "12%", right: "-80px" }} />
        <div className="mesh-ambient-orb mesh-orb-ruby" style={{ top: "24%", left: "15%" }} />
        <div className="mesh-ambient-orb mesh-orb-purple" style={{ top: "36%", right: "10%" }} />
        <div className="mesh-ambient-orb mesh-orb-amber" style={{ top: "50%", left: "-60px" }} />
        <div className="mesh-ambient-orb mesh-orb-coral" style={{ top: "64%", right: "-80px" }} />
        <div className="mesh-ambient-orb mesh-orb-ruby" style={{ top: "78%", left: "10%" }} />
        <div className="mesh-ambient-orb mesh-orb-purple" style={{ top: "90%", right: "15%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <LogoMarquee />
        <CommunityIntro />
        <Stats />
        <TechnicalContent />
        <FounderMeets />
        <Testimonials />
        <CommunityImpact />
        <FAQ />
        <Newsletter />
      </div>
    </main>
  );
}

// 2. EXPLORE FEED PAGE (/explore)
function ExploreFeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCatParam = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(activeCatParam);
  const [searchFilter, setSearchFilter] = useState("");
  const { openArticleReader, userPosts = [] } = useApp();

  useEffect(() => {
    if (activeCatParam) {
      setActiveCategory(activeCatParam);
    }
  }, [activeCatParam]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  // Combine default technical articles and user published posts
  const allArticles = useMemo(() => {
    const combined = [...TECHNICAL_ARTICLES];
    (userPosts || []).forEach(post => {
      if (!combined.some(a => a.id === post.id)) {
        combined.push(post);
      }
    });
    return combined;
  }, [userPosts]);

  const isCategoryMatch = (articleCat, catId) => {
    if (!catId || catId === "all") return true;
    const cat = (articleCat || "").toLowerCase();
    const id = catId.toLowerCase();
    
    if (id === "python-ai") {
      return cat.includes("python") || cat.includes("ai") || cat.includes("ml") || cat.includes("machine learning");
    }
    if (id === "creative-media") {
      return cat.includes("creative") || cat.includes("media") || cat.includes("design") || cat.includes("video") || cat.includes("marketing");
    }
    if (id === "fullstack") {
      return cat.includes("full-stack") || cat.includes("fullstack") || cat.includes("web") || cat.includes("frontend") || cat.includes("react") || cat.includes("javascript");
    }
    if (id === "cloud") {
      return cat.includes("cloud") || cat.includes("infra") || cat.includes("devops") || cat.includes("backend") || cat.includes("system") || cat.includes("database");
    }
    if (id === "business") {
      return cat.includes("operations") || cat.includes("business") || cat.includes("bd") || cat.includes("hr") || cat.includes("support");
    }
    
    const catObj = CATEGORIES.find(c => c.id === id);
    if (catObj) {
      if (cat === catObj.name.toLowerCase() || cat.includes(catObj.name.toLowerCase()) || catObj.name.toLowerCase().includes(cat)) {
        return true;
      }
    }
    return cat.includes(id);
  };

  const filteredArticles = allArticles.filter((art) => {
    const matchesCat = isCategoryMatch(art.category, activeCategory);
    const matchesSearch = !searchFilter || 
      (art.title && art.title.toLowerCase().includes(searchFilter.toLowerCase())) || 
      (art.excerpt && art.excerpt.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (art.category && art.category.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ marginBottom: "36px" }}>
          <span className="section-label">COMMUNITY KNOWLEDGE</span>
          <h1 className="section-heading">Explore Feed &amp; Dispatches</h1>
          <p className="section-subtitle">
            Browse technical articles, architecture teardowns, and engineering insights across key technology domains.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
          <div style={{ position: "relative", maxWidth: "500px" }}>
            <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Search articles, architectures, tags..."
              className="form-input"
              style={{ paddingLeft: "44px", borderRadius: "var(--radius-full)" }}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className={`btn btn-sm ${activeCategory === "all" ? "btn-primary" : "btn-secondary"}`}
            >
              All Topics ({allArticles.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = allArticles.filter(art => isCategoryMatch(art.category, cat.id)).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`btn btn-sm ${activeCategory === cat.id ? "btn-primary" : "btn-secondary"}`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
          {filteredArticles.map((art) => (
            <ArticleCard3D
              key={art.id}
              article={art}
              onOpenReader={openArticleReader}
            />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>No dispatches found</h3>
            <p style={{ fontSize: "0.9375rem" }}>Try adjusting your search query or topic filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. SPEAKERS PAGE (/speakers)
function SpeakersPage() {
  return (
    <div className="inner-page-wrapper">
      <div className="page-hero-banner">
        <div className="container">
          <div className="page-hero-badge">
            <Mic size={14} style={{ color: "#38BDF8" }} />
            <span>DISTINGUISHED SPEAKERS &amp; ARCHITECTS</span>
          </div>
          <h1 className="page-hero-title">
            Learn From Industry Leaders &amp; <span className="hero-highlight-vibrant">Visionaries</span>
          </h1>
          <p className="page-hero-subtitle">
            Connect with keynote architects, engineering leaders, and founders from Fortune 500 tech enterprises and disruptive startups.
          </p>
        </div>
      </div>
      <Speakers />
      <Testimonials />
    </div>
  );
}

// 6. DEDICATED COURSES PAGE (/courses)
function CoursesPage() {
  return (
    <div className="inner-page-wrapper">
      <div className="page-hero-banner courses-hero-banner">
        <div className="container">
          <div className="page-hero-badge">
            <span>PROFESSIONAL TECHNICAL COURSES</span>
          </div>
          <h1 className="page-hero-title">
            Industry-Aligned Technical Courses &amp; Certifications
          </h1>
          <p className="page-hero-subtitle">
            Comprehensive curriculum, live architect-led masterclasses, hands-on enterprise projects, and verified skill certifications across 65+ technology domains.
          </p>
        </div>
      </div>
      <TechnologyTopics />
    </div>
  );
}

// 7. PASSES PAGE (/passes & /pricing)
function PassesPage() {
  return (
    <main className="passes-page-root" style={{ background: "transparent", minHeight: "100vh" }}>
      <Passes />
    </main>
  );
}

// 8. SCANNER PAGE (/scanner)
function ScannerPage() {
  return (
    <div style={{ paddingTop: "20px" }}>
      <QRScanner />
      <DigitalPass />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN APPLICATION ROUTER & WRAPPER
   ══════════════════════════════════════════════════════════════════ */
function App() {
  const { toastMessage } = useApp();
  const location = useLocation();

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";
  const isEventsPage = location.pathname === "/events" || location.pathname.startsWith("/events/");
  const isPassesPage = location.pathname === "/passes" || location.pathname === "/pricing";
  const isCheckoutPage = location.pathname.startsWith("/checkout") || location.pathname === "/payment";
  const isUserPlatformPage = [
    "/profile",
    "/saved-posts",
    "/my-posts",
    "/notifications",
    "/settings"
  ].includes(location.pathname);

  return (
    <div className={`app-shell ${isHomePage ? "app-shell-home-luxury" : "app-shell-luxury-mesh"} ${isPassesPage ? "app-shell-passes" : ""} ${isCheckoutPage ? "app-shell-checkout" : ""} ${isUserPlatformPage ? "app-shell-platform" : ""}`}>
      {/* Sticky Header Navigation (hidden on distraction-free checkout and user logged-in platform page) */}
      {!isCheckoutPage && !isUserPlatformPage && <Navbar />}

      {/* Luminous Ambient Mesh Lighting across all pages */}
      {!isCheckoutPage && (
        <div className="mesh-ambient-glow-wrap" aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div className="mesh-ambient-orb mesh-orb-purple" style={{ top: "5%", left: "-80px", opacity: 0.55 }} />
          <div className="mesh-ambient-orb mesh-orb-amber" style={{ top: "25%", right: "-80px", opacity: 0.45 }} />
          <div className="mesh-ambient-orb mesh-orb-coral" style={{ top: "55%", left: "10%", opacity: 0.5 }} />
          <div className="mesh-ambient-orb mesh-orb-ruby" style={{ top: "80%", right: "15%", opacity: 0.45 }} />
        </div>
      )}

      {/* Main Routed Content */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/explore" element={<ExploreFeedPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/members" element={<CommunityPage />} />
          <Route path="/posts" element={<CommunityPage />} />
          <Route path="/experts" element={<CommunityPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
          <Route path="/saved-posts" element={<RequireVerifiedMember><UserProfilePage /></RequireVerifiedMember>} />
          <Route path="/my-posts" element={<RequireVerifiedMember><UserProfilePage /></RequireVerifiedMember>} />
          <Route path="/notifications" element={<RequireVerifiedMember><UserProfilePage /></RequireVerifiedMember>} />
          <Route path="/settings" element={<RequireVerifiedMember><UserProfilePage /></RequireVerifiedMember>} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/create-post" element={<RequireVerifiedMember><CreatePostPage /></RequireVerifiedMember>} />
          <Route path="/login" element={<AuthPage defaultMode="login" />} />
          <Route path="/register" element={<AuthPage defaultMode="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/otp" element={<VerifyEmailPage />} />
          <Route path="/verify-otp" element={<VerifyEmailPage />} />
          <Route path="/login-otp" element={<VerifyEmailPage />} />
          <Route path="/email-verification" element={<VerifyEmailPage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/onboarding" element={<CreateProfilePage />} />
          <Route path="/summits" element={<SummitsPage />} />
          <Route path="/summits/:id" element={<Navigate to="/events" replace />} />
          <Route path="/summit-details" element={<Navigate to="/events" replace />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/internship" element={<InternshipPage />} />
          <Route path="/founder-meets" element={<FounderMeetsPage />} />
          <Route path="/founder-meets/:id" element={<FounderMeetDetailsPage />} />
          <Route path="/founder-meet-details" element={<FounderMeetDetailsPage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/partner-with-us" element={<PartnerPage />} />
          <Route path="/passes" element={<PassesPage />} />
          <Route path="/pricing" element={<PassesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/:passId" element={<CheckoutPage />} />
          <Route path="/payment" element={<CheckoutPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms" element={<LegalPage initialTab="terms" />} />
          <Route path="/terms-and-conditions" element={<LegalPage initialTab="terms" />} />
          <Route path="/terms-of-service" element={<LegalPage initialTab="terms" />} />
          <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
          <Route path="/privacy-policy" element={<LegalPage initialTab="privacy" />} />
          <Route path="/profile" element={<RequireVerifiedMember><UserProfilePage /></RequireVerifiedMember>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {/* Spacious Footer (hidden on distraction-free checkout and user logged-in platform page) */}
      {!isCheckoutPage && !isUserPlatformPage && <Footer />}

      {/* Modals */}
      <PassRegistrationModal />
      <VideoModal />
      <ArticleModal />
      <SummitModal />
      <CourseModal />
      <InternshipModal />
      <LoginModal />

      {/* Interactive Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner" role="alert">
          
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// Error Boundary to prevent blank white screens on runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TechTalk ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F7F5F0", color: "#18181B" }}>
          <div style={{ maxWidth: "540px", background: "#FFFFFF", padding: "36px", borderRadius: "16px", border: "1px solid #E7E3DC", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px", color: "#6C2BD9" }}>TechTalk Platform Recovery</h2>
            <p style={{ fontSize: "0.9375rem", color: "#666666", marginBottom: "20px" }}>
              An unexpected render issue occurred. Click below to recover or return home.
            </p>
            {this.state.error?.message && (
              <pre style={{ fontSize: "0.8125rem", background: "#FFF7ED", color: "#9A3412", padding: "10px 14px", borderRadius: "8px", overflowX: "auto", textAlign: "left", marginBottom: "20px" }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                type="button" 
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
                style={{ padding: "10px 20px", background: "#6C2BD9", color: "#FFFFFF", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Return to Home
              </button>
              <button 
                type="button" 
                onClick={() => window.location.reload()}
                style={{ padding: "10px 20px", background: "#E7E3DC", color: "#18181B", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Root Render
const rootElement = document.getElementById("root");
if (rootElement) {
  if (!window.__techtalk_root) {
    window.__techtalk_root = createRoot(rootElement);
  }
  window.__techtalk_root.render(
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
