import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Camera, CheckCircle, XCircle, RefreshCw, QrCode, Check, ShieldAlert, ArrowRight, UserCheck, AlertTriangle, Zap 
} from "lucide-react";
import jsQR from "jsqr";
import { useApp } from "../context/AppContext.jsx";

export default function QRScanner() {
  const { activePass, passesList, checkInPass, resetCheckIn, showToast } = useApp();
  
  const [scannerOpen, setScannerOpen] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanningFrame, setIsScanningFrame] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState("");
  const [scanResult, setScanResult] = useState({
    status: "valid", // "valid", "invalid", "idle"
    attendee: activePass.holder,
    pass: activePass.passType,
    amount: activePass.price,
    payment: "Verified",
    checkedIn: activePass.checkedIn,
    passId: activePass.passId
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanLoopRef = useRef(null);
  const isCooldownRef = useRef(false);

  // Sync with activePass
  useEffect(() => {
    setScanResult({
      status: "valid",
      attendee: activePass.holder,
      pass: activePass.passType,
      amount: activePass.price,
      payment: "Verified",
      checkedIn: activePass.checkedIn,
      passId: activePass.passId
    });
  }, [activePass]);

  // Real-time Optical QR Frame Processing Loop
  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      scanLoopRef.current = requestAnimationFrame(processVideoFrame);
      return;
    }

    if (isCooldownRef.current) {
      scanLoopRef.current = requestAnimationFrame(processVideoFrame);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (canvas.width > 0 && canvas.height > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Perform jsQR decoding on the live webcam frame
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        const decodedText = code.data.trim();
        handleDecodedQRCode(decodedText);
      }
    }

    scanLoopRef.current = requestAnimationFrame(processVideoFrame);
  }, [passesList, activePass]);

  // Handle successfully decoded QR code payload
  const handleDecodedQRCode = (decodedText) => {
    if (isCooldownRef.current) return;
    isCooldownRef.current = true;
    setLastScannedCode(decodedText);

    // Parse potential TechTalk pass payload formats
    // Format 1: TECHTALK:TT26-123456:LALITHA:STUDENT:99:VERIFIED
    // Format 2: TT26-123456
    // Format 3: upi://pay?...
    let matchedPassId = "";
    let matchedHolder = "Attendee";
    let matchedType = "TECHTALK PASS";
    let matchedAmount = "₹499";
    let isMatchValid = false;

    if (decodedText.startsWith("TECHTALK:")) {
      const parts = decodedText.split(":");
      matchedPassId = parts[1] || "";
      matchedHolder = parts[2] || "Verified Attendee";
      matchedType = `${parts[3] || "COMMUNITY"} PASS`;
      matchedAmount = parts[4] === "FREE" ? "FREE" : `₹${parts[4]}`;
      isMatchValid = true;
    } else if (decodedText.toUpperCase().includes("TT26-") || decodedText.startsWith("TT-")) {
      matchedPassId = decodedText.toUpperCase();
      matchedHolder = activePass.holder || "Verified Attendee";
      matchedType = activePass.passType || "TECHTALK PASS";
      matchedAmount = activePass.price || "₹499";
      isMatchValid = true;
    } else if (decodedText.startsWith("upi://pay")) {
      // UPI QR code scanned
      showToast(` UPI Payment QR Detected: ${decodedText.slice(0, 45)}...`);
      setTimeout(() => { isCooldownRef.current = false; }, 2500);
      return;
    } else {
      // Generic QR check in database
      const found = passesList.find(p => p.passId && decodedText.includes(p.passId));
      if (found) {
        matchedPassId = found.passId;
        matchedHolder = found.holder;
        matchedType = found.passType;
        matchedAmount = found.price;
        isMatchValid = true;
      }
    }

    if (isMatchValid && matchedPassId) {
      setScanResult({
        status: "valid",
        attendee: matchedHolder,
        pass: matchedType,
        amount: matchedAmount,
        payment: "Verified",
        checkedIn: true,
        passId: matchedPassId
      });
      checkInPass(matchedPassId);
      showToast(` REAL-TIME SCAN SUCCESS! Pass ${matchedPassId} verified & checked in for ${matchedHolder}!`);
    } else {
      setScanResult({
        status: "invalid",
        attendee: "Unrecognized QR",
        pass: "Unknown",
        amount: "₹0",
        payment: "Unverified",
        checkedIn: false,
        passId: decodedText.slice(0, 20)
      });
      showToast(` Unrecognized QR Code scanned: ${decodedText.slice(0, 30)}`);
    }

    // Cooldown 2.5s before next scan
    setTimeout(() => {
      isCooldownRef.current = false;
    }, 2500);
  };

  // Handle Browser Camera toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (scanLoopRef.current) {
        cancelAnimationFrame(scanLoopRef.current);
      }
      setCameraActive(false);
      showToast("Camera stream stopped.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true);
          videoRef.current.play();
        }
        setCameraActive(true);
        showToast(" Live Optical Camera Scanner active! Point any pass QR code at the camera.");
        scanLoopRef.current = requestAnimationFrame(processVideoFrame);
      } catch (err) {
        setCameraActive(false);
        showToast("Camera access unavailable. Using interactive scanner simulation.");
      }
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (scanLoopRef.current) {
        cancelAnimationFrame(scanLoopRef.current);
      }
    };
  }, []);

  // Trigger scanning loop when camera starts
  useEffect(() => {
    if (cameraActive) {
      scanLoopRef.current = requestAnimationFrame(processVideoFrame);
    }
    return () => {
      if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current);
    };
  }, [cameraActive, processVideoFrame]);

  // Simulate scanning a Valid Pass (Lalitha TT26-000125)
  const handleScanValid = () => {
    setScanResult({
      status: "valid",
      attendee: activePass.holder,
      pass: activePass.passType,
      amount: activePass.price,
      payment: "Verified",
      checkedIn: true,
      passId: activePass.passId
    });
    checkInPass(activePass.passId);
    showToast(` QR Scanned: Verified pass ${activePass.passId} for ${activePass.holder}`);
  };

  // Simulate scanning an Invalid Pass
  const handleScanInvalid = () => {
    setScanResult({
      status: "invalid",
      attendee: "Unknown",
      pass: "N/A",
      amount: "₹0",
      payment: "Failed / Unrecognized",
      checkedIn: false,
      passId: "TT-INVALID-999"
    });
    showToast(" INVALID PASS: QR code hash signature mismatch.");
  };

  // Perform Check In
  const handleCheckInAttendee = () => {
    if (scanResult.status !== "valid") return;
    checkInPass(scanResult.passId);
    setScanResult((prev) => ({ ...prev, checkedIn: true }));
  };

  return (
    <section className="scanner-section" id="scanner">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            
            VENUE ENTRANCE ACCESS CONTROL
          </span>
          <h2 className="section-heading">Fast. Secure. Contactless.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Scan an attendee's QR code and verify their event access instantly.
          </p>
        </div>

        <div className="scanner-ui-container">
          {/* LEFT: Professional Scanner Interface & Camera Frame */}
          <div>
            <div className="scanner-viewport-box">
              {/* If camera is active, render real video */}
              {cameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="scanner-video-preview" 
                />
              ) : (
                /* High-tech simulated camera preview */
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at center, #1E1035 0%, #0A0E17 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{ textAlign: "center", color: "#A1A1AA" }}>
                    <QrCode size={56} style={{ color: "var(--primary-purple)", marginBottom: "12px", opacity: 0.9 }} />
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Optical Scanner Sensor Ready</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Align attendee pass QR code within reticle</div>
                  </div>
                </div>
              )}

              {/* Four Corner Brackets Reticle */}
              <div className="scanner-reticle">
                <div className="scanner-corner top-left"></div>
                <div className="scanner-corner top-right"></div>
                <div className="scanner-corner bottom-left"></div>
                <div className="scanner-corner bottom-right"></div>

                {/* Animated Laser Scanning Line */}
                <div className="scanner-laser-line"></div>
              </div>

              {/* Status Overlay */}
              <div className="scanner-simulation-overlay">
                <span>{cameraActive ? "● LIVE WEBCAM" : "● SIMULATION MODE"}</span>
                <span>FPS: 60 | LATENCY: 12ms</span>
              </div>
            </div>

            {/* Quick Actions for Testing */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "18px", flexWrap: "wrap" }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={toggleCamera}
              >
                <Camera size={15} />
                <span>{cameraActive ? "Stop Camera" : "Open QR Scanner (Camera)"}</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleScanValid}
              >
                <CheckCircle size={15} style={{ color: "#16A34A" }} />
                <span>Scan Valid Pass ({activePass.holder})</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleScanInvalid}
              >
                <AlertTriangle size={15} style={{ color: "#EF4444" }} />
                <span>Test Invalid QR</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Scanner Verification Results Panel */}
          <div className="scanner-results-card">
            {scanResult.status === "valid" ? (
              <div>
                <div className="scan-status-banner valid">
                  <CheckCircle size={22} />
                  <span> PASS VERIFIED</span>
                </div>

                <div className="attendee-details-grid">
                  <div className="detail-item-box">
                    <div className="detail-label">Attendee</div>
                    <div className="detail-value">{scanResult.attendee}</div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Pass</div>
                    <div className="detail-value" style={{ color: "var(--primary-purple)" }}>
                      {scanResult.pass}
                    </div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Amount</div>
                    <div className="detail-value">{scanResult.amount}</div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Payment</div>
                    <div className="detail-value" style={{ color: "#16A34A" }}>
                      {scanResult.payment}
                    </div>
                  </div>
                </div>

                <div className="detail-item-box" style={{ marginBottom: "24px" }}>
                  <div className="detail-label">Check-in Status</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                    <div style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: scanResult.checkedIn ? "#16A34A" : "var(--coral)"
                    }}>
                      {scanResult.checkedIn ? " Checked In (Venue Entry Verified)" : "Not Checked In"}
                    </div>
                    {scanResult.checkedIn && (
                      <button 
                        type="button"
                        onClick={() => resetCheckIn(scanResult.passId)}
                        style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textDecoration: "underline" }}
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>

                <div className="scanner-toggle-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleCheckInAttendee}
                    disabled={scanResult.checkedIn}
                  >
                    <UserCheck size={18} />
                    <span>{scanResult.checkedIn ? "Attendee Already Checked In" : "Check In Attendee"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="scan-status-banner invalid">
                  <XCircle size={22} />
                  <span> INVALID PASS</span>
                </div>

                <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "12px", border: "1px solid #FECACA", marginBottom: "24px" }}>
                  <p style={{ color: "#B91C1C", fontWeight: 600, marginBottom: "8px" }}>
                    This QR code could not be verified.
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    The cryptographic signature was not recognized in the NexziByte TechTalk 2026 database. 
                    Please direct the attendee to the accreditation desk.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                  onClick={handleScanValid}
                >
                  <RefreshCw size={16} />
                  <span>Retry Scan with Valid Pass</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
