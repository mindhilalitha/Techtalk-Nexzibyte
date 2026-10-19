import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  X, Clock, MapPin, Briefcase, GraduationCap, 
  CheckCircle2, ArrowRight, Share2, Award, UserCheck, Send,
  BookOpen, FolderGit2, Wrench, ChevronDown, ChevronUp, Copy, Check, Sparkles
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { getCourseCurriculum } from "../data/courseSyllabusData.js";

export default function CourseModal() {
  const { 
    courseModalOpen, 
    setCourseModalOpen, 
    selectedCourse, 
    showToast,
    courseInitialTab 
  } = useApp();

  const [activeTab, setActiveTab] = useState("curriculum"); // "curriculum" | "overview" | "projects" | "tools" | "apply"
  const [expandedModule, setExpandedModule] = useState("01"); // Accordion state
  const [copiedSyllabus, setCopiedSyllabus] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interestRole: "",
    experienceLevel: "Student / Fresh Graduate",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Compute curriculum matter for the selected course
  const curriculumData = useMemo(() => {
    return getCourseCurriculum(selectedCourse);
  }, [selectedCourse]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && courseModalOpen) {
        setCourseModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [courseModalOpen, setCourseModalOpen]);

  // Reset form state when course changes or modal opens
  useEffect(() => {
    if (selectedCourse && courseModalOpen) {
      setFormData(prev => ({
        ...prev,
        interestRole: selectedCourse.roles ? selectedCourse.roles[0] : ""
      }));
      setSubmitted(false);
      setActiveTab(courseInitialTab || "curriculum");
      setExpandedModule("01");
    }
  }, [selectedCourse, courseInitialTab, courseModalOpen]);

  if (!courseModalOpen || !selectedCourse) return null;

  const handleCopySyllabus = () => {
    if (!curriculumData) return;
    const text = `Course: ${selectedCourse.title}\nSubtitle: ${selectedCourse.subtitle}\nDuration: ${selectedCourse.duration}\n\nSYLLABUS MODULES:\n` +
      curriculumData.modules.map(m => `Module ${m.number}: ${m.title} (${m.duration})\nTopics: ${m.topics.join(", ")}\nLab: ${m.handsOnLab}\n`).join("\n");
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSyllabus(true);
      showToast(` Syllabus for ${selectedCourse.title} copied to clipboard!`);
      setTimeout(() => setCopiedSyllabus(false), 3000);
    }).catch(() => {
      showToast("Unable to copy to clipboard");
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast("Please fill in your name, email, and phone number.");
      return;
    }

    try {
      await api.submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.interestRole || "Learner",
        form_type: "course",
        subject: `Course Application: ${selectedCourse.title}`,
        message: `Applicant: ${formData.name}\nCourse Track: ${selectedCourse.title}\nExperience Level: ${formData.experienceLevel}\nTarget Role: ${formData.interestRole || "N/A"}\nNotes/Goals: ${formData.notes || "N/A"}`
      });
    } catch (err) {
      console.warn("Course application submit notice:", err);
    }

    setSubmitted(true);
    showToast(` Application for ${selectedCourse.title} submitted to Admin! Our team will contact you.`);
  };

  const modulesList = curriculumData?.modules || [];
  const projectsList = curriculumData?.projects || [];
  const outcomesList = curriculumData?.learningOutcomes || [];
  const toolsList = curriculumData?.tools || selectedCourse.tags || [];

  return createPortal(
    <div 
      className="modal-backdrop-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setCourseModalOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto"
      }}
    >
      <div 
        className="modal-content-card course-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setCourseModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Hero */}
        <div className="course-modal-hero">
          <img 
            src={selectedCourse.image} 
            alt={selectedCourse.title} 
            className="course-modal-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/ai-course.jpg";
            }}
          />
          <div className="course-modal-overlay">
            <div className="course-modal-tags-row">
              <span className="course-badge-pill">
                {selectedCourse.category}
              </span>
              {selectedCourse.badge && (
                <span className="course-status-pill" style={{ background: "rgba(16, 185, 129, 0.9)", color: "#ffffff", fontWeight: 700 }}>
                  {selectedCourse.badge}
                </span>
              )}
              {selectedCourse.level && (
                <span className="course-badge-pill" style={{ background: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)" }}>
                  {selectedCourse.level}
                </span>
              )}
            </div>
            <h2 id="course-modal-title" className="course-modal-title">
              {selectedCourse.title}
            </h2>
            <div className="course-modal-subtitle">
              {selectedCourse.subtitle}
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="course-modal-tabs-bar" role="tablist">
          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            role="tab"
            aria-selected={activeTab === "overview"}
          >
            <span>Track Overview</span>
          </button>
          
          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
            onClick={() => setActiveTab("curriculum")}
            role="tab"
            aria-selected={activeTab === "curriculum"}
          >
            <BookOpen size={15} />
            <span>Syllabus &amp; Modules ({modulesList.length})</span>
          </button>

          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
            role="tab"
            aria-selected={activeTab === "projects"}
          >
            <FolderGit2 size={15} />
            <span>Projects ({projectsList.length})</span>
          </button>

          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "tools" ? "active" : ""}`}
            onClick={() => setActiveTab("tools")}
            role="tab"
            aria-selected={activeTab === "tools"}
          >
            <Wrench size={15} />
            <span>Skills &amp; Tools</span>
          </button>

          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "apply" ? "active" : ""}`}
            onClick={() => setActiveTab("apply")}
            role="tab"
            aria-selected={activeTab === "apply"}
          >
            <UserCheck size={15} />
            <span>Apply for Track</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="course-modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              {/* Quick Meta Row */}
              <div className="course-modal-quick-meta">
                <div className="quick-meta-item">
                  <Clock size={16} style={{ color: "#10B981" }} />
                  <div>
                    <span className="quick-label">Duration</span>
                    <strong className="quick-val">{selectedCourse.duration}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <MapPin size={16} style={{ color: "#F43F5E" }} />
                  <div>
                    <span className="quick-label">Format</span>
                    <strong className="quick-val">{selectedCourse.mode}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <GraduationCap size={16} style={{ color: "#A855F7" }} />
                  <div>
                    <span className="quick-label">Difficulty</span>
                    <strong className="quick-val">{selectedCourse.level || "Beginner to Advanced"}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <Award size={16} style={{ color: "#38BDF8" }} />
                  <div>
                    <span className="quick-label">Certification</span>
                    <strong className="quick-val">Industry Recognized</strong>
                  </div>
                </div>
              </div>

              {/* Special Internship Recruitment Notice */}
              {selectedCourse.internshipNote && (
                <div className="course-recruitment-banner">
                  <div className="pulse-dot-green"></div>
                  <div>
                    <strong style={{ fontSize: "0.9375rem", display: "block", color: "#34D399" }}>
                      Active Talent Recruitment &amp; Placement Support
                    </strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#A7F3D0", lineHeight: 1.45 }}>
                      "{selectedCourse.internshipNote}"
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Program Overview */}
              <div className="course-modal-text">
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "#FFFFFF" }}>
                  Program Overview
                </h4>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#E2E8F0" }}>
                  {selectedCourse.fullDesc || selectedCourse.shortDesc}
                </p>
                <p style={{ marginTop: "12px", color: "#CBD5E1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  Our curriculum combines direct hands-on lab exercises, system architecture teardowns, live mentor code reviews, and enterprise capstone project delivery to ensure you are day-one production ready.
                </p>
              </div>

              {/* Quick Jump to Syllabus Banner */}
              <div style={{
                marginTop: "20px",
                padding: "16px 20px",
                background: "linear-gradient(135deg, rgba(108, 43, 217, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.35)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sparkles size={20} style={{ color: "#C084FC" }} />
                  <div>
                    <strong style={{ color: "#FFFFFF", fontSize: "0.9375rem", display: "block" }}>
                      Complete {modulesList.length}-Module Syllabus Available
                    </strong>
                    <span style={{ color: "#CBD5E1", fontSize: "0.8125rem" }}>
                      Explore week-by-week topics, practical lab assignments &amp; capstone projects.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab("curriculum")}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <BookOpen size={14} />
                  <span>View Detailed Syllabus →</span>
                </button>
              </div>

              {/* Key Learning Outcomes */}
              {outcomesList.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", color: "#FFFFFF" }}>
                    What You Will Master:
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                    {outcomesList.map((outcome, idx) => (
                      <div key={idx} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        background: "rgba(255, 255, 255, 0.04)",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255, 255, 255, 0.08)"
                      }}>
                        <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "0.85rem", color: "#E2E8F0", lineHeight: 1.45 }}>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Roles & Outcomes */}
              {selectedCourse.roles && (
                <div style={{ marginTop: "24px" }}>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "10px", color: "#FFFFFF" }}>
                    Career Roles &amp; Outcomes:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedCourse.roles.map(r => (
                      <span key={r} className="course-role-badge">
                        <CheckCircle2 size={13} style={{ color: "#10B981" }} />
                        <span>{r}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED CURRICULUM & SYLLABUS MATTER */}
          {activeTab === "curriculum" && (
            <div>
              {/* Syllabus Header Bar */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px 0" }}>
                    {selectedCourse.title} Comprehensive Syllabus
                  </h4>
                  <span style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>
                    {curriculumData?.totalHours || `${modulesList.length} Core Modules`} • Lab-Driven Engineering Curriculum
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handleCopySyllabus}
                    className="btn btn-secondary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem" }}
                  >
                    {copiedSyllabus ? <Check size={14} style={{ color: "#10B981" }} /> : <Copy size={14} />}
                    <span>{copiedSyllabus ? "Copied!" : "Copy Syllabus"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("apply")}
                    className="btn btn-primary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem" }}
                  >
                    <UserCheck size={14} />
                    <span>Apply for this Track</span>
                  </button>
                </div>
              </div>

              {/* Module-by-Module Cards / Accordion */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {modulesList.map((mod) => {
                  const isExpanded = expandedModule === mod.number;
                  return (
                    <div 
                      key={mod.number}
                      className="course-syllabus-card"
                      style={{
                        background: isExpanded ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
                        border: isExpanded ? "1px solid rgba(168, 85, 247, 0.45)" : "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "14px",
                        overflow: "hidden",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {/* Module Card Header */}
                      <div 
                        onClick={() => setExpandedModule(isExpanded ? null : mod.number)}
                        style={{
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          userSelect: "none",
                          gap: "12px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <span style={{
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            color: "#FFFFFF",
                            background: "linear-gradient(135deg, #6C2BD9 0%, #EC4899 100%)",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            letterSpacing: "0.05em"
                          }}>
                            MODULE {mod.number}
                          </span>
                          <div>
                            <h5 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                              {mod.title}
                            </h5>
                            <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                              {mod.duration}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{
                            fontSize: "0.75rem",
                            background: "rgba(255, 255, 255, 0.08)",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            color: "#CBD5E1"
                          }}>
                            {mod.topics.length} Topics
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={18} style={{ color: "#C084FC" }} />
                          ) : (
                            <ChevronDown size={18} style={{ color: "#94A3B8" }} />
                          )}
                        </div>
                      </div>

                      {/* Module Expanded Details */}
                      {isExpanded && (
                        <div style={{
                          padding: "0 20px 20px 20px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                          marginTop: "4px",
                          paddingTop: "16px"
                        }}>
                          {mod.summary && (
                            <p style={{ fontSize: "0.875rem", color: "#CBD5E1", margin: "0 0 14px 0", lineHeight: 1.5 }}>
                              {mod.summary}
                            </p>
                          )}

                          {/* Topics Checklist */}
                          <div style={{ marginBottom: "16px" }}>
                            <strong style={{ display: "block", fontSize: "0.8125rem", color: "#C084FC", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
                              Topics Covered:
                            </strong>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {mod.topics.map((topic, tIdx) => (
                                <div key={tIdx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                  <span style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: "#38BDF8",
                                    marginTop: "7px",
                                    flexShrink: 0
                                  }}></span>
                                  <span style={{ fontSize: "0.875rem", color: "#E2E8F0", lineHeight: 1.45 }}>
                                    {topic}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Practical Hands-on Lab */}
                          {mod.handsOnLab && (
                            <div style={{
                              background: "rgba(16, 185, 129, 0.08)",
                              border: "1px solid rgba(16, 185, 129, 0.25)",
                              padding: "10px 14px",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px"
                            }}>
                              <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                              <div>
                                <strong style={{ fontSize: "0.78rem", color: "#34D399", display: "block", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                  Practical Lab Assignment:
                                </strong>
                                <span style={{ fontSize: "0.85rem", color: "#E2E8F0" }}>
                                  {mod.handsOnLab}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Support Callout */}
              <div style={{
                marginTop: "24px",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "18px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div>
                  <h5 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: "0 0 4px 0", color: "#FFFFFF" }}>
                    Looking for cohort dates &amp; placement opportunities?
                  </h5>
                  <p style={{ fontSize: "0.8125rem", color: "#94A3B8", margin: 0 }}>
                    Cohorts are conducted in our HITEC City Hyderabad campus and Live Online with 1-on-1 mentor guidance.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab("apply")}
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CAPSTONE PROJECTS */}
          {activeTab === "projects" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                  Enterprise Capstone Projects
                </h4>
                <p style={{ fontSize: "0.875rem", color: "#CBD5E1", margin: 0 }}>
                  Build production-grade applications that prove your technical ability to recruiters and hiring managers.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {projectsList.map((proj, pIdx) => (
                  <div 
                    key={pIdx}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "14px",
                      padding: "20px 24px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <FolderGit2 size={18} style={{ color: "#38BDF8" }} />
                      <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                        {proj.title}
                      </h5>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#E2E8F0", lineHeight: 1.55, margin: "0 0 14px 0" }}>
                      {proj.description}
                    </p>
                    
                    {proj.skills && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {proj.skills.map(sk => (
                          <span key={sk} style={{
                            fontSize: "0.75rem",
                            background: "rgba(108, 43, 217, 0.3)",
                            border: "1px solid rgba(168, 85, 247, 0.35)",
                            color: "#C084FC",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            fontWeight: 600
                          }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS & TOOLS */}
          {activeTab === "tools" && (
            <div>
              {/* Prerequisites */}
              {curriculumData?.prerequisites && (
                <div style={{
                  background: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px"
                }}>
                  <GraduationCap size={20} style={{ color: "#38BDF8", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ fontSize: "0.9375rem", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                      Prerequisites &amp; Target Background:
                    </strong>
                    <p style={{ fontSize: "0.85rem", color: "#E2E8F0", margin: 0, lineHeight: 1.5 }}>
                      {curriculumData.prerequisites}
                    </p>
                  </div>
                </div>
              )}

              {/* Target Audience */}
              {curriculumData?.targetAudience && (
                <div style={{ marginBottom: "24px" }}>
                  <h5 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
                    Who Should Attend:
                  </h5>
                  <p style={{ fontSize: "0.875rem", color: "#CBD5E1", margin: 0, lineHeight: 1.5 }}>
                    {curriculumData.targetAudience}
                  </p>
                </div>
              )}

              {/* Tools & Technologies Grid */}
              <h5 style={{ fontSize: "1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px" }}>
                Tools, Compilers &amp; Technologies Practiced:
              </h5>
              <div className="course-all-skills-grid">
                {toolsList.map((skill, index) => (
                  <div key={skill} className="curriculum-skill-card">
                    <span className="skill-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: APPLICATION FORM */}
          {activeTab === "apply" && (
            <div>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10B981",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                    Application Received!
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "#CBD5E1", maxWidth: "460px", margin: "0 auto 24px", lineHeight: 1.5 }}>
                    Thank you, <strong>{formData.name}</strong>. Our admissions and internship recruitment team will review your application for <strong>{selectedCourse.title}</strong> and reach out via email/phone within 24 hours.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => setCourseModalOpen(false)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication}>
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px", color: "#FFFFFF" }}>
                      Apply for {selectedCourse.title} Track
                    </h4>
                    <p style={{ fontSize: "0.875rem", color: "#CBD5E1", margin: 0 }}>
                      Submit your application for upcoming training &amp; internship cohorts in Hyderabad &amp; Online.
                    </p>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Your Full Name" 
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="you@domain.com" 
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="Enter 10-digit mobile number" 
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Target Role / Track</label>
                      <select 
                        className="form-input"
                        value={formData.interestRole}
                        onChange={(e) => setFormData({ ...formData, interestRole: e.target.value })}
                      >
                        {selectedCourse.roles && selectedCourse.roles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                        <option value="General Internship">General Internship Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Experience Level</label>
                    <select 
                      className="form-input"
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    >
                      <option value="Student / Fresh Graduate">Student / Fresh Graduate (Seeking Internship)</option>
                      <option value="Early Career (1-2 Years)">Early Career (1-2 Years Professional)</option>
                      <option value="Experienced Professional">Experienced Professional (Upskilling)</option>
                      <option value="Career Switcher">Career Switcher</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Career Goals (Optional)</label>
                    <textarea 
                      rows={3} 
                      placeholder="Tell us about your background, portfolio, or career goals..."
                      className="form-input"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setCourseModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      <Send size={15} />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="course-modal-footer">
          <div style={{ fontSize: "0.8125rem", color: "#CBD5E1" }}>
             Hyderabad Campus &amp; Live Remote Mentorship
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {activeTab !== "curriculum" && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab("curriculum")}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <BookOpen size={14} />
                <span>View Syllabus</span>
              </button>
            )}

            {activeTab !== "apply" && (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab("apply")}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>Apply for this Track</span>
                <ArrowRight size={14} />
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setCourseModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
