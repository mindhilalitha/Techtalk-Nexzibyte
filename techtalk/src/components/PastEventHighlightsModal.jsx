import React from "react";
import { X, Calendar, Clock, MapPin, Mic, Users, CheckCircle2, Award, Building, Share2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function PastEventHighlightsModal({ event, isOpen, onClose }) {
  const { showToast } = useApp();

  if (!isOpen || !event) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Highlights link copied to clipboard!");
    } else {
      showToast("Shared event highlights!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="past-modal-title">
      <div 
        className="modal-container past-event-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Banner image */}
        <div className="past-modal-banner-wrap">
          <img 
            src={event.image} 
            alt={event.title} 
            className="past-modal-banner-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/events-tech-stage.jpg";
            }}
          />
          <div className="past-modal-banner-overlay">
            <span className="past-category-tag">{event.category}</span>
            <h2 id="past-modal-title" className="past-modal-title">{event.title}</h2>
            <div className="past-modal-meta">
              <div className="past-meta-item">
                <Calendar size={15} />
                <span>{event.date}</span>
              </div>
              <div className="past-meta-item">
                <MapPin size={15} />
                <span>{event.venue || event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="past-modal-body">
          {/* Structured 4-Box Parameters (Matching Flagship Summit Specification) */}
          <div className="past-card-info-grid" style={{ marginTop: 0, marginBottom: "22px" }}>
            <div className="past-card-info-box">
              <div className="past-card-info-icon-wrap">
                <Clock size={16} />
              </div>
              <div>
                <div className="past-card-info-label">TIME</div>
                <div className="past-card-info-value">{event.time || "9:00 AM – 6:00 PM IST"}</div>
              </div>
            </div>

            <div className="past-card-info-box">
              <div className="past-card-info-icon-wrap">
                <MapPin size={16} />
              </div>
              <div>
                <div className="past-card-info-label">VENUE</div>
                <div className="past-card-info-value">{event.venue || event.location}</div>
              </div>
            </div>

            <div className="past-card-info-box">
              <div className="past-card-info-icon-wrap">
                <Mic size={16} />
              </div>
              <div>
                <div className="past-card-info-label">SPEAKERS</div>
                <div className="past-card-info-value">{event.speakers || "25+ Industry Keynotes"}</div>
              </div>
            </div>

            <div className="past-card-info-box past-card-info-full">
              <div className="past-card-info-icon-wrap">
                <Users size={16} />
              </div>
              <div>
                <div className="past-card-info-label">EXPECTED ATTENDEES</div>
                <div className="past-card-info-value">{event.expectedAttendees || "2,000+ Builders & Innovators"}</div>
              </div>
            </div>
          </div>

          {/* Impact Stats Row */}
          {event.stats && event.stats.length > 0 && (
            <div className="past-card-stats-pill-row" style={{ marginBottom: "24px" }}>
              {event.stats.map((s, idx) => (
                <span key={idx} className="past-stat-pill">
                  <strong>{s.value}</strong> {s.label}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="past-modal-section">
            <h3 className="past-section-heading">Event Overview</h3>
            <p className="past-modal-text">{event.description}</p>
          </div>

          {/* Key Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="past-modal-section">
              <h3 className="past-section-heading">Key Highlights &amp; Outcomes</h3>
              <ul className="past-highlights-list">
                {event.highlights.map((item, idx) => (
                  <li key={idx} className="past-highlight-item">
                    <CheckCircle2 size={16} className="text-blue-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Leadership Quote / Recap Statement */}
          {event.recapStatement && (
            <div className="past-quote-card">
              <div className="past-quote-mark">“</div>
              <p className="past-quote-text">{event.recapStatement}</p>
              <div className="past-quote-author">
                <strong>NexziByte Leadership &amp; Community Dispatch</strong>
              </div>
            </div>
          )}

          <div className="past-modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleShare}
            >
              <Share2 size={15} />
              <span>Share Highlights</span>
            </button>
            <button 
              type="button" 
              className="btn btn-blue-primary btn-sm"
              onClick={onClose}
            >
              Close Highlights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
