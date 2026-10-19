import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, ArrowLeft, ArrowRight, ShieldCheck, 
  CheckCircle2, RefreshCw, KeyRound, AlertCircle, Sparkles 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { TechTalkMinimalLogo } from "./AuthPage.jsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { user, showToast } = useApp();

  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      showToast(" Please enter your registered email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.forgotPassword(cleanEmail);
      setIsSent(true);
      setResendCooldown(60);
      showToast(` Password reset instructions dispatched to ${cleanEmail}!`);

      // Start countdown for resend
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      showToast(` ${err.message || "Failed to send reset instructions. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "88vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 20px",
      background: "transparent"
    }}>
      {/* Back to Sign In Link */}
      <div style={{ width: "100%", maxWidth: "460px", marginBottom: "16px" }}>
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

      {/* Main Card Container */}
      <div style={{
        width: "100%",
        maxWidth: "460px",
        background: "rgba(14, 10, 48, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "24px",
        padding: "42px 36px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(108, 43, 217, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        textAlign: "center"
      }}>
        {/* Brand Logo */}
        <div style={{ marginBottom: "22px" }}>
          <TechTalkMinimalLogo size={1.05} theme="dark" />
        </div>

        {isSent ? (
          /* EMAIL SENT CONFIRMATION STATE */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(108, 43, 217, 0.25)",
              color: "#C084FC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              boxShadow: "0 10px 28px rgba(108, 43, 217, 0.3)",
              border: "1px solid rgba(168, 85, 247, 0.4)"
            }}>
              <Mail size={36} />
            </div>

            <h2 style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "10px",
              letterSpacing: "-0.025em"
            }}>
              Check Your Inbox
            </h2>

            <p style={{
              fontSize: "0.95rem",
              color: "#94A3B8",
              lineHeight: 1.6,
              marginBottom: "20px"
            }}>
              We've dispatched a password reset link and a 6-digit recovery code to:
            </p>

            <div style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#C084FC",
              wordBreak: "break-all",
              marginBottom: "24px"
            }}>
              {email}
            </div>

            <div style={{
              background: "rgba(108, 43, 217, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "0.85rem",
              color: "#E9D5FF",
              textAlign: "left",
              marginBottom: "28px",
              lineHeight: 1.5
            }}>
              <strong style={{ color: "#FFFFFF" }}>💡 Tip:</strong> Please check your inbox and click the reset button inside the email. If you don't see it, check your spam or promotional folders.
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                type="button"
                id="btn-proceed-reset-code"
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                style={{
                  width: "100%",
                  padding: "15px 28px",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(108, 43, 217, 0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(108, 43, 217, 0.35)";
                }}
              >
                <span>Enter Reset Code Manually</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isSubmitting}
                onClick={handleSubmit}
                style={{
                  width: "100%",
                  padding: "13px 24px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: resendCooldown > 0 ? "#64748B" : "#FFFFFF",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <RefreshCw size={14} className={isSubmitting ? "spin-slow" : ""} />
                <span>{resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : "Resend Email"}</span>
              </button>
            </div>

            <div style={{ marginTop: "24px" }}>
              <Link 
                to="/login" 
                style={{
                  color: "#94A3B8",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          /* INITIAL INPUT STATE */
          <div>
            <h2 style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 10px 0",
              letterSpacing: "-0.025em"
            }}>
              Forgot Password?
            </h2>

            <p style={{
              fontSize: "0.925rem",
              color: "#94A3B8",
              marginBottom: "28px",
              lineHeight: 1.55
            }}>
              No worries! Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: "left", width: "100%" }}>
              <div style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  Email Address *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(255, 255, 255, 0.2)",
                      fontSize: "0.95rem",
                      background: "rgba(255, 255, 255, 0.07)",
                      color: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-send-reset-instructions"
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
                {isSubmitting ? "Sending Reset Link..." : "Send Password Reset Link"}
              </button>
            </form>

            <div style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "0.925rem"
            }}>
              <div style={{ color: "#94A3B8" }}>
                <span>Already have an account? </span>
                <Link 
                  to="/login"
                  style={{
                    color: "#C084FC",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  Sign In
                </Link>
              </div>

              <div style={{ color: "#94A3B8" }}>
                <span>Already received a reset code? </span>
                <Link 
                  to={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                  style={{
                    color: "#C084FC",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Enter code directly &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
