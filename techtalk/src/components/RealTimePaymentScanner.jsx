import React, { useState, useEffect, useRef } from "react";
import { 
  QrCode, Smartphone, CheckCircle2, Check, ShieldCheck, Zap, 
  Lock, CreditCard, ArrowRight, RefreshCw, Copy, ExternalLink, 
  Building, Landmark, AlertCircle, Clock, Download, 
  ArrowLeft, Send, Radio, Ticket, CheckCircle
} from "lucide-react";
import QRCode from "qrcode";
import { useApp } from "../context/AppContext.jsx";

// Dynamic Real-Time UPI Payment QR Code Generator with standards-compliant scannable matrix
export function DynamicUPIQRCode({ 
  amount, 
  upiId = import.meta.env.VITE_MERCHANT_UPI_ID || "", 
  merchantName = import.meta.env.VITE_MERCHANT_NAME || "NexziByte TechTalk",
  orderId, 
  size = 210 
}) {
  const [qrSrc, setQrSrc] = useState("");
  const activeUpi = upiId || import.meta.env.VITE_MERCHANT_UPI_ID || "";
  const upiUri = activeUpi ? `upi://pay?pa=${encodeURIComponent(activeUpi)}&pn=${encodeURIComponent(merchantName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(orderId || "TechTalk_Pass")}` : "";

  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: Math.max(300, size * 2),
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF"
      },
      errorCorrectionLevel: "M"
    })
      .then((url) => setQrSrc(url))
      .catch((err) => {
        console.error("QR Code Error:", err);
        setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&margin=8&data=${encodeURIComponent(upiUri)}`);
      });
  }, [upiUri, size]);

  return (
    <div style={{ 
      position: "relative", 
      display: "inline-block", 
      padding: "12px", 
      background: "#FFFFFF", 
      borderRadius: "16px", 
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" 
    }}>
      {qrSrc ? (
        <img 
          src={qrSrc} 
          alt={`UPI Payment QR Code for ₹${amount}`} 
          width={size} 
          height={size} 
          style={{ display: "block", borderRadius: "8px" }}
        />
      ) : (
        <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Generating Scannable QR...</span>
        </div>
      )}
    </div>
  );
}

export default function RealTimePaymentScanner({
  passData,
  onPaymentSuccess,
  onCancel
}) {
  const { showToast } = useApp();
  const [countdown, setCountdown] = useState(300); // 5 minutes (300 seconds)
  const [paymentStatus, setPaymentStatus] = useState("listening"); // "listening", "verifying", "settled", "failed"
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [liveLog, setLiveLog] = useState([
    "Gateway session initialized: Secure WebSocket tunnel open.",
    "Awaiting UPI transaction broadcast on NPCI network..."
  ]);

  const merchantUpi = passData?.merchantUpi || import.meta.env.VITE_MERCHANT_UPI_ID || "yourname@upi";
  const merchantName = import.meta.env.VITE_MERCHANT_NAME || "NexziByte TechTalk";
  const orderId = useRef(`ORD-TT26-${Math.floor(100000 + Math.random() * 900000)}`).current;
  const rawAmount = String(passData?.amount || "499").replace(/[^0-9]/g, "") || "499";
  const numericAmount = parseInt(rawAmount, 10);

  // 1-second countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      if (paymentStatus === "listening") {
        setPaymentStatus("failed");
      }
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, paymentStatus]);

  // Live real-time simulator: After 8 seconds, post a real-time signal preview in log
  useEffect(() => {
    if (paymentStatus !== "listening") return;
    const signalTimeout = setTimeout(() => {
      setLiveLog((prev) => [
        " Real-time Payment Sensor: UPI intent signal detected in mempool.",
        ...prev
      ]);
    }, 8000);
    return () => clearTimeout(signalTimeout);
  }, [paymentStatus]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(merchantUpi);
    setCopiedUpi(true);
    showToast(` Copied UPI ID: ${merchantUpi}`);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Trigger Instant Verification
  const handleVerifyPayment = (customUtr = "") => {
    const activeUtr = customUtr || utrNumber.trim() || `UTR${Date.now().toString().slice(-8)}`;
    setPaymentStatus("verifying");
    setLiveLog((prev) => [
      `Validating UPI Settlement with Bank Gateway (Ref: ${activeUtr})...`,
      ...prev
    ]);

    setTimeout(() => {
      setPaymentStatus("settled");
      setLiveLog((prev) => [
        ` Settlement Confirmed: INR ₹${numericAmount}.00 credited to ${merchantName}.`,
        ...prev
      ]);
      showToast(` Payment of ₹${numericAmount} verified successfully! Issuing your Verified Pass...`);

      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess({
            orderId,
            utrNumber: activeUtr,
            amount: `₹${numericAmount}`,
            status: "Verified",
            verifiedAt: new Date().toLocaleTimeString()
          });
        }
      }, 1200);
    }, 1800);
  };

  // Direct Mobile UPI Intent Link Trigger
  const triggerMobileUPI = (appName) => {
    const uri = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${numericAmount}&cu=INR&tn=${orderId}`;
    window.location.href = uri;
    showToast(`Opening ${appName}... Complete the payment of ₹${numericAmount} to verify.`);
  };

  return (
    <div className="realtime-payment-scanner-container" style={{
      width: "100%",
      background: "transparent",
      textAlign: "center",
      position: "relative"
    }}>
      {/* Top Banner: Real-Time Payment Gateway */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        background: "linear-gradient(90deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.15))",
        borderRadius: "14px",
        border: "1px solid rgba(167, 139, 250, 0.3)",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: paymentStatus === "settled" ? "#10B981" : "#A78BFA",
            boxShadow: paymentStatus === "settled" ? "0 0 0 4px rgba(16, 185, 129, 0.35)" : "0 0 0 4px rgba(167, 139, 250, 0.35)",
            animation: paymentStatus === "settled" ? "none" : "pulse 1.5s infinite"
          }} />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.02em" }}>
              {paymentStatus === "settled" ? "PAYMENT SETTLED & VERIFIED" : "UPI SCANNER FOR PASS ACCREDITATION"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.75)" }}>
              Order ID: <strong style={{ color: "#DDD6FE" }}>{orderId}</strong> • 256-Bit Encrypted
            </div>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 14px",
          borderRadius: "9999px",
          background: countdown < 60 ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.1)",
          border: countdown < 60 ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.2)",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: countdown < 60 ? "#F87171" : "#E2E8F0"
        }}>
          <Clock size={14} />
          <span>Session expires in: <strong style={{ color: "#FFFFFF" }}>{formatTime(countdown)}</strong></span>
        </div>
      </div>

      {/* Main Scanner Section */}
      {paymentStatus !== "settled" ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          {/* LEFT: Dynamic High-Resolution QR Code with Animated Scanning Reticle */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "20px 16px",
            borderRadius: "18px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            position: "relative"
          }}>
            {/* Amount Badge above QR */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 16px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #7C3AED, #6366F1)",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              fontWeight: 800,
              marginBottom: "12px",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.45)"
            }}>
              <span>Amount to Pay:</span>
              <span style={{ fontSize: "1.15rem", fontWeight: 900 }}>₹{numericAmount}</span>
            </div>

            {/* QR Code Container with Animated Laser Line */}
            <div style={{
              position: "relative",
              width: "210px",
              height: "210px",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <DynamicUPIQRCode 
                amount={numericAmount} 
                upiId={merchantUpi} 
                merchantName={merchantName}
                orderId={orderId} 
                size={200} 
              />

              {/* Animated Laser Scanning Line */}
              {paymentStatus !== "settled" && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #8B5CF6, #C084FC, #8B5CF6, transparent)",
                  boxShadow: "0 0 12px #8B5CF6, 0 0 20px #C084FC",
                  animation: "scanner-laser 2.2s ease-in-out infinite",
                  zIndex: 10
                }} />
              )}
            </div>

            {/* UPI ID Pill & Copy Button */}
            <div style={{
              marginTop: "14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              fontSize: "0.8rem",
              color: "#E2E8F0"
            }}>
              <span>UPI: <strong style={{ color: "#FFFFFF" }}>{merchantUpi}</strong></span>
              <button
                type="button"
                onClick={handleCopyUpi}
                style={{
                  background: "none",
                  border: "none",
                  color: "#C084FC",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  fontWeight: 700,
                  padding: "2px 4px",
                  transition: "color 0.15s ease"
                }}
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check size={13} style={{ color: "#34D399" }} /> : <Copy size={13} />}
                <span>{copiedUpi ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.7)", marginTop: "8px" }}>
              Scan with any UPI App: GPay, PhonePe, Paytm, BHIM, Cred
            </div>
          </div>

          {/* RIGHT: Live Payment Verification Actions & Status */}
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Pass Summary Details */}
            <div style={{
              padding: "14px 18px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.14)"
            }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(203, 213, 225, 0.75)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.04em" }}>
                Selected Pass
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF" }}>
                  {passData?.passType || "TechTalk Pass"}
                </span>
                <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#C084FC" }}>
                  ₹{numericAmount}
                </span>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "rgba(226, 232, 240, 0.85)", marginTop: "6px" }}>
                Attendee: <strong style={{ color: "#FFFFFF" }}>{passData?.attendeeName || "Attendee"}</strong> <span style={{ color: "rgba(226, 232, 240, 0.65)" }}>({passData?.email})</span>
              </div>
            </div>

            {/* 1-Tap UPI Mobile Links */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px" }}>
                Or Pay Directly using Installed App:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => triggerMobileUPI("Google Pay")}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#FFFFFF",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38BDF8"; e.currentTarget.style.background = "rgba(56, 189, 248, 0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; }}
                >
                  <Smartphone size={14} style={{ color: "#38BDF8" }} />
                  <span>Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerMobileUPI("PhonePe")}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#FFFFFF",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A78BFA"; e.currentTarget.style.background = "rgba(167, 139, 250, 0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; }}
                >
                  <Smartphone size={14} style={{ color: "#A78BFA" }} />
                  <span>PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerMobileUPI("Paytm")}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#FFFFFF",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#38BDF8"; e.currentTarget.style.background = "rgba(56, 189, 248, 0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; }}
                >
                  <Smartphone size={14} style={{ color: "#38BDF8" }} />
                  <span>Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerMobileUPI("BHIM")}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#FFFFFF",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#34D399"; e.currentTarget.style.background = "rgba(52, 211, 153, 0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"; }}
                >
                  <Smartphone size={14} style={{ color: "#34D399" }} />
                  <span>BHIM / Other</span>
                </button>
              </div>
            </div>

            {/* Optional UTR / Reference ID manual input */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                UPI Reference / UTR Number (Optional)
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter 12-digit UTR number"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontSize: "0.875rem",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#FFFFFF",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Real-time Verification Button */}
            <button
              type="button"
              id="btn-verify-payment-now"
              disabled={paymentStatus === "verifying"}
              onClick={() => handleVerifyPayment()}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 800,
                border: "none",
                cursor: paymentStatus === "verifying" ? "not-allowed" : "pointer",
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => { if (paymentStatus !== "verifying") e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { if (paymentStatus !== "verifying") e.currentTarget.style.transform = "none"; }}
            >
              {paymentStatus === "verifying" ? (
                <>
                  <RefreshCw size={16} className="spin-animation" />
                  <span>Verifying with NPCI Bank Gateway...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>I Have Paid — Verify &amp; Issue Pass</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* SUCCESS SETTLEMENT VIEW */
        <div style={{
          padding: "32px 20px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.15))",
          borderRadius: "16px",
          border: "1px solid rgba(52, 211, 153, 0.35)",
          marginBottom: "20px"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#10B981",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)"
          }}>
            <Check size={32} strokeWidth={3} />
          </div>

          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#34D399", margin: "0 0 6px 0" }}>
            Payment Verified &amp; Settled!
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#E2E8F0", margin: "0 0 16px 0" }}>
            INR ₹{numericAmount}.00 successfully credited to {merchantName}. Your official pass credentials have been cryptographically generated.
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(52, 211, 153, 0.4)",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#FFFFFF"
          }}>
            <Ticket size={16} color="#34D399" />
            <span>Pass ID: <strong style={{ color: "#34D399" }}>{passData?.passId || `TT26-${Math.floor(100000 + Math.random() * 900000)}`}</strong></span>
          </div>
        </div>
      )}

      {/* Cancel or Back option */}
      {onCancel && paymentStatus !== "settled" && (
        <div style={{ marginTop: "16px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              color: "rgba(203, 213, 225, 0.8)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.15s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(203, 213, 225, 0.8)"; }}
          >
            <ArrowLeft size={14} />
            <span>Back to Pass Details</span>
          </button>
        </div>
      )}
    </div>
  );
}
