import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, 
  CheckCircle2, Clock, ArrowLeft, Lock, Send
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { TechTalkMinimalLogo } from "./AuthPage.jsx";

const OTP_EXPIRY_SECONDS = 300; // 5 minutes

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, markEmailAsVerified, showToast } = useApp();

  // URL Query Parameters
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || user?.email || "";
  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [isVerifyingToken, setIsVerifyingToken] = useState(Boolean(tokenParam));

  // 6-digit OTP Inputs state (array of 6 strings)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Timer state (5-minute countdown)
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  // Resend cooldown state
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Status & Error/Success States
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-verify Magic Link Token if token is in URL
  useEffect(() => {
    if (tokenParam) {
      handleVerifyMagicToken(tokenParam);
    }
  }, [tokenParam]);

  // Sync email when search params change
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleVerifyMagicToken = async (tok) => {
    setIsVerifyingToken(true);
    setErrorMessage("");
    try {
      const res = await api.verifyToken(tok);
      setIsSuccess(true);
      markEmailAsVerified(res.user || { email, is_verified: true });
      showToast(" Email verified successfully via secure token! Welcome to TechTalk.");
      setTimeout(() => {
        navigate("/profile");
      }, 1400);
    } catch (err) {
      setErrorMessage(err.message || "Invalid or expired verification link.");
    } finally {
      setIsVerifyingToken(false);
    }
  };

  // Countdown timer effect (1-second tick)
  useEffect(() => {
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
  }, [timeLeft]);

  // Resend cooldown tick
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const cdTimer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cdTimer);
  }, [resendCooldown]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Focus first input on mount if not verifying token
  useEffect(() => {
    if (!tokenParam && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [tokenParam]);

  // Handle single digit input
  const handleDigitChange = (index, value) => {
    setErrorMessage("");
    const cleaned = value.replace(/[^0-9]/g, "");
    const lastChar = cleaned.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // Auto-advance to next input if digit entered
    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically trigger verification
    const fullCode = newOtp.join("");
    if (fullCode.length === 6 && !newOtp.includes("")) {
      performVerification(fullCode);
    }
  };

  // Handle backspace and keyboard navigation
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

  // Perform OTP Verification
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

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const res = await api.verifyEmail(email, code);
      setIsSuccess(true);
      markEmailAsVerified(res.user || { email, is_verified: true });
      showToast(" Email verified successfully! Welcome to TechTalk.");

      setTimeout(() => {
        if (res.user && res.user.profile_completed) {
          navigate("/profile");
        } else {
          navigate("/create-profile");
        }
      }, 1200);
    } catch (err) {
      const msg = err.message || "Invalid verification code.";
      setErrorMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Resend Verification Code
  const handleResendCode = async () => {
    if (resendCooldown > 0 && !isTimerExpired) return;
    if (!email) {
      showToast(" Email address is required to resend code.");
      return;
    }

    setIsResending(true);
    setErrorMessage("");

    try {
      const res = await api.resendVerification(email);
      showToast(` A new verification link and code have been sent to ${email}.`);
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setIsTimerExpired(false);
      setResendCooldown(60);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (err) {
      const errorDetail = err.message || "Failed to resend code. Please try again.";
      setErrorMessage(errorDetail);
      showToast(` ${errorDetail}`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verify-email-page-root" style={{
      minHeight: "88vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      background: "transparent"
    }}>
      {/* Back Link */}
      <div style={{ width: "100%", maxWidth: "480px", marginBottom: "16px" }}>
        <Link 
          to="/login" 
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
          <span>Back to Sign In</span>
        </Link>
      </div>

      {/* Main Luxury Verification Card */}
      <div className="verify-email-card" style={{
        width: "100%",
        maxWidth: "480px",
        background: "rgba(14, 10, 48, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "24px",
        padding: "40px 32px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(108, 43, 217, 0.2)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Top Decorative Purple Gradient Strip */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: "linear-gradient(90deg, #6C2BD9, #9333EA, #C084FC)"
        }} />

        {/* 1. Official Brand Logo */}
        <div style={{ marginBottom: "22px" }}>
          <TechTalkMinimalLogo size={1.05} theme="dark" />
        </div>

        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "#FFFFFF",
          margin: "0 0 10px 0",
          letterSpacing: "-0.025em"
        }}>
          {tokenParam ? "Cryptographic Verification" : "Verify Your Account"}
        </h1>

        <p style={{
          fontSize: "0.9375rem",
          color: "#94A3B8",
          lineHeight: 1.55,
          margin: "0 0 24px 0"
        }}>
          {tokenParam ? (
            "Validating your 1-click magic link security token."
          ) : (
            <>
              We've sent a 6-digit verification code to
              <br />
              <strong style={{ color: "#FFFFFF", wordBreak: "break-all" }}>
                {email || "your registered email"}
              </strong>
            </>
          )}
        </p>

        {/* Token Verifying Loader State */}
        {isVerifyingToken && (
          <div style={{ padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.15)",
              borderTopColor: "#A855F7",
              animation: "spin 0.8s linear infinite",
              marginBottom: "16px"
            }} />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px 0" }}>
              Verifying Security Token...
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: 0 }}>
              Checking token validity and authenticity.
            </p>
          </div>
        )}

        {/* 3. 6-Digit OTP Input Boxes (shown when not in token-verifying mode) */}
        {!isVerifyingToken && (
          <>
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
                  disabled={isSuccess || isVerifying}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-digit-box"
                  style={{
                    width: "52px",
                    height: "60px",
                    borderRadius: "14px",
                    border: errorMessage 
                      ? "2px solid #EF4444" 
                      : (digit ? "2px solid #8B5CF6" : "1.5px solid rgba(255, 255, 255, 0.2)"),
                    background: isSuccess 
                      ? "rgba(34, 197, 94, 0.2)" 
                      : (digit ? "rgba(108, 43, 217, 0.25)" : "rgba(255, 255, 255, 0.06)"),
                    color: isSuccess ? "#4ADE80" : "#FFFFFF",
                    fontSize: "1.65rem",
                    fontWeight: 800,
                    textAlign: "center",
                    outline: "none",
                    transition: "all 0.18s ease",
                    boxShadow: digit ? "0 2px 12px rgba(108, 43, 217, 0.3)" : "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#A855F7";
                    e.target.style.background = "rgba(108, 43, 217, 0.35)";
                    e.target.style.boxShadow = "0 0 0 4px rgba(168, 85, 247, 0.3)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = digit ? "#8B5CF6" : "rgba(255, 255, 255, 0.2)";
                    e.target.style.background = digit ? "rgba(108, 43, 217, 0.25)" : "rgba(255, 255, 255, 0.06)";
                    e.target.style.boxShadow = digit ? "0 2px 12px rgba(108, 43, 217, 0.3)" : "none";
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* 4. Real-time Countdown Timer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "20px",
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

        {/* Error Message Alert */}
        {errorMessage && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#FCA5A5",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "20px",
            textAlign: "left"
          }} role="alert">
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Message Banner */}
        {isSuccess && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(34, 197, 94, 0.18)",
            border: "1px solid rgba(34, 197, 94, 0.45)",
            color: "#4ADE80",
            fontSize: "0.95rem",
            fontWeight: 700,
            marginBottom: "20px"
          }} role="status">
            <CheckCircle2 size={20} />
            <span>Account verified successfully</span>
          </div>
        )}

        {/* 5. Verify Button */}
        <button
          type="button"
          id="btn-verify-otp"
          disabled={isVerifying || isSuccess || otp.join("").length !== 6}
          onClick={() => performVerification(otp.join(""))}
          style={{
            width: "100%",
            padding: "16px 28px",
            borderRadius: "9999px",
            background: isSuccess 
              ? "#16A34A" 
              : "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
            color: "#FFFFFF",
            fontSize: "1.05rem",
            fontWeight: 800,
            border: "none",
            cursor: (isVerifying || isSuccess || otp.join("").length !== 6) ? "not-allowed" : "pointer",
            opacity: (otp.join("").length !== 6 && !isVerifying && !isSuccess) ? 0.6 : 1,
            boxShadow: isSuccess 
              ? "0 6px 20px rgba(22, 163, 74, 0.35)" 
              : "0 6px 20px rgba(108, 43, 217, 0.4)",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
          onMouseEnter={(e) => {
            if (otp.join("").length === 6 && !isVerifying && !isSuccess) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(108, 43, 217, 0.55)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSuccess) {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(108, 43, 217, 0.4)";
            }
          }}
        >
          {isVerifying ? (
            <span>Verifying Code...</span>
          ) : isSuccess ? (
            <>
              <CheckCircle2 size={18} />
              <span>Verified! Redirecting...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* 6. Resend Option with Cooldown */}
        <div style={{
          marginTop: "26px",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontSize: "0.9rem",
          color: "#94A3B8"
        }}>
          <div>
            <span>Didn't receive the code? </span>
            <button
              type="button"
              id="btn-resend-otp"
              disabled={isResending || (resendCooldown > 0 && !isTimerExpired)}
              onClick={handleResendCode}
              style={{
                background: "none",
                border: "none",
                color: (resendCooldown > 0 && !isTimerExpired) ? "#64748B" : "#C084FC",
                fontWeight: 700,
                cursor: (resendCooldown > 0 && !isTimerExpired) ? "not-allowed" : "pointer",
                padding: 0,
                fontSize: "inherit",
                textDecoration: (resendCooldown > 0 && !isTimerExpired) ? "none" : "underline"
              }}
            >
              {isResending ? (
                "Sending new code..."
              ) : resendCooldown > 0 && !isTimerExpired ? (
                `Resend code in ${resendCooldown}s`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>

          {/* Change email or switch account link */}
          <div style={{ fontSize: "0.825rem", marginTop: "4px" }}>
            <span style={{ color: "#64748B" }}>Wrong email address? </span>
            <Link 
              to="/register" 
              style={{ color: "#C084FC", textDecoration: "none", fontWeight: 600 }}
            >
              Register with another email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
