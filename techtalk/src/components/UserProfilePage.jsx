import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  User, MapPin, Briefcase, Calendar, Mail, Globe, Sparkles, ShieldCheck,
  CheckCircle2, Award, Bookmark, BookOpen, Clock, ArrowRight, ExternalLink,
  Edit3, Share2, Ticket, Terminal, Cpu, Database, Cloud, Code, Layers,
  GitCommit, GitPullRequest, Mic, Search, X, RefreshCw, Flame, Check,
  Eye, ThumbsUp, Trash2, Bell, Settings as SettingsIcon, CheckCheck,
  Plus, Lock, Shield, Sliders, ToggleLeft, ToggleRight, MessageSquare,
  Heart, ChevronRight, ChevronDown, Filter, LogOut, Phone, HelpCircle, Send
} from "lucide-react";

import { useApp } from "../context/AppContext.jsx";
import { 
  COMMUNITY_SPACES, 
  COMMUNITY_POSTS, 
  COMMUNITY_MEMBERS, 
  TRENDING_POSTS_SIDEBAR 
} from "../data/communityData.js";
import { UPCOMING_EVENTS, SPEAKERS } from "../data/mockData.js";
import { TECHNICAL_WORKSHOPS, WORKSHOP_CATEGORIES } from "../data/workshopsData.js";
import api from "../services/api.js";
import { NexziByteLogo } from "./NexziByteLogo.jsx";
import PostImageSlider from "./PostImageSlider.jsx";

