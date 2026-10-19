import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, Clock, MapPin, 
  Users, ExternalLink, ChevronRight,
  Mic, Award, Star
} from "lucide-react";
import { 
  DEDICATED_PAST_EVENTS 
} from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

// Modals
import EventDetailModal from "./EventDetailModal.jsx";
import PastEventHighlightsModal from "./PastEventHighlightsModal.jsx";
import HostEventModal from "./HostEventModal.jsx";

export default function EventsPage() {
  const { showToast } = useApp();

  // Modal States
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [autoFocusRegister, setAutoFocusRegister] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [selectedPastEvent, setSelectedPastEvent] = useState(null);
  const [pastModalOpen, setPastModalOpen] = useState(false);

  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostModalType, setHostModalType] = useState("host"); // "host" or "speaker"

  // Open Event Details
  const handleOpenEventDetails = (event, focusRegister = false) => {
    setSelectedEventForDetail(event);
    setAutoFocusRegister(focusRegister);
    setDetailModalOpen(true);
  };

  // Open Past Event Highlights
  const handleOpenPastHighlights = (pastEvt) => {
    setSelectedPastEvent(pastEvt);
    setPastModalOpen(true);
  };

  // Open Host / Speaker Modal
  const handleOpenHostModal = (type) => {
    setHostModalType(type);
    setHostModalOpen(true);
  };

  return (
    <div className="events-page-root">
      {/* ══════════════════════════════════════════════════════════════════
          1. EVENTS PAGE HERO BANNER
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-banner-section">
        <div className="container">
          <div className="events-banner-content">
            <div className="events-page-badge">
              <span>NEXZIBYTE TECHTALK EVENTS DISCOVERY</span>
            </div>

            <h1 className="events-page-main-heading">
              Explore NexziByte Events
            </h1>

            <p className="events-page-main-subheading">
              Discover technology events, workshops, industry meetups and learning experiences that connect ideas, people and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. PAST NEXZIBYTE EVENTS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-past-section">
        <div className="container">
          <div className="events-section-header-row">
            <div>
              <div className="events-section-tag">
                <Award size={13} className="text-blue-accent" />
                <span>ARCHIVE &amp; IMPACT DISPATCHES</span>
              </div>
              <h2 className="events-section-heading">Past Events</h2>
              <p className="events-section-subtitle">
                Explore previous NexziByte summits, industry conferences, and developer networking sessions that shaped tech conversations.
              </p>
            </div>
          </div>

          <div className="past-events-three-col-grid">
            {DEDICATED_PAST_EVENTS.map((pastEvt) => (
              <div key={pastEvt.id} className="past-event-archive-card">
                <div className="past-card-img-wrap">
                  <img 
                    src={pastEvt.image} 
                    alt={pastEvt.title} 
                    className="past-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/events-tech-stage.jpg";
                    }}
                  />
                  <span className="past-badge-pill">{pastEvt.category}</span>
                </div>

                <div className="past-card-content">
                  <div className="past-card-meta-row">
                    <div className="past-meta-item">
                      <Calendar size={13} className="text-blue-accent" />
                      <span>{pastEvt.date}</span>
                    </div>
                    <div className="past-meta-item">
                      <MapPin size={13} className="text-blue-accent" />
                      <span>{pastEvt.location}</span>
                    </div>
                  </div>

                  <h3 className="past-card-title">{pastEvt.title}</h3>

                  <p className="past-card-desc">{pastEvt.description}</p>

                  <div className="past-card-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm btn-full"
                      onClick={() => handleOpenPastHighlights(pastEvt)}
                    >
                      <span>View Highlights</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. HOST AN EVENT / COLLABORATE SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-host-collab-section">
        <div className="container">
          <div className="host-collab-box">
            <div className="host-collab-ambient-glow" aria-hidden="true" />

            <div className="host-collab-inner">
              <span className="host-collab-tag">
                
                PARTNERSHIP &amp; COMMUNITY COLLABORATION
              </span>

              <h2 className="host-collab-heading">
                Want to Host or Collaborate on an Event?
              </h2>

              <p className="host-collab-text">
                Partner with NexziByte TechTalk to organize workshops, tech talks, community meetups and industry-focused learning experiences.
              </p>

              <div className="host-collab-btn-row">
                <button 
                  type="button" 
                  className="btn btn-blue-primary btn-lg"
                  onClick={() => handleOpenHostModal("host")}
                >
                  <Calendar size={18} />
                  <span>Host an Event</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg"
                  onClick={() => handleOpenHostModal("speaker")}
                >
                  <Mic size={18} />
                  <span>Become a Speaker</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MODALS
          ══════════════════════════════════════════════════════════════════ */}
      {/* 6. Event Detail Modal with Registration Card */}
      <EventDetailModal 
        event={selectedEventForDetail}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        autoFocusRegister={autoFocusRegister}
      />

      {/* Past Event Highlights Modal */}
      <PastEventHighlightsModal 
        event={selectedPastEvent}
        isOpen={pastModalOpen}
        onClose={() => setPastModalOpen(false)}
      />

      {/* Host / Speaker Modal */}
      <HostEventModal 
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        defaultType={hostModalType}
      />
    </div>
  );
}
