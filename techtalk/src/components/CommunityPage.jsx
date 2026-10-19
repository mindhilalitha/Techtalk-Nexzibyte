import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Users, MessageSquare, Sparkles, Flame, Plus, Search, Filter,
  Heart, Share2, Bookmark, CheckCircle2, Award, Briefcase, MapPin,
  Mail, ExternalLink, Globe, Lock, Shield, ArrowRight, Eye,
  ThumbsUp, Send, Check, Bell, ChevronRight, X, User, Clock,
  Calendar, Mic, Cpu, HelpCircle, Layers
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { COMMUNITY_SPACES, COMMUNITY_POSTS, COMMUNITY_MEMBERS, TRENDING_POSTS_SIDEBAR } from "../data/communityData.js";
import { SPEAKERS } from "../data/mockData.js";
import PostImageSlider from "./PostImageSlider.jsx";

export default function CommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, setLoginModalOpen, showToast, savedPosts, toggleSavePost, likePost } = useApp();

  // Active Main Sub-Tab: "feed" | "members" | "speakers" | "experts"
  const tabParam = searchParams.get("tab") || "feed";
  const [activeMainTab, setActiveMainTab] = useState(tabParam);

  // Active Sidebar Space in Feed view
  const spaceParam = searchParams.get("space") || "feed";
  const [activeSpace, setActiveSpace] = useState(spaceParam);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [memberFilter, setMemberFilter] = useState("all"); // "all" | "near" | "online" | "recent"
  const [feedSort, setFeedSort] = useState("latest"); // "latest" | "popular"

  // Selected Member for Profile Details Modal (Screenshot 4)
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileModalTab, setProfileModalTab] = useState("about");

  // Direct Messages Popup State (Screenshot 5)
  const [showDMPopup, setShowDMPopup] = useState(false);
  const [dmTab, setDmTab] = useState("inbox"); // "inbox" | "unread"

  // New Post Modal State
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSpace, setNewPostSpace] = useState("feed");

  // Local state for posts with interactive like/share
  const [postsList, setPostsList] = useState(COMMUNITY_POSTS);

  // Interactive Comments & Share State
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [shareModalPost, setShareModalPost] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  React.useEffect(() => {
    setPostsList(COMMUNITY_POSTS);
  }, []);

  // Handle Main Tab switch
  const handleTabChange = (tabId) => {
    setActiveMainTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Handle Space switch in Feed
  const handleSpaceChange = (spaceId) => {
    setActiveSpace(spaceId);
    setSearchParams({ tab: "feed", space: spaceId });
  };

  // Toggle Like on Post
  const handleToggleLike = (postId) => {
    setPostsList(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
    if (likePost) {
      likePost(postId);
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

  // Submit New Post
  const handleCreatePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      showToast("Please enter a title and content for your post.");
      return;
    }

    const newPost = {
      id: `post-custom-${Date.now()}`,
      author: {
        name: user?.name || "Lalitha Mindhi",
        role: user?.title || "Full Stack Developer",
        company: user?.company || "NexziByte Community",
        avatar: user?.avatar || "",
        initials: user?.avatarInitials || "LM",
        badge: "Community Member"
      },
      title: newPostTitle,
      space: newPostSpace,
      spaceName: COMMUNITY_SPACES.find(s => s.id === newPostSpace)?.name || "Feed",
      timeAgo: "Just now",
      date: "September 25, 2026",
      content: newPostContent,
      tags: ["TechTalk", "NexziByte", "CommunityPost"],
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

    // Also persist to backend database so it shows in Admin Dashboard & across sessions
    api.createPost({
      title: newPostTitle,
      category: newPostSpace || "Community Feed",
      content: newPostContent,
      excerpt: newPostContent.slice(0, 140) + "...",
      tags: ["TechTalk", "NexziByte", "CommunityPost"],
      status: "Published"
    }).catch(err => console.warn("[TechTalk] Create post backend fallback:", err));
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return postsList.filter(post => {
      const matchSpace = activeSpace === "feed" || post.space === activeSpace;
      const matchSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpace && matchSearch;
    });
  }, [postsList, activeSpace, searchQuery]);

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
      postsCount: 3,
      commentsCount: 14,
      points: 120,
      online: true
    };
  }, [user]);

  // Members Directory containing exclusively the logged-in user's profile
  const membersList = useMemo(() => {
    return [currentUserObj];
  }, [currentUserObj]);

  // Filtered Members (Search query + Member filter pills)
  const filteredMembers = useMemo(() => {
    return membersList.filter(m => {
      // 1. Search Query filter
      const q = searchQuery.toLowerCase().trim();
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
  }, [membersList, searchQuery, memberFilter]);

  return (
    <div className="community-hub-root">
      {/* ── Subheader Navigation matching Screenshots 1, 2, 3 with NexziByte Brand Palette ── */}
      <div className="community-hub-topbar">
        <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Main Top Navigation Tabs */}
          <div className="community-top-tabs">
            <button
              type="button"
              className={`community-top-tab-btn ${activeMainTab === "feed" ? "is-active" : ""}`}
              onClick={() => handleTabChange("feed")}
            >
              <Flame size={15} />
              <span>Feed &amp; Posts</span>
            </button>
            <button
              type="button"
              className={`community-top-tab-btn ${activeMainTab === "members" ? "is-active" : ""}`}
              onClick={() => handleTabChange("members")}
            >
              <Users size={15} />
              <span>Members ({filteredMembers.length})</span>
            </button>
            <button
              type="button"
              className={`community-top-tab-btn ${activeMainTab === "speakers" ? "is-active" : ""}`}
              onClick={() => handleTabChange("speakers")}
            >
              <Mic size={15} />
              <span>Keynote Speakers</span>
            </button>
            <button
              type="button"
              className={`community-top-tab-btn ${activeMainTab === "experts" ? "is-active" : ""}`}
              onClick={() => handleTabChange("experts")}
            >
              <Award size={15} />
              <span>Mentors &amp; Experts</span>
            </button>
          </div>

          {/* Right Action Icons: Search, Notifications, Messages, Profile */}
          <div className="community-top-actions">
            <div className="community-search-input-wrap">
              <Search size={15} className="community-search-icon" />
              <input
                type="text"
                placeholder="Search community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="community-search-input"
              />
            </div>

            {/* Direct Messages Icon Button with Badge (Screenshot 5) */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="community-icon-btn"
                title="Direct Messages"
                onClick={() => setShowDMPopup(!showDMPopup)}
              >
                <MessageSquare size={17} />
                <span className="community-badge-dot">1</span>
              </button>

              {/* Direct Messages Modal Dropdown (Screenshot 5 with NexziByte Brand Palette) */}
              {showDMPopup && (
                <div className="dm-popup-card" role="dialog" aria-label="Direct Messages">
                  <div className="dm-popup-header-info">
                    <HelpCircle size={15} style={{ color: "#A78BFA", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.775rem", color: "#CBD5E1", lineHeight: 1.4 }}>
                      While direct messaging is disabled, administrators can still message you about important announcements.
                    </span>
                    <button type="button" className="dm-manage-btn" onClick={() => setShowDMPopup(false)}>Close</button>
                  </div>

                  <div className="dm-popup-title-row">
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Direct messages</h3>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button type="button" className="dm-action-icon-btn" title="Mark all read"><Check size={14} /></button>
                      <button type="button" className="dm-action-icon-btn" title="New Message" onClick={() => setCreatePostOpen(true)}><Plus size={14} /></button>
                    </div>
                  </div>

                  <div className="dm-tabs-row">
                    <button type="button" className={`dm-tab-item ${dmTab === "inbox" ? "is-active" : ""}`} onClick={() => setDmTab("inbox")}>
                      Inbox
                    </button>
                    <button type="button" className={`dm-tab-item ${dmTab === "unread" ? "is-active" : ""}`} onClick={() => setDmTab("unread")}>
                      Unread <span className="dm-unread-badge">1</span>
                    </button>
                  </div>

                  {/* Message Item */}
                  <div 
                    className="dm-message-item unread"
                    onClick={() => {
                      setSelectedMember(currentUserObj);
                      setShowDMPopup(false);
                    }}
                  >
                    <div className="dm-avatar-box" style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={16} style={{ color: "#6C2BD9" }} />
                    </div>
                    <div className="dm-msg-body">
                      <div className="dm-msg-top">
                        <strong style={{ color: "#0F172A", fontSize: "0.875rem" }}>NexziByte TechTalk Team</strong>
                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Just now</span>
                      </div>
                      <p className="dm-msg-preview">
                        Welcome to NexziByte TechTalk! 👋 We're thrilled to have you in the community. Explore technical events, connect with innovators, and grow your career.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Pill / Action (Screenshot 3) */}
            {isLoggedIn ? (
              <div 
                className="community-user-pill"
                onClick={() => setSelectedMember(COMMUNITY_MEMBERS[0])}
                title="View your Profile"
              >
                <div className="community-user-avatar-circle" style={{ background: user?.avatar ? "transparent" : "#F0F4F8", border: user?.avatar ? "none" : "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <User size={16} color="#334155" strokeWidth={2.2} />
                  )}
                </div>
                <span className="community-user-name-text">{user?.name ? user.name.split(" ")[0] : "Lalitha"}</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setLoginModalOpen(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="container-wide" style={{ padding: "28px 0 60px 0" }}>
        
        {/* VIEW 1: FEED & SPACES (Screenshots 1 & 5) */}
        {activeMainTab === "feed" && (
          <div className="community-feed-layout">
            
            {/* LEFT SIDEBAR: Spaces & Channels */}
            <aside className="community-spaces-sidebar">
              <div className="spaces-section">
                <button
                  type="button"
                  className={`space-nav-btn ${activeSpace === "feed" ? "is-active-purple" : ""}`}
                  onClick={() => handleSpaceChange("feed")}
                >
                  <Flame size={16} />
                  <span>Feed</span>
                </button>
              </div>

              <div className="spaces-section">
                <div className="spaces-header-label">WELCOME</div>
                {COMMUNITY_SPACES.filter(s => s.category === "WELCOME").map(space => (
                  <button
                    key={space.id}
                    type="button"
                    className={`space-nav-btn ${activeSpace === space.id ? "is-active-purple" : ""}`}
                    onClick={() => handleSpaceChange(space.id)}
                  >
                    <div className="space-dot" />
                    <span>{space.name}</span>
                  </button>
                ))}
              </div>



              <div className="spaces-section">
                <div className="spaces-header-label">EVENTS &amp; SUMMITS</div>
                <Link to="/summits" className="space-nav-btn">
                  <Sparkles size={15} style={{ color: "#6C2BD9" }} />
                  <span>Global Summits</span>
                </Link>
                <Link to="/founder-meets" className="space-nav-btn">
                  <Briefcase size={15} style={{ color: "#4F46E5" }} />
                  <span>Founder Meets</span>
                </Link>
                <Link to="/events" className="space-nav-btn">
                  <Calendar size={15} style={{ color: "#2563EB" }} />
                  <span>Upcoming Workshops</span>
                </Link>
              </div>
            </aside>

            {/* CENTER FEED CONTENT */}
            <main className="community-feed-main">
              
              {/* NexziByte Royal Purple Live Banner (Styled with NexziByte TechTalk Colors!) */}
              <div className="community-live-hero-banner">
                <div className="live-badge-wrap">
                  <span className="live-pulse-dot" />
                  <span className="live-badge-text">WE'RE LIVE!</span>
                </div>
                <h2 className="live-banner-headline">
                  THE NEXZIBYTE TECHTALK COMMUNITY IS NOW OPEN
                </h2>
                <p className="live-banner-subtext">
                  Welcome to India's premier community for developers, distributed systems architects, and AI pioneers.
                </p>
                <div className="live-banner-actions">
                  <button 
                    type="button" 
                    className="btn-live-cta"
                    onClick={() => setCreatePostOpen(true)}
                  >
                    <span>Start a Post</span>
                    <ArrowRight size={14} />
                  </button>
                  <Link to="/summits" className="btn-live-secondary">
                    <span>Explore Summits 2026</span>
                  </Link>
                </div>
              </div>

              {/* Start a Post Input Bar */}
              <div className="start-post-card">
                <div className="start-post-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <User size={16} style={{ color: "#64748B" }} />
                  )}
                </div>
                <button
                  type="button"
                  className="start-post-fake-input"
                  onClick={() => setCreatePostOpen(true)}
                >
                  <span>Start a post in NexziByte TechTalk...</span>
                </button>
                <button
                  type="button"
                  className="start-post-plus-btn"
                  onClick={() => setCreatePostOpen(true)}
                  title="Create Post"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Feed Sort & Filter Bar */}
              <div className="feed-sort-bar">
                <div className="feed-sort-left">
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>
                    {activeSpace === "feed" ? "Community Dispatches" : COMMUNITY_SPACES.find(s => s.id === activeSpace)?.name}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>({filteredPosts.length} posts)</span>
                </div>
                <div className="feed-sort-right">
                  <button
                    type="button"
                    className={`sort-pill ${feedSort === "latest" ? "is-active" : ""}`}
                    onClick={() => setFeedSort("latest")}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    className={`sort-pill ${feedSort === "popular" ? "is-active" : ""}`}
                    onClick={() => setFeedSort("popular")}
                  >
                    Trending
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: "9999px", padding: "6px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    onClick={() => setCreatePostOpen(true)}
                  >
                    <Plus size={14} />
                    <span>New post</span>
                  </button>
                </div>
              </div>

              {/* Posts List */}
              <div className="community-posts-list">
                {filteredPosts.map(post => {
                  const isSaved = savedPosts?.some(p => p.id === post.id);
                  return (
                    <article key={post.id} className="feed-post-card">
                      {/* Post Author Row */}
                      <div className="feed-post-header">
                        <div 
                          className="feed-post-author-box"
                          onClick={() => {
                            const found = COMMUNITY_MEMBERS.find(m => m.name === post.author.name) || COMMUNITY_MEMBERS[1];
                            setSelectedMember(found);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="feed-post-avatar-circle" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#475569" }}>
                            {post.author.avatar ? (
                              <img src={post.author.avatar} alt={post.author.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            ) : (
                              <User size={18} color="#475569" strokeWidth={1.8} />
                            )}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong className="feed-author-name">{post.author.name}</strong>
                              {post.author.badge && (
                                <span className={`author-badge ${post.author.isFounder ? "badge-founder" : "badge-member"}`}>
                                  {post.author.badge}
                                </span>
                              )}
                            </div>
                            <div className="feed-author-sub">
                              <span>{post.author.role}</span>
                              <span className="dot-sep">•</span>
                              <span>{post.timeAgo}</span>
                              <span className="dot-sep">•</span>
                              <span className="feed-space-tag">{post.spaceName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="feed-post-top-actions">
                          <button
                            type="button"
                            className="feed-action-btn"
                            onClick={() => toggleSavePost(post)}
                            title={isSaved ? "Remove bookmark" : "Save post"}
                          >
                            <Bookmark size={16} fill={isSaved ? "#6C2BD9" : "none"} color={isSaved ? "#6C2BD9" : "#64748B"} />
                          </button>
                        </div>
                      </div>

                      {/* Post Title & Content */}
                      <h3 className="feed-post-title">{post.title}</h3>
                      <div className="feed-post-content">
                        {post.content.split("\n\n").map((para, idx) => {
                          const parts = para.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={idx} style={{ marginBottom: "12px", whiteSpace: "pre-line", lineHeight: 1.65 }}>
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

                      {/* Post Media / Interactive Carousel Slider */}
                      <PostImageSlider images={post.images} singleImage={post.image} alt={post.title} />

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="feed-post-tags">
                          {post.tags.map(t => (
                            <span key={t} className="feed-tag-pill">#{t}</span>
                          ))}
                        </div>
                      )}

                      {/* Interactive Footer: Likes, Comments, Share */}
                      <div className="feed-post-footer">
                        <div className="feed-footer-left">
                          <button
                            type="button"
                            className={`feed-interaction-btn ${post.isLiked ? "liked" : ""}`}
                            onClick={() => handleToggleLike(post.id)}
                            title="Like post"
                          >
                            <ThumbsUp size={15} fill={post.isLiked ? "#6C2BD9" : "none"} color={post.isLiked ? "#6C2BD9" : "currentColor"} />
                            <span>{post.likes}</span>
                          </button>
                          <button
                            type="button"
                            className={`feed-interaction-btn ${openCommentsPostId === post.id ? "active-comment-open" : ""}`}
                            onClick={() => setOpenCommentsPostId(prev => prev === post.id ? null : post.id)}
                            title="View and write comments"
                            style={{ background: openCommentsPostId === post.id ? "rgba(108, 43, 217, 0.1)" : "transparent", color: openCommentsPostId === post.id ? "#6C2BD9" : "inherit" }}
                          >
                            <MessageSquare size={15} />
                            <span>{post.commentsCount || (post.comments ? post.comments.length : 0)}</span>
                          </button>
                          <button
                            type="button"
                            className="feed-interaction-btn"
                            onClick={() => handleOpenShare(post)}
                            title="Share post"
                          >
                            <Share2 size={15} />
                            <span>{post.shares || 0}</span>
                          </button>
                        </div>

                        <Link to={`/posts/${post.id}`} className="feed-details-link">
                          <span>View Discussion</span>
                          <ChevronRight size={14} />
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

            {/* RIGHT SIDEBAR: Trending Posts & Community Spotlight */}
            <aside className="community-right-sidebar">
              {/* Trending Posts Card */}
              <div className="trending-widget-card">
                <h4 className="trending-widget-title">
                  <Flame size={16} style={{ color: "#6C2BD9" }} />
                  <span>Trending Posts</span>
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
                      <div className="trending-avatar" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#475569" }}>
                        <User size={15} color="#475569" strokeWidth={1.8} />
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
                    <span style={{ fontSize: "0.75rem", color: "#CBD5E1" }}>Official Company Page</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#E2E8F0", lineHeight: 1.5, marginBottom: "14px" }}>
                  Follow NexziByte Solutions on LinkedIn for official press releases, Hyderabad hiring updates, and AI enterprise case studies.
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

              {/* Founder Spotlight Card */}
              <div className="founder-spotlight-card">
                <div className="founder-card-top">
                  <div className="founder-avatar-circle">
                    <span>DP</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.9375rem", color: "#0F172A", display: "block" }}>Nagunoori Durga Prasad</strong>
                    <span style={{ fontSize: "0.75rem", color: "#6C2BD9", fontWeight: 700 }}>Founder &amp; Managing Director</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#475569", lineHeight: 1.5, margin: "10px 0 12px 0" }}>
                  "We created TechTalk to empower the next generation of software creators, distributed systems engineers, and founders."
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm w-100"
                  onClick={() => setSelectedMember(COMMUNITY_MEMBERS[1])}
                >
                  View Founder Profile
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* VIEW 2: MEMBERS DIRECTORY (Screenshot 2 with NexziByte Brand Palette) */}
        {activeMainTab === "members" && (
          <div className="members-directory-view">
            {/* Header & Filter Bar */}
            <div className="members-view-header">
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>
                  All Members <span className="members-count-pill">7,064+</span>
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#64748B", margin: 0 }}>
                  Discover developers, engineering managers, and technical architects in the NexziByte TechTalk network.
                </p>
              </div>

              {/* Filter Pills: All, Near me, Online, Recently joined */}
              <div className="members-filter-pills">
                <button
                  type="button"
                  className={`member-filter-pill ${memberFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setMemberFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`member-filter-pill ${memberFilter === "near" ? "is-active" : ""}`}
                  onClick={() => setMemberFilter("near")}
                >
                  <MapPin size={13} />
                  <span>Near me</span>
                </button>
                <button
                  type="button"
                  className={`member-filter-pill ${memberFilter === "online" ? "is-active" : ""}`}
                  onClick={() => setMemberFilter("online")}
                >
                  <span className="online-dot-mini" />
                  <span>Online</span>
                </button>
                <button
                  type="button"
                  className={`member-filter-pill ${memberFilter === "recent" ? "is-active" : ""}`}
                  onClick={() => setMemberFilter("recent")}
                >
                  <Clock size={13} />
                  <span>Recently joined</span>
                </button>
              </div>
            </div>

            {/* Member Cards Grid */}
            <div className="members-grid">
              {filteredMembers.map(member => (
                <div key={member.id} className="member-grid-card">
                  {/* Avatar Circle */}
                  <div className="member-card-avatar" style={{ background: "#F3F4F6", border: "1.5px solid #E5E7EB", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <User size={28} style={{ color: "#64748B" }} />
                    )}
                    {member.online && <span className="member-online-indicator" title="Online" />}
                  </div>

                  {/* Member Name & Role */}
                  <h3 className="member-card-name">{member.name}</h3>
                  <p className="member-card-role">{member.role}</p>

                  {/* Location */}
                  <div className="member-card-location">
                    <MapPin size={13} style={{ color: "#6C2BD9", flexShrink: 0 }} />
                    <span>{member.location}</span>
                  </div>

                  {/* View Profile Action Button (NexziByte Brand Purple) */}
                  <button
                    type="button"
                    className="btn-member-view-profile"
                    onClick={() => {
                      setSelectedMember(member);
                      setProfileModalTab("about");
                    }}
                  >
                    <User size={14} />
                    <span>View profile</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: KEYNOTE SPEAKERS */}
        {activeMainTab === "speakers" && (
          <div className="speakers-tab-view">
            <div style={{ marginBottom: "28px" }}>
              <span className="section-label">KEYNOTE ARCHITECTS &amp; FOUNDERS</span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", margin: "4px 0 8px 0" }}>
                Distinguished Keynote Speakers
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#64748B" }}>
                Connect directly with keynote architects, engineering leaders, and AI researchers from top tech enterprises.
              </p>
            </div>

            <div className="speakers-grid">
              {SPEAKERS.map(spk => (
                <div key={spk.id} className="speaker-card">
                  <div className="speaker-image-wrap">
                    <img src={spk.image} alt={spk.name} className="speaker-img" loading="lazy" />
                    <div className="speaker-track-tag">{spk.track}</div>
                  </div>
                  <div className="speaker-body">
                    <h3 className="speaker-name">{spk.name}</h3>
                    <p className="speaker-role">{spk.role}</p>
                    <p className="speaker-company">{spk.company}</p>
                    <p className="speaker-bio">{spk.bio}</p>
                    <div className="speaker-session-box">
                      <Mic size={14} style={{ color: "#6C2BD9", flexShrink: 0 }} />
                      <span>{spk.sessionTitle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: MENTORS & EXPERTS */}
        {activeMainTab === "experts" && (
          <div className="experts-tab-view">
            <div style={{ marginBottom: "28px" }}>
              <span className="section-label">COMMUNITY ADVISORS</span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", margin: "4px 0 8px 0" }}>
                Architecture Mentors &amp; Domain Experts
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#64748B" }}>
                Book 1-on-1 technical mentorship, resume teardowns, and architecture design reviews with certified mentors.
              </p>
            </div>

            <div className="experts-grid">
              {COMMUNITY_MEMBERS.map(m => (
                <div key={m.id} className="expert-card">
                  <div className="expert-top">
                    <div className="expert-avatar-circle" style={{ background: m.avatarBg }}>
                      <span>{m.initials}</span>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0F172A" }}>{m.name}</h3>
                      <span style={{ fontSize: "0.8125rem", color: "#6C2BD9", fontWeight: 700 }}>{m.badge}</span>
                      <div style={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <MapPin size={12} />
                        <span>{m.location}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "#475569", lineHeight: 1.5, margin: "14px 0" }}>
                    {m.headline}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {m.skills.slice(0, 4).map(s => (
                      <span key={s} className="expert-skill-pill">{s}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => {
                      setSelectedMember(m);
                      setProfileModalTab("about");
                    }}
                  >
                    View Full Profile &amp; Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── PROFILE DETAILS MODAL (Screenshot 4 with NexziByte Brand Palette) ── */}
      {selectedMember && (
        <div className="profile-modal-backdrop" onClick={() => setSelectedMember(null)}>
          <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="profile-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0F172A" }}>Profile</span>
              </div>
              <button
                type="button"
                className="profile-modal-close-btn"
                onClick={() => setSelectedMember(null)}
                title="Close Profile"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Left Sidebar + Right Tabs */}
            <div className="profile-modal-body">
              {/* LEFT SIDEBAR: Avatar & Core Info */}
              <div className="profile-modal-left-pane">
                <div className="profile-modal-avatar-circle">
                  {selectedMember.avatar ? (
                    <img src={selectedMember.avatar} alt={selectedMember.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <User size={38} color="#475569" strokeWidth={1.8} />
                  )}
                  <span className="profile-avatar-badge-sub">1</span>
                </div>

                <h3 className="profile-modal-name">{selectedMember.name}</h3>
                <div className="profile-modal-meta-row">
                  <Clock size={13} />
                  <span>Last seen {selectedMember.lastSeen}</span>
                </div>
                <div className="profile-modal-meta-row">
                  <Calendar size={13} />
                  <span>Member since {selectedMember.memberSince}</span>
                </div>

                {/* Badge Tag */}
                <div style={{ margin: "14px 0" }}>
                  <span className="profile-modal-tag-badge">{selectedMember.badge}</span>
                </div>

                {/* Edit & Link Actions */}
                <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="profile-modal-edit-btn"
                    onClick={() => {
                      showToast(`Opening profile editor for ${selectedMember.name}`);
                      navigate("/profile?tab=settings");
                    }}
                  >
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="profile-modal-link-btn"
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

              {/* RIGHT PANE: Tabs & Details */}
              <div className="profile-modal-right-pane">
                {/* Sub-Tabs */}
                <div className="profile-modal-tabs-row">
                  <button
                    type="button"
                    className={`profile-subtab-btn ${profileModalTab === "about" ? "is-active" : ""}`}
                    onClick={() => setProfileModalTab("about")}
                  >
                    About
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-btn ${profileModalTab === "posts" ? "is-active" : ""}`}
                    onClick={() => setProfileModalTab("posts")}
                  >
                    Posts ({selectedMember.postsCount})
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-btn ${profileModalTab === "comments" ? "is-active" : ""}`}
                    onClick={() => setProfileModalTab("comments")}
                  >
                    Comments ({selectedMember.commentsCount})
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-btn ${profileModalTab === "spaces" ? "is-active" : ""}`}
                    onClick={() => setProfileModalTab("spaces")}
                  >
                    Spaces (11)
                  </button>
                  <button
                    type="button"
                    className={`profile-subtab-btn ${profileModalTab === "rewards" ? "is-active" : ""}`}
                    onClick={() => setProfileModalTab("rewards")}
                  >
                    Rewards
                  </button>
                </div>

                {/* TAB CONTENT: ABOUT */}
                {profileModalTab === "about" && (
                  <div className="profile-tab-content">
                    {/* Level Badge in Royal Purple & Gold (NOT neon lime!) */}
                    <div className="profile-level-badge-card">
                      <div className="level-badge-left">
                        <Award size={18} style={{ color: "#D97706" }} />
                        <span className="level-badge-title">{selectedMember.level}</span>
                      </div>
                      <div className="level-badge-right">
                        <span>{selectedMember.points} points</span>
                        <span className="dot-sep">•</span>
                        <span>10 to level up</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="profile-field-group">
                      <div className="profile-field-label">
                        <Mail size={14} style={{ color: "#6C2BD9" }} />
                        <span>Email</span>
                      </div>
                      <div className="profile-field-value">{selectedMember.email}</div>
                    </div>

                    {/* Tags */}
                    <div className="profile-field-group">
                      <div className="profile-field-label">
                        <span>Tags</span>
                      </div>
                      <div className="profile-tags-wrap">
                        <span className="profile-purple-tag">{selectedMember.badge}</span>
                        {selectedMember.skills.map(s => (
                          <span key={s} className="profile-skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="profile-field-group">
                      <div className="profile-field-label">Headline</div>
                      <div className="profile-field-value">{selectedMember.headline}</div>
                    </div>

                    {/* Bio */}
                    <div className="profile-field-group">
                      <div className="profile-field-label">Bio</div>
                      <div className="profile-field-value" style={{ lineHeight: 1.6 }}>{selectedMember.bio}</div>
                    </div>

                    {/* Location */}
                    <div className="profile-field-group">
                      <div className="profile-field-label">Location</div>
                      <div className="profile-field-value">{selectedMember.location}</div>
                    </div>

                    {/* LinkedIn URL */}
                    <div className="profile-field-group">
                      <div className="profile-field-label">LinkedIn URL</div>
                      <a 
                        href={selectedMember.linkedin} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="profile-linkedin-link"
                      >
                        <span>{selectedMember.linkedin}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: POSTS */}
                {profileModalTab === "posts" && (
                  <div className="profile-tab-content">
                    <p style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: "16px" }}>
                      Dispatches &amp; discussions published by {selectedMember.name}:
                    </p>
                    {COMMUNITY_POSTS.slice(0, 2).map(p => (
                      <div key={p.id} className="profile-mini-post-card">
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>{p.title}</h4>
                        <div style={{ fontSize: "0.75rem", color: "#64748B", display: "flex", gap: "12px" }}>
                          <span>{p.timeAgo}</span>
                          <span>•</span>
                          <span>{p.likes} likes</span>
                          <span>•</span>
                          <span>{p.commentsCount} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB CONTENT: SPACES */}
                {profileModalTab === "spaces" && (
                  <div className="profile-tab-content">
                    <div className="profile-spaces-grid">
                      {COMMUNITY_SPACES.map(s => (
                        <div key={s.id} className="profile-space-card">
                          <div className="space-dot-purple" />
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: REWARDS */}
                {profileModalTab === "rewards" && (
                  <div className="profile-tab-content">
                    <div className="reward-badge-card">
                      <Award size={32} style={{ color: "#6C2BD9", marginBottom: "8px" }} />
                      <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0F172A" }}>Verified Community Champion</h4>
                      <p style={{ fontSize: "0.8125rem", color: "#64748B", margin: "4px 0 0 0" }}>
                        Active contributor in the NexziByte TechTalk Developer Hub.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE POST MODAL ── */}
      {createPostOpen && (
        <div className="profile-modal-backdrop" onClick={() => setCreatePostOpen(false)}>
          <div className="create-post-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="create-post-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>Create a Community Post</h3>
              <button type="button" className="profile-modal-close-btn" onClick={() => setCreatePostOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="create-post-form">
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  Select Space / Channel
                </label>
                <select
                  value={newPostSpace}
                  onChange={(e) => setNewPostSpace(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                >
                  <option value="feed">Feed (General)</option>
                  <option value="introduce-yourself">Introduce Yourself</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  Post Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Architecture Insights on Kafka Streaming & Microservices"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", padding: "10px 14px" }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>
                  Message / Content
                </label>
                <textarea
                  rows={6}
                  placeholder="Share your technical learnings, architectural questions, or project updates with the community..."
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
    </div>
  );
}
