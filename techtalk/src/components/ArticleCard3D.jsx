import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

// Map categories to distinctive accent glow colors
const CATEGORY_COLORS = {
  "CREATIVE MEDIA": { glow: "#ff9966", c1: "#ffbb66", c2: "#ff8866", c3: "#ff2233" },
  "PYTHON & AI/ML": { glow: "#38bdf8", c1: "#38bdf8", c2: "#818cf8", c3: "#22d3ee" },
  "FULL-STACK WEB": { glow: "#c084fc", c1: "#c084fc", c2: "#7C3AED", c3: "#e879f9" },
  "OPERATIONS & BD": { glow: "#00A97F", c1: "#34D399", c2: "#059669", c3: "#10B981" },
  "CLOUD COMPUTING": { glow: "#60a5fa", c1: "#93c5fd", c2: "#3b82f6", c3: "#1d4ed8" },
};

const DEFAULT_COLOR = { glow: "#c084fc", c1: "#c084fc", c2: "#7C3AED", c3: "#e879f9" };

export default function ArticleCard3D({ article, onOpenReader }) {
  const { openArticleReader } = useApp();
  const handleOpen = onOpenReader || openArticleReader;

  const colorConfig = CATEGORY_COLORS[article.category] || DEFAULT_COLOR;

  const articleImage = article.image || 
    (article.category?.toLowerCase().includes("python") || article.category?.toLowerCase().includes("ai") ? "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&auto=format&fit=crop&q=80" :
     article.category?.toLowerCase().includes("creative") || article.category?.toLowerCase().includes("design") || article.category?.toLowerCase().includes("media") ? "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&auto=format&fit=crop&q=80" :
     article.category?.toLowerCase().includes("full-stack") || article.category?.toLowerCase().includes("frontend") || article.category?.toLowerCase().includes("web") ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80" :
     article.category?.toLowerCase().includes("operations") || article.category?.toLowerCase().includes("business") ? "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80" :
     "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80");

  return (
    <div
      className="article-card-3d-wrapper"
      onClick={() => handleOpen && handleOpen(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleOpen && handleOpen(article)}
      style={{
        "--box-glow": colorConfig.glow,
        "--circle-1": colorConfig.c1,
        "--circle-2": colorConfig.c2,
        "--circle-3": colorConfig.c3,
      }}
    >
      <div className="article-card-3d-content">
        {/* ─── FRONT FACE ─── */}
        <div className="article-card-3d-front">
          {/* Header Image with Category Badge */}
          <div className="article-card-image-wrap">
            <img
              src={articleImage}
              alt={article.title}
              className="article-card-img"
              loading="lazy"
            />
            <div className="article-card-image-overlay" />
            <div className="article-category-tag">{article.category}</div>
          </div>

          {/* Card Body */}
          <div className="article-card-body">
            <h3 className="article-title">{article.title}</h3>
            <p className="article-excerpt">{article.excerpt}</p>

            {/* Footer Row */}
            <div className="article-meta-row">
              <div className="article-meta-time">
                <Clock size={14} />
                <span>{article.readingTime || "5 min read"}</span>
              </div>

              <span className="article-read-btn-link">
                <span>Read Article</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* ─── BACK FACE (3D Rotating Glow & Quick Insights) ─── */}
        <div className="article-card-3d-back">
          <div className="article-back-inner">
            {/* Ambient Animated Floating Bubbles */}
            <div className="back-ambient-circle circle-1" />
            <div className="back-ambient-circle circle-2" />
            <div className="back-ambient-circle circle-3" />

            <div className="article-back-body">
              <div className="article-back-category-pill">
                <Sparkles size={13} color={colorConfig.glow} />
                <span>{article.category}</span>
              </div>

              <h4 className="article-back-title">{article.title}</h4>

              <p className="article-back-quote">
                "{article.excerpt?.slice(0, 150)}..."
              </p>

              <div className="article-back-actions">
                <button
                  type="button"
                  className="btn-uiverse"
                  style={{
                    "--color": colorConfig.glow,
                    "--color2": "#FFFFFF",
                    width: "100%",
                    padding: "0.65em 1.2em",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen && handleOpen(article);
                  }}
                >
                  <BookOpen size={14} />
                  <span>Open Full Reader</span>
                </button>

                <Link
                  to={`/posts/${article.id}`}
                  className="article-back-permalink"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Post Page</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
