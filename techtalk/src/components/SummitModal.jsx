import React, { useEffect } from "react";
import { 
  X, Calendar, MapPin, Share2, Bookmark, CheckCircle2, 
  Users, Tag, ArrowRight, ExternalLink 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function SummitModal() {
  const { 
    summitModalOpen, 
    setSummitModalOpen, 
    selectedSummit, 
    openPassModal, 
    showToast 
  } = useApp();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && summitModalOpen) {
        setSummitModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [summitModalOpen, setSummitModalOpen]);

  if (!summitModalOpen || !selectedSummit) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(` Link to "${selectedSummit.title}" copied to clipboard!`);
    } else {
      showToast("Link ready to share!");
    }
  };

  const handleTagClick = (tag) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tag);
      showToast(`Tag ${tag} copied to clipboard!`);
    }
  };

  return (
    <div 
      className="modal-backdrop-overlay" 
      onClick={() => setSummitModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summit-modal-title"
    >
      <div 
        className="modal-content-card summit-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "740px",
          padding: 0,
          background: "rgba(14, 10, 48, 0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
          color: "#FFFFFF",
          overflow: "hidden"
        }}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setSummitModalOpen(false)}
          aria-label="Close modal"
          style={{ color: "#FFFFFF", zIndex: 10, background: "rgba(0,0,0,0.5)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={18} />
        </button>

        {/* Header Visual Banner */}
        <div className="summit-modal-hero" style={{ position: "relative", height: "240px" }}>
          <img 
            src={selectedSummit.image} 
            alt={selectedSummit.title} 
            className="summit-modal-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/renewable-energy.jpg";
            }}
          />
          <div className="summit-modal-overlay" style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(14, 10, 48, 0.95) 0%, rgba(14, 10, 48, 0.3) 60%, transparent 100%)",
            display: "flex",
            alignItems: "flex-end",
            padding: "20px"
          }}>
            <div className="summit-modal-tags-row" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span className="summit-badge-pill" style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                background: "rgba(108, 43, 217, 0.75)",
                border: "1px solid rgba(168, 85, 247, 0.6)",
                color: "#FFFFFF",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase"
              }}>
                {selectedSummit.badge || selectedSummit.type}
              </span>
              <span className="summit-type-pill" style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
                fontSize: "0.78rem",
                fontWeight: 600
              }}>
                {selectedSummit.type}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="summit-modal-body" style={{ padding: "28px 32px 36px" }}>
          {/* Metadata Row */}
          <div className="summit-modal-meta-row" style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "0.875rem",
            color: "#CBD5E1",
            marginBottom: "16px"
          }}>
            <div className="summit-meta-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={15} style={{ color: "#4ADE80" }} />
              <span style={{ color: "#E2E8F0", fontWeight: 600 }}>{selectedSummit.date}</span>
            </div>
            <div className="summit-meta-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={15} style={{ color: "#FB923C" }} />
              <span style={{ color: "#E2E8F0" }}>{selectedSummit.venue || selectedSummit.location}</span>
            </div>
            {selectedSummit.dignitaries && (
              <div className="summit-meta-item" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Users size={15} style={{ color: "#38BDF8" }} />
                <span style={{ color: "#E2E8F0" }}>{selectedSummit.dignitaries}</span>
              </div>
            )}
          </div>

          <h2 id="summit-modal-title" className="summit-modal-title" style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.25,
            marginBottom: "16px"
          }}>
            {selectedSummit.title}
          </h2>

          {selectedSummit.statement && (
            <div className="summit-modal-quote" style={{
              padding: "14px 18px",
              borderRadius: "12px",
              background: "rgba(108, 43, 217, 0.15)",
              borderLeft: "3px solid #A855F7",
              color: "#E9D5FF",
              fontSize: "0.95rem",
              fontStyle: "italic",
              marginBottom: "20px",
              lineHeight: 1.6
            }}>
              "{selectedSummit.statement}"
            </div>
          )}

          {/* Full Announcement Text */}
          <div className="summit-modal-text-content" style={{
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "24px"
          }}>
            {selectedSummit.fullContent ? (
              selectedSummit.fullContent.split("\n\n").map((para, i) => (
                <p key={i} style={{ color: "#E2E8F0" }}>{para}</p>
              ))
            ) : (
              <p style={{ color: "#E2E8F0" }}>{selectedSummit.description}</p>
            )}
          </div>

          {/* Hashtags Section */}
          {selectedSummit.hashtags && selectedSummit.hashtags.length > 0 && (
            <div className="summit-modal-hashtags-wrap" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              marginBottom: "24px"
            }}>
              <span className="hashtags-label" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.825rem",
                fontWeight: 700,
                color: "#94A3B8"
              }}>
                <Tag size={13} />
                Tags:
              </span>
              <div className="hashtags-list" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {selectedSummit.hashtags.map((tag, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className="hashtag-pill-btn"
                    onClick={() => handleTagClick(tag)}
                    title="Click to copy tag"
                    style={{
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#C084FC",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="summit-modal-footer" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)"
          }}>
            <div className="summit-modal-footer-actions" style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleShare}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#FFFFFF"
                }}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => showToast("Summit saved to your calendar list.")}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#FFFFFF"
                }}
              >
                <Bookmark size={15} />
                <span>Bookmark</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setSummitModalOpen(false)}
                style={{
                  background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "9999px",
                  padding: "8px 20px"
                }}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
