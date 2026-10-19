import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User as UserIcon, Camera, HelpCircle, Check, ChevronDown, 
  ArrowRight, ShieldCheck, Sparkles, Globe, MapPin, Briefcase 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { NexziByteLogo } from "./NexziByteLogo.jsx";

const TIMEZONES = [
  "(GMT +05:30) Chennai",
  "(GMT +05:30) Mumbai, Kolkata, New Delhi",
  "(GMT +00:00) London, Dublin, Edinburgh",
  "(GMT +01:00) Paris, Berlin, Amsterdam",
  "(GMT +04:00) Dubai, Abu Dhabi, Muscat",
  "(GMT +08:00) Singapore, Kuala Lumpur, Hong Kong",
  "(GMT +09:00) Tokyo, Seoul",
  "(GMT -05:00) Eastern Time (US & Canada) - New York",
  "(GMT -06:00) Central Time (US & Canada) - Chicago",
  "(GMT -07:00) Mountain Time (US & Canada) - Denver",
  "(GMT -08:00) Pacific Time (US & Canada) - San Francisco",
  "(GMT +10:00) Sydney, Melbourne, Brisbane"
];

const DEPARTMENTS = [
  "Software Engineering & Architecture",
  "Artificial Intelligence & Machine Learning",
  "Product Management",
  "UI/UX & Product Design",
  "Cloud Architecture & DevOps",
  "Cybersecurity & DevSecOps",
  "Data Engineering & Analytics",
  "Quality Assurance & Test Automation",
  "Marketing, Content & Growth",
  "Sales, Partnerships & Business Dev",
  "Human Resources & Talent Acquisition",
  "Operations, Strategy & Legal",
  "Student / Researcher / Fresher",
  "Other"
];

const EXPERIENCE_LEVELS = [
  "0 - 1 years (Student / Entry Level)",
  "1 - 3 years (Junior)",
  "3 - 5 years (Mid-Level)",
  "5 - 8 years (Senior)",
  "8 - 12 years (Lead / Staff / Principal)",
  "12+ years (Engineering Director / VP / CXO)"
];

const JOB_SEARCH_STATUSES = [
  "Actively looking for a new role",
  "Open to exciting opportunities",
  "Not looking right now (Happily employed)",
  "Hiring / Recruiter / Building team",
  "Founder / Co-Founder"
];

const JOB_SEARCH_DURATIONS = [
  "Just started (< 1 month)",
  "1 - 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "12+ months",
  "Not currently job searching"
];

const VISA_STATUSES = [
  "No / Citizen / Permanent Resident",
  "Yes - Student / Graduate Visa",
  "Yes - Work / Employment Visa (H1B, Tier 2, etc.)",
  "Require Visa Sponsorship",
  "Not Applicable"
];

const CAREER_CHALLENGES = [
  "Finding a job",
  "Navigating career growth at my current job",
  "Work-life balance",
  "Upskilling & mastering emerging technologies",
  "Networking & connecting with industry leaders"
];

const MENTORSHIP_OPTIONS = [
  "Yes, as a Mentee (Seeking guidance)",
  "Yes, as a Mentor (Happy to guide)",
  "Both (Mentee & Mentor)",
  "Maybe in the future",
  "No"
];

const ACCOUNTABILITY_OPTIONS = [
  "Yes, definitely interested",
  "Maybe, tell me more",
  "No, not at this time"
];

