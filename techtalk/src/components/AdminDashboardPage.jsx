import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, Users, Ticket, CheckCircle2, Clock, 
  ArrowUpRight, AlertCircle, RefreshCw, QrCode, 
  Mail, Phone, ExternalLink, Download, Search, 
  DollarSign, Check, X, Filter, UserCheck, UserX, User,
  Sparkles, Layers, Eye, Heart, CreditCard, ChevronRight, LogOut,
  Plus, Edit3, Trash2, Calendar, Mic, Tag, BookOpen, Building,
  FileText, Globe, Share2, Award
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, showToast } = useApp();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); 
  // "overview" | "users" | "posts" | "categories" | "summits" | "founder-meets" | "speakers" | "registrations" | "inquiries"
  
  const [searchQuery, setSearchQuery] = useState("");
  const [passFilter, setPassFilter] = useState("all");
  const [emailStatusFilter, setEmailStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [checkInFilter, setCheckInFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [messageTypeFilter, setMessageTypeFilter] = useState("all");
  const [messageStatusFilter, setMessageStatusFilter] = useState("all");
  
  // Modals state
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // CRUD Modals
  const [modalMode, setModalMode] = useState(null); // null | "create-post" | "edit-post" | "create-summit" | "edit-summit" | "create-meet" | "edit-meet" | "create-speaker" | "edit-speaker" | "create-category" | "edit-category"
  const [activeItem, setActiveItem] = useState(null);
  
  // Form States
  const [postForm, setPostForm] = useState({ title: "", category: "System Architecture", excerpt: "", content: "", cover_image: "", tags: "TechTalk, Architecture", status: "Published" });
  const [summitForm, setSummitForm] = useState({ title: "", subtitle: "", badge: "UPCOMING FLAGSHIP", description: "", date: "", time: "09:00 AM - 06:00 PM IST", venue: "", location: "Hyderabad, India", max_seats: 500, status: "Upcoming", banner_image: "" });
  const [meetForm, setMeetForm] = useState({ title: "", subtitle: "", badge: "FOUNDER ROUNDTABLE", description: "", founder_info: "", date: "", time: "04:00 PM - 08:30 PM IST", venue: "", location: "Hyderabad, India", max_seats: 60, status: "Upcoming", banner_image: "" });
  const [speakerForm, setSpeakerForm] = useState({ name: "", title: "", company: "", bio: "", image_url: "", twitter: "", linkedin: "", github: "", is_featured: false, expertise: "AI, Cloud, Scalability" });
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "", icon: "Tag" });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real admin data directly from backend
  const loadDashboardData = async (isManual = false, isBackground = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else if (!isBackground) {
      setLoading(true);
    }
    
    try {
      const res = await api.getAdminDashboardData();
      if (res && res.overview) {
        setData(res);
      }
      if (isManual) {
        await new Promise((r) => setTimeout(r, 400));
        showToast("Live admin metrics refreshed successfully!");
      }
    } catch (err) {
      if (!isBackground) {
        console.error("Failed to load admin metrics:", err);
        showToast("Could not refresh live metrics from server.");
      }
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const emailClean = (user?.email || "").toLowerCase().trim();
    const isStrictAdmin = isLoggedIn && (emailClean === "nexzibyte@gmail.com" || emailClean === "nexzibyteadmin@gmail.com");
    if (!isStrictAdmin) {
      showToast("Access restricted: Administrator privileges required.");
      navigate("/profile", { replace: true });
      return;
    }
    loadDashboardData();

    // Auto-poll live database every 8s so user likes, saves, posts, registrations, passes appear regularly
    const interval = setInterval(() => {
      loadDashboardData(false, true);
    }, 8000);

    const handleFocus = () => {
      loadDashboardData(false, true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // 1. User Management Actions
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.toggleUserStatus(userId);
      setData(prev => {
        if (!prev) return prev;
        const updated = (prev.members || []).map(m => m.id === userId ? { ...m, is_active: !currentStatus } : m);
        return { ...prev, members: updated };
      });
      showToast(`User account ${!currentStatus ? "activated" : "deactivated"} successfully.`);
    } catch (err) {
      showToast("Failed to toggle user status.");
    }
  };

  const handleDeleteUser = async (userIdOrEmail) => {
    if (!window.confirm(`Are you sure you want to delete account '${userIdOrEmail}'? This action cannot be undone.`)) return;
    try {
      await api.deleteUser(userIdOrEmail);
      setData(prev => {
        if (!prev) return prev;
        const updated = (prev.members || []).filter(m => m.id !== userIdOrEmail && m.email !== userIdOrEmail);
        return { 
          ...prev, 
          members: updated,
          overview: { ...prev.overview, total_members: Math.max(0, prev.overview.total_members - 1) }
        };
      });
      if (selectedMember?.id === userIdOrEmail || selectedMember?.email === userIdOrEmail) {
        setSelectedMember(null);
      }
      showToast("User account deleted successfully.");
    } catch (err) {
      showToast("Failed to delete user account.");
    }
  };

  // 2. Pass Check-in Toggle
  const handleToggleCheckIn = async (passId, currentStatus) => {
    if (!passId) return;
    setIsUpdating(true);
    try {
      if (currentStatus) {
        await api.resetCheckIn(passId);
      } else {
        await api.checkInPass(passId);
      }

      setData((prev) => {
        if (!prev) return prev;
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const updatedPasses = (prev.passes || []).map((p) => {
          if (p.pass_id === passId) {
            return { ...p, checked_in: !currentStatus, check_in_time: !currentStatus ? nowStr : null };
          }
          return p;
        });

        const updatedMembers = (prev.members || []).map((m) => {
          if (m.passes && m.passes.length > 0) {
            const mPasses = m.passes.map((mp) => {
              if (mp.pass_id === passId) {
                return { ...mp, checked_in: !currentStatus, check_in_time: !currentStatus ? nowStr : null };
              }
              return mp;
            });
            const primary = mPasses[0] || null;
            return { ...m, passes: mPasses, primary_pass: primary };
          }
          return m;
        });

        const checkedCount = updatedPasses.filter(p => p.checked_in).length;

        return {
          ...prev,
          passes: updatedPasses,
          members: updatedMembers,
          overview: {
            ...prev.overview,
            checked_in_count: checkedCount,
            check_in_rate: `${Math.round((checkedCount / Math.max(updatedPasses.length, 1)) * 100)}%`
          }
        };
      });

      showToast(`Pass ${passId} ${!currentStatus ? "checked in successfully!" : "check-in reset."}`);
    } catch (err) {
      showToast(`Update error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. Posts Actions
  const handleSavePost = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: postForm.title,
        category: postForm.category,
        excerpt: postForm.excerpt,
        content: postForm.content,
        cover_image: postForm.cover_image,
        tags: typeof postForm.tags === "string" ? postForm.tags.split(",").map(t => t.trim()).filter(Boolean) : postForm.tags,
        status: postForm.status
      };

      if (modalMode === "create-post") {
        const created = await api.createPost(payload);
        setData(prev => ({
          ...prev,
          posts: [created, ...(prev.posts || [])],
          overview: { ...prev.overview, total_dispatches: (prev.overview.total_dispatches || 0) + 1 }
        }));
        showToast("Technical dispatch created and published!");
      } else if (modalMode === "edit-post" && activeItem) {
        const updated = await api.updatePost(activeItem.id, payload);
        setData(prev => ({
          ...prev,
          posts: (prev.posts || []).map(p => p.id === activeItem.id ? { ...p, ...updated } : p)
        }));
        showToast("Post updated successfully!");
      }
      setModalMode(null);
      setActiveItem(null);
    } catch (err) {
      showToast("Error saving post.");
    }
  };

  const handleTogglePostPublish = async (post) => {
    const nextStatus = post.status === "Published" ? "Draft" : "Published";
    try {
      await api.updatePost(post.id, { status: nextStatus });
      setData(prev => ({
        ...prev,
        posts: (prev.posts || []).map(p => p.id === post.id ? { ...p, status: nextStatus } : p)
      }));
      showToast(`Post marked as ${nextStatus}.`);
    } catch (err) {
      showToast("Could not update post status.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this technical post permanently?")) return;
    try {
      await api.deletePost(postId);
      setData(prev => ({
        ...prev,
        posts: (prev.posts || []).filter(p => p.id !== postId),
        overview: { ...prev.overview, total_dispatches: Math.max(0, (prev.overview.total_dispatches || 1) - 1) }
      }));
      showToast("Post deleted successfully.");
    } catch (err) {
      showToast("Failed to delete post.");
    }
  };

  // 4. Summits Actions
  const handleSaveSummit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: summitForm.title,
        subtitle: summitForm.subtitle,
        badge: summitForm.badge,
        description: summitForm.description,
        date: summitForm.date,
        time: summitForm.time,
        venue: summitForm.venue,
        location: summitForm.location,
        max_seats: parseInt(summitForm.max_seats) || 500,
        status: summitForm.status,
        banner_image: summitForm.banner_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80"
      };

      if (modalMode === "create-summit") {
        const created = await api.createSummit(payload);
        setData(prev => ({
          ...prev,
          summits: [created, ...(prev.summits || [])],
          overview: { ...prev.overview, total_summits: (prev.overview.total_summits || 0) + 1 }
        }));
        showToast("Summit conference created successfully!");
      } else if (modalMode === "edit-summit" && activeItem) {
        const updated = await api.updateSummit(activeItem.id, payload);
        setData(prev => ({
          ...prev,
          summits: (prev.summits || []).map(s => s.id === activeItem.id ? { ...s, ...updated } : s)
        }));
        showToast("Summit details updated.");
      }
      setModalMode(null);
      setActiveItem(null);
    } catch (err) {
      showToast("Error saving summit.");
    }
  };

  const handleToggleSummitStatus = async (summit) => {
    const nextStatus = summit.status === "Archived" ? "Upcoming" : "Archived";
    try {
      await api.updateSummit(summit.id, { ...summit, status: nextStatus });
      setData(prev => ({
        ...prev,
        summits: (prev.summits || []).map(s => s.id === summit.id ? { ...s, status: nextStatus } : s)
      }));
      showToast(`Summit status set to ${nextStatus}.`);
    } catch (err) {
      showToast("Could not update summit status.");
    }
  };

  const handleDeleteSummit = async (summitId) => {
    if (!window.confirm("Are you sure you want to delete this Summit?")) return;
    try {
      await api.deleteSummit(summitId);
      setData(prev => ({
        ...prev,
        summits: (prev.summits || []).filter(s => s.id !== summitId),
        overview: { ...prev.overview, total_summits: Math.max(0, (prev.overview.total_summits || 1) - 1) }
      }));
      showToast("Summit deleted.");
    } catch (err) {
      showToast("Failed to delete summit.");
    }
  };

  // 5. Founder Meets Actions
  const handleSaveMeet = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: meetForm.title,
        subtitle: meetForm.subtitle,
        badge: meetForm.badge,
        description: meetForm.description,
        founder_info: meetForm.founder_info,
        date: meetForm.date,
        time: meetForm.time,
        venue: meetForm.venue,
        location: meetForm.location,
        max_seats: parseInt(meetForm.max_seats) || 60,
        status: meetForm.status,
        banner_image: meetForm.banner_image || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80"
      };

      if (modalMode === "create-meet") {
        const created = await api.createFounderMeet(payload);
        setData(prev => ({
          ...prev,
          founder_meets: [created, ...(prev.founder_meets || [])],
          overview: { ...prev.overview, total_founder_meets: (prev.overview.total_founder_meets || 0) + 1 }
        }));
        showToast("Founder meet scheduled successfully!");
      } else if (modalMode === "edit-meet" && activeItem) {
        const updated = await api.updateFounderMeet(activeItem.id, payload);
        setData(prev => ({
          ...prev,
          founder_meets: (prev.founder_meets || []).map(m => m.id === activeItem.id ? { ...m, ...updated } : m)
        }));
        showToast("Founder meet updated.");
      }
      setModalMode(null);
      setActiveItem(null);
    } catch (err) {
      showToast("Error saving founder meet.");
    }
  };

  const handleDeleteMeet = async (meetId) => {
    if (!window.confirm("Delete this founder meetup permanently?")) return;
    try {
      await api.deleteFounderMeet(meetId);
      setData(prev => ({
        ...prev,
        founder_meets: (prev.founder_meets || []).filter(m => m.id !== meetId),
        overview: { ...prev.overview, total_founder_meets: Math.max(0, (prev.overview.total_founder_meets || 1) - 1) }
      }));
      showToast("Founder meet removed.");
    } catch (err) {
      showToast("Failed to delete founder meet.");
    }
  };

  // 6. Speakers Actions
  const handleSaveSpeaker = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: speakerForm.name,
        title: speakerForm.title,
        company: speakerForm.company,
        bio: speakerForm.bio,
        image_url: speakerForm.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        twitter: speakerForm.twitter,
        linkedin: speakerForm.linkedin,
        github: speakerForm.github,
        is_featured: speakerForm.is_featured,
        expertise: typeof speakerForm.expertise === "string" ? speakerForm.expertise.split(",").map(s => s.trim()).filter(Boolean) : speakerForm.expertise
      };

      if (modalMode === "create-speaker") {
        const created = await api.createSpeaker(payload);
        setData(prev => ({
          ...prev,
          speakers: [created, ...(prev.speakers || [])],
          overview: { ...prev.overview, total_speakers: (prev.overview.total_speakers || 0) + 1 }
        }));
        showToast("Speaker added successfully!");
      } else if (modalMode === "edit-speaker" && activeItem) {
        const updated = await api.updateSpeaker(activeItem.id, payload);
        setData(prev => ({
          ...prev,
          speakers: (prev.speakers || []).map(s => s.id === activeItem.id ? { ...s, ...updated } : s)
        }));
        showToast("Speaker profile updated.");
      }
      setModalMode(null);
      setActiveItem(null);
    } catch (err) {
      showToast("Error saving speaker.");
    }
  };

  const handleDeleteSpeaker = async (speakerId) => {
    if (!window.confirm("Remove this speaker from the directory?")) return;
    try {
      await api.deleteSpeaker(speakerId);
      setData(prev => ({
        ...prev,
        speakers: (prev.speakers || []).filter(s => s.id !== speakerId),
        overview: { ...prev.overview, total_speakers: Math.max(0, (prev.overview.total_speakers || 1) - 1) }
      }));
      showToast("Speaker removed.");
    } catch (err) {
      showToast("Failed to delete speaker.");
    }
  };

  // 7. Categories Actions
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, "-"),
        description: categoryForm.description,
        icon: categoryForm.icon || "Tag"
      };

      if (modalMode === "create-category") {
        const created = await api.createCategory(payload);
        setData(prev => ({
          ...prev,
          categories: [created, ...(prev.categories || [])],
          overview: { ...prev.overview, total_categories: (prev.overview.total_categories || 0) + 1 }
        }));
        showToast("Category created!");
      } else if (modalMode === "edit-category" && activeItem) {
        const updated = await api.updateCategory(activeItem.id, payload);
        setData(prev => ({
          ...prev,
          categories: (prev.categories || []).map(c => c.id === activeItem.id ? { ...c, ...updated } : c)
        }));
        showToast("Category updated.");
      }
      setModalMode(null);
      setActiveItem(null);
    } catch (err) {
      showToast("Error saving category.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.deleteCategory(categoryId);
      setData(prev => ({
        ...prev,
        categories: (prev.categories || []).filter(c => c.id !== categoryId),
        overview: { ...prev.overview, total_categories: Math.max(0, (prev.overview.total_categories || 1) - 1) }
      }));
      showToast("Category deleted.");
    } catch (err) {
      showToast("Failed to delete category.");
    }
  };

  // 8. Contact Message Actions
  const handleToggleMessageStatus = async (msgId) => {
    try {
      await api.toggleMessageStatus(msgId);
      setData((prev) => {
        if (!prev) return prev;
        const updated = (prev.messages || []).map((m) => {
          if (m.id === msgId) {
            const nextStatus = m.status === "unread" ? "read" : "unread";
            return { ...m, status: nextStatus };
          }
          return m;
        });
        return { ...prev, messages: updated };
      });
      showToast("Message status updated.");
    } catch (err) {
      showToast("Could not update message status.");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await api.deleteContactMessage(msgId);
      setData((prev) => {
        if (!prev) return prev;
        const updated = (prev.messages || []).filter((m) => m.id !== msgId);
        return { ...prev, messages: updated };
      });
      showToast("Message removed.");
    } catch (err) {
      showToast("Could not delete message.");
    }
  };

  // CSV Export feature
  const handleExportCSV = () => {
    if (!data || !data.members) return;
    const headers = ["Member Name,Email ID,Phone Number,Role,Location,Email Status,Has Pass,Pass ID,Pass Type,Amount Paid,Payment Status,Checked In,Registered Date\n"];
    const rows = data.members.map(m => {
      const p = m.primary_pass || {};
      const emailStatus = m.is_verified ? "Verified" : "Pending OTP";
      const hasPassStr = m.has_pass ? "Yes" : "No";
      const paymentStatus = p.payment_status || (m.has_pass ? "PAID" : "NONE");
      const checkedInStr = p.checked_in ? "Yes" : "No";
      return `"${m.name || ""}","${m.email || ""}","${m.phone || ""}","${m.role || ""}","${m.location || ""}","${emailStatus}","${hasPassStr}","${p.pass_id || "N/A"}","${p.pass_type || "N/A"}","${p.amount || "N/A"}","${paymentStatus}","${checkedInStr}","${m.registered_at || ""}"`;
    });
    const blob = new Blob([headers.concat(rows.join("\n"))], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexzibyte_techtalk_member_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported live member accounts & pass roster to CSV.");
  };

  // Filtered queries
  const filteredMembers = useMemo(() => {
    if (!data || !data.members) return [];
    return data.members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const pass = m.primary_pass;
      
      const matchesSearch = !q || 
        (m.name && m.name.toLowerCase().includes(q)) || 
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        (pass?.pass_id && pass.pass_id.toLowerCase().includes(q));

      const matchesPass = 
        passFilter === "all" ||
        (passFilter === "has-pass" && m.has_pass) ||
        (passFilter === "no-pass" && !m.has_pass) ||
        (pass?.pass_type && pass.pass_type.toLowerCase().includes(passFilter.toLowerCase()));

      const matchesEmailStatus = 
        emailStatusFilter === "all" ||
        (emailStatusFilter === "verified" && m.is_verified) ||
        (emailStatusFilter === "unverified" && !m.is_verified);

      return matchesSearch && matchesPass && matchesEmailStatus;
    });
  }, [data, searchQuery, passFilter, emailStatusFilter]);

  const filteredPasses = useMemo(() => {
    if (!data || !data.passes) return [];
    return data.passes.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (p.attendee_name && p.attendee_name.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        (p.pass_id && p.pass_id.toLowerCase().includes(q)) ||
        (p.organization && p.organization.toLowerCase().includes(q));

      const matchesPass = passFilter === "all" || (p.pass_type && p.pass_type.toLowerCase().includes(passFilter.toLowerCase()));
      const matchesEvent = eventFilter === "all" || (p.event_type && p.event_type.toLowerCase() === eventFilter.toLowerCase()) || (p.badge && p.badge.toLowerCase().includes(eventFilter.toLowerCase()));
      const matchesPayment = paymentFilter === "all" || (paymentFilter === "paid" && p.is_paid) || (paymentFilter === "free" && !p.is_paid);
      const matchesCheckIn = checkInFilter === "all" || (checkInFilter === "checked-in" && p.checked_in) || (checkInFilter === "pending" && !p.checked_in);

      return matchesSearch && matchesPass && matchesEvent && matchesPayment && matchesCheckIn;
    });
  }, [data, searchQuery, passFilter, eventFilter, paymentFilter, checkInFilter]);

  const filteredPosts = useMemo(() => {
    if (!data || !data.posts) return [];
    return data.posts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      return !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.author_name && p.author_name.toLowerCase().includes(q));
    });
  }, [data, searchQuery]);

  const filteredSummits = useMemo(() => {
    if (!data || !data.summits) return [];
    return data.summits.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      return !q ||
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.venue && s.venue.toLowerCase().includes(q)) ||
        (s.location && s.location.toLowerCase().includes(q));
    });
  }, [data, searchQuery]);

  const filteredMeets = useMemo(() => {
    if (!data || !data.founder_meets) return [];
    return data.founder_meets.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      return !q ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.founder_info && m.founder_info.toLowerCase().includes(q)) ||
        (m.venue && m.venue.toLowerCase().includes(q));
    });
  }, [data, searchQuery]);

  const filteredSpeakers = useMemo(() => {
    if (!data || !data.speakers) return [];
    return data.speakers.filter((sp) => {
      const q = searchQuery.toLowerCase().trim();
      return !q ||
        (sp.name && sp.name.toLowerCase().includes(q)) ||
        (sp.title && sp.title.toLowerCase().includes(q)) ||
        (sp.company && sp.company.toLowerCase().includes(q));
    });
  }, [data, searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!data || !data.categories) return [];
    return data.categories.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      return !q || (c.name && c.name.toLowerCase().includes(q)) || (c.slug && c.slug.toLowerCase().includes(q));
    });
  }, [data, searchQuery]);

  const filteredMessages = useMemo(() => {
    if (!data || !data.messages) return [];
    return data.messages.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.organization && m.organization.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q));

      const subLower = (m.subject || "").toLowerCase();
      const ft = (m.form_type || "").toLowerCase();

      let matchesType = true;
      if (messageTypeFilter === "host") {
        matchesType = ft === "host_proposal" || subLower.includes("host");
      } else if (messageTypeFilter === "speaker") {
        matchesType = ft === "speaker_proposal" || subLower.includes("speaker");
      } else if (messageTypeFilter === "partnership") {
        matchesType = ft === "partnership" || subLower.includes("partner");
      } else if (messageTypeFilter === "internship") {
        matchesType = ft === "internship" || subLower.includes("internship");
      } else if (messageTypeFilter === "course") {
        matchesType = ft === "course" || subLower.includes("course");
      } else if (messageTypeFilter === "contact") {
        matchesType = ft === "contact" || (!subLower.includes("host") && !subLower.includes("speaker") && !subLower.includes("partner") && !subLower.includes("internship") && !subLower.includes("course"));
      }

      let matchesStatus = true;
      if (messageStatusFilter === "unread") {
        matchesStatus = m.status === "unread";
      } else if (messageStatusFilter === "read") {
        matchesStatus = m.status === "read";
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, searchQuery, messageTypeFilter, messageStatusFilter]);

  const overview = data?.overview || {
    total_members: 0,
    verified_members: 0,
    unverified_members: 0,
    total_passes_issued: 0,
    pass_holders_count: 0,
    non_pass_members_count: 0,
    checked_in_count: 0,
    check_in_rate: "0%",
    total_revenue: "₹0",
    total_dispatches: 0,
    total_summits: 0,
    total_founder_meets: 0,
    total_speakers: 0,
    total_categories: 0
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out of Admin Command Center.");
    navigate("/");
  };

  return (
    <div className="admin-dashboard-page-root techtalk-logged-platform-root" style={{ minHeight: "100vh", backgroundColor: "transparent", paddingBottom: "80px" }}>
      {/* Top Banner & Control Bar */}
      <div className="admin-top-banner" style={{
        padding: "36px 24px 32px 24px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        background: "rgba(14, 10, 48, 0.75)",
        backdropFilter: "blur(16px)"
      }}>
        <div className="container" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            
            {/* Title & Badge */}
            <div>
              <h1 style={{ fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 6px 0", color: "#FFFFFF" }}>
                TechTalk Platform Administration
              </h1>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#94A3B8" }}>
                Manage users, technical posts, summits, founder meets, keynote speakers, registrations, and inquiries.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => loadDashboardData(true)}
                disabled={isRefreshing || loading}
                title="Refresh latest data from server"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: isRefreshing || loading ? "wait" : "pointer",
                  boxShadow: "0 4px 14px rgba(108, 43, 217, 0.4)"
                }}
              >
                <RefreshCw size={16} className={isRefreshing || loading ? "animate-spin" : ""} />
                <span>{isRefreshing ? "Refreshing..." : "Refresh Live"}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#FCA5A5",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                <LogOut size={16} />
                <span>Logout Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: "1320px", margin: "24px auto 0 auto", padding: "0 20px" }}>
        
        {/* TOP STATS CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {/* Card 1: Users */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.05)", 
            borderRadius: "14px", 
            padding: "20px 22px", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>USERS</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={18} style={{ color: "#60A5FA" }} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{overview.total_members}</div>
            <div style={{ fontSize: "0.82rem", color: "#4ADE80", fontWeight: 700, marginTop: "8px" }}>{overview.verified_members} Verified Accounts</div>
          </div>

          {/* Card 2: Registrations */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.05)", 
            borderRadius: "14px", 
            padding: "20px 22px", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>PASS REGISTRATIONS</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ticket size={18} style={{ color: "#4ADE80" }} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{overview.total_passes_issued}</div>
            <div style={{ fontSize: "0.82rem", color: "#CBD5E1", fontWeight: 600, marginTop: "8px" }}>{overview.checked_in_count} Checked In ({overview.check_in_rate})</div>
          </div>

          {/* Card 3: Summits & Meets */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.05)", 
            borderRadius: "14px", 
            padding: "20px 22px", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>EVENTS &amp; SUMMITS</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(168, 85, 247, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={18} style={{ color: "#C084FC" }} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{(overview.total_summits || data?.summits?.length || 0) + (overview.total_founder_meets || data?.founder_meets?.length || 0)}</div>
            <div style={{ fontSize: "0.82rem", color: "#C084FC", fontWeight: 700, marginTop: "8px" }}>{overview.total_summits || data?.summits?.length || 0} Summits &bull; {overview.total_founder_meets || data?.founder_meets?.length || 0} Meets</div>
          </div>

          {/* Card 4: Posts & Dispatches */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.05)", 
            borderRadius: "14px", 
            padding: "20px 22px", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>TECHNICAL POSTS</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(249, 115, 22, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={18} style={{ color: "#FB923C" }} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{overview.total_dispatches}</div>
            <div style={{ fontSize: "0.82rem", color: "#FB923C", fontWeight: 700, marginTop: "8px" }}>{overview.total_categories || data?.categories?.length || 7} Categories</div>
          </div>

          {/* Card 5: Engagement (Likes & Saves) */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.05)", 
            borderRadius: "14px", 
            padding: "20px 22px", 
            border: "1px solid rgba(255, 255, 255, 0.12)", 
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>LIKES &amp; BOOKMARKS</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(236, 72, 153, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={18} style={{ color: "#F472B6" }} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{overview.total_likes || overview.total_reactions || 0}</div>
            <div style={{ fontSize: "0.82rem", color: "#F472B6", fontWeight: 700, marginTop: "8px" }}>❤️ Total Likes &bull; 🔖 {overview.total_saved || 0} Saved</div>
          </div>

          {/* Card 6: Form Submissions & Proposals */}
          <div 
            onClick={() => setActiveTab("inquiries")}
            style={{ 
              background: "rgba(255, 255, 255, 0.05)", 
              borderRadius: "14px", 
              padding: "20px 22px", 
              border: (overview.unread_messages || 0) > 0 ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)", 
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "transform 0.15s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em" }}>PROPOSALS &amp; FORMS</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={18} style={{ color: "#C084FC" }} />
              </div>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              {overview.total_messages || data?.messages?.length || 0}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#FBBF24", fontWeight: 700, marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: (overview.unread_messages || 0) > 0 ? "#F59E0B" : "#10B981" }}></span>
              {(overview.unread_messages || 0) > 0 ? `${overview.unread_messages} Unread Submissions` : "All Submissions Reviewed"}
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "14px",
          padding: "16px 20px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "overview" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "overview" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "overview" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "overview" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Sparkles size={15} />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("users")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "users" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "users" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "users" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "users" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Users size={15} />
              <span>Users ({data?.members?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "posts" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "posts" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "posts" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "posts" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <FileText size={15} />
              <span>Posts ({data?.posts?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "categories" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "categories" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "categories" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "categories" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Tag size={15} />
              <span>Categories ({data?.categories?.length || 7})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("summits")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "summits" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "summits" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "summits" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "summits" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Calendar size={15} />
              <span>Summits ({data?.summits?.length || 2})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("founder-meets")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "founder-meets" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "founder-meets" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "founder-meets" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "founder-meets" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Building size={15} />
              <span>Founder Meets ({data?.founder_meets?.length || 1})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("speakers")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "speakers" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "speakers" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "speakers" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "speakers" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Mic size={15} />
              <span>Speakers ({data?.speakers?.length || 3})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("registrations")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "registrations" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "registrations" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "registrations" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "registrations" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Ticket size={15} />
              <span>Registrations ({data?.passes?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inquiries")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: activeTab === "inquiries" ? "1px solid #8B5CF6" : "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: activeTab === "inquiries" ? "#6C2BD9" : "rgba(255, 255, 255, 0.06)",
                color: activeTab === "inquiries" ? "#FFFFFF" : "#CBD5E1",
                boxShadow: activeTab === "inquiries" ? "0 4px 14px rgba(108, 43, 217, 0.4)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Mail size={15} />
              <span>Proposals &amp; Inquiries ({data?.messages?.length || 0})</span>
              {(overview.unread_messages || 0) > 0 && (
                <span style={{ background: "#F59E0B", color: "#000", fontSize: "0.68rem", fontWeight: 800, padding: "1px 6px", borderRadius: "10px", marginLeft: "4px" }}>
                  {overview.unread_messages} NEW
                </span>
              )}
            </button>
          </div>

          {/* Search bar & tab action */}
          {activeTab !== "overview" && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <div style={{ position: "relative", flex: "1 1 280px", maxWidth: "420px" }}>
                <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type="text"
                  placeholder={`Search in ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 14px 8px 36px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontSize: "0.85rem",
                    outline: "none",
                    background: "rgba(14, 10, 48, 0.85)",
                    color: "#FFFFFF"
                  }}
                />
              </div>

              {/* Action Buttons for Tabs */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                {activeTab === "posts" && (
                  <button
                    type="button"
                    onClick={() => {
                      setPostForm({ title: "", category: "System Architecture", excerpt: "", content: "", cover_image: "", tags: "TechTalk, Architecture", status: "Published" });
                      setModalMode("create-post");
                    }}
                    style={{ background: "#6C2BD9", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", border: "1px solid #8B5CF6", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(108, 43, 217, 0.3)" }}
                  >
                    <Plus size={14} /> <span>Create Post</span>
                  </button>
                )}

                {activeTab === "summits" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSummitForm({ title: "", subtitle: "", badge: "UPCOMING FLAGSHIP", description: "", date: "Nov 14, 2026", time: "09:00 AM - 06:00 PM IST", venue: "HICC Novotel, Hyderabad", location: "Hyderabad, India", max_seats: 500, status: "Upcoming", banner_image: "" });
                      setModalMode("create-summit");
                    }}
                    style={{ background: "#6C2BD9", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", border: "1px solid #8B5CF6", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(108, 43, 217, 0.3)" }}
                  >
                    <Plus size={14} /> <span>Add Summit</span>
                  </button>
                )}

                {activeTab === "founder-meets" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMeetForm({ title: "", subtitle: "", badge: "FOUNDER ROUNDTABLE", description: "", founder_info: "Enterprise Founders & CXOs", date: "Oct 24, 2026", time: "04:00 PM - 08:30 PM IST", venue: "T-Hub, Hyderabad", location: "Hyderabad, India", max_seats: 60, status: "Upcoming", banner_image: "" });
                      setModalMode("create-meet");
                    }}
                    style={{ background: "#6C2BD9", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", border: "1px solid #8B5CF6", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(108, 43, 217, 0.3)" }}
                  >
                    <Plus size={14} /> <span>Add Founder Meet</span>
                  </button>
                )}

                {activeTab === "speakers" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSpeakerForm({ name: "", title: "", company: "", bio: "", image_url: "", twitter: "", linkedin: "", github: "", is_featured: false, expertise: "AI, Scalability, Architecture" });
                      setModalMode("create-speaker");
                    }}
                    style={{ background: "#6C2BD9", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", border: "1px solid #8B5CF6", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(108, 43, 217, 0.3)" }}
                  >
                    <Plus size={14} /> <span>Add Speaker</span>
                  </button>
                )}

                {activeTab === "categories" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryForm({ name: "", slug: "", description: "", icon: "Tag" });
                      setModalMode("create-category");
                    }}
                    style={{ background: "#6C2BD9", color: "#FFFFFF", padding: "8px 14px", borderRadius: "8px", border: "1px solid #8B5CF6", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(108, 43, 217, 0.3)" }}
                  >
                    <Plus size={14} /> <span>Add Category</span>
                  </button>
                )}

                {activeTab === "registrations" && (
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.2)", fontSize: "0.8125rem", fontWeight: 600, background: "rgba(14, 10, 48, 0.85)", color: "#FFFFFF" }}
                  >
                    <option value="all">All Events</option>
                    <option value="summit">Summits</option>
                    <option value="founder">Founder Meets</option>
                  </select>
                )}

                {activeTab === "inquiries" && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <select
                      value={messageTypeFilter}
                      onChange={(e) => setMessageTypeFilter(e.target.value)}
                      style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.2)", fontSize: "0.8125rem", fontWeight: 600, background: "rgba(14, 10, 48, 0.85)", color: "#FFFFFF" }}
                    >
                      <option value="all">All Form Types</option>
                      <option value="host">📅 Host Event Proposals</option>
                      <option value="speaker">🎤 Speaker Proposals</option>
                      <option value="partnership">🤝 Partnerships</option>
                      <option value="internship">🎓 Internship Applications</option>
                      <option value="course">📚 Course Tracks</option>
                      <option value="contact">✉️ Contact Us</option>
                    </select>

                    <select
                      value={messageStatusFilter}
                      onChange={(e) => setMessageStatusFilter(e.target.value)}
                      style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.2)", fontSize: "0.8125rem", fontWeight: 600, background: "rgba(14, 10, 48, 0.85)", color: "#FFFFFF" }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="unread">🟡 Unread Only</option>
                      <option value="read">🟢 Read Only</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW & DASHBOARD METRICS
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            
            {/* Quick Actions & Navigation */}
            <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", padding: "24px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 14px 0", color: "#FFFFFF" }}>Quick Management Modules</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button type="button" onClick={() => setActiveTab("users")} style={{ padding: "12px", background: "rgba(37, 99, 235, 0.18)", border: "1px solid rgba(96, 165, 250, 0.35)", borderRadius: "10px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontWeight: 800, color: "#93C5FD", fontSize: "0.9rem" }}>Users ({data?.members?.length || 0})</div>
                  <div style={{ fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>Search &amp; Status</div>
                </button>

                <button type="button" onClick={() => setActiveTab("posts")} style={{ padding: "12px", background: "rgba(234, 88, 12, 0.18)", border: "1px solid rgba(251, 146, 60, 0.35)", borderRadius: "10px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontWeight: 800, color: "#FDBA74", fontSize: "0.9rem" }}>Posts ({data?.posts?.length || 0})</div>
                  <div style={{ fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>Create &amp; Publish</div>
                </button>

                <button type="button" onClick={() => setActiveTab("summits")} style={{ padding: "12px", background: "rgba(124, 58, 237, 0.18)", border: "1px solid rgba(192, 132, 252, 0.35)", borderRadius: "10px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontWeight: 800, color: "#D8B4FE", fontSize: "0.9rem" }}>Summits ({data?.summits?.length || 2})</div>
                  <div style={{ fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>Manage Schedules</div>
                </button>

                <button type="button" onClick={() => setActiveTab("registrations")} style={{ padding: "12px", background: "rgba(22, 163, 74, 0.18)", border: "1px solid rgba(74, 222, 128, 0.35)", borderRadius: "10px", textAlign: "left", cursor: "pointer" }}>
                  <div style={{ fontWeight: 800, color: "#86EFAC", fontSize: "0.9rem" }}>Passes ({data?.passes?.length || 0})</div>
                  <div style={{ fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>QR &amp; Check-ins</div>
                </button>

                <button type="button" onClick={() => setActiveTab("inquiries")} style={{ padding: "12px", background: "rgba(168, 85, 247, 0.18)", border: "1px solid rgba(192, 132, 252, 0.35)", borderRadius: "10px", textAlign: "left", cursor: "pointer", gridColumn: "span 2" }}>
                  <div style={{ fontWeight: 800, color: "#D8B4FE", fontSize: "0.9rem" }}>Form Submissions &amp; Proposals ({data?.messages?.length || 0})</div>
                  <div style={{ fontSize: "0.75rem", color: "#CBD5E1", marginTop: "2px" }}>Host Proposals, Speaker Applications, Partner Requests &amp; Contact Inquiries</div>
                </button>
              </div>
            </div>

            {/* Recent Inquiries Dispatch */}
            <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", padding: "24px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Recent Inquiries</h3>
                <button type="button" onClick={() => setActiveTab("inquiries")} style={{ background: "none", border: "none", color: "#A78BFA", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}>View All &rarr;</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(data?.messages || []).slice(0, 3).map((msg, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.85rem" }}>
                      <span style={{ color: "#FFFFFF" }}>{msg.name}</span>
                      <span style={{ fontSize: "0.72rem", color: msg.status === "unread" ? "#F59E0B" : "#34D399", fontWeight: 800 }}>{msg.status.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "4px" }}>{msg.email} &bull; {msg.subject}</div>
                  </div>
                ))}
                {(!data?.messages || data.messages.length === 0) && (
                  <div style={{ color: "#94A3B8", fontSize: "0.85rem" }}>No inquiries received yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: USERS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              Registered User Accounts ({filteredMembers.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>User</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Email &amp; Phone</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Role</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Verification</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m, idx) => (
                    <tr key={m.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{m.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Joined: {m.registered_at}</div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ color: "#E2E8F0" }}>{m.email}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{m.phone}</div>
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 600, color: "#CBD5E1" }}>{m.role}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ color: m.is_verified ? "#4ADE80" : "#FBBF24", fontWeight: 700, fontSize: "0.75rem" }}>
                          {m.is_verified ? "Verified" : "Pending OTP"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(m.id, m.is_active)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: `1px solid ${m.is_active ? "rgba(74, 222, 128, 0.4)" : "rgba(248, 113, 113, 0.4)"}`,
                            background: m.is_active ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: m.is_active ? "#4ADE80" : "#F87171",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {m.is_active ? "Active" : "Deactivated"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(m.id || m.email)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: POSTS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "posts" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              Technical Posts &amp; Dispatches ({filteredPosts.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Article Title</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Category</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Author</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Views / Likes</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((p, idx) => (
                    <tr key={p.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{p.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{p.created_at}</div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "#93C5FD", border: "1px solid rgba(96, 165, 250, 0.4)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>{p.category}</span>
                      </td>
                      <td style={{ padding: "12px 18px", color: "#CBD5E1", fontWeight: 600 }}>{p.author_name}</td>
                      <td style={{ padding: "12px 18px", fontSize: "0.8rem", color: "#E2E8F0" }}>
                        👁️ {p.views || 0} &bull; ❤️ {p.likes || 0}
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePostPublish(p)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: `1px solid ${p.status === "Published" ? "rgba(74, 222, 128, 0.4)" : "rgba(255, 255, 255, 0.2)"}`,
                            background: p.status === "Published" ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 255, 255, 0.08)",
                            color: p.status === "Published" ? "#4ADE80" : "#CBD5E1",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {p.status || "Published"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(p);
                              setPostForm({ title: p.title, category: p.category, excerpt: p.excerpt || "", content: p.content || "", cover_image: p.cover_image || p.coverImage || "", tags: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""), status: p.status || "Published" });
                              setModalMode("edit-post");
                            }}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(p.id)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4: CATEGORIES MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "categories" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              Content Categories ({filteredCategories.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Category Name</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Slug</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Description</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Post Count</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c, idx) => (
                    <tr key={c.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#FFFFFF" }}>{c.name}</td>
                      <td style={{ padding: "12px 18px", color: "#A78BFA", fontFamily: "monospace" }}>{c.slug}</td>
                      <td style={{ padding: "12px 18px", color: "#CBD5E1" }}>{c.description || "—"}</td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#60A5FA" }}>{c.post_count || 0}</td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(c);
                              setCategoryForm({ name: c.name, slug: c.slug, description: c.description || "", icon: c.icon || "Tag" });
                              setModalMode("edit-category");
                            }}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c.id)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 5: SUMMITS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "summits" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              TechTalk Summits Directory ({filteredSummits.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Summit Title</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Date &amp; Time</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Venue</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Capacity</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSummits.map((s, idx) => (
                    <tr key={s.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{s.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#C084FC", fontWeight: 600 }}>{s.badge}</div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ color: "#FFFFFF" }}>{s.date}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{s.time}</div>
                      </td>
                      <td style={{ padding: "12px 18px", color: "#CBD5E1" }}>{s.venue || s.location}</td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#60A5FA" }}>{s.max_seats || 500} Seats</td>
                      <td style={{ padding: "12px 18px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleSummitStatus(s)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            border: `1px solid ${s.status === "Upcoming" ? "rgba(74, 222, 128, 0.4)" : "rgba(255, 255, 255, 0.2)"}`,
                            background: s.status === "Upcoming" ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 255, 255, 0.08)",
                            color: s.status === "Upcoming" ? "#4ADE80" : "#CBD5E1",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {s.status}
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(s);
                              setSummitForm({ title: s.title, subtitle: s.subtitle || "", badge: s.badge || "UPCOMING FLAGSHIP", description: s.description || "", date: s.date || "", time: s.time || "", venue: s.venue || "", location: s.location || "Hyderabad, India", max_seats: s.max_seats || 500, status: s.status || "Upcoming", banner_image: s.banner || s.banner_image || "" });
                              setModalMode("edit-summit");
                            }}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSummit(s.id)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 6: FOUNDER MEETS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "founder-meets" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              Founder Meets &amp; Venture Roundtables ({filteredMeets.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Meet Title</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Founder / CXO Info</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Date &amp; Venue</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Seats</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeets.map((m, idx) => (
                    <tr key={m.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{m.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#FBBF24", fontWeight: 600 }}>{m.badge}</div>
                      </td>
                      <td style={{ padding: "12px 18px", color: "#CBD5E1", fontWeight: 600 }}>{m.founder_info}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ color: "#FFFFFF" }}>{m.date}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{m.venue}</div>
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#60A5FA" }}>{m.max_seats || 60}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FCD34D", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(m);
                              setMeetForm({ title: m.title, subtitle: m.subtitle || "", badge: m.badge || "FOUNDER ROUNDTABLE", description: m.description || "", founder_info: m.founder_info || "", date: m.date || "", time: m.time || "", venue: m.venue || "", location: m.location || "Hyderabad, India", max_seats: m.max_seats || 60, status: m.status || "Upcoming", banner_image: m.banner || m.banner_image || "" });
                              setModalMode("edit-meet");
                            }}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMeet(m.id)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 7: SPEAKERS & FOUNDERS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "speakers" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              Speakers &amp; Founders Directory ({filteredSpeakers.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Speaker</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Title &amp; Company</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Bio</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Featured</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpeakers.map((sp, idx) => (
                    <tr key={sp.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{sp.name}</div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 600, color: "#E2E8F0" }}>{sp.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#60A5FA" }}>{sp.company}</div>
                      </td>
                      <td style={{ padding: "12px 18px", color: "#CBD5E1", maxWidth: "300px" }}>{sp.bio || "—"}</td>
                      <td style={{ padding: "12px 18px" }}>
                        {sp.is_featured ? (
                          <span style={{ background: "rgba(245, 158, 11, 0.2)", color: "#FCD34D", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Featured</span>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>Regular</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveItem(sp);
                              setSpeakerForm({ name: sp.name, title: sp.title || "", company: sp.company || "", bio: sp.bio || "", image_url: sp.image || sp.image_url || "", twitter: sp.twitter || "", linkedin: sp.linkedin || "", github: sp.github || "", is_featured: !!sp.is_featured, expertise: Array.isArray(sp.expertise) ? sp.expertise.join(", ") : (sp.expertise || "") });
                              setModalMode("edit-speaker");
                            }}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSpeaker(sp.id)}
                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 8: REGISTRATIONS & PASS REGISTRY
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "registrations" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", fontWeight: 800, color: "#FFFFFF" }}>
              All Registrations &amp; Event Tickets ({filteredPasses.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Pass ID &amp; Badge</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Attendee</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Contact</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Pass Type</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Amount</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Check-In</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPasses.map((p, idx) => (
                    <tr key={p.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 800, fontFamily: "monospace", color: "#C084FC" }}>{p.pass_id}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{p.badge || "Delegate"}</div>
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#FFFFFF" }}>{p.attendee_name}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ color: "#E2E8F0" }}>{p.email}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{p.phone}</div>
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 600, color: "#CBD5E1" }}>{p.pass_type}</td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: p.is_paid ? "#4ADE80" : "#60A5FA" }}>{p.amount}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleCheckIn(p.pass_id, p.checked_in)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: `1px solid ${p.checked_in ? "rgba(74, 222, 128, 0.4)" : "rgba(255, 255, 255, 0.2)"}`,
                            background: p.checked_in ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 255, 255, 0.08)",
                            color: p.checked_in ? "#4ADE80" : "#CBD5E1",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          <CheckCircle2 size={12} style={{ display: "inline", marginRight: "4px" }} />
                          {p.checked_in ? "Checked In" : "Scan In"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedRegistration(p)}
                          style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 9: CONTACT MESSAGES & INQUIRIES
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "inquiries" && (
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.12)", backdropFilter: "blur(14px)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "1rem" }}>
                Form Submissions &amp; Event Proposals ({filteredMessages.length})
              </div>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                Showing {filteredMessages.length} of {data?.messages?.length || 0} total submissions in database
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#CBD5E1", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Applicant &amp; Contact</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Organization / College</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Form Type &amp; Topic</th>
                    <th style={{ padding: "12px 18px", textAlign: "left", minWidth: "260px" }}>Proposal Details</th>
                    <th style={{ padding: "12px 18px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg, idx) => {
                    const subLower = (msg.subject || "").toLowerCase();
                    const ft = (msg.form_type || "").toLowerCase();
                    const isHost = ft === "host_proposal" || subLower.includes("host");
                    const isSpeaker = ft === "speaker_proposal" || subLower.includes("speaker");
                    const isPartner = ft === "partnership" || subLower.includes("partner");
                    const isIntern = ft === "internship" || subLower.includes("internship");
                    const isCourse = ft === "course" || subLower.includes("course");

                    const badgeLabel = isHost ? "📅 Host Proposal"
                      : isSpeaker ? "🎤 Speaker Proposal"
                      : isPartner ? "🤝 Partnership"
                      : isIntern ? "🎓 Internship"
                      : isCourse ? "📚 Course Track"
                      : "✉️ Contact Us";

                    const badgeColor = isHost ? "#C084FC"
                      : isSpeaker ? "#38BDF8"
                      : isPartner ? "#FBBF24"
                      : isIntern ? "#34D399"
                      : isCourse ? "#F472B6"
                      : "#E2E8F0";

                    const badgeBg = isHost ? "rgba(139, 92, 246, 0.2)"
                      : isSpeaker ? "rgba(56, 189, 248, 0.2)"
                      : isPartner ? "rgba(245, 158, 11, 0.2)"
                      : isIntern ? "rgba(16, 185, 129, 0.2)"
                      : isCourse ? "rgba(236, 72, 153, 0.2)"
                      : "rgba(255, 255, 255, 0.08)";

                    return (
                      <tr key={msg.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", background: msg.status === "unread" ? "rgba(245, 158, 11, 0.08)" : "transparent" }}>
                        <td style={{ padding: "12px 18px" }}>
                          <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{msg.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{msg.email}</div>
                          {msg.phone && msg.phone !== "Not provided" && (
                            <div style={{ fontSize: "0.72rem", color: "#38BDF8", marginTop: "2px" }}>📞 {msg.phone}</div>
                          )}
                          <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "2px" }}>{msg.created_at || "Recent"}</div>
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <div style={{ color: "#E2E8F0", fontWeight: 600, fontSize: "0.85rem" }}>
                            {msg.organization && msg.organization !== "N/A" ? msg.organization : "Individual / Community"}
                          </div>
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <div style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: badgeBg,
                            color: badgeColor,
                            marginBottom: "4px"
                          }}>
                            {badgeLabel}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#E2E8F0", fontWeight: 600, maxWidth: "260px" }}>
                            {msg.subject || "No Subject"}
                          </div>
                        </td>
                        <td style={{ padding: "12px 18px", color: "#CBD5E1", fontSize: "0.825rem", whiteSpace: "pre-line", maxWidth: "340px", lineHeight: "1.4" }}>
                          {msg.message?.length > 130 ? `${msg.message.slice(0, 130)}...` : msg.message}
                          {msg.message?.length > 130 && (
                            <button
                              type="button"
                              onClick={() => setSelectedMessage(msg)}
                              style={{ display: "block", background: "none", border: "none", color: "#A78BFA", fontSize: "0.75rem", fontWeight: 700, padding: 0, marginTop: "4px", cursor: "pointer" }}
                            >
                              Read full &rarr;
                            </button>
                          )}
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <button
                            type="button"
                            onClick={() => handleToggleMessageStatus(msg.id)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: `1px solid ${msg.status === "unread" ? "rgba(245, 158, 11, 0.4)" : "rgba(74, 222, 128, 0.4)"}`,
                              background: msg.status === "unread" ? "rgba(245, 158, 11, 0.15)" : "rgba(34, 197, 94, 0.15)",
                              color: msg.status === "unread" ? "#FCD34D" : "#4ADE80",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            {msg.status === "unread" ? "🟡 Unread" : "🟢 Read"}
                          </button>
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => setSelectedMessage(msg)}
                              style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              Details
                            </button>
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "NexziByte TechTalk")}`}
                              style={{ padding: "4px 8px", borderRadius: "6px", background: "#7C3AED", color: "#FFFFFF", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}
                            >
                              Reply
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMessages.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
                        No form submissions or proposals found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
          ══════════════════════════════════════════════════════════════════════ */}

      {/* 1. Member Details Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "560px", width: "90vw", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>User Account Details</h3>
              <button type="button" onClick={() => setSelectedMember(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "#E2E8F0" }}>
              <div><strong style={{ color: "#FFFFFF" }}>Name:</strong> {selectedMember.name}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Email:</strong> {selectedMember.email}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Phone:</strong> {selectedMember.phone}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Role:</strong> {selectedMember.role}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Location:</strong> {selectedMember.location}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Email Status:</strong> <span style={{ color: selectedMember.is_verified ? "#4ADE80" : "#FBBF24", fontWeight: 700 }}>{selectedMember.is_verified ? "Verified" : "Pending OTP"}</span></div>
              <div><strong style={{ color: "#FFFFFF" }}>Account Status:</strong> <span style={{ color: selectedMember.is_active ? "#4ADE80" : "#F87171", fontWeight: 700 }}>{selectedMember.is_active ? "Active" : "Deactivated"}</span></div>
              <div><strong style={{ color: "#FFFFFF" }}>Registered:</strong> {selectedMember.registered_at}</div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => {
                  handleToggleUserStatus(selectedMember.id, selectedMember.is_active);
                  setSelectedMember(prev => prev ? { ...prev, is_active: !prev.is_active } : null);
                }}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${selectedMember.is_active ? "rgba(239, 68, 68, 0.4)" : "rgba(74, 222, 128, 0.4)"}`, background: selectedMember.is_active ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)", color: selectedMember.is_active ? "#FCA5A5" : "#4ADE80", fontWeight: 700, cursor: "pointer" }}
              >
                {selectedMember.is_active ? "Deactivate Account" : "Activate Account"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.1)", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Registration Details Modal */}
      {selectedRegistration && (
        <div className="modal-overlay" onClick={() => setSelectedRegistration(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "560px", width: "90vw", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Registration Pass Info</h3>
              <button type="button" onClick={() => setSelectedRegistration(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "#E2E8F0" }}>
              <div><strong style={{ color: "#FFFFFF" }}>Pass ID:</strong> <span style={{ fontFamily: "monospace", color: "#C084FC", fontWeight: 700 }}>{selectedRegistration.pass_id}</span></div>
              <div><strong style={{ color: "#FFFFFF" }}>Attendee:</strong> {selectedRegistration.attendee_name}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Email:</strong> {selectedRegistration.email}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Phone:</strong> {selectedRegistration.phone}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Pass Type:</strong> {selectedRegistration.pass_type}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Amount:</strong> <span style={{ color: "#4ADE80", fontWeight: 700 }}>{selectedRegistration.amount}</span></div>
              <div><strong style={{ color: "#FFFFFF" }}>Payment Status:</strong> {selectedRegistration.payment_status}</div>
              <div><strong style={{ color: "#FFFFFF" }}>Check-In Status:</strong> <span style={{ color: selectedRegistration.checked_in ? "#4ADE80" : "#FBBF24", fontWeight: 700 }}>{selectedRegistration.checked_in ? `Checked In (${selectedRegistration.check_in_time || "Verified"})` : "Pending Scan"}</span></div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => {
                  handleToggleCheckIn(selectedRegistration.pass_id, selectedRegistration.checked_in);
                  setSelectedRegistration(prev => prev ? { ...prev, checked_in: !prev.checked_in } : null);
                }}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${selectedRegistration.checked_in ? "rgba(239, 68, 68, 0.4)" : "rgba(74, 222, 128, 0.4)"}`, background: selectedRegistration.checked_in ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)", color: selectedRegistration.checked_in ? "#FCA5A5" : "#4ADE80", fontWeight: 700, cursor: "pointer" }}
              >
                {selectedRegistration.checked_in ? "Reset Check-In" : "Scan / Check-In Attendee"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.1)", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2b. Form Submission & Proposal Details Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "640px", width: "92vw", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 24px 60px rgba(0,0,0,0.8)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Form Submission Details</h3>
                <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 800, background: selectedMessage.status === "unread" ? "rgba(245, 158, 11, 0.2)" : "rgba(34, 197, 94, 0.2)", color: selectedMessage.status === "unread" ? "#FCD34D" : "#4ADE80", border: `1px solid ${selectedMessage.status === "unread" ? "rgba(245, 158, 11, 0.4)" : "rgba(74, 222, 128, 0.4)"}` }}>
                  {selectedMessage.status?.toUpperCase()}
                </span>
              </div>
              <button type="button" onClick={() => setSelectedMessage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.875rem", color: "#E2E8F0" }}>
              <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>Subject / Title</div>
                <div style={{ fontWeight: 800, color: "#A78BFA", fontSize: "1rem" }}>{selectedMessage.subject || "General Inquiry"}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><strong style={{ color: "#FFFFFF" }}>Sender Name:</strong> {selectedMessage.name}</div>
                <div><strong style={{ color: "#FFFFFF" }}>Email:</strong> <a href={`mailto:${selectedMessage.email}`} style={{ color: "#60A5FA", textDecoration: "none" }}>{selectedMessage.email}</a></div>
                <div><strong style={{ color: "#FFFFFF" }}>Phone / Contact:</strong> {selectedMessage.phone || "Not provided"}</div>
                <div><strong style={{ color: "#FFFFFF" }}>Organization:</strong> {selectedMessage.organization || "N/A"}</div>
                <div><strong style={{ color: "#FFFFFF" }}>Form Type:</strong> <span style={{ textTransform: "capitalize", color: "#CBD5E1" }}>{selectedMessage.form_type?.replace("_", " ") || "Proposal"}</span></div>
                <div><strong style={{ color: "#FFFFFF" }}>Submitted Date:</strong> {selectedMessage.created_at}</div>
              </div>

              <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "6px" }}>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 800, marginBottom: "8px" }}>Full Proposal / Message Content</div>
                <div style={{ color: "#F1F5F9", fontSize: "0.875rem", whiteSpace: "pre-line", lineHeight: "1.6" }}>
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={async () => {
                  await handleToggleMessageStatus(selectedMessage.id);
                  setSelectedMessage(prev => prev ? { ...prev, status: prev.status === "unread" ? "read" : "unread" } : null);
                }}
                style={{ flex: 1, minWidth: "140px", padding: "10px", borderRadius: "8px", border: `1px solid ${selectedMessage.status === "unread" ? "rgba(74, 222, 128, 0.4)" : "rgba(245, 158, 11, 0.4)"}`, background: selectedMessage.status === "unread" ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)", color: selectedMessage.status === "unread" ? "#4ADE80" : "#FCD34D", fontWeight: 700, cursor: "pointer" }}
              >
                {selectedMessage.status === "unread" ? "Mark as Read" : "Mark as Unread"}
              </button>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "NexziByte TechTalk")}`}
                style={{ flex: 1, minWidth: "140px", padding: "10px", borderRadius: "8px", background: "#7C3AED", color: "#FFFFFF", fontWeight: 700, textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                Reply via Email
              </a>

              <button
                type="button"
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this submission?")) {
                    await handleDeleteMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }
                }}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", fontWeight: 700, cursor: "pointer" }}
              >
                Delete
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.1)", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Post Modal (Create / Edit) */}
      {(modalMode === "create-post" || modalMode === "edit-post") && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "680px", width: "90vw", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>{modalMode === "create-post" ? "Create Technical Post" : "Edit Post"}</h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSavePost} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Title *</label>
                <input type="text" required value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Category</label>
                  <input type="text" value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Status</label>
                  <select value={postForm.status} onChange={e => setPostForm({ ...postForm, status: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(14, 10, 48, 0.95)", color: "#FFFFFF", boxSizing: "border-box" }}>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Excerpt</label>
                <input type="text" value={postForm.excerpt} onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Content *</label>
                <textarea rows={5} required value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Cover Image URL</label>
                <input type="text" placeholder="https://..." value={postForm.cover_image} onChange={e => setPostForm({ ...postForm, cover_image: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108, 43, 217, 0.4)" }}>Save Post</button>
                <button type="button" onClick={() => setModalMode(null)} style={{ padding: "12px 20px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#CBD5E1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Summit Modal (Create / Edit) */}
      {(modalMode === "create-summit" || modalMode === "edit-summit") && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "680px", width: "90vw", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>{modalMode === "create-summit" ? "Create Summit Conference" : "Edit Summit"}</h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveSummit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Summit Title *</label>
                <input type="text" required value={summitForm.title} onChange={e => setSummitForm({ ...summitForm, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Badge Tag</label>
                  <input type="text" value={summitForm.badge} onChange={e => setSummitForm({ ...summitForm, badge: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Status</label>
                  <select value={summitForm.status} onChange={e => setSummitForm({ ...summitForm, status: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(14, 10, 48, 0.95)", color: "#FFFFFF", boxSizing: "border-box" }}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Date *</label>
                  <input type="text" required value={summitForm.date} onChange={e => setSummitForm({ ...summitForm, date: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Max Seats</label>
                  <input type="number" value={summitForm.max_seats} onChange={e => setSummitForm({ ...summitForm, max_seats: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Venue *</label>
                <input type="text" required value={summitForm.venue} onChange={e => setSummitForm({ ...summitForm, venue: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Description *</label>
                <textarea rows={4} required value={summitForm.description} onChange={e => setSummitForm({ ...summitForm, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108, 43, 217, 0.4)" }}>Save Summit</button>
                <button type="button" onClick={() => setModalMode(null)} style={{ padding: "12px 20px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#CBD5E1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Founder Meet Modal (Create / Edit) */}
      {(modalMode === "create-meet" || modalMode === "edit-meet") && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "680px", width: "90vw", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>{modalMode === "create-meet" ? "Add Founder Meet" : "Edit Founder Meet"}</h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMeet} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Meet Title *</label>
                <input type="text" required value={meetForm.title} onChange={e => setMeetForm({ ...meetForm, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Founder / Leadership Info</label>
                <input type="text" value={meetForm.founder_info} onChange={e => setMeetForm({ ...meetForm, founder_info: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Date *</label>
                  <input type="text" required value={meetForm.date} onChange={e => setMeetForm({ ...meetForm, date: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Seats Capacity</label>
                  <input type="number" value={meetForm.max_seats} onChange={e => setMeetForm({ ...meetForm, max_seats: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Venue *</label>
                <input type="text" required value={meetForm.venue} onChange={e => setMeetForm({ ...meetForm, venue: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Description *</label>
                <textarea rows={4} required value={meetForm.description} onChange={e => setMeetForm({ ...meetForm, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108, 43, 217, 0.4)" }}>Save Founder Meet</button>
                <button type="button" onClick={() => setModalMode(null)} style={{ padding: "12px 20px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#CBD5E1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Speaker Modal (Create / Edit) */}
      {(modalMode === "create-speaker" || modalMode === "edit-speaker") && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "600px", width: "90vw", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>{modalMode === "create-speaker" ? "Add Speaker Profile" : "Edit Speaker"}</h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveSpeaker} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Speaker Name *</label>
                <input type="text" required value={speakerForm.name} onChange={e => setSpeakerForm({ ...speakerForm, name: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Designation / Role</label>
                  <input type="text" value={speakerForm.title} onChange={e => setSpeakerForm({ ...speakerForm, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Company / Org</label>
                  <input type="text" value={speakerForm.company} onChange={e => setSpeakerForm({ ...speakerForm, company: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Bio</label>
                <textarea rows={3} value={speakerForm.bio} onChange={e => setSpeakerForm({ ...speakerForm, bio: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108, 43, 217, 0.4)" }}>Save Speaker</button>
                <button type="button" onClick={() => setModalMode(null)} style={{ padding: "12px 20px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#CBD5E1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Category Modal (Create / Edit) */}
      {(modalMode === "create-category" || modalMode === "edit-category") && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ background: "rgba(14, 10, 48, 0.98)", borderRadius: "16px", padding: "28px", maxWidth: "500px", width: "90vw", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>{modalMode === "create-category" ? "Add Category" : "Edit Category"}</h3>
              <button type="button" onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Category Name *</label>
                <input type="text" required value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px", color: "#E2E8F0" }}>Description</label>
                <input type="text" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#FFFFFF", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%)", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(108, 43, 217, 0.4)" }}>Save Category</button>
                <button type="button" onClick={() => setModalMode(null)} style={{ padding: "12px 20px", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: "#CBD5E1", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
