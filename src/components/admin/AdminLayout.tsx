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
} from "lucide-react";
import { api, getAccessToken, clearTokens } from "@/services/api";
import { ToastProvider, LoadingSpinner } from "./AdminUI";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "About", href: "/admin/about", icon: User },
  { name: "Skills", href: "/admin/skills", icon: Zap },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { name: "Services", href: "/admin/services", icon: Layers },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Messages", href: "/admin/messages", icon: Mail },
];

const pageTitles: Record<string, string> = {
  "/admin": "System Overview",
  "/admin/about": "About & Bio Configuration",
  "/admin/skills": "Skills & Expertise Management",
  "/admin/projects": "Projects Portfolio",
  "/admin/blogs": "Blog & Editorial Articles",
  "/admin/experience": "Career & Experience History",
  "/admin/testimonials": "Client & Colleague Testimonials",
  "/admin/services": "Consulting & Engineering Services",
  "/admin/media": "Media Assets Library",
  "/admin/messages": "Contact Form Inquiries",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // If on login page, render children without sidebar/header layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await api.getMe();
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        clearTokens();
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    api.logout();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
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
    <ToastProvider>
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
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#C47A52]/10 text-[#C47A52] font-semibold"
                      : "text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF8]"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Link to Public Site */}
          <div className="p-4 border-t border-[#E8E8E5]">
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
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-medium text-[#171717] block">
                    {user?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-[#6B6B6B] block">
                    {user?.email || "admin@mehta.dev"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B6B6B] hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
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
      </div>
    </ToastProvider>
  );
}