const RECRUITER_SHARING_OPTIONS = [
  "Yes, happy for you to share with partners",
  "No, keep my profile confidential within TechTalk"
];

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, showToast } = useApp();

  // Form State matching the exact 4 photos
  const [fullName, setFullName] = useState(user?.fullName || user?.name || "");
  const [timezone, setTimezone] = useState(user?.timezone || "(GMT +05:30) Chennai");
  const [headline, setHeadline] = useState(user?.headline || user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [customDepartment, setCustomDepartment] = useState("");
  const [experienceYears, setExperienceYears] = useState(user?.experience_years || "");
  const [jobSearchStatus, setJobSearchStatus] = useState(user?.job_search_status || "");
  const [jobSearchDuration, setJobSearchDuration] = useState(user?.job_search_duration || "");
  const [visaStatus, setVisaStatus] = useState(user?.visa_status || "");
  const [careerChallenge, setCareerChallenge] = useState(user?.career_challenge || "Finding a job");
  const [mentorshipInterest, setMentorshipInterest] = useState(user?.mentorship_interest || "");
  const [accountabilityInterest, setAccountabilityInterest] = useState(user?.accountability_group_interest || "");
  const [shareProfileWithPartners, setShareProfileWithPartners] = useState(user?.share_profile_with_partners || "");
  const [referralSource, setReferralSource] = useState(user?.referral_source || "");
  
  // Permissions Toggles
  const [permEmailPublic, setPermEmailPublic] = useState(user?.permission_email_public || false);
  const [permPreventMessages, setPermPreventMessages] = useState(user?.permission_prevent_messages || false);
  const [permShowDirectory, setPermShowDirectory] = useState(user?.permission_show_directory !== undefined ? user.permission_show_directory : true);

  // Avatar Photo State
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial user details if available
  useEffect(() => {
    if (user) {
      if (!fullName && (user.fullName || user.name)) {
        setFullName(user.fullName || user.name);
      }
      if (!headline && (user.headline || user.title)) {
        setHeadline(user.headline || user.title);
      }
      if (!location && user.location) {
        setLocation(user.location);
      }
    }
  }, [user]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!fullName.trim()) {
      showToast(" Please enter your full name.");
      return;
    }

    setIsSubmitting(true);

    const profilePayload = {
      full_name: fullName.trim(),
      name: fullName.trim(),
      timezone,
      headline: headline.trim(),
      title: headline.trim() || "Tech Community Member",
      bio: bio.trim(),
      location: location.trim(),
      linkedin_url: linkedinUrl.trim(),
      department: department === "Other" && customDepartment.trim() ? customDepartment.trim() : department,
      experience_years: experienceYears,
      job_search_status: jobSearchStatus,
      job_search_duration: jobSearchDuration,
      visa_status: visaStatus,
      career_challenge: careerChallenge,
      mentorship_interest: mentorshipInterest,
      accountability_group_interest: accountabilityInterest,
      share_profile_with_partners: shareProfileWithPartners,
      referral_source: referralSource.trim(),
      permission_email_public: permEmailPublic,
      permission_prevent_messages: permPreventMessages,
      permission_show_directory: permShowDirectory,
      avatar_url: avatarPreview,
      profile_completed: true
    };

    try {
      const res = await api.createProfileOnboarding(profilePayload);
      if (res && res.user) {
        setUser({
          ...user,
          ...res.user,
          fullName: fullName.trim(),
          name: fullName.trim(),
          title: headline.trim() || user?.title,
          isLoggedIn: true,
          profile_completed: true
        });
      } else {
        setUser({
          ...user,
          ...profilePayload,
          isLoggedIn: true,
          profile_completed: true
        });
      }

      showToast(" Profile created successfully! Welcome to the TechTalk Community.");
      navigate("/profile");
    } catch (err) {
      showToast(` ${err.message || "Failed to save profile. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-profile-container" style={{
      minHeight: "100vh",
      backgroundColor: "#f4f4f5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 16px 80px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "#18181b"
    }}>
      {/* Centered Form Wrapper */}
      <div style={{
        width: "100%",
        maxWidth: "620px",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "44px 36px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        border: "1px solid #e4e4e7"
      }}>
        {/* Brand Header Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <NexziByteLogo height={42} showTechTalk={true} />
        </div>

        {/* Page Title & Subtitle */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#09090b",
            margin: "0 0 6px 0",
            letterSpacing: "-0.02em"
          }}>
            Create a profile
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#71717a",
            margin: 0
          }}>
            This is how you'll appear in the community
          </p>
        </div>

        {/* Avatar Photo Section */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "32px"
        }}>
          <label htmlFor="avatar-file-input" style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{
              width: "92px",
              height: "92px",
              borderRadius: "50%",
              backgroundColor: "#f4f4f5",
              border: "2px solid #e4e4e7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
              transition: "border-color 0.2s ease"
            }}>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar Preview" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                <UserIcon size={48} color="#a1a1aa" strokeWidth={1.5} />
              )}
            </div>
            <span style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#18181b",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <Camera size={14} color="#71717a" />
              Add a photo
            </span>
          </label>
          <input 
            id="avatar-file-input" 
            type="file" 
            accept="image/*" 
            onChange={handlePhotoUpload} 
            style={{ display: "none" }} 
          />
        </div>

        {/* Main Onboarding Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          
          {/* 1. Full Name */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              Full name<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input 
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={inputStyle}
            />
          </div>

          {/* 2. Timezone */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              Timezone<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 3. Headline */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              <span>Headline<span style={{ color: "#dc2626" }}>*</span></span>
              <HelpCircle size={14} color="#a1a1aa" title="Your professional title and summary" style={{ cursor: "pointer" }} />
            </label>
            <input 
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Job title & what you're looking for"
              style={inputStyle}
            />
          </div>

          {/* 4. Bio */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              <span>Bio</span>
              <HelpCircle size={14} color="#a1a1aa" title="A brief description of your background and tech interests" style={{ cursor: "pointer" }} />
            </label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself"
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            />
          </div>

          {/* 5. Location */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              <span>Location<span style={{ color: "#dc2626" }}>*</span></span>
              <HelpCircle size={14} color="#a1a1aa" title="City, State, or Country" style={{ cursor: "pointer" }} />
            </label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city or location"
              style={inputStyle}
            />
          </div>

          {/* 6. LinkedIn URL */}
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              <span>Linkedin URL<span style={{ color: "#dc2626" }}>*</span></span>
              <HelpCircle size={14} color="#a1a1aa" title="Your personal LinkedIn profile link" style={{ cursor: "pointer" }} />
            </label>
            <input 
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="Add your LinkedIn URL"
              style={inputStyle}
            />
          </div>

          {/* 7. Department */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              What department do you work in or are you seeking work in?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            {department === "Other" && (
              <div style={{ marginTop: "10px", padding: "12px", background: "#EFF6FF", borderRadius: "10px", border: "1.5px solid #BFDBFE" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#1D4ED8", marginBottom: "6px" }}>
                  Specify Your Custom Department / Profession *
                </label>
                <input 
                  type="text"
                  required
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  placeholder="e.g. Embedded Systems, Robotics, Solutions Specialist"
                  style={{
                    ...inputStyle,
                    border: "1px solid #93C5FD",
                    backgroundColor: "#FFFFFF",
                    color: "#1E293B"
                  }}
                />
              </div>
            )}
          </div>

          {/* 8. Years of Experience */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              How many years of experience do you have in your field or the field you're seeking work in?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 9. Current Job Search Status */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              What is your current job search status?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={jobSearchStatus}
                onChange={(e) => setJobSearchStatus(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {JOB_SEARCH_STATUSES.map((stat) => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 10. Job Search Duration */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              If you're actively job searching, how long have you been looking for a job?
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={jobSearchDuration}
                onChange={(e) => setJobSearchDuration(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {JOB_SEARCH_DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 11. Visa Status */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              Are you currently on a visa?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={visaStatus}
                onChange={(e) => setVisaStatus(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {VISA_STATUSES.map((visa) => (
                  <option key={visa} value={visa}>{visa}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 12. Biggest Career Challenge (Radio Option List matching screenshot) */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "10px" }}>
              What is your biggest challenge right now in your career?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {CAREER_CHALLENGES.map((challenge) => (
                <label 
                  key={challenge} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: careerChallenge === challenge ? "#f5f3ff" : "#ffffff",
                    border: `1px solid ${careerChallenge === challenge ? "#c4b5fd" : "#e4e4e7"}`,
                    cursor: "pointer",
                    fontSize: "14px",
                    color: careerChallenge === challenge ? "#6d28d9" : "#3f3f46",
                    fontWeight: careerChallenge === challenge ? 600 : 400,
                    transition: "all 0.15s ease"
                  }}
                >
                  <input 
                    type="radio" 
                    name="careerChallenge" 
                    value={challenge}
                    checked={careerChallenge === challenge}
                    onChange={() => setCareerChallenge(challenge)}
                    style={{ accentColor: "#7c3aed", width: "16px", height: "16px" }}
                  />
                  <span>{challenge}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 13. Mentorship Interest */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              Would you be interested in joining a mentorship program?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={mentorshipInterest}
                onChange={(e) => setMentorshipInterest(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {MENTORSHIP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 14. Accountability Group Interest */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              Would you be interested in joining an accountability group?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={accountabilityInterest}
                onChange={(e) => setAccountabilityInterest(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {ACCOUNTABILITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 15. Share profile with recruitment partners */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px", lineHeight: 1.45 }}>
              Would you be happy for us to share your profile (CV, LinkedIn, and key career info) with our vetted recruitment partners if we believe they have relevant job opportunities for you?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select 
                value={shareProfileWithPartners}
                onChange={(e) => setShareProfileWithPartners(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "36px", cursor: "pointer" }}
              >
                <option value="">Select an option</option>
                {RECRUITER_SHARING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={16} color="#71717a" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* 16. How did you hear about TechTalk */}
          <div className="form-group">
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#18181b", marginBottom: "6px" }}>
              How did you hear about TechTalk?<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input 
              type="text"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              placeholder=""
              style={inputStyle}
            />
          </div>

          {/* Permissions Section */}
          <div style={{ marginTop: "12px", paddingTop: "18px", borderTop: "1px solid #f4f4f5" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#18181b", margin: "0 0 16px 0" }}>
              Permissions
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Toggle 1: Make email visible */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#3f3f46" }}>
                  <span>Make my email publicly visible</span>
                  <HelpCircle size={14} color="#a1a1aa" title="Allow other members to view your email address on your public profile" />
                </div>
                <ToggleSwitch checked={permEmailPublic} onChange={() => setPermEmailPublic(!permEmailPublic)} />
              </div>

              {/* Toggle 2: Prevent messages */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#3f3f46" }}>
                  <span>Prevent members from messaging me</span>
                  <HelpCircle size={14} color="#a1a1aa" title="Block direct peer-to-peer messages from general members" />
                </div>
                <ToggleSwitch checked={permPreventMessages} onChange={() => setPermPreventMessages(!permPreventMessages)} />
              </div>

              {/* Toggle 3: Show profile in directory */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#3f3f46" }}>
                  <span>Show my profile in the member directory</span>
                  <HelpCircle size={14} color="#a1a1aa" title="Make your member card discoverable in the community directory" />
                </div>
                <ToggleSwitch checked={permShowDirectory} onChange={() => setPermShowDirectory(!permShowDirectory)} />
              </div>
            </div>
          </div>

          {/* Continue Action Button */}
          <div style={{ marginTop: "24px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor: "#2563EB", // Vibrant Royal Blue matching user request
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                borderRadius: "9999px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1D4ED8"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
            >
              {isSubmitting ? "Saving Profile..." : "Continue"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Reusable Switch Component matching iOS/Modern Web Pill Toggle
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: "42px",
        height: "24px",
        borderRadius: "9999px",
        backgroundColor: checked ? "#0f172a" : "#e4e4e7",
        position: "relative",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        transition: "background-color 0.2s ease",
        display: "inline-flex",
        alignItems: "center"
      }}
    >
      <span style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        transform: checked ? "translateX(18px)" : "translateX(0px)",
        transition: "transform 0.2s ease"
      }} />
    </button>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #e4e4e7",
  backgroundColor: "#ffffff",
  fontSize: "14px",
  color: "#18181b",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease"
};
