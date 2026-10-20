import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Lock, Mail, User, Eye, EyeOff, 
  ArrowLeft, LogOut, Phone, ShieldCheck,
  Clock, CheckCircle2, RefreshCw, AlertCircle, Check
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

import { api } from "../services/api.js";

import { NexziByteLogo } from "./NexziByteLogo.jsx";
import PolicyModal from "./PolicyModal.jsx";

const OTP_EXPIRY_SECONDS = 300; // 5 minutes

// Official NexziByte TechTalk Brand Logo mark (Light theme with crisp dark navy text & purple X)
export function TechTalkMinimalLogo({ size = 1, theme = "light", showSubtitle = true }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `scale(${size})`, transformOrigin: "center", margin: "4px 0" }}>
      <NexziByteLogo height={38} theme={theme} showTechTalk={true} showSubtitle={showSubtitle} />
    </div>
  );
}

const ROLE_OPTIONS = [
  "Senior Full Stack Developer",
  "Distributed Systems Architect",
  "Frontend Engineer (React / Next.js)",
  "Backend Engineer (Python / FastAPI / Node)",
  "AI / Machine Learning Engineer",
  "Data Scientist / Data Analyst",
  "Cloud & DevOps / SRE Engineer",
  "Cybersecurity & DevSecOps Specialist",
  "Mobile App Developer (iOS / Android / Flutter)",
  "UI/UX & Product Designer",
  "Product Manager / Technical Lead",
  "Founder / Co-Founder / CEO / CTO",
  "Technology Student / Academic Researcher",
  "QA & Test Automation Engineer",
  "Blockchain & Web3 Developer",
  "IT Consultant / Solutions Architect",
  "Engineering Director / VP of Tech",
  "Tech Recruiter & Talent Partner",
  "Others"
];