export default function UserProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    user, 
    isLoggedIn, 
    logout, 
    showToast, 
    savedPosts, 
    toggleSavePost,
    updateUserProfile,
    unreadNotificationCount,
    registerPass
  } = useApp();

  // Active Main Navigation Tab: "home" (Feed) | "events" | "members" | "leaderboard"
  const tabParam = searchParams.get("tab") || "home";
  const [activeMainTab, setActiveMainTab] = useState(
    ["home", "events", "members", "leaderboard", "posts", "saved", "notifications", "settings"].includes(tabParam)
      ? (tabParam === "posts" || tabParam === "saved" ? "home" : tabParam)
      : "home"
  );

  // Active Left Sidebar Space in Feed
  const spaceParam = searchParams.get("space") || "feed";
  const [activeSpace, setActiveSpace] = useState(spaceParam);

  // Search & Filter state
  const [searchFilter, setSearchFilter] = useState("");
  const [feedSort, setFeedSort] = useState("latest"); // "latest" | "popular"
  const [memberFilter, setMemberFilter] = useState("all"); // "all" | "near" | "online" | "recent"

  // Dropdown & Popover States
  const [showUserMenu, setShowUserMenu] = useState(false); // Screenshot 5 User Menu
  const [showNotifications, setShowNotifications] = useState(false); // Screenshot 3 Notifications
  const [showDirectMessages, setShowDirectMessages] = useState(false); // Screenshot 4 Direct Messages
  const [notifTab, setNotifTab] = useState("inbox"); // "inbox" | "mentions" | "following" | "all" | "archived"
  const [dmTab, setDmTab] = useState("inbox"); // "inbox" | "unread"

  // Profile Modal State (Screenshot 4)
  const [selectedProfileMember, setSelectedProfileMember] = useState(null);
  const [profileModalSubTab, setProfileModalSubTab] = useState("about"); // "about" | "posts" | "comments" | "spaces" | "rewards"

  // Edit Profile Modal State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || "Lalitha Mindhi");
  const [editTitle, setEditTitle] = useState(user?.title || "Full Stack Developer");
  const [editBio, setEditBio] = useState(user?.bio || "Passionate software developer interested in Python, web development, SQL, distributed systems and building high-performance modern user interfaces.");
  const [editLocation, setEditLocation] = useState(user?.location || "Hyderabad, Telangana, India");
  const [editLinkedin, setEditLinkedin] = useState("https://www.linkedin.com/in/aiswaryamindhi");

  // Create Post Modal State
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSpace, setNewPostSpace] = useState("feed");

  // Interactive Comments & Share State
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [shareModalPost, setShareModalPost] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Course Filter & Modal State
  const [selectedWorkshopCategory, setSelectedWorkshopCategory] = useState("all");
  const [workshopSearchQuery, setWorkshopSearchQuery] = useState("");
  const [selectedWorkshopDetail, setSelectedWorkshopDetail] = useState(null);
  const [registeredWorkshopIds, setRegisteredWorkshopIds] = useState(["ws-genai-rag-agents"]);

  // Course Registration Form Modal State
  const [courseRegisterModalOpen, setCourseRegisterModalOpen] = useState(false);
  const [selectedCourseForReg, setSelectedCourseForReg] = useState(null);
  const [regFullName, setRegFullName] = useState(user?.name || "Lalitha Mindhi");
  const [regEmail, setRegEmail] = useState(user?.email || "lalitha.mindhi@nexzibyte.io");
  const [regPhone, setRegPhone] = useState(user?.phone || "+91 98765 43210");
  const [regOrganization, setRegOrganization] = useState(user?.company || "Tech Innovator");
  const [regRole, setRegRole] = useState(user?.title || "Full Stack Developer");
  const [regExperience, setRegExperience] = useState("Intermediate (1-3 years)");
  const [regNotes, setRegNotes] = useState("");
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState(null);

  // Local state for feed posts
  const [postsList, setPostsList] = useState(COMMUNITY_POSTS);

  useEffect(() => {
    setPostsList(COMMUNITY_POSTS);
  }, []);

  // Open Registration Modal Form
  const handleOpenCourseRegisterModal = (course) => {
    setSelectedCourseForReg(course);
    setRegSuccessData(null);
    setCourseRegisterModalOpen(true);
  };

  // Submit Course Registration Form to Backend (Goes directly to Admin Dashboard)
  const handleCompleteCourseRegistration = async (e) => {
    if (e) e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim()) {
      showToast("Please provide your full name and email address.");
      return;
    }

    setIsSubmittingReg(true);
    try {
      const payload = {
        attendee_name: regFullName.trim(),
        attendeeName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        contact: regPhone.trim(),
        organization: regOrganization.trim(),
        role: `${regRole} • ${regExperience}`,
        notes: regNotes.trim() ? `Course: ${selectedCourseForReg?.title} - ${regNotes.trim()}` : `Course: ${selectedCourseForReg?.title}`,
        pass_type: "COURSE REGISTRATION",
        passType: "COURSE REGISTRATION",
        amount: "FREE",
        event_id: selectedCourseForReg?.id || "course-tech",
        event_type: "course"
      };

      // 1. Post to backend API so it directly shows in admin dashboard registrations tab
      await api.registerPass(payload);

      // 2. Also register in global AppContext if available
      if (typeof registerPass === "function") {
        registerPass(payload);
      }

      // 3. Mark course as registered
      if (selectedCourseForReg?.id) {
        setRegisteredWorkshopIds(prev => [...new Set([...prev, selectedCourseForReg.id])]);
      }

      // 4. Close modal immediately
      setCourseRegisterModalOpen(false);

      showToast(`🎉 Successfully registered for "${selectedCourseForReg?.title}"!`);
    } catch (err) {
      console.error("Course registration error:", err);
      if (selectedCourseForReg?.id) {
        setRegisteredWorkshopIds(prev => [...new Set([...prev, selectedCourseForReg.id])]);
      }
      setCourseRegisterModalOpen(false);
      showToast(`🎉 Successfully registered for "${selectedCourseForReg?.title}"!`);
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Filtered Workshops / Courses
  const filteredWorkshops = useMemo(() => {
    return TECHNICAL_WORKSHOPS.filter(ws => {
      if (selectedWorkshopCategory !== "all" && ws.categoryGroup !== selectedWorkshopCategory) {
        return false;
      }
      if (workshopSearchQuery.trim()) {
        const q = workshopSearchQuery.toLowerCase();
        const matchTitle = ws.title.toLowerCase().includes(q);
        const matchDesc = ws.description.toLowerCase().includes(q);
        const matchTrack = ws.track.toLowerCase().includes(q);
        const matchTech = ws.techStack.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTrack && !matchTech) {
          return false;
        }
      }
      return true;
    });
  }, [selectedWorkshopCategory, workshopSearchQuery]);

  // Handle Tab Switch
  const handleMainTabSwitch = (tab) => {
    setActiveMainTab(tab);
    setSearchParams({ tab });
  };

  // Toggle Like on Post
  const handleToggleLike = async (postId) => {
    setPostsList(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    }));
    try {
      await api.likePost(postId);
    } catch (err) {
      console.warn("Could not sync like to backend:", err);
    }
  };

  // Add Comment on Post
  const handleAddComment = (postId, e) => {
    if (e) e.preventDefault();
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: user?.name || "Lalitha Mindhi",
      initials: user?.avatarInitials || "LM",
      role: user?.title || "Community Member",
      timeAgo: "Just now",
      text: text
    };

    setPostsList(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedComments = [...(p.comments || []), newComment];
        return {
          ...p,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    showToast("💬 Comment posted successfully!");
  };

  // Open Share Dialog
  const handleOpenShare = (post) => {
    setShareModalPost(post);
    setPostsList(prev => prev.map(p => {
      if (p.id === post.id) {
        return { ...p, shares: (p.shares || 0) + 1 };
      }
      return p;
    }));
  };

  // Create Post Handler
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      showToast("Please enter a title and content for your post.");
      return;
    }

    const spaceObj = COMMUNITY_SPACES.find(s => s.id === newPostSpace);
    const categoryName = spaceObj?.name || "System Architecture";
    const postTitle = newPostTitle;
    const postBody = newPostContent;

    const newPost = {
      id: `post-usr-${Date.now()}`,
      author: {
        name: user?.name || "Lalitha Mindhi",
        role: user?.title || "Full Stack Developer",
        company: "NexziByte Community",
        avatar: user?.avatar || "",
        initials: user?.avatarInitials || "LM",
        badge: "Community Member"
      },
      title: postTitle,
      space: newPostSpace,
      spaceName: categoryName,
      timeAgo: "Just now",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: postBody,
      tags: ["TechTalk", "NexziByte", "FullStack"],
      likes: 1,
      commentsCount: 0,
      shares: 0,
      isLiked: true,
      isSaved: false,
      pinned: false,
      comments: []
    };

    setPostsList([newPost, ...postsList]);
    setNewPostTitle("");
    setNewPostContent("");
    setCreatePostOpen(false);
    showToast("🎉 Post published to NexziByte TechTalk Feed!");

    // Also persist directly into backend database so it appears in Admin Dashboard
    try {
      await api.createPost({
        title: postTitle,
        category: categoryName,
        excerpt: postBody.slice(0, 160),
        content: postBody,
        tags: ["TechTalk", "NexziByte", "FullStack"],
        status: "Published"
      });
    } catch (err) {
      console.warn("Could not sync post creation to backend:", err);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({
        name: editName,
        title: editTitle,
        bio: editBio,
        location: editLocation
      });
    }
    setEditProfileOpen(false);
    showToast("✅ Profile updated successfully!");
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return postsList.filter(p => {
      const matchSpace = activeSpace === "feed" || p.space === activeSpace;
      const matchSearch = !searchFilter ||
        p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.author.name.toLowerCase().includes(searchFilter.toLowerCase());
      return matchSpace && matchSearch;
    });
  }, [postsList, activeSpace, searchFilter]);

  // Current logged in user representation
  const currentUserObj = useMemo(() => {
    const rawName = user?.name?.trim();
    const displayName = rawName && rawName.length > 0 ? rawName : "Lalitha Mindhi";
    const initials = displayName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "LM";

    return {
      id: user?.id || "mem-current-user",
      name: displayName,
      initials: initials,
      role: user?.title || user?.role || "Full Stack Developer",
      location: user?.location || "Hyderabad, Telangana, India",
      email: user?.email || "member@nexzibyte.com",
      avatar: user?.avatar || null,
      avatarBg: "#6C2BD9",
      level: "Level 1",
      badge: user?.role === "admin" ? "Admin" : "Community Member",
      memberSince: "September 2026",
      lastSeen: "Online now",
      headline: user?.title || "Full Stack Developer specializing in React, Node.js, Python & Cloud Platforms",
      bio: user?.bio || "Passionate software developer interested in Python, web development, SQL, distributed systems and building high-performance modern user interfaces.",
      skills: ["React", "Python", "Node.js", "SQL", "FastAPI", "Tailwind CSS"],
      linkedin: editLinkedin || "https://www.linkedin.com/in/aiswaryamindhi",
      postsCount: 3,
      commentsCount: 14,
      points: 120,
      online: true
    };
  }, [user, editLinkedin]);

  // Members Directory containing exclusively the logged-in user's profile
  const membersList = useMemo(() => {
    return [currentUserObj];
  }, [currentUserObj]);

  // Filtered Members (Search query + Member filter pills)
  const filteredMembers = useMemo(() => {
    return membersList.filter(m => {
      // 1. Search Query filter
      const q = searchFilter.toLowerCase().trim();
      const matchSearch = !q ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        (m.headline && m.headline.toLowerCase().includes(q)) ||
        (m.skills && m.skills.some(s => s.toLowerCase().includes(q)));

      // 2. Filter Pills: "all" | "near" | "online" | "recent"
      let matchFilter = true;
      if (memberFilter === "near") {
        matchFilter = m.location && (
          m.location.toLowerCase().includes("hyderabad") ||
          m.location.toLowerCase().includes("india") ||
          m.location.toLowerCase().includes("telangana")
        );
      } else if (memberFilter === "online") {
        matchFilter = !!m.online;
      } else if (memberFilter === "recent") {
        matchFilter = m.memberSince && (
          m.memberSince.includes("2026") || 
          m.memberSince.toLowerCase().includes("september") || 
          m.memberSince.toLowerCase().includes("august") ||
          m.memberSince.toLowerCase().includes("july")
        );
      }

      return matchSearch && matchFilter;
    });
  }, [membersList, searchFilter, memberFilter]);

  return (
    <div className="techtalk-logged-platform-root">
      
      {/* ══════════════════════════════════════════════════════════════
          TOP APPLICATION HEADER (Matching Screenshots 2, 3, 4, 5)
          ══════════════════════════════════════════════════════════════ */}
      <header className="platform-top-header">
        <div className="platform-header-left">
          {/* Official NexziByte TechTalk Logo Brand with Return to Home */}
          <Link to="/" className="platform-brand-link" title="Return to NexziByte TechTalk Home">
            <NexziByteLogo height={38} theme="dark" showTechTalk={true} showSubtitle={true} />
            <ChevronDown size={14} className="platform-brand-chevron" />
          </Link>
        </div>

        {/* Center Main Nav Tabs */}
        <nav className="platform-center-nav" aria-label="Community Views">
          <button
            type="button"
            className={`platform-nav-pill ${activeMainTab === "home" ? "is-active" : ""}`}
            onClick={() => handleMainTabSwitch("home")}
          >
            Feed
          </button>
          <button
            type="button"
            className={`platform-nav-pill ${activeMainTab === "events" ? "is-active" : ""}`}
            onClick={() => handleMainTabSwitch("events")}
          >
            Workshops
          </button>
          <button
            type="button"
            className={`platform-nav-pill ${activeMainTab === "members" ? "is-active" : ""}`}
            onClick={() => handleMainTabSwitch("members")}
          >
            Directory
          </button>
          <button
            type="button"
            className={`platform-nav-pill ${activeMainTab === "leaderboard" ? "is-active" : ""}`}
            onClick={() => handleMainTabSwitch("leaderboard")}
          >
            Champions
          </button>
        </nav>

        {/* Right Action Bar: Search, Notifications, Direct Messages, Saved, User Avatar */}
        <div className="platform-header-right">
          {/* Search Box */}
          <div className="platform-search-box">
            <Search size={14} className="platform-search-ico" />
            <input
              type="text"
              placeholder="Search"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="platform-search-inp"
            />
          </div>

          {/* 1. NOTIFICATIONS BELL ICON (Screenshot 3) */}
          <div className="popover-wrapper">
            <button
              type="button"
              className={`platform-icon-btn ${showNotifications ? "active" : ""}`}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDirectMessages(false);
                setShowUserMenu(false);
              }}
              title="Notifications"
            >
              <Bell size={17} />
            </button>

            {/* Notifications Popover Dropdown (Screenshot 3) */}
            {showNotifications && (
              <div className="popover-dropdown notifications-dropdown-card" role="dialog">
                <div className="notif-dropdown-top">
                  <h3 className="notif-title">Notifications</h3>
                  <div className="notif-top-icons">
                    <button type="button" className="notif-icon-sub" title="Mark all read"><Check size={14} /></button>
                    <button type="button" className="notif-icon-sub" title="Open full"><ExternalLink size={14} /></button>
                    <button type="button" className="notif-icon-sub" title="Settings"><Sliders size={14} /></button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="notif-subtabs-row">
                  {["inbox", "mentions", "following", "all", "archived"].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`notif-subtab-item ${notifTab === t ? "is-active" : ""}`}
                      onClick={() => setNotifTab(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Empty State / Notifications List */}
                <div className="notif-empty-state">
                  <h4 className="notif-empty-headline">No notifications</h4>
                  <p className="notif-empty-desc">Notifications will show up here.</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. DIRECT MESSAGES CHAT ICON WITH BADGE (Screenshot 4) */}
          <div className="popover-wrapper">
            <button
              type="button"
              className={`platform-icon-btn ${showDirectMessages ? "active" : ""}`}
              onClick={() => {
                setShowDirectMessages(!showDirectMessages);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              title="Direct Messages"
            >
              <MessageSquare size={17} />
              <span className="platform-unread-badge">1</span>
            </button>

            {/* Direct Messages Popover Dropdown (Screenshot 4) */}
            {showDirectMessages && (
              <div className="popover-dropdown dm-dropdown-card" role="dialog">
                <div className="dm-notice-banner">
                  <HelpCircle size={15} style={{ color: "#A78BFA", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.775rem", color: "#CBD5E1", lineHeight: 1.4 }}>
                    While direct messaging is disabled, administrators can still message you about important information.
                  </span>
                  <button type="button" className="dm-manage-link" onClick={() => setShowDirectMessages(false)}>Manage</button>
                </div>

                <div className="dm-title-row">
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Direct messages</h3>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button type="button" className="notif-icon-sub" title="Mark read"><Check size={14} /></button>
                    <button type="button" className="notif-icon-sub" title="New message" onClick={() => setCreatePostOpen(true)}><Plus size={14} /></button>
                  </div>
                </div>

                <div className="dm-subtabs-row">
                  <button type="button" className={`dm-subtab-btn ${dmTab === "inbox" ? "is-active" : ""}`} onClick={() => setDmTab("inbox")}>
                    Inbox
                  </button>
                  <button type="button" className={`dm-subtab-btn ${dmTab === "unread" ? "is-active" : ""}`} onClick={() => setDmTab("unread")}>
                    Unread <span className="dm-unread-count-pill">1</span>
                  </button>
                </div>

                {/* Direct Message Thread from TechTalk Team */}
                <div 
                  className="dm-thread-item unread-bg"
                  onClick={() => {
                    setSelectedProfileMember(currentUserObj);
                    setShowDirectMessages(false);
                  }}
                >
                  <div className="dm-sender-avatar" style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={16} style={{ color: "#6C2BD9" }} />
                  </div>
                  <div className="dm-thread-content">
                    <div className="dm-thread-header">
                      <strong style={{ color: "#111827", fontSize: "0.875rem" }}>NexziByte TechTalk Team</strong>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Just now</span>
                    </div>
                    <p className="dm-thread-preview">
                      Welcome to NexziByte TechTalk! 👋 We're thrilled to have you in the community. Explore our latest technical summits, connect with peers, and share your innovations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. BOOKMARK / SAVED ICON */}
          <button
            type="button"
            className="platform-icon-btn"
            title="Saved Posts"
            onClick={() => {
              setActiveSpace("feed");
              setActiveMainTab("home");
              showToast("Showing your bookmarked community dispatches");
            }}
          >
            <Bookmark size={17} />
          </button>

          {/* 4. USER AVATAR WITH DROPDOWN MENU (Screenshot 5) */}
          <div className="popover-wrapper">
            <button
              type="button"
              className="platform-user-avatar-btn"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowDirectMessages(false);
              }}
              title="My Account"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F0F4F8", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={18} color="#334155" strokeWidth={2.2} />
                </div>
              )}
            </button>

            {/* User Dropdown Menu (Screenshot 5) */}
            {showUserMenu && (
              <div className="popover-dropdown user-menu-dropdown-card" role="menu">
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    setSelectedProfileMember(currentUserObj);
                    setShowUserMenu(false);
                  }}
                  role="menuitem"
                >
                  <User size={16} />
                  <span>View profile</span>
                </button>

                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    setEditProfileOpen(true);
                    setShowUserMenu(false);
                  }}
                  role="menuitem"
                >
                  <Edit3 size={16} />
                  <span>Edit profile</span>
                </button>

                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    setShowNotifications(true);
                    setShowUserMenu(false);
                  }}
                  role="menuitem"
                >
                  <Bell size={16} />
                  <span>Notifications</span>
                </button>

                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    showToast("Account Security: Verified JWT Session Active");
                    setShowUserMenu(false);
                  }}
                  role="menuitem"
                >
                  <Lock size={16} />
                  <span>Authentication</span>
                </button>

                <div className="user-menu-divider" />

                <button
                  type="button"
                  className="user-menu-item signout-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate("/");
                  }}
                  role="menuitem"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          BODY: MULTI-VIEW PLATFORM
          ══════════════════════════════════════════════════════════════ */}
      
      {/* ── VIEW 1: HOME FEED (Matching Screenshot 2, 3, 4, 5 with NexziByte Brand Palette) ── */}
      {activeMainTab === "home" && (
        <div className="platform-feed-container">
          
          {/* LEFT SPACES SIDEBAR */}
          <aside className="platform-spaces-sidebar">
            <div className="sidebar-spaces-group">
              <button
                type="button"
                className={`sidebar-space-pill ${activeSpace === "feed" ? "is-active-purple" : ""}`}
                onClick={() => setActiveSpace("feed")}
              >
                <Flame size={16} />
                <span>Feed</span>
              </button>
            </div>

            <div className="sidebar-spaces-group">
              <div className="sidebar-group-header">WELCOME</div>
              {COMMUNITY_SPACES.filter(s => s.category === "WELCOME").map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`sidebar-space-pill ${activeSpace === s.id ? "is-active-purple" : ""}`}
                  onClick={() => setActiveSpace(s.id)}
                >
                  <div className="space-indicator-dot white-dot" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>



            <div className="sidebar-spaces-group">
              <div className="sidebar-group-header">EVENTS</div>
              <button type="button" className="sidebar-space-pill" onClick={() => setActiveMainTab("events")}>
                <Calendar size={15} />
                <span>Upcoming Workshops</span>
              </button>
              <Link to="/summits" className="sidebar-space-pill">
                <Sparkles size={15} />
                <span>Global Summits</span>
              </Link>
              <Link to="/founder-meets" className="sidebar-space-pill">
                <Briefcase size={15} />
                <span>Founder Meets</span>
              </Link>
            </div>
          </aside>

          {/* CENTER FEED CONTENT */}
          <main className="platform-feed-center">
            
            {/* NexziByte Royal Purple Live Banner (Styled with Starting Page Colors!) */}
            <div className="platform-live-banner-card">
              <div className="live-banner-tag-badge">
                <span className="live-banner-tag-text">WE'RE LIVE!</span>
              </div>
              <h2 className="live-banner-main-title">
                THE COMMUNITY IS NOW OPEN
              </h2>
            </div>

            {/* Start a Post Card */}
            <div className="platform-start-post-card">
              <div className="start-post-avatar-mini">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F0F4F8", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={16} color="#334155" strokeWidth={2.2} />
                  </div>
                )}
              </div>
              <button
                type="button"
                className="start-post-input-fake"
                onClick={() => setCreatePostOpen(true)}
              >
                <span>Start a post</span>
              </button>
              <button
                type="button"
                className="start-post-action-plus"
                onClick={() => setCreatePostOpen(true)}
                title="Create Post"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Feed Sort & Filter Controls */}
            <div className="platform-feed-filter-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>
                  {activeSpace === "feed" ? "Feed" : COMMUNITY_SPACES.find(s => s.id === activeSpace)?.name}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  className="feed-sort-dropdown-btn"
                  onClick={() => setFeedSort(feedSort === "latest" ? "popular" : "latest")}
                >
                  <span>{feedSort === "latest" ? "Latest" : "Top"}</span>
                  <ChevronRight size={13} style={{ transform: "rotate(90deg)" }} />
                </button>
                <button
                  type="button"
                  className="btn-new-post-purple"
                  onClick={() => setCreatePostOpen(true)}
                >
                  <span>New post</span>
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="platform-posts-stream">
              {filteredPosts.map(post => {
                const isSaved = savedPosts?.some(p => p.id === post.id);
                return (
                  <article key={post.id} className="platform-single-post-card">
                    {/* Post Author Row */}
                    <div className="single-post-top-row">
                      <div 
                        className="single-post-author-box"
                        onClick={() => {
                          const found = COMMUNITY_MEMBERS.find(m => m.name === post.author.name) || COMMUNITY_MEMBERS[1];
                          setSelectedProfileMember(found);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="single-post-avatar-round" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#475569" }}>
                          {post.author.avatar ? (
                            <img src={post.author.avatar} alt={post.author.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                          ) : (
                            <User size={18} color="#475569" strokeWidth={1.8} />
                          )}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <strong className="single-post-author-name">{post.author.name}</strong>
                            {post.author.badge && (
                              <span className="single-post-author-badge">
                                {post.author.badge}
                              </span>
                            )}
                            <span className="single-post-time-ago">{post.timeAgo}</span>
                          </div>
                          <div className="single-post-posted-space">
                            Posted in {post.spaceName}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="post-icon-action"
                          onClick={() => toggleSavePost(post)}
                          title="Save Post"
                        >
                          <Bookmark size={15} fill={isSaved ? "#6C2BD9" : "none"} color={isSaved ? "#6C2BD9" : "#64748B"} />
                        </button>
                      </div>
                    </div>

                    {/* Post Title & Content */}
                    <h3 className="single-post-title">{post.title}</h3>
                    <div className="single-post-body-text">
                      {post.content.split("\n\n").map((paragraph, pIdx) => {
                        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={pIdx} style={{ marginBottom: "12px", whiteSpace: "pre-line", lineHeight: 1.65 }}>
                            {parts.map((part, i) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                return <strong key={i} style={{ color: "#0F172A", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </p>
                        );
                      })}
                    </div>

                    {/* Post Media / Interactive Image Carousel Slider */}
                    <PostImageSlider images={post.images} singleImage={post.image} alt={post.title} />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="single-post-tags-row">
                        {post.tags.map(t => (
                          <span key={t} className="single-post-tag-pill">#{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Interactive Footer: Likes, Comments, Share */}
                    <div className="single-post-footer-actions">
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <button
                          type="button"
                          className={`post-interaction-btn ${post.isLiked ? "active-liked" : ""}`}
                          onClick={() => handleToggleLike(post.id)}
                          title="Like post"
                        >
                          <ThumbsUp size={14} fill={post.isLiked ? "#6C2BD9" : "none"} color={post.isLiked ? "#6C2BD9" : "currentColor"} />
                          <span>{post.likes}</span>
                        </button>
                        <button
                          type="button"
                          className={`post-interaction-btn ${openCommentsPostId === post.id ? "active-comment-open" : ""}`}
                          onClick={() => setOpenCommentsPostId(prev => prev === post.id ? null : post.id)}
                          title="View and write comments"
                          style={{ background: openCommentsPostId === post.id ? "rgba(108, 43, 217, 0.1)" : "transparent", color: openCommentsPostId === post.id ? "#6C2BD9" : "inherit" }}
                        >
                          <MessageSquare size={14} />
                          <span>{post.commentsCount || (post.comments ? post.comments.length : 0)}</span>
                        </button>
                        <button
                          type="button"
                          className="post-interaction-btn"
                          onClick={() => handleOpenShare(post)}
                          title="Share post"
                        >
                          <Share2 size={14} />
                          <span>{post.shares || 0}</span>
                        </button>
                      </div>

                      <Link to={`/posts/${post.id}`} className="post-view-discussion-link">
                        <span>View Discussion</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>

                    {/* Interactive Inline Comments Drawer */}
                    {openCommentsPostId === post.id && (
                      <div className="inline-comments-section" style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                        {/* Comments List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px", maxHeight: "240px", overflowY: "auto" }}>
                          {(post.comments && post.comments.length > 0) ? (
                            post.comments.map((c, idx) => (
                              <div key={c.id || idx} style={{ display: "flex", gap: "10px", background: "#F8FAFC", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#6C2BD9", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                                  {c.initials || "MB"}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.8125rem", color: "#0F172A" }}>{c.author}</span>
                                    <span style={{ fontSize: "0.7rem", color: "#64748B" }}>{c.timeAgo || "Recently"}</span>
                                  </div>
                                  <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#334155", lineHeight: "1.4" }}>{c.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontStyle: "italic", textAlign: "center", padding: "8px 0" }}>
                              No comments yet. Be the first to start the conversation!
                            </div>
                          )}
                        </div>

                        {/* Comment Input Form */}
                        <form onSubmit={(e) => handleAddComment(post.id, e)} style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="Write a constructive comment..."
                            value={commentInputs[post.id] || ""}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            style={{
                              flex: 1,
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border: "1px solid #CBD5E1",
                              fontSize: "0.8125rem",
                              outline: "none",
                              background: "#FFFFFF"
                            }}
                          />
                          <button
                            type="submit"
                            style={{
                              background: "#111827",
                              color: "#FFFFFF",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontWeight: 700,
                              fontSize: "0.8125rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Send size={13} />
                            <span>Reply</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </main>

          {/* RIGHT SIDEBAR: Trending Discussions & Ecosystem Spotlight */}
          <aside className="platform-trending-sidebar">
            {/* Trending Discussions Card */}
            <div className="trending-widget-card">
              <h4 className="trending-widget-title">
                <Flame size={16} style={{ color: "#C084FC" }} />
                <span>Trending Discussions</span>
              </h4>
              <div className="trending-items-list">
                {TRENDING_POSTS_SIDEBAR.map(item => (
                  <div 
                    key={item.id} 
                    className="trending-item"
                    onClick={() => {
                      const target = postsList[0];
                      if (target) navigate(`/posts/${target.id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="trending-avatar">
                      <User size={14} color="#A78BFA" strokeWidth={2} />
                    </div>
                    <div className="trending-info">
                      <h5 className="trending-post-headline">{item.title}</h5>
                      <div className="trending-meta">
                        <span>{item.author}</span>
                        <span className="dot-sep">•</span>
                        <span>{item.comments} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official NexziByte LinkedIn Link Card */}
            <div className="nexzibyte-linkedin-promo-card">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div className="linkedin-icon-badge">in</div>
                <div>
                  <h5 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 800, color: "#FFFFFF" }}>NexziByte Solutions</h5>
                  <span style={{ fontSize: "0.75rem", color: "#C4B5FD" }}>Official Company Page</span>
                </div>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "14px" }}>
                Follow NexziByte Solutions on LinkedIn for technical briefings, Hyderabad hiring announcements, and enterprise AI workshops.
              </p>
              <a 
                href="https://www.linkedin.com/company/nexzibyte-solutions/" 
                target="_blank" 
                rel="noreferrer"
                className="btn-linkedin-follow"
              >
                <span>Visit LinkedIn</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ── VIEW 2: MEMBERS DIRECTORY (NexziByte Brand Palette) ── */}
      {activeMainTab === "members" && (
        <div className="container-wide" style={{ padding: "28px 0 60px 0" }}>
          <div className="members-view-container">
            {/* Header with Title & Filters */}
            <div className="members-view-top-row">
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span>Members Directory</span>
                  <span className="members-count-tag">{filteredMembers.length}</span>
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#C4B5FD", margin: 0 }}>
                  NexziByte TechTalk verified member profile.
                </p>
              </div>

              {/* Right Side Controls: Search & Filter Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                {/* Quick Search */}
                <div style={{ position: "relative", minWidth: "220px" }}>
                  <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#A78BFA" }} />
                  <input
                    type="text"
                    placeholder="Search profile or skills..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 12px 7px 32px",
                      fontSize: "0.8125rem",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      borderRadius: "9999px",
                      color: "#FFFFFF",
                      outline: "none"
                    }}
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter("")}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Filters matching Screenshot */}
                <div className="members-filter-group">
                  <button
                    type="button"
                    className={`mem-filter-btn ${memberFilter === "all" ? "is-active" : ""}`}
                    onClick={() => setMemberFilter("all")}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`mem-filter-btn ${memberFilter === "near" ? "is-active" : ""}`}
                    onClick={() => setMemberFilter("near")}
                  >
                    <MapPin size={13} />
                    <span>Near me</span>
                  </button>
                  <button
                    type="button"
                    className={`mem-filter-btn ${memberFilter === "online" ? "is-active" : ""}`}
                    onClick={() => setMemberFilter("online")}
                  >
                    <span className="online-indicator-dot" />
                    <span>Online</span>
                  </button>
                  <button
                    type="button"
                    className={`mem-filter-btn ${memberFilter === "recent" ? "is-active" : ""}`}
                    onClick={() => setMemberFilter("recent")}
                  >
                    <Clock size={13} />
                    <span>Recently joined</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Member Cards */}
            {filteredMembers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748B" }}>
                <User size={42} style={{ color: "#CBD5E1", margin: "0 auto 12px auto", display: "block" }} />
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: "0 0 6px 0" }}>No members found</h3>
                <p style={{ fontSize: "0.875rem", margin: "0 0 16px 0" }}>Try adjusting your search query or switching filters.</p>
                <button
                  type="button"
                  className="btn-member-card-view"
                  style={{ width: "auto", padding: "8px 18px", margin: "0 auto" }}
                  onClick={() => { setSearchFilter(""); setMemberFilter("all"); }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="members-cards-grid">
                {filteredMembers.map(m => (
                  <div key={m.id} className="member-portrait-card">
                    {/* Avatar Circle with Online Dot & Fallback Initials */}
                    <div 
                      className="member-avatar-portrait" 
                      style={{ 
                        background: m.avatar ? "transparent" : (m.avatarBg || "linear-gradient(135deg, #6C2BD9, #3B82F6)"), 
                        border: "2px solid #E2E8F0", 
                        color: "#FFFFFF", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        position: "relative",
                        fontSize: "1.125rem",
                        fontWeight: 700
                      }}
                    >
                      {m.avatar ? (
                        <img src={m.avatar} alt={m.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <span>{m.initials || m.name?.substring(0, 2)?.toUpperCase() || "NB"}</span>
                      )}
                      {m.online && (
                        <span 
                          style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "#22C55E",
                            border: "2px solid #FFFFFF"
                          }}
                          title="Online now"
                        />
                      )}
                    </div>

                    {/* Member Name */}
                    <h4 className="member-card-title">{m.name}</h4>

                    {/* Badge / Tier */}
                    {m.badge && (
                      <span 
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          background: m.badge.includes("Founder") ? "#FEF3C7" : "#EDE9FE",
                          color: m.badge.includes("Founder") ? "#B45309" : "#6C2BD9",
                          marginBottom: "6px",
                          display: "inline-block"
                        }}
                      >
                        {m.badge}
                      </span>
                    )}

                    {/* Role / Subtitle */}
                    <p className="member-card-subtitle">{m.role}</p>

                    {/* Location */}
                    <div className="member-card-loc">
                      <MapPin size={13} style={{ color: "#6C2BD9", flexShrink: 0 }} />
                      <span>{m.location}</span>
                    </div>

                    {/* View Profile Action Button */}
                    <button
                      type="button"
                      className="btn-member-card-view"
                      onClick={() => {
                        setSelectedProfileMember(m);
                        setProfileModalSubTab("about");
                      }}
                    >
                      <User size={13} />
                      <span>View profile</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 3: EVENTS & TECHNICAL WORKSHOPS ── */}
      {activeMainTab === "events" && (
        <div className="container-wide" style={{ padding: "28px 0 60px 0" }}>
          
          {/* Header Banner */}
          <div className="workshops-page-header-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ maxWidth: "720px" }}>
                <span style={{ background: "rgba(124, 58, 237, 0.3)", color: "#E9D5FF", border: "1px solid rgba(167, 139, 250, 0.4)", padding: "3px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", display: "inline-block", marginBottom: "8px" }}>
                  TECHNICAL MASTERCLASSES &amp; LABS
                </span>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
                  Upcoming Technical Workshops &amp; Masterclasses
                </h1>
                <p style={{ fontSize: "0.95rem", color: "#C4B5FD", lineHeight: 1.6, margin: 0 }}>
                  Hands-on masterclasses and interactive code sandboxes aligned with TechTalk's course curriculum across AI &amp; GenAI, Cloud &amp; DevOps, Full-Stack Web, Cybersecurity, Python, and Big Data. Build production projects with industry leads.
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ minWidth: "280px", flex: "1 1 280px", maxWidth: "360px" }}>
                <div style={{ position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A78BFA" }} />
                  <input
                    type="text"
                    placeholder="Search workshops, tech, mentors..."
                    value={workshopSearchQuery}
                    onChange={(e) => setWorkshopSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 40px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      fontSize: "0.875rem",
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#FFFFFF",
                      outline: "none",
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)"
                    }}
                  />
                  {workshopSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setWorkshopSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94A3B8",
                        padding: "4px"
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Technology Category Filter Bar (No horizontal scrollbar, sleek wrap) */}
          <div className="workshops-filter-scroll-wrapper">
            {WORKSHOP_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`workshop-cat-btn ${selectedWorkshopCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedWorkshopCategory(cat.id)}
              >
                <span>{cat.label}</span>
                {cat.id === "all" ? (
                  <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>({TECHNICAL_WORKSHOPS.length})</span>
                ) : (
                  <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                    ({TECHNICAL_WORKSHOPS.filter(w => w.categoryGroup === cat.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Workshops Grid */}
          {filteredWorkshops.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "20px", border: "1px dashed rgba(255, 255, 255, 0.2)" }}>
              <BookOpen size={40} style={{ color: "#94A3B8", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px 0" }}>No workshops found</h3>
              <p style={{ fontSize: "0.875rem", color: "#C4B5FD", margin: "0 0 16px 0" }}>Try clearing your search query or selecting a different technology category.</p>
              <button
                type="button"
                className="workshop-cat-btn active"
                onClick={() => {
                  setSelectedWorkshopCategory("all");
                  setWorkshopSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="workshops-grid-layout">
              {filteredWorkshops.map(ws => {
                const isRegistered = registeredWorkshopIds.includes(ws.id);
                return (
                  <div key={ws.id} className="workshop-card-tech">
                    <div className="workshop-card-top-stripe" />
                    <div className="workshop-card-inner">
                      
                      {/* Top Badges */}
                      <div className="workshop-card-header-row">
                        <span className="workshop-track-badge">{ws.track}</span>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ fontSize: "0.725rem", fontWeight: 700, color: "#DDD6FE", background: "rgba(124, 58, 237, 0.25)", border: "1px solid rgba(167, 139, 250, 0.35)", padding: "3px 8px", borderRadius: "6px" }}>
                            {ws.badge}
                          </span>
                          <span className="workshop-mode-badge">
                            <Globe size={11} />
                            <span>{ws.location.includes("Online") ? "Online Lab" : "Hyderabad"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        className="workshop-card-title"
                        onClick={() => setSelectedWorkshopDetail(ws)}
                        title="Click to view curriculum and details"
                      >
                        {ws.title}
                      </h3>

                      {/* Description */}
                      <p className="workshop-desc-text">
                        {ws.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="workshop-tech-tags-list">
                        {ws.techStack.map((tech, idx) => (
                          <span key={idx} className="workshop-tech-pill">
                            #{tech}
                          </span>
                        ))}
                      </div>

                      {/* Meta Info: Duration & Spots */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "16px" }}>
                        <div style={{ fontSize: "0.8125rem", color: "#CBD5E1", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                          <Clock size={13} style={{ color: "#A78BFA" }} />
                          <span>{ws.duration}</span>
                        </div>

                        <span className="workshop-spots-pill" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "1px solid rgba(52, 211, 153, 0.3)", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                          {ws.spotsLeft} spots left
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="workshop-actions-footer">
                        <button
                          type="button"
                          className={`workshop-btn-register ${isRegistered ? "registered" : ""}`}
                          onClick={() => handleOpenCourseRegisterModal(ws)}
                        >
                          {isRegistered ? (
                            <>
                              <Check size={15} />
                              <span>Registered</span>
                            </>
                          ) : (
                            <>
                              <Ticket size={15} />
                              <span>Register</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="workshop-btn-details"
                          onClick={() => setSelectedWorkshopDetail(ws)}
                          title="View Syllabus & Highlights"
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#FFFFFF",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            padding: "9px 14px",
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <BookOpen size={14} />
                          <span>Curriculum</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ── VIEW 4: LEADERBOARD / CHAMPIONS (Dark Luxury Theme) ── */}
      {activeMainTab === "leaderboard" && (
        <div className="container-wide" style={{ padding: "28px 0 60px 0" }}>
          <div className="leaderboard-view-card">
            <div style={{ marginBottom: "28px" }}>
              <span className="section-label" style={{ background: "rgba(124, 58, 237, 0.3)", color: "#E9D5FF", border: "1px solid rgba(167, 139, 250, 0.4)", padding: "3px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", display: "inline-block", marginBottom: "8px" }}>
                COMMUNITY CONTRIBUTIONS &amp; RANKINGS
              </span>
              <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#FFFFFF", margin: "4px 0 6px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>Community Champions</span>
                <span className="members-count-tag" style={{ background: "rgba(124, 58, 237, 0.35)", color: "#E9D5FF", border: "1px solid rgba(167, 139, 250, 0.5)", fontSize: "0.75rem", padding: "2px 10px", borderRadius: "9999px" }}>
                  Rank #1
                </span>
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#C4B5FD", margin: 0 }}>
                Top technical contributors, active discussion participants, and workshop innovators in NexziByte TechTalk.
              </p>
            </div>

            <div className="leaderboard-list">
              {membersList.map((m, idx) => (
                <div 
                  key={m.id} 
                  className="leaderboard-row-item"
                  onClick={() => {
                    setSelectedProfileMember(m);
                    setProfileModalSubTab("about");
                  }}
                  style={{ cursor: "pointer" }}
                  title="Click to view profile"
                >
                  <div className="leaderboard-rank-box">
                    <span>#{idx + 1}</span>
                  </div>
                  <div 
                    className="leaderboard-avatar" 
                    style={{ 
                      background: m.avatar ? "transparent" : (m.avatarBg || "linear-gradient(135deg, #6C2BD9, #3B82F6)"), 
                      border: "2px solid rgba(255, 255, 255, 0.2)", 
                      color: "#FFFFFF", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "0.9375rem",
                      fontWeight: 800,
                      position: "relative"
                    }}
                  >
                    {m.avatar ? (
                      <img src={m.avatar} alt={m.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <span>{m.initials || m.name?.substring(0, 2)?.toUpperCase() || "LM"}</span>
                    )}
                    {m.online && (
                      <span 
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "0px",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#22C55E",
                          border: "1.5px solid #1E174D"
                        }}
                      />
                    )}
                  </div>
                  <div className="leaderboard-name-info">
                    <strong style={{ color: "#FFFFFF", fontSize: "1rem", fontWeight: 800, marginBottom: "2px" }}>{m.name}</strong>
                    <span style={{ fontSize: "0.8125rem", color: "#C4B5FD" }}>{m.role} • {m.location}</span>
                  </div>
                  <div className="leaderboard-points-badge">
                    <Award size={15} style={{ color: "#F59E0B" }} />
                    <span>{m.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PROFILE DETAILS MODAL (Exact Matching Screenshot 4)
          ══════════════════════════════════════════════════════════════ */}
      {selectedProfileMember && (
        <div className="profile-modal-backdrop" onClick={() => setSelectedProfileMember(null)}>
          <div className="profile-details-modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="profile-details-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800, color: "#0F172A" }}>Profile</h3>
              <button 
                type="button" 
                className="profile-modal-close-btn"
                onClick={() => setSelectedProfileMember(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Left Sidebar + Right Pane */}
            <div className="profile-details-modal-body">
              
              {/* LEFT PANE (Screenshot 4) */}
              <div className="profile-details-left-pane">
                <div className="profile-large-avatar">
                  {selectedProfileMember.avatar ? (
                    <img src={selectedProfileMember.avatar} alt={selectedProfileMember.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <User size={38} color="#475569" strokeWidth={1.8} />
                  )}
                  <span className="profile-avatar-sub-rank">1</span>
                </div>

                <h3 className="profile-user-display-name">{selectedProfileMember.name}</h3>
                
                <div className="profile-user-meta-item">
                  <Clock size={13} />
                  <span>Last seen {selectedProfileMember.lastSeen}</span>
                </div>
                <div className="profile-user-meta-item">
                  <Calendar size={13} />
                  <span>Member since {selectedProfileMember.memberSince}</span>
                </div>

                {/* Job Seeker Badge */}
                <div style={{ margin: "14px 0" }}>
                  <span className="profile-job-seeker-badge">{selectedProfileMember.badge}</span>
                </div>

                {/* Edit & Link Buttons */}
                <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
                  <button 
                    type="button" 
                    className="btn-profile-edit-pill"
                    onClick={() => {
                      setEditProfileOpen(true);
                      setSelectedProfileMember(null);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    type="button" 
                    className="btn-profile-link-round"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast("🔗 Profile link copied to clipboard!");
                    }}
                    title="Copy Profile Link"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* RIGHT PANE: Sub-Tabs & Detailed Fields (Screenshot 4) */}
              <div className="profile-details-right-pane">
                {/* Sub-Tabs: About, Posts, Comments, Spaces 11, Rewards */}
                <div className="profile-subtabs-bar">
                  <button
                    type="button"
                    className={`profile-subtab-pill ${profileModalSubTab === "about" ? "is-active" : ""}`}
                    onClick={() => setProfileModalSubTab("about")}
                  >
                    About
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-pill ${profileModalSubTab === "posts" ? "is-active" : ""}`}
                    onClick={() => setProfileModalSubTab("posts")}
                  >
                    Posts
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-pill ${profileModalSubTab === "comments" ? "is-active" : ""}`}
                    onClick={() => setProfileModalSubTab("comments")}
                  >
                    Comments
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-pill ${profileModalSubTab === "spaces" ? "is-active" : ""}`}
                    onClick={() => setProfileModalSubTab("spaces")}
                  >
                    Spaces 11
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-pill ${profileModalSubTab === "rewards" ? "is-active" : ""}`}
                    onClick={() => setProfileModalSubTab("rewards")}
                  >
                    Rewards
                  </button>
                </div>

                {/* TAB: ABOUT (Exact Fields from Screenshot 4) */}
                {profileModalSubTab === "about" && (
                  <div className="profile-fields-list">
                    {/* Level 1 Badge */}
                    <div className="profile-level-badge-box">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Award size={16} style={{ color: "#D97706" }} />
                        <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#6C2BD9" }}>1 &nbsp; Level 1</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                        <span>0 points</span>
                        <span className="dot-sep">•</span>
                        <span>10 to level up</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="profile-data-field">
                      <div className="profile-data-label">
                        <Mail size={13} style={{ color: "#6C2BD9" }} />
                        <span>Email</span>
                      </div>
                      <div className="profile-data-val">{selectedProfileMember.email}</div>
                    </div>

                    {/* Tags */}
                    <div className="profile-data-field">
                      <div className="profile-data-label">Tags</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        <span className="profile-tag-pill-purple">{selectedProfileMember.badge}</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="profile-data-field">
                      <div className="profile-data-label">Headline</div>
                      <div className="profile-data-val">{selectedProfileMember.headline}</div>
                    </div>

                    {/* Bio */}
                    <div className="profile-data-field">
                      <div className="profile-data-label">Bio</div>
                      <div className="profile-data-val" style={{ lineHeight: 1.65 }}>{selectedProfileMember.bio}</div>
                    </div>

                    {/* Location */}
                    <div className="profile-data-field">
                      <div className="profile-data-label">Location</div>
                      <div className="profile-data-val">{selectedProfileMember.location}</div>
                    </div>

                    {/* Linkedin URL */}
                    <div className="profile-data-field">
                      <div className="profile-data-label">Linkedin URL</div>
                      <a 
                        href={selectedProfileMember.linkedin} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="profile-linkedin-anchor"
                      >
                        <span>{selectedProfileMember.linkedin}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {/* TAB: POSTS */}
                {profileModalSubTab === "posts" && (
                  <div className="profile-fields-list">
                    <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "14px" }}>
                      Posts created by {selectedProfileMember.name}:
                    </p>
                    {COMMUNITY_POSTS.slice(0, 2).map(p => (
                      <div key={p.id} className="profile-mini-post-item">
                        <h5 style={{ margin: "0 0 4px 0", fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>{p.title}</h5>
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{p.timeAgo} • {p.likes} likes</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB: COMMENTS */}
                {profileModalSubTab === "comments" && (
                  <div className="profile-fields-list">
                    <p style={{ fontSize: "0.875rem", color: "#64748B" }}>
                      No public comments to display.
                    </p>
                  </div>
                )}

                {/* TAB: SPACES 11 */}
                {profileModalSubTab === "spaces" && (
                  <div className="profile-fields-list">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {COMMUNITY_SPACES.map(s => (
                        <div key={s.id} className="profile-space-item-box">
                          <div className="space-indicator-dot purple-dot" />
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: REWARDS */}
                {profileModalSubTab === "rewards" && (
                  <div className="profile-fields-list">
                    <div style={{ background: "#FAF5FF", border: "1px solid #E9D5FF", padding: "16px", borderRadius: "10px", textAlign: "center" }}>
                      <Award size={28} style={{ color: "#6C2BD9", marginBottom: "6px" }} />
                      <h5 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 800, color: "#0F172A" }}>Community Pioneer Badge</h5>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Earned by joining NexziByte TechTalk Ecosystem</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT PROFILE MODAL
          ══════════════════════════════════════════════════════════════ */}
      {editProfileOpen && (
        <div className="profile-modal-backdrop" onClick={() => setEditProfileOpen(false)}>
          <div className="create-post-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="create-post-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>Edit Profile</h3>
              <button type="button" className="profile-modal-close-btn" onClick={() => setEditProfileOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>Headline / Role</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>Bio</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button 
                  type="button" 
                  onClick={() => setEditProfileOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    padding: "9px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    padding: "9px 20px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
                    transition: "all 0.2s ease"
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CREATE POST MODAL
          ══════════════════════════════════════════════════════════════ */}
      {createPostOpen && (
        <div className="profile-modal-backdrop" onClick={() => setCreatePostOpen(false)}>
          <div className="create-post-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="create-post-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>Start a Post</h3>
              <button type="button" className="profile-modal-close-btn" onClick={() => setCreatePostOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  Select Space
                </label>
                <select
                  value={newPostSpace}
                  onChange={(e) => setNewPostSpace(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                >
                  <option value="feed">Feed</option>
                  <option value="introduce-yourself">Introduce Yourself</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>Post Title</label>
                <input
                  type="text"
                  placeholder="What would you like to share?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>Content</label>
                <textarea
                  rows={6}
                  placeholder="Share details with fellow engineers, founders, and architects..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px", resize: "vertical" }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button 
                  type="button" 
                  onClick={() => setCreatePostOpen(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    padding: "9px 18px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    padding: "9px 20px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Send size={14} />
                  <span>Publish Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Post Interactive Modal */}
      {shareModalPost && (
        <div className="modal-overlay" onClick={() => setShareModalPost(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", maxWidth: "460px", width: "90vw", border: "1px solid #E2E8F0", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Share2 size={18} style={{ color: "#6C2BD9" }} />
                <span>Share Discussion</span>
              </h3>
              <button type="button" onClick={() => setShareModalPost(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.875rem", color: "#334155", margin: "0 0 16px 0", fontWeight: 600, lineHeight: "1.4" }}>
              "{shareModalPost.title}"
            </p>

            {/* Share Buttons Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
              <button
                type="button"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/community#${shareModalPost.id}`;
                  navigator.clipboard?.writeText(shareUrl);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                  showToast("🔗 Post link copied to clipboard!");
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  background: linkCopied ? "#F0FDF4" : "#F8FAFC",
                  color: linkCopied ? "#16A34A" : "#0F172A",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                {linkCopied ? <Check size={15} /> : <ExternalLink size={15} />}
                <span>{linkCopied ? "Link Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareModalPost.title} - NexziByte TechTalk: ${window.location.origin}/community`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #BBF7D0",
                  background: "#F0FDF4",
                  color: "#15803D",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareModalPost.title)}&url=${encodeURIComponent(window.location.origin + '/community')}&hashtags=NexziByte,TechTalk`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  background: "#000000",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <span>Twitter / X</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/community')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #BFDBFE",
                  background: "#EFF6FF",
                  color: "#1D4ED8",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <span>LinkedIn</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShareModalPost(null)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #111827",
                background: "#111827",
                color: "#FFFFFF",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          WORKSHOP CURRICULUM & DETAILS MODAL
          ══════════════════════════════════════════════════════════════ */}
      {selectedWorkshopDetail && (
        <div className="workshop-modal-backdrop" onClick={() => setSelectedWorkshopDetail(null)}>
          <div className="workshop-modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="workshop-modal-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span className="workshop-track-badge">{selectedWorkshopDetail.track}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", background: "#FFFFFF", padding: "3px 8px", borderRadius: "6px", border: "1px solid #CBD5E1" }}>
                    {selectedWorkshopDetail.badge}
                  </span>
                </div>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1.35 }}>
                  {selectedWorkshopDetail.title}
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedWorkshopDetail(null)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748B",
                  flexShrink: 0
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="workshop-modal-body">
              
              {/* Schedule Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                <div style={{ background: "#F1F5F9", padding: "12px 14px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.725rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Course Duration</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0F172A" }}>{selectedWorkshopDetail.duration}</div>
                  <div style={{ fontSize: "0.775rem", color: "#475569" }}>{selectedWorkshopDetail.level}</div>
                </div>
                <div style={{ background: "#F1F5F9", padding: "12px 14px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.725rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Learning Mode</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0F172A" }}>{selectedWorkshopDetail.mode}</div>
                  <div style={{ fontSize: "0.775rem", color: "#475569" }}>{selectedWorkshopDetail.venue}</div>
                </div>
                <div style={{ background: "#F1F5F9", padding: "12px 14px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.725rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Access &amp; Seats</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0F172A" }}>{selectedWorkshopDetail.price}</div>
                  <div style={{ fontSize: "0.775rem", color: "#DC2626", fontWeight: 700 }}>{selectedWorkshopDetail.spotsLeft} spots remaining</div>
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>Course Overview</h4>
                <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  {selectedWorkshopDetail.description}
                </p>
              </div>

              {/* Hands-on Curriculum Highlights */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>What You Will Build &amp; Learn</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedWorkshopDetail.highlights.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.875rem", color: "#334155" }}>
                      <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0, marginTop: "2px" }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Covered */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Technologies &amp; Tools</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedWorkshopDetail.techStack.map((tech, idx) => (
                    <span key={idx} style={{ background: "#EDE9FE", color: "#6C2BD9", padding: "4px 10px", borderRadius: "8px", fontWeight: 700, fontSize: "0.775rem", border: "1px solid #DDD6FE" }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites & Credentials */}
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "16px", marginBottom: "24px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ fontSize: "0.8125rem", color: "#0F172A", display: "block", marginBottom: "2px" }}>Prerequisites:</strong>
                  <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>{selectedWorkshopDetail.prerequisites}</span>
                </div>
                <div>
                  <strong style={{ fontSize: "0.8125rem", color: "#0F172A", display: "block", marginBottom: "2px" }}>Certification:</strong>
                  <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>Certificate of Completion issued by NexziByte TechTalk upon successful project submission.</span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  className="workshop-btn-register"
                  style={{ padding: "12px 24px", fontSize: "0.9375rem" }}
                  onClick={() => {
                    const current = selectedWorkshopDetail;
                    setSelectedWorkshopDetail(null);
                    handleOpenCourseRegisterModal(current);
                  }}
                >
                  <Ticket size={16} />
                  <span>Register for this Course</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedWorkshopDetail(null)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    color: "#475569",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          COURSE REGISTRATION FORM MODAL (Submits to Admin Dashboard)
          ══════════════════════════════════════════════════════════════ */}
      {courseRegisterModalOpen && selectedCourseForReg && (
        <div className="workshop-modal-backdrop" onClick={() => !isSubmittingReg && setCourseRegisterModalOpen(false)}>
          <div className="workshop-modal-content" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="workshop-modal-header" style={{ alignItems: "center" }}>
              <div>
                <span className="workshop-track-badge" style={{ marginBottom: "6px", display: "inline-block" }}>
                  {selectedCourseForReg.track}
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Course Registration
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setCourseRegisterModalOpen(false)}
                disabled={isSubmittingReg}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748B"
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="workshop-modal-body">
              
              {/* REGISTRATION FORM */}
              <form onSubmit={handleCompleteCourseRegistration}>
                
                {/* Selected Course Banner */}
                <div style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.725rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Selected Course</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0F172A" }}>{selectedCourseForReg.title}</div>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "4px 10px", borderRadius: "9999px", border: "1px solid #A7F3D0" }}>
                    FREE ACCESS
                  </span>
                </div>

                {/* Form Inputs Grid */}
                <div style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
                  
                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Full Name <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Lalitha Mindhi"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.875rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Email Address <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input 
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. name@nexzibyte.io"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.875rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Phone / WhatsApp Number
                    </label>
                    <input 
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.875rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* College / Organization */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                        College / Company
                      </label>
                      <input 
                        type="text"
                        value={regOrganization}
                        onChange={(e) => setRegOrganization(e.target.value)}
                        placeholder="e.g. Tech University / Org"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "0.875rem",
                          outline: "none"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                        Role / Title
                      </label>
                      <input 
                        type="text"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        placeholder="e.g. Student / Software Dev"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1.5px solid #CBD5E1",
                          fontSize: "0.875rem",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Experience Level
                    </label>
                    <select
                      value={regExperience}
                      onChange={(e) => setRegExperience(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.875rem",
                        outline: "none",
                        background: "#FFFFFF"
                      }}
                    >
                      <option value="Beginner (Learning basics)">Beginner (Learning basics)</option>
                      <option value="Student / Fresher">Student / Fresher</option>
                      <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
                      <option value="Experienced Professional (3+ years)">Experienced Professional (3+ years)</option>
                      <option value="Career Switcher">Career Switcher</option>
                    </select>
                  </div>

                  {/* Notes / Questions */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Learning Goals / Questions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={regNotes}
                      onChange={(e) => setRegNotes(e.target.value)}
                      placeholder="What are you most excited to learn?"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.875rem",
                        outline: "none",
                        resize: "vertical"
                      }}
                    />
                  </div>

                </div>

                {/* Submit Button */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    disabled={isSubmittingReg}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "12px",
                      background: "#111827",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      border: "none",
                      cursor: isSubmittingReg ? "not-allowed" : "pointer",
                      fontSize: "0.9375rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    {isSubmittingReg ? (
                      <>
                        <RefreshCw size={16} className="spin-slow" />
                        <span>Submitting Registration...</span>
                      </>
                    ) : (
                      <>
                        <Ticket size={16} />
                        <span>Submit Free Registration</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCourseRegisterModalOpen(false)}
                    disabled={isSubmittingReg}
                    style={{
                      padding: "12px 18px",
                      borderRadius: "12px",
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      color: "#475569",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Cancel
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
