import React from "react";
import { X, Clock, User, Share2, Bookmark } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function ArticleModal() {
  const { articleModalOpen, setArticleModalOpen, selectedArticle, showToast } = useApp();

  if (!articleModalOpen || !selectedArticle) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={() => setArticleModalOpen(false)}>
      <div 
        className="modal-content-card" 
        style={{ 
          maxWidth: "720px", 
          padding: "36px",
          background: "rgba(14, 10, 48, 0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
          color: "#FFFFFF"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setArticleModalOpen(false)}
          aria-label="Close article"
          style={{ color: "#94A3B8" }}
        >
          <X size={18} />
        </button>

        <div>
          <span style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: "9999px",
            background: "rgba(108, 43, 217, 0.3)",
            border: "1px solid rgba(168, 85, 247, 0.45)",
            color: "#C084FC",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "12px"
          }}>
            {selectedArticle.category}
          </span>

          <h2 style={{ 
            fontSize: "1.75rem", 
            fontWeight: 800, 
            marginTop: "4px", 
            marginBottom: "14px",
            lineHeight: 1.3,
            color: "#FFFFFF"
          }}>
            {selectedArticle.title}
          </h2>

          <div style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "0.875rem",
            color: "#94A3B8",
            margin: "12px 0 24px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)"
          }}>
            <span style={{ fontWeight: 600, color: "#FFFFFF" }}>By {selectedArticle.author}</span>
            <span>•</span>
            <span style={{ color: "#CBD5E1" }}>{selectedArticle.role}</span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#94A3B8" }}>
              <Clock size={13} />
              {selectedArticle.readingTime}
            </span>
          </div>

          <div style={{
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}>
            <p style={{ fontWeight: 500, color: "#CBD5E1", fontSize: "1.05rem", lineHeight: 1.6 }}>
              {selectedArticle.excerpt}
            </p>
            <p style={{ color: "#E2E8F0" }}>
              {selectedArticle.content}
            </p>
            <p style={{ color: "#E2E8F0" }}>
              At NexziByte TechTalk, our technical tracks prioritize hands-on architectural rigor over speculative buzzwords. Every pattern highlighted above has been tested against real-world production constraints, multi-region database latencies, and high-frequency concurrency.
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)"
          }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => showToast("Article saved to your reading list.")}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#FFFFFF"
                }}
              >
                <Bookmark size={15} />
                <span>Save Article</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast("Article link copied to clipboard!");
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#FFFFFF"
                }}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
            </div>

            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => setArticleModalOpen(false)}
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
  );
}
