"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Zap,
  FolderGit2,
  BookOpen,
  Briefcase,
  Quote,
  Layers,
  Image as ImageIcon,
  Mail,
  ExternalLink,
  Menu,
  LogOut,
  Edit3,
  RotateCcw,
  AlertTriangle,
  Lock,
  Settings,
} from "lucide-react";
import { api, getAccessToken, clearTokens } from "@/services/api";
import { ToastProvider, LoadingSpinner, Modal, useToast } from "./AdminUI";

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "CONTENT MANAGEMENT",
    items: [
      { name: "Profile & Hero", href: "/admin/profile", icon: User },
      { name: "About & Bio", href: "/admin/about", icon: BookOpen },
      { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
      { name: "Skills & Tech", href: "/admin/skills", icon: Zap },
      { name: "Experience", href: "/admin/experience", icon: Briefcase },
      { name: "Blog Posts", href: "/admin/blogs", icon: Edit3 },
      { name: "Services", href: "/admin/services", icon: Layers },
      { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
    ],
  },
  {
    title: "ENGAGEMENT & ASSETS",
    items: [
      { name: "Messages", href: "/admin/messages", icon: Mail },
      { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "SETTINGS & SECURITY",
    items: [
      { name: "Site Settings", href: "/admin/settings", icon: Settings },
      { name: "Admin Security", href: "/admin/security", icon: Lock },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/admin": "System Overview",
  "/admin/profile": "Profile & Hero Image Configuration",
  "/admin/about": "About & Bio Configuration",
  "/admin/skills": "Skills & Expertise Management",
  "/admin/projects": "Projects Portfolio",
  "/admin/blogs": "Blog & Editorial Articles",
  "/admin/experience": "Career & Experience History",
  "/admin/testimonials": "Client & Colleague Testimonials",
  "/admin/services": "Consulting & Engineering Services",
  "/admin/media": "Media Assets Library",
  "/admin/messages": "Contact Form Inquiries",
  "/admin/settings": "Global Site Settings",
  "/admin/security": "Admin Account & Security",
};

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Reset Website Content Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [resettingContent, setResettingContent] = useState(false);
  const [resetError, setResetError] = useState("");

  const isLoginPage = pathname === "/admin/login";
  const isChangePasswordPage = pathname === "/admin/change-password";
  const isSetupPage = pathname === "/admin/setup";
  const isAuthPage = isLoginPage || isChangePasswordPage || isSetupPage;

  useEffect(() => {
    if (isLoginPage || isSetupPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        router.replace("/admin/login");
        return;
      }

      try {
        const res = await api.getMe();
        if (res.data?.user) {
          const currentUser = res.data.user;
          setUser(currentUser);
          setProfileForm((prev) => ({
            ...prev,
            name: currentUser.name || "",
            email: currentUser.email || "",
          }));

          // First-login enforcement:
          // If mustChangePassword is true, DO NOT allow access to CMS dashboard yet. Redirect to setup!
          if (currentUser.mustChangePassword && !isChangePasswordPage && !isSetupPage) {
            setLoading(false);
            router.replace("/admin/setup");
            return;
          }

          // If on change-password or setup page but password is already set, route to dashboard
          if (!currentUser.mustChangePassword && (isChangePasswordPage || isSetupPage)) {
            router.replace("/admin");
            return;
          }
        }
      } catch {
        clearTokens();
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, isChangePasswordPage, router]);

  const handleLogout = () => {
    api.logout();
    router.replace("/admin/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const cleanEmail = profileForm.email.trim();
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        addToast("Please provide a valid administrator email address.", "error");
        setSavingProfile(false);
        return;
      }

      const payload: any = {
        name: profileForm.name.trim(),
        email: cleanEmail,
      };

      if (profileForm.newPassword) {
        if (!profileForm.currentPassword) {
          addToast("Current password is required to change your password.", "error");
          setSavingProfile(false);
          return;
        }
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }

      const res = await api.updateProfile(payload);
      if (res.data?.user) {
        setUser(res.data.user);
      }
      addToast("Account profile & login email updated successfully.", "success");
      setProfileModalOpen(false);
      setProfileForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err: any) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetConfirmed) {
      setResetError("Please check the confirmation box to proceed.");
      return;
    }

    setResettingContent(true);
    setResetError("");

    try {
      await api.resetContent({
        email: resetEmail.trim(),
        password: resetPassword,
        confirm: resetConfirmed,
      });

      addToast("Website content has been reset successfully to default project content.", "success");
      setResetModalOpen(false);
      setResetEmail("");
      setResetPassword("");
      setResetConfirmed(false);

      // Refresh current page so all components load fresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setResetError(err.message || "Failed to reset website content. Verify your credentials.");
      addToast(err.message || "Reset rejected. Please check email and password.", "error");
    } finally {
      setResettingContent(false);
    }
  };

  // Do not show admin sidebar/header on login or change-password pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Authenticating administrator session..." />
      </div>
    );
  }

  const currentTitle = pageTitles[pathname] || "Administration";

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717] flex flex-col font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#171717]/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#E8E8E5] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[#E8E8E5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#C47A52] flex items-center justify-center text-white font-serif font-bold text-lg">
              A
            </div>
            <div>
              <span className="font-semibold text-[#171717] text-sm tracking-wide block">
                ARJUN MEHTA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] block">
                Custom CMS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-[#6B6B6B]/70 uppercase">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#C47A52]/10 text-[#C47A52] font-semibold border-l-3 border-[#C47A52] pl-2.5"
                          : "text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF8]"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#C47A52]" : "text-[#6B6B6B]"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-[#E8E8E5] space-y-2">
          {/* Dangerous Action: Reset Website Content */}
          <button
            type="button"
            onClick={() => {
              setResetEmail(user?.email || "");
              setResetPassword("");
              setResetConfirmed(false);
              setResetError("");
              setResetModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50/70 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer group"
            title="Reset website content to original project defaults"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-red-500 group-hover:-rotate-90 transition-transform duration-300" />
              <span>Reset Website Content</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase">
              Reset
            </span>
          </button>

          {/* Link to Public Site */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#C47A52] rounded-md hover:bg-[#FAFAF8] transition-colors"
          >
            <span>View Public Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-[#FFFFFF] border-b border-[#E8E8E5] sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF8]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-[#171717]">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#8C9A86]/10 text-[#8C9A86] text-xs font-medium border border-[#8C9A86]/20">
              <span className="w-2 h-2 rounded-full bg-[#8C9A86] animate-pulse" />
              <span>Backend Connected (:5000)</span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-[#E8E8E5]">
              {/* Clickable Profile & Email Editor */}
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="text-right hidden sm:block group hover:opacity-85 transition-opacity cursor-pointer p-1 rounded-md hover:bg-[#FAFAF8]"
                title="Click to edit Administrator account details and email"
              >
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-medium text-[#171717] block">
                    {user?.name || "Administrator"}
                  </span>
                  <Edit3 className="w-3 h-3 text-[#6B6B6B] group-hover:text-[#C47A52] transition-colors" />
                </div>
                <span className="text-[10px] text-[#C47A52] block font-mono">
                  {user?.email || "admin@mehta.dev"}
                </span>
              </button>

              <button
                onClick={handleLogout}
                title="Log out"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B6B6B] hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Admin Profile & Email Edit Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Edit Administrator Account & Email"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Update your CMS administrator name and login credentials. Your new email will be used for logging into this CMS dashboard.
          </p>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              Administrator Name
            </label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#6B6B6B]">
                Administrator Login Email
              </label>
              {profileForm.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email.trim()) ? (
                <span className="text-[10px] text-emerald-600 font-medium">Valid email</span>
              ) : (
                <span className="text-[10px] text-amber-600 font-medium">Enter valid email</span>
              )}
            </div>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              onBlur={() => setProfileForm({ ...profileForm, email: profileForm.email.trim() })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div className="pt-3 border-t border-[#E8E8E5]">
            <h4 className="text-xs font-semibold text-[#171717] mb-2">
              Security Credentials (Optional)
            </h4>
            <p className="text-[11px] text-[#6B6B6B] mb-3">
              Leave these fields blank if you do not want to change your password.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                  placeholder="Required only to change password"
                  className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8E5]">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] bg-[#FAFAF8] rounded-lg transition-colors border border-[#E8E8E5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? "Saving Updates..." : "Save Account Settings"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Website Content Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset all website content?"
      >
        <form onSubmit={handleResetContent} className="space-y-4">
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900 leading-relaxed space-y-1.5">
              <p className="font-semibold text-red-950">
                Warning: Irreversible Content Action
              </p>
              <p>
                This will permanently remove your current CMS-managed website content and restore the website to its default project content.
              </p>
              <p className="text-red-800 text-[11px]">
                Your admin account, authentication, database structure, and system configuration will remain intact.
              </p>
            </div>
          </div>

          {resetError && (
            <div className="p-3 bg-red-100/80 border border-red-300 text-xs text-red-800 rounded-lg font-medium">
              {resetError}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Confirm Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6B6B]">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#171717] mb-1">
              Current Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6B6B]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type="password"
                required
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Enter your admin password"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5] cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={resetConfirmed}
                onChange={(e) => setResetConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-[#E8E8E5] text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-[#171717] font-medium leading-tight">
                I understand that all CMS-managed website content will be reset.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E8E5]">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              disabled={resettingContent}
              className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] bg-[#FAFAF8] rounded-lg transition-colors border border-[#E8E8E5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                resettingContent ||
                !resetEmail.trim() ||
                !resetPassword ||
                !resetConfirmed
              }
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {resettingContent ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Resetting Content...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET WEBSITE CONTENT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ToastProvider>
  );
}
