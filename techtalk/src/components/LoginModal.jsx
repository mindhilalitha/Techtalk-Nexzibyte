import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight, Clock, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { TechTalkMinimalLogo } from "./AuthPage.jsx";
import { api } from "../services/api.js";

const OTP_EXPIRY_SECONDS = 300; // 5 minutes

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, user, setUser, showToast } = useApp();
  const navigate = useNavigate();

  // Mode: "login" or "otp"
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({ identifier: "", password: "" });
  const [fieldTouched, setFieldTouched] = useState({ identifier: false, password: false });

  // OTP inputs state (array of 6 strings)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset modal state when opened
  useEffect(() => {
    if (loginModalOpen) {
      setStep("login");
      setOtp(["", "", "", "", "", ""]);
      setErrorMessage("");
      setIsSuccess(false);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsTimerExpired(false);
      setResendCooldown(60);
    }
  }, [loginModalOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== "otp") return;
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
  }, [step, timeLeft]);

  // Resend cooldown tick
  useEffect(() => {
    if (step !== "otp" || resendCooldown <= 0) return;
    const cdTimer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cdTimer);
  }, [step, resendCooldown]);

  // Focus first input on step change
  useEffect(() => {
    if (step === "otp" && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [step]);

  if (!loginModalOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const validateIdentifier = (val) => {
    const trimmed = (val || "").trim();
    if (!trimmed) return "Please enter your email or mobile number.";
    const isDigits = /^\+?[0-9\s-]{10,}$/.test(trimmed);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
    if (!isDigits && !isEmail) {
      return "Please enter a valid email address or 10-digit mobile number.";
    }
    return "";
  };

  // Step 1: Handle Login Submit & Dispatch OTP
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setFieldTouched({ identifier: true, password: true });
    const identifierErr = validateIdentifier(email);
    const passwordErr = !password ? "Please enter your password." : (password.length < 4 ? "Password must be at least 4 characters." : "");

    setFieldErrors({ identifier: identifierErr, password: passwordErr });

    if (identifierErr || passwordErr) {
      showToast("⚠️ Please enter a valid email/phone and password.");
      return;
    }

    const cleanIdentifier = email.trim();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await api.login(cleanIdentifier, password);
      showToast(res?.message || `📩 A 6-digit OTP has been sent to ${cleanIdentifier}. Please enter it to sign in.`);
      setStep("otp");
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsTimerExpired(false);
      setResendCooldown(60);
    } catch (err) {
      const errorMsg = err?.message || "Invalid credentials. Please verify your email and password.";
      setFieldErrors((prev) => ({ ...prev, password: errorMsg }));
      setErrorMessage(errorMsg);
      showToast(`⚠️ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle single digit input
  const handleDigitChange = (index, value) => {
    setErrorMessage("");
    const cleaned = value.replace(/[^0-9]/g, "");
    const lastChar = cleaned.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // Auto-advance to next input
    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 6 are filled
    const fullCode = newOtp.join("");
    if (fullCode.length === 6 && !newOtp.includes("")) {
      performVerification(fullCode);
    }
  };

  // Handle backspace navigation
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

  // Handle paste full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    setErrorMessage("");
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
      performVerification(newOtp.join(""));
    }
  };

  // Step 2: Verify OTP
  const performVerification = async (codeToVerify) => {
    const code = codeToVerify || otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    if (timeLeft <= 0) {
      setErrorMessage("Verification code expired. Please request a new code.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await api.verifyEmail(email.trim(), code);
      setIsSuccess(true);
      setUser({
        ...(res.user || {}),
        email: email.trim(),
        name: res.user?.name || email.trim().split("@")[0],
        isLoggedIn: true,
        is_verified: true
      });
      const emailClean = email.trim().toLowerCase();
      const isAdmin = (emailClean === "nexzibyte@gmail.com" || emailClean === "nexzibyteadmin@gmail.com") && res.user?.role === "admin";
      if (isAdmin) {
        showToast(`👑 Welcome back to Command Center, ${res.user?.name || "Admin"}!`);
      } else {
        showToast("✅ Email verified successfully! You are logged in.");
      }

      setTimeout(() => {
        setLoginModalOpen(false);
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP Code
  const handleResendCode = async () => {
    if (resendCooldown > 0 && !isTimerExpired) return;
    setIsResending(true);
    setErrorMessage("");

    try {
      await api.resendVerification(email.trim());
      showToast(` A new 6-digit code has been sent to ${email.trim()}.`);
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsTimerExpired(false);
      setResendCooldown(60);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      setErrorMessage(err.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleRegisterClick = () => {
    setLoginModalOpen(false);
    navigate("/register");
  };

  const handleForgotPassword = () => {
    setLoginModalOpen(false);
    navigate(email ? `/forgot-password?email=${encodeURIComponent(email.trim())}` : "/forgot-password");
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setLoginModalOpen(false)}>
      <div 
        className="modal-content-card" 
        style={{
          maxWidth: "460px",
          background: "rgba(14, 10, 48, 0.96)",
          backdropFilter: "blur(24px)",
          borderRadius: "24px",
          padding: "38px 32px",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
          color: "#FFFFFF"
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setLoginModalOpen(false)}
          aria-label="Close modal"
          style={{ top: "18px", right: "18px", color: "#94A3B8" }}
        >
          <X size={18} />
        </button>

        {/* NexziByte TechTalk Brand Logo */}
        <div style={{ marginBottom: "20px" }}>
          <TechTalkMinimalLogo size={1.05} theme="dark" />
        </div>

        {/* ─── STEP 1: EMAIL & PASSWORD LOGIN ─── */}
        {step === "login" && (
          <div>
            <h2 style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 24px 0",
              letterSpacing: "-0.025em"
            }}>
              Log in to your account
            </h2>

            <form onSubmit={handleLogin} style={{ textAlign: "left", width: "100%", marginBottom: "16px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "4px" }}>
                  Email Address or Mobile Number
                </label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  placeholder="Enter your email or 10-digit mobile number"
                  className="form-input"
                  style={{ 
                    background: fieldErrors.identifier ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)", 
                    border: fieldErrors.identifier ? "1.5px solid #EF4444" : (fieldTouched.identifier && !fieldErrors.identifier ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"), 
                    color: "#FFFFFF", 
                    padding: "12px 14px", 
                    borderRadius: "10px", 
                    width: "100%", 
                    boxSizing: "border-box" 
                  }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldTouched.identifier) {
                      setFieldErrors(prev => ({ ...prev, identifier: validateIdentifier(e.target.value) }));
                    }
                  }}
                  onBlur={() => {
                    setFieldTouched(prev => ({ ...prev, identifier: true }));
                    setFieldErrors(prev => ({ ...prev, identifier: validateIdentifier(email) }));
                  }}
                />
                {fieldErrors.identifier && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                    <AlertCircle size={14} />
                    <span>{fieldErrors.identifier}</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", width: "100%" }}>
                  <label style={{ fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0" }}>Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    style={{ background: "none", border: "none", color: "#C084FC", fontSize: "0.825rem", fontWeight: 600, cursor: "pointer", padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Enter your password"
                    className="form-input"
                    style={{ 
                      background: fieldErrors.password ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.07)", 
                      border: fieldErrors.password ? "1.5px solid #EF4444" : (fieldTouched.password && !fieldErrors.password ? "1.5px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.2)"), 
                      color: "#FFFFFF", 
                      padding: "12px 14px", 
                      paddingRight: "40px", 
                      borderRadius: "10px", 
                      width: "100%", 
                      boxSizing: "border-box" 
                    }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldTouched.password) {
                        setFieldErrors(prev => ({ ...prev, password: !e.target.value ? "Please enter your password." : "" }));
                      }
                    }}
                    onBlur={() => {
                      setFieldTouched(prev => ({ ...prev, password: true }));
                      setFieldErrors(prev => ({ ...prev, password: !password ? "Please enter your password." : "" }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F87171", fontSize: "0.825rem", marginTop: "6px", fontWeight: 600 }}>
                    <AlertCircle size={14} />
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
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
              >
                {isSubmitting ? "Sending OTP..." : "Sign in with an email"}
              </button>
            </form>

            {/* Links */}
            <div style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "0.95rem"
            }}>
              <div style={{ color: "#94A3B8" }}>
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={handleRegisterClick}
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
                  Create account
                </button>
              </div>

              <div>
                <button
                  type="button"
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
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: 6-DIGIT OTP NUMBER INPUT SCREEN ─── */}
        {step === "otp" && (
          <div>
            <h2 style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 8px 0"
            }}>
              Enter 6-Digit OTP
            </h2>

            <p style={{ fontSize: "0.9rem", color: "#94A3B8", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              Enter the 6-digit verification code sent to
              <br />
              <strong style={{ color: "#FFFFFF" }}>{email}</strong>
            </p>

            {/* 6 Digit Numeric Inputs */}
            <div 
              onPaste={handlePaste}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "16px"
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
                  disabled={isSuccess || isSubmitting}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: "48px",
                    height: "56px",
                    borderRadius: "12px",
                    border: errorMessage 
                      ? "2px solid #EF4444" 
                      : (digit ? "2px solid #8B5CF6" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                    background: isSuccess 
                      ? "rgba(34, 197, 94, 0.2)" 
                      : (digit ? "rgba(108, 43, 217, 0.25)" : "rgba(255, 255, 255, 0.06)"),
                    color: isSuccess ? "#4ADE80" : "#FFFFFF",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    textAlign: "center",
                    outline: "none"
                  }}
                />
              ))}
            </div>

            {/* Countdown timer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "16px",
              fontSize: "0.85rem",
              color: isTimerExpired ? "#F87171" : "#94A3B8"
            }}>
              <Clock size={14} />
              <span>
                {isTimerExpired ? (
                  <strong style={{ color: "#F87171" }}>Code Expired</strong>
                ) : (
                  <>Code expires in <strong style={{ color: "#FFFFFF" }}>{formatTime(timeLeft)}</strong></>
                )}
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#FCA5A5",
                fontSize: "0.85rem",
                marginBottom: "16px"
              }}>
                {errorMessage}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="button"
              disabled={isSubmitting || isSuccess || otp.join("").length !== 6}
              onClick={() => performVerification(otp.join(""))}
              style={{
                width: "100%",
                padding: "15px 24px",
                borderRadius: "9999px",
                background: isSuccess ? "#16A34A" : "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                color: "#FFFFFF",
                fontSize: "1.02rem",
                fontWeight: 800,
                border: "none",
                cursor: (isSubmitting || isSuccess || otp.join("").length !== 6) ? "not-allowed" : "pointer",
                opacity: (otp.join("").length !== 6 && !isSubmitting && !isSuccess) ? 0.6 : 1,
                boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Verified! Entering...</span>
                </>
              ) : (
                <>
                  <span>Verify OTP &amp; Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            {/* Resend Code & Back Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "#94A3B8" }}>
              <div>
                <span>Didn't get the code? </span>
                <button
                  type="button"
                  disabled={isResending || (resendCooldown > 0 && !isTimerExpired)}
                  onClick={handleResendCode}
                  style={{
                    background: "none",
                    border: "none",
                    color: (resendCooldown > 0 && !isTimerExpired) ? "#64748B" : "#C084FC",
                    fontWeight: 700,
                    cursor: (resendCooldown > 0 && !isTimerExpired) ? "not-allowed" : "pointer",
                    padding: 0
                  }}
                >
                  {isResending ? "Sending..." : resendCooldown > 0 && !isTimerExpired ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setStep("login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94A3B8",
                    fontSize: "0.825rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Email &amp; Password</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

