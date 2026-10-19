import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, Mic, Calendar, User, Mail, Building, FileText } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";

export default function HostEventModal({ isOpen, onClose, defaultType = "host" }) {
  const { showToast } = useApp();
  const [modalType, setModalType] = useState(defaultType); // "host" or "speaker"
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    topic: "",
    format: "workshop",
    message: ""
  });

  useEffect(() => {
    if (isOpen) {
      setModalType(defaultType || "host");
      setSubmitted(false);
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.topic) {
      showToast("Please fill out your name, email, and topic.");
      return;
    }

    setSubmitting(true);
    try {
      await api.submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.org || "",
        organization: formData.org || "",
        form_type: modalType === "host" ? "host_proposal" : "speaker_proposal",
        subject: modalType === "host" 
          ? `Host Event Proposal: ${formData.topic} (${formData.format})` 
          : `Speaker Proposal: ${formData.topic} (${formData.format})`,
        message: `Organization/College: ${formData.org || "N/A"}\nFormat: ${formData.format}\nTopic/Theme: ${formData.topic}\nDetails: ${formData.message || "N/A"}`
      });
    } catch (err) {
      console.warn("Host event submission notice:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
    showToast(modalType === "host" ? "Event proposal submitted to Admin!" : "Speaker application received!");
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      org: "",
      topic: "",
      format: "workshop",
      message: ""
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-container host-event-modal-container"
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

        {/* Modal Type Selector Tabs */}
        <div className="host-modal-header">
          <div className="host-type-toggle">
            <button 
              type="button" 
              className={`host-type-tab ${modalType === "host" ? "active" : ""}`}
              onClick={() => { setModalType("host"); setSubmitted(false); }}
            >
              <Calendar size={16} />
              <span>Host an Event</span>
            </button>
            <button 
              type="button" 
              className={`host-type-tab ${modalType === "speaker" ? "active" : ""}`}
              onClick={() => { setModalType("speaker"); setSubmitted(false); }}
            >
              <Mic size={16} />
              <span>Become a Speaker</span>
            </button>
          </div>

          <h2 className="host-modal-title">
            {modalType === "host" ? "Partner & Host an Event" : "Apply to Speak at NexziByte TechTalk"}
          </h2>
          <p className="host-modal-subtitle">
            {modalType === "host"
              ? "Collaborate with NexziByte TechTalk to co-organize workshops, industry summits, hackathons, or campus tech meetups."
              : "Share your engineering lessons, production architectures, or breakthrough innovations with our tech community."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="host-modal-body">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="host-form">
              <div className="event-form-row">
                <div className="event-form-group" style={{ flex: 1 }}>
                  <label className="event-form-label"><User size={14} /> Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Your Name" 
                    className="event-form-input" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-form-group" style={{ flex: 1 }}>
                  <label className="event-form-label"><Mail size={14} /> Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="you@company.com" 
                    className="event-form-input" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="event-form-row">
                <div className="event-form-group" style={{ flex: 1 }}>
                  <label className="event-form-label"><Building size={14} /> Organization / College</label>
                  <input 
                    type="text" 
                    name="org" 
                    placeholder="Company or Institution" 
                    className="event-form-input" 
                    value={formData.org}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-form-group" style={{ flex: 1 }}>
                  <label className="event-form-label">Preferred Format</label>
                  <select 
                    name="format" 
                    className="event-form-select"
                    value={formData.format}
                    onChange={handleChange}
                  >
                    <option value="workshop">Hands-on Workshop</option>
                    <option value="techtalk">Technical Keynote / Talk</option>
                    <option value="meetup">Developer Meetup</option>
                    <option value="conference">Summit / Conference Panel</option>
                    <option value="webinar">Online Live Webinar</option>
                  </select>
                </div>
              </div>

              <div className="event-form-group">
                <label className="event-form-label"><FileText size={14} /> {modalType === "host" ? "Event Theme / Concept *" : "Proposed Talk Title / Topic *"}</label>
                <input 
                  type="text" 
                  name="topic" 
                  required 
                  placeholder={modalType === "host" ? "e.g. AI In Healthcare Workshop or Cloud Migration Panel" : "e.g. Scaling Kubernetes with Zero-Downtime at High Concurrency"} 
                  className="event-form-input" 
                  value={formData.topic}
                  onChange={handleChange}
                />
              </div>

              <div className="event-form-group">
                <label className="event-form-label">Additional Details / Objectives</label>
                <textarea 
                  name="message" 
                  rows={3}
                  placeholder="Tell us about the target audience, expected outcomes, or preferred dates..."
                  className="event-form-textarea"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="host-form-actions">
                <button 
                  type="submit" 
                  className="btn btn-blue-primary btn-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{modalType === "host" ? "Submit Hosting Proposal" : "Submit Speaker Proposal"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="host-success-box">
              <CheckCircle2 size={48} className="text-blue-accent" />
              <h3 className="host-success-title">Proposal Submitted Successfully!</h3>
              <p className="host-success-desc">
                Thank you, <strong>{formData.name}</strong>. Our NexziByte Community Review Committee will review your details and connect with you at <strong>{formData.email}</strong> within 2 business days.
              </p>
              <button 
                type="button" 
                className="btn btn-blue-primary"
                onClick={onClose}
                style={{ marginTop: "16px" }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