export default function AuthPage({ defaultMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, isLoggedIn, logout, showToast } = useApp();

  const searchParams = new URLSearchParams(location.search);
  const emailQuery = searchParams.get("email") || "";
  const stepQuery = searchParams.get("step") || "";

  // Mode: "login" or "register"
  const [mode, setMode] = useState(
    location.pathname === "/register" ? "register" : defaultMode
  );

  // Login Steps: "form" or "otp"
  const [loginStep, setLoginStep] = useState(stepQuery === "otp" || emailQuery ? "otp" : "form");

  // Sync mode with route if navigating between /login and /register
  useEffect(() => {
    if (location.pathname === "/register") {
      setMode("register");
      setLoginStep("form");
    } else if (location.pathname === "/login") {
      setMode("login");
    }
  }, [location.pathname]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState(emailQuery || user?.email || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 6-Digit OTP States
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    if (loginStep !== "otp") return;
    if (timeLeft <= 0) {
      setIsTimerExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loginStep, timeLeft]);

  // Resend cooldown tick
  useEffect(() => {
    if (loginStep !== "otp" || resendCooldown <= 0) return;
    const cdTimer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cdTimer);
  }, [loginStep, resendCooldown]);

  // Auto focus first OTP input on step change
  useEffect(() => {
    if (loginStep === "otp" && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [loginStep]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // OTP Input handlers
  const handleDigitChange = (index, value) => {
    setOtpError("");
    const cleaned = value.replace(/[^0-9]/g, "");
    const lastChar = cleaned.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === 6 && !newOtp.includes("")) {
      performLoginOtpVerification(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    setOtpError("");
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (!pastedData) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      performLoginOtpVerification(newOtp.join(""));
    }
  };

  // Perform OTP Verification
  const performLoginOtpVerification = async (codeToVerify) => {
    const code = codeToVerify || otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (timeLeft <= 0) {
      setOtpError("Verification code expired. Please request a new code.");
      return;
    }

    setIsSubmitting(true);
    setOtpError("");

    try {
      const res = await api.verifyEmail(loginEmail.trim(), code);
      setIsOtpSuccess(true);
      setUser({
        ...(res.user || {}),
        email: loginEmail.trim(),
        name: res.user?.name || loginEmail.trim().split("@")[0],
        isLoggedIn: true,
        is_verified: true
      });
      const emailClean = loginEmail.trim().toLowerCase();
      const isAdmin = (emailClean === "nexzibyte@gmail.com" || emailClean === "nexzibyteadmin@gmail.com") && res.user?.role === "admin";
      if (isAdmin) {
        showToast(`👑 Verification successful! Welcome to Command Center, ${res.user?.name || "Admin"}!`);
      } else {
        showToast("🎉 Verification successful! Welcome back to TechTalk.");
      }

      setTimeout(() => {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }, 1000);
    } catch (err) {
      setOtpError(err.message || "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 && !isTimerExpired) return;
    setIsResending(true);
    setOtpError("");

    try {
      await api.resendVerification(loginEmail.trim());
      showToast(`📩 A new 6-digit verification code has been dispatched to ${loginEmail.trim()}.`);
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsTimerExpired(false);
      setResendCooldown(60);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setOtpError(err.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState(ROLE_OPTIONS[0]);
  const [customRole, setCustomRole] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(null);

  // Field Validation Errors & Touched States
  const [loginErrors, setLoginErrors] = useState({ identifier: "", password: "" });
  const [loginTouched, setLoginTouched] = useState({ identifier: false, password: false });

  const [regErrors, setRegErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: ""
  });
  const [regTouched, setRegTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    terms: false
  });

  // Password Strength Evaluator (0 to 4 score)
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "#64748B", percent: "0%" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (pass.length < 8) {
      return { score: 1, label: "Too Short", color: "#EF4444", percent: "25%" };
    }
    if (score === 1) return { score: 1, label: "Weak", color: "#EF4444", percent: "25%" };
    if (score === 2) return { score: 2, label: "Fair", color: "#F59E0B", percent: "50%" };
    if (score === 3) return { score: 3, label: "Good", color: "#3B82F6", percent: "75%" };
    return { score: 4, label: "Strong", color: "#10B981", percent: "100%" };
  };

  const passwordStrength = getPasswordStrength(regPassword);

  // Validation functions (Like real enterprise web apps)
  const validateName = (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return "Full Name is required.";
    if (trimmed.length < 2) return "Full Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return "Name must only contain letters, spaces, or hyphens (no numbers or symbols).";
    return "";
  };

  const validateEmail = (email) => {
    const trimmed = (email || "").trim();
    if (!trimmed) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    return "";
  };

  const validatePhone = (phone) => {
    const trimmed = (phone || "").trim();
    if (!trimmed) return "Contact / Mobile number is required.";
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 10) {
      return "Please enter a valid mobile number (minimum 10 digits).";
    }
    if (digits.length > 15) {
      return "Mobile number must not exceed 15 digits.";
    }
    return "";
  };

  const validatePassword = (pass) => {
    if (!pass) return "Password is required.";
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-zA-Z]/.test(pass) || !/[0-9\W]/.test(pass)) {
      return "Password must include both letters and numbers/special characters.";
    }
    return "";
  };

  const validateConfirmPassword = (pass, confirm) => {
    if (!confirm) return "Please confirm your password.";
    if (pass !== confirm) return "Passwords do not match.";
    return "";
  };

  const validateLoginIdentifier = (val) => {
    const trimmed = (val || "").trim();
    if (!trimmed) return "Please enter your email or mobile number.";
    const isDigits = /^\+?[0-9\s-]{10,}$/.test(trimmed);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
    if (!isDigits && !isEmail) {
      return "Please enter a valid email address or 10-digit mobile number.";
    }
    return "";
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setLoginTouched({ identifier: true, password: true });
    const identifierErr = validateLoginIdentifier(loginEmail);
    const passwordErr = !loginPassword ? "Please enter your password." : (loginPassword.length < 4 ? "Password must be at least 4 characters." : "");

    setLoginErrors({ identifier: identifierErr, password: passwordErr });

    if (identifierErr || passwordErr) {
      showToast("⚠️ Please enter a valid email/phone and password.");
      return;
    }

    const cleanIdentifier = loginEmail.trim();
    setIsSubmitting(true);

    try {
      const res = await api.login(cleanIdentifier, loginPassword);
      showToast(res?.message || `📩 A 6-digit OTP has been sent to ${cleanIdentifier}. Please enter the code to sign in.`);
      setLoginStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsTimerExpired(false);
      setResendCooldown(60);
    } catch (err) {
      const errorMsg = err?.message || "Invalid email or password. Please verify your credentials.";
      setLoginErrors((prev) => ({ ...prev, password: errorMsg }));
      showToast(`⚠️ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nameErr = validateName(regName);
    const emailErr = validateEmail(regEmail);
    const phoneErr = validatePhone(regPhone);
    const passwordErr = validatePassword(regPassword);
    const confirmErr = validateConfirmPassword(regPassword, regConfirmPassword);
    const termsErr = !agreedToTerms ? "You must agree to the Terms of Service & Privacy Policy." : "";

    setRegTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true
    });

    setRegErrors({
      name: nameErr,
      email: emailErr,
      phone: phoneErr,
      password: passwordErr,
      confirmPassword: confirmErr,
      terms: termsErr
    });

    if (nameErr || emailErr || phoneErr || passwordErr || confirmErr || termsErr) {
      showToast("⚠️ Please correct all flagged registration fields.");
      return;
    }

    setIsSubmitting(true);
    const cleanEmail = regEmail.trim();
    const cleanName = regName.trim();
    const initials = cleanName.split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase();
    const resolvedRole = regRole === "Others" && customRole.trim() ? customRole.trim() : regRole;

    try {
      const regRes = await api.register({
        email: cleanEmail,
        password: regPassword,
        name: cleanName,
        full_name: cleanName,
        phone: regPhone.trim(),
        role: resolvedRole,
        title: resolvedRole
      });

      // Update session state as unverified initially
      setUser((prev) => ({
        ...prev,
        name: cleanName,
        fullName: cleanName,
        email: cleanEmail,
        phone: regPhone.trim(),
        contact: regPhone.trim(),
        role: resolvedRole,
        title: resolvedRole,
        avatarInitials: initials,
        isLoggedIn: false,
        is_verified: false
      }));

      showToast(`🎉 Verification code dispatched to ${cleanEmail}! Please enter your 6-digit OTP.`);
      navigate(`/verify-email?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err) {
      showToast(`⚠️ ${err.message || "Registration error. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate(loginEmail ? `/forgot-password?email=${encodeURIComponent(loginEmail.trim())}` : "/forgot-password");
  };

  return (
    <div className="auth-page-root" style={{
      minHeight: "88vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 20px",
      background: "transparent"
    }}>
      {/* Back to Home Breadcrumb Link */}
      <div style={{ width: "100%", maxWidth: "460px", marginBottom: "16px" }}>
        <Link 
          to="/" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#94A3B8",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            transition: "color 0.15s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Active Session Notice Banner if already logged in */}
      {isLoggedIn && (
        <div style={{
          width: "100%",
          maxWidth: "460px",
          marginBottom: "20px",
          padding: "14px 18px",
          borderRadius: "14px",
          background: "rgba(108, 43, 217, 0.2)",
          border: "1.5px solid rgba(168, 85, 247, 0.4)",
          backdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
        }}>
          <div style={{ fontSize: "0.85rem", color: "#E9D5FF" }}>
            <span>Signed in as <strong style={{ color: "#FFFFFF" }}>{user?.name || "Member"}</strong></span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={{
                padding: "6px 14px",
                fontSize: "0.8rem",
                borderRadius: "9999px",
                background: "#6C2BD9",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(108, 43, 217, 0.35)"
              }}
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: "6px 14px",
                fontSize: "0.8rem",
                borderRadius: "9999px",
                background: "transparent",
                color: "#FCA5A5",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <LogOut size={12} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* Centered Auth Card on Dark Luxury Background */}
      <div style={{
        width: "100%",
        maxWidth: "460px",
        background: "rgba(14, 10, 48, 0.85)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)"
      }}>
        {/* 1. Official NexziByte TechTalk Logo Mark */}
        <div style={{ marginBottom: "22px" }}>
          <TechTalkMinimalLogo size={1.05} theme="dark" />
        </div>

        {/* 2. Heading */}
        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "#FFFFFF",
          margin: "0 0 24px 0",
          letterSpacing: "-0.025em"
        }}>
          {mode === "register" 
            ? "Create your account" 
            : (loginStep === "otp" ? "Security Verification" : "Log in to your account")}
        </h1>

        {/* ─── LOGIN MODE WITH 6-DIGIT OTP VERIFICATION STEP ─── */}
        {mode === "login" && (
          <div style={{ width: "100%" }}>
            {loginStep === "otp" ? (
              /* OTP 6-DIGIT NUMERIC CODE SCREEN */
              <div style={{ width: "100%", textAlign: "center" }}>
                <p style={{
                  fontSize: "0.9375rem",
                  color: "#94A3B8",
                  lineHeight: 1.55,
                  margin: "0 0 20px 0"
                }}>
                  Enter the 6-digit numeric OTP sent to
                  <br />
                  <strong style={{ color: "#FFFFFF", wordBreak: "break-all" }}>
                    {loginEmail || "your registered email"}
                  </strong>
                  {" "}
                  <button
                    type="button"
                    onClick={() => setLoginStep("form")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#C084FC",
                      fontSize: "0.825rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: "0 4px",
                      textDecoration: "underline"
                    }}
                  >
                    (Change)
                  </button>
                </p>

                {/* 6 individual OTP number boxes */}
                <div 
                  className="otp-inputs-grid"
                  onPaste={handlePaste}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "18px"
                  }}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isOtpSuccess || isSubmitting}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-digit-box"
                      style={{
                        width: "50px",
                        height: "58px",
                        borderRadius: "12px",
                        border: otpError 
                          ? "2px solid #EF4444" 
                          : (digit ? "2px solid #8B5CF6" : "1.5px solid rgba(255, 255, 255, 0.25)"),
                        background: isOtpSuccess 
                          ? "rgba(34, 197, 94, 0.25)" 
                          : (digit ? "rgba(108, 43, 217, 0.35)" : "rgba(255, 255, 255, 0.08)"),
                        color: isOtpSuccess ? "#4ADE80" : "#FFFFFF",
                        fontSize: "1.65rem",
                        fontWeight: 900,
                        textAlign: "center",
                        outline: "none",
                        transition: "all 0.18s ease",
                        boxShadow: digit ? "0 2px 12px rgba(108, 43, 217, 0.4)" : "none"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#A855F7";
                        e.target.style.background = "rgba(108, 43, 217, 0.4)";
                        e.target.style.boxShadow = "0 0 0 4px rgba(168, 85, 247, 0.35)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = digit ? "#8B5CF6" : "rgba(255, 255, 255, 0.25)";
                        e.target.style.background = digit ? "rgba(108, 43, 217, 0.35)" : "rgba(255, 255, 255, 0.08)";
                        e.target.style.boxShadow = digit ? "0 2px 12px rgba(108, 43, 217, 0.4)" : "none";
                      }}
                    />
                  ))}
                </div>

                {/* Countdown Timer */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "18px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: isTimerExpired ? "#F87171" : (timeLeft < 60 ? "#FBBF24" : "#94A3B8")
                }}>
                  <Clock size={16} style={{ color: "inherit" }} />
                  <span>
                    {isTimerExpired ? (
                      <strong style={{ color: "#F87171" }}>Code Expired</strong>
                    ) : (
                      <>Code expires in <strong style={{ color: "#FFFFFF" }}>{formatTime(timeLeft)}</strong></>
                    )}
                  </span>
                </div>

                {/* Error Banner */}
                {otpError && (
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    color: "#FCA5A5",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: "16px"
                  }}>
                    {otpError}
                  </div>
                )}

                {/* Primary Verify Button */}
                <button
                  type="button"
                  id="btn-verify-otp"
                  disabled={isSubmitting || otp.includes("")}
                  onClick={() => performLoginOtpVerification()}
                  style={{
                    width: "100%",
                    padding: "15px 28px",
                    borderRadius: "9999px",
                    background: (isSubmitting || otp.includes("")) 
                      ? "rgba(108, 43, 217, 0.5)" 
                      : "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                    color: "#FFFFFF",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    border: "none",
                    cursor: (isSubmitting || otp.includes("")) ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
                    transition: "transform 0.15s ease, background 0.15s ease",
                    marginBottom: "14px"
                  }}
                >
                  {isSubmitting ? "Verifying OTP..." : "Verify & Sign In"}
                </button>

                {/* Resend Action */}
                <div style={{ marginTop: "12px", fontSize: "0.875rem", color: "#94A3B8" }}>
                  <span>Didn't receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending || (resendCooldown > 0 && !isTimerExpired)}
                    style={{
                      background: "none",
                      border: "none",
                      color: (resendCooldown > 0 && !isTimerExpired) ? "#64748B" : "#C084FC",
                      fontWeight: 700,
                      cursor: (resendCooldown > 0 && !isTimerExpired) ? "default" : "pointer",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <RefreshCw size={13} className={isResending ? "animate-spin" : ""} />
                    <span>
                      {isResending ? "Resending..." : (resendCooldown > 0 && !isTimerExpired ? `Resend code in ${resendCooldown}s` : "Resend OTP Code")}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* LOGIN FORM */
              <>
                <form onSubmit={handleLoginSubmit} style={{ width: "100%", textAlign: "left", marginBottom: "20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                      Email Address or Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginTouched.identifier) {
                          setLoginErrors(prev => ({ ...prev, identifier: validateLoginIdentifier(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        setLoginTouched(prev => ({ ...prev, identifier: true }));
                        setLoginErrors(prev => ({ ...prev, identifier: validateLoginIdentifier(loginEmail) }));
                      }}
                      placeholder="Enter your email or 10-digit mobile number"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: loginErrors.identifier 
                          ? "1.5px solid #EF4444" 
                          : (loginTouched.identifier && !loginErrors.identifier ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                        fontSize: "0.95rem",
                        background: loginErrors.identifier ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                        color: "#FFFFFF",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    {loginErrors.identifier && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                        <AlertCircle size={14} />
                        <span>{loginErrors.identifier}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0" }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#C084FC",
                          fontSize: "0.825rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          padding: 0
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginTouched.password) {
                            setLoginErrors(prev => ({ ...prev, password: !e.target.value ? "Please enter your password." : "" }));
                          }
                        }}
                        onBlur={() => {
                          setLoginTouched(prev => ({ ...prev, password: true }));
                          setLoginErrors(prev => ({ ...prev, password: !loginPassword ? "Please enter your password." : "" }));
                        }}
                        placeholder="Enter your password"
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          paddingRight: "44px",
                          borderRadius: "12px",
                          border: loginErrors.password 
                            ? "1.5px solid #EF4444" 
                            : (loginTouched.password && !loginErrors.password ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                          fontSize: "0.95rem",
                          background: loginErrors.password ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                          color: "#FFFFFF",
                          outline: "none",
                          boxSizing: "border-box"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label="Toggle password visibility"
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "#94A3B8",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                        <AlertCircle size={14} />
                        <span>{loginErrors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Clean primary login button */}
                  <button
                    type="submit"
                    id="btn-sign-in-email"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "16px 28px",
                      borderRadius: "9999px",
                      background: isSubmitting ? "#8B5CF6" : "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                      color: "#FFFFFF",
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      border: "none",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.8 : 1,
                      boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
                      transition: "transform 0.15s ease, background 0.15s ease",
                      display: "block"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(108, 43, 217, 0.55)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(108, 43, 217, 0.35)";
                      }
                    }}
                  >
                    {isSubmitting ? "Sending OTP..." : "Sign in with an email"}
                  </button>
                </form>

                {/* Links below */}
                <div style={{
                  marginTop: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "0.95rem"
                }}>
                  <div style={{ color: "#94A3B8" }}>
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      id="link-to-register"
                      onClick={() => { setMode("register"); setShowEmailInput(true); }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#C084FC",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                        fontSize: "inherit"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                    >
                      Create account
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      id="link-forgot-password"
                      onClick={handleForgotPassword}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#C084FC",
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                        fontSize: "inherit"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── CREATE ACCOUNT MODE (§Same Format & Picture 3 Colors) ─── */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} style={{ width: "100%", textAlign: "left" }}>
            {/* Full Name Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => {
                  setRegName(e.target.value);
                  if (regTouched.name) {
                    setRegErrors(prev => ({ ...prev, name: validateName(e.target.value) }));
                  }
                }}
                onBlur={() => {
                  setRegTouched(prev => ({ ...prev, name: true }));
                  setRegErrors(prev => ({ ...prev, name: validateName(regName) }));
                }}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: regErrors.name 
                    ? "1.5px solid #EF4444" 
                    : (regTouched.name && !regErrors.name ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                  fontSize: "0.95rem",
                  background: regErrors.name ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              {regErrors.name && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                  <AlertCircle size={14} />
                  <span>{regErrors.name}</span>
                </div>
              )}
            </div>

            {/* Email Address Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => {
                  setRegEmail(e.target.value);
                  if (regTouched.email) {
                    setRegErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }));
                  }
                }}
                onBlur={() => {
                  setRegTouched(prev => ({ ...prev, email: true }));
                  setRegErrors(prev => ({ ...prev, email: validateEmail(regEmail) }));
                }}
                placeholder="Enter your email address"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: regErrors.email 
                    ? "1.5px solid #EF4444" 
                    : (regTouched.email && !regErrors.email ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                  fontSize: "0.95rem",
                  background: regErrors.email ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              {regErrors.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                  <AlertCircle size={14} />
                  <span>{regErrors.email}</span>
                </div>
              )}
            </div>

            {/* Contact / Mobile Number Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                Contact / Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => {
                  // Only allow digits, plus sign, spaces, hyphens and parenthesis (filter letters out like real websites)
                  const sanitized = e.target.value.replace(/[^\d+\s\-()]/g, "");
                  setRegPhone(sanitized);
                  if (regTouched.phone) {
                    setRegErrors(prev => ({ ...prev, phone: validatePhone(sanitized) }));
                  }
                }}
                onBlur={() => {
                  setRegTouched(prev => ({ ...prev, phone: true }));
                  setRegErrors(prev => ({ ...prev, phone: validatePhone(regPhone) }));
                }}
                placeholder="e.g. 9876543210 or +91 98765 43210"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: regErrors.phone 
                    ? "1.5px solid #EF4444" 
                    : (regTouched.phone && !regErrors.phone ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                  fontSize: "0.95rem",
                  background: regErrors.phone ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              {regErrors.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                  <AlertCircle size={14} />
                  <span>{regErrors.phone}</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                Primary Technical Role
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "0.925rem",
                  background: "#19133F",
                  color: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              >
                {ROLE_OPTIONS.map((r, i) => (
                  <option key={i} value={r} style={{ background: "#15103A", color: "#FFFFFF" }}>{r}</option>
                ))}
              </select>

              {regRole === "Others" && (
                <div style={{ marginTop: "12px", padding: "14px", background: "rgba(108, 43, 217, 0.2)", borderRadius: "12px", border: "1.5px solid rgba(168, 85, 247, 0.4)" }}>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#C084FC", marginBottom: "6px" }}>
                    Specify Your Custom Profession / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Embedded Systems Engineer, Solutions Specialist"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      fontSize: "0.875rem",
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (regTouched.password) {
                      setRegErrors(prev => ({ 
                        ...prev, 
                        password: validatePassword(e.target.value),
                        confirmPassword: regConfirmPassword ? validateConfirmPassword(e.target.value, regConfirmPassword) : prev.confirmPassword
                      }));
                    }
                  }}
                  onBlur={() => {
                    setRegTouched(prev => ({ ...prev, password: true }));
                    setRegErrors(prev => ({ ...prev, password: validatePassword(regPassword) }));
                  }}
                  placeholder="At least 8 characters (letters & numbers)"
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    paddingRight: "44px",
                    borderRadius: "12px",
                    border: regErrors.password 
                      ? "1.5px solid #EF4444" 
                      : (regTouched.password && !regErrors.password ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                    fontSize: "0.95rem",
                    background: regErrors.password ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                    color: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Real-time Password Strength Meter */}
              {regPassword && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Password Strength:</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "4px", height: "4px", width: "100%" }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step}
                        style={{
                          flex: 1,
                          borderRadius: "2px",
                          background: step <= passwordStrength.score ? passwordStrength.color : "rgba(255, 255, 255, 0.15)",
                          transition: "background 0.25s ease"
                        }}
                      />
                    ))}
                  </div>

                  {/* Requirements checklist */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "6px", fontSize: "0.75rem" }}>
                    <span style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "3px", 
                      color: regPassword.length >= 8 ? "#4ADE80" : "#94A3B8" 
                    }}>
                      {regPassword.length >= 8 ? <Check size={12} /> : "○"} 8+ characters
                    </span>
                    <span style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "3px", 
                      color: (/[a-zA-Z]/.test(regPassword) && /[0-9\W]/.test(regPassword)) ? "#4ADE80" : "#94A3B8" 
                    }}>
                      {(/[a-zA-Z]/.test(regPassword) && /[0-9\W]/.test(regPassword)) ? <Check size={12} /> : "○"} Letters & numbers
                    </span>
                  </div>
                </div>
              )}

              {regErrors.password && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                  <AlertCircle size={14} />
                  <span>{regErrors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                Confirm Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showRegConfirmPassword ? "text" : "password"}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    if (regTouched.confirmPassword) {
                      setRegErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(regPassword, e.target.value) }));
                    }
                  }}
                  onBlur={() => {
                    setRegTouched(prev => ({ ...prev, confirmPassword: true }));
                    setRegErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(regPassword, regConfirmPassword) }));
                  }}
                  placeholder="Re-enter your password"
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    paddingRight: "44px",
                    borderRadius: "12px",
                    border: regErrors.confirmPassword 
                      ? "1.5px solid #EF4444" 
                      : (regConfirmPassword && regConfirmPassword === regPassword ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                    fontSize: "0.95rem",
                    background: regErrors.confirmPassword ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)",
                    color: "#FFFFFF",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Live match indicator */}
              {regConfirmPassword && regConfirmPassword === regPassword && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4ADE80", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                  <CheckCircle2 size={14} />
                  <span>Passwords match</span>
                </div>
              )}

              {regErrors.confirmPassword && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                  <AlertCircle size={14} />
                  <span>{regErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Terms of Service & Privacy Policy Agreement Checkbox */}
            <div style={{
              marginBottom: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              background: regErrors.terms ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.04)",
              padding: "12px 14px",
              borderRadius: "12px",
              border: regErrors.terms ? "1.5px solid #EF4444" : "1px solid rgba(255, 255, 255, 0.12)"
            }}>
              <input
                type="checkbox"
                id="checkbox-agree-policy"
                required
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (regTouched.terms) {
                    setRegErrors(prev => ({ ...prev, terms: !e.target.checked ? "You must agree to the Terms of Service & Privacy Policy." : "" }));
                  }
                }}
                style={{
                  width: "18px",
                  height: "18px",
                  marginTop: "2px",
                  accentColor: "#6C2BD9",
                  cursor: "pointer",
                  flexShrink: 0
                }}
              />
              <label 
                htmlFor="checkbox-agree-policy" 
                style={{ 
                  fontSize: "0.85rem", 
                  color: "#94A3B8", 
                  lineHeight: 1.5, 
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                I agree to NexziByte TechTalk's{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setPolicyModalOpen("terms"); }}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "#C084FC", 
                    fontWeight: 700, 
                    textDecoration: "underline", 
                    cursor: "pointer", 
                    padding: 0, 
                    fontSize: "inherit" 
                  }}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setPolicyModalOpen("privacy"); }}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "#C084FC", 
                    fontWeight: 700, 
                    textDecoration: "underline", 
                    cursor: "pointer", 
                    padding: 0, 
                    fontSize: "inherit" 
                  }}
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>
            {regErrors.terms && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginBottom: "16px", fontWeight: 600 }}>
                <AlertCircle size={14} />
                <span>{regErrors.terms}</span>
              </div>
            )}

            {/* Purple rounded pill button for register matching Picture 3 colors */}
            <button
              type="submit"
              id="btn-create-account"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "16px 28px",
                borderRadius: "9999px",
                background: isSubmitting ? "#8B5CF6" : "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                color: "#FFFFFF",
                fontSize: "1.05rem",
                fontWeight: 800,
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
                boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
                display: "block",
                transition: "transform 0.15s ease, background 0.15s ease"
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(108, 43, 217, 0.55)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(108, 43, 217, 0.35)";
                }
              }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            {/* Back to Login link */}
            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "0.95rem", color: "#94A3B8" }}>
              <span>Already have an account? </span>
              <button
                type="button"
                id="link-to-login"
                onClick={() => setMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#C084FC",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "inherit"
                }}
              >
                Log in
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Interactive Terms & Privacy Policy Modal */}
      <PolicyModal
        isOpen={Boolean(policyModalOpen)}
        initialTab={policyModalOpen || "terms"}
        onClose={() => setPolicyModalOpen(null)}
        onAccept={() => {
          setAgreedToTerms(true);
          setPolicyModalOpen(null);
        }}
      />
    </div>
  );
}
