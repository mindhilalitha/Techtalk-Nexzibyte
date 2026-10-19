import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Lock, KeyRound, Eye, EyeOff, CheckCircle2, 
  ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, Mail, RefreshCw 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { TechTalkMinimalLogo } from "./AuthPage.jsx";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useApp();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenParam);
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(Boolean(tokenParam));
  const [tokenError, setTokenError] = useState("");
  const [useManualCode, setUseManualCode] = useState(!tokenParam);

  // If token is provided in URL, verify it
  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
      setIsValidatingToken(true);
      setTokenError("");

      api.verifyResetToken(tokenParam)
        .then((data) => {
          if (data && data.email) {
            setEmail(data.email);
          }
          setUseManualCode(false);
        })
        .catch((err) => {
          console.warn("Token validation warning:", err);
          // Allow fallback so user can still enter code or use link
          setTokenError(err.message || "Invalid or expired link. You can still reset using the 6-digit code.");
          setUseManualCode(true);
        })
        .finally(() => {
          setIsValidatingToken(false);
        });
    } else {
      setUseManualCode(true);
    }
  }, [tokenParam]);

  const handleResetSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!newPassword) {
      showToast(" Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      showToast(" Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(" Passwords do not match. Please verify.");
      return;
    }

    if (useManualCode && !code.trim() && !token) {
      showToast(" Please enter the 6-digit reset code sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.resetPassword({
        token: token || undefined,
        email: email.trim() || undefined,
        code: code.trim() || undefined,
        newPassword: newPassword
      });

      setIsSuccess(true);
      showToast(" Password reset successfully! You can now sign in.");
    } catch (err) {
      showToast(` ${err.message || "Failed to reset password. Please try again."}`);
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

        {isValidatingToken ? (
          <div style={{ padding: "40px 0" }}>
            <RefreshCw size={36} className="spin-slow" style={{ color: "#C084FC", margin: "0 auto 16px auto", display: "block" }} />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
              Verifying Reset Link...
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              Please wait while we validate your secure security token.
            </p>
          </div>
        ) : isSuccess ? (
          /* SUCCESS STATE */
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34D399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)"
            }}>
              <CheckCircle2 size={38} />
            </div>

            <h2 style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "10px",
              letterSpacing: "-0.02em"
            }}>
              Password Reset Complete!
            </h2>

            <p style={{
              fontSize: "0.95rem",
              color: "#94A3B8",
              lineHeight: 1.6,
              marginBottom: "28px"
            }}>
              Your NexziByte TechTalk password has been updated successfully. You can now log in with your new credentials.
            </p>

            <button
              type="button"
              id="btn-login-after-reset"
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                padding: "16px 28px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                color: "#FFFFFF",
                fontSize: "1.05rem",
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
              <span>Sign In to Your Account</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            <h2 style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: "0 0 10px 0",
              letterSpacing: "-0.025em"
            }}>
              Set New Password
            </h2>

            <p style={{
              fontSize: "0.925rem",
              color: "#94A3B8",
              marginBottom: "24px",
              lineHeight: 1.5
            }}>
              {email ? (
                <>Creating a new password for <strong style={{ color: "#FFFFFF" }}>{email}</strong></>
              ) : (
                "Create a strong, unique password to secure your account."
              )}
            </p>

            {tokenError && (
              <div style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "12px",
                padding: "12px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                textAlign: "left"
              }}>
                <AlertCircle size={18} style={{ color: "#EF4444", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "0.825rem", color: "#FCA5A5", lineHeight: 1.45 }}>
                  {tokenError}
                </div>
              </div>
            )}

            <form onSubmit={handleResetSubmit} style={{ textAlign: "left", width: "100%" }}>
              {/* If entering manual code / no token */}
              {useManualCode && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                      Registered Email Address *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{
                          width: "100%",
                          padding: "13px 16px",
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

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0" }}>
                        6-Digit Reset Code *
                      </label>
                      <Link 
                        to="/forgot-password" 
                        style={{ fontSize: "0.8rem", color: "#C084FC", fontWeight: 600, textDecoration: "none" }}
                      >
                        Resend Code
                      </Link>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="e.g. 123456"
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        borderRadius: "12px",
                        border: "1.5px solid rgba(255, 255, 255, 0.2)",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        letterSpacing: "4px",
                        textAlign: "center",
                        background: "rgba(255, 255, 255, 0.07)",
                        color: "#FFFFFF",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </>
              )}

              {/* New Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  New Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      paddingRight: "44px",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(255, 255, 255, 0.2)",
                      fontSize: "0.95rem",
                      background: "rgba(255, 255, 255, 0.07)",
                      color: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle new password visibility"
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
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  Confirm New Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      paddingRight: "44px",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(255, 255, 255, 0.2)",
                      fontSize: "0.95rem",
                      background: "rgba(255, 255, 255, 0.07)",
                      color: "#FFFFFF",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                  <div style={{
                    marginTop: "6px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: newPassword === confirmPassword ? "#34D399" : "#F87171"
                  }}>
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={13} />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-reset-password"
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
                {isSubmitting ? "Saving New Password..." : "Reset Password"}
              </button>
            </form>

            <div style={{ marginTop: "24px", fontSize: "0.875rem", color: "#94A3B8" }}>
              <span>Remembered your password? </span>
              <Link to="/login" style={{ color: "#C084FC", fontWeight: 700, textDecoration: "none" }}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
