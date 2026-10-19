import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { TECHNICAL_ARTICLES } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";
import ArticleCard3D from "./ArticleCard3D.jsx";

export default function TechnicalContent() {
  const { openArticleReader } = useApp();

  return (
    <section className="section-padding technical-content-section" id="technical-content">
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div style={{ maxWidth: "680px" }}>
            <span className="section-label">
              ENGINEERING DISPATCHES
            </span>
            <h2 className="section-heading">Learn From the Community</h2>
            <p className="section-subtitle">
              In-depth architectural breakdowns, real-world case studies, and engineering practices shared by senior contributors.
            </p>
          </div>

          <Link to="/explore" className="btn-uiverse-primary">
            <span>Explore All Articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
          {TECHNICAL_ARTICLES.map((art) => (
            <ArticleCard3D
              key={art.id}
              article={art}
              onOpenReader={openArticleReader}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
