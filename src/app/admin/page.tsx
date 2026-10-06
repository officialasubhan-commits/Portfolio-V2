"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import {
  FolderGit2,
  Zap,
  BookOpen,
  Briefcase,
  Quote,
  Layers,
  Mail,
  Image as ImageIcon,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  User,
  CheckCircle2,
  Database,
  RefreshCw,
} from "lucide-react";
import { LoadingSpinner, Badge, PageHeader } from "@/components/admin/AdminUI";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadStats = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      const res = await api.getDashboardStats();
      setStats(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" label="Querying live database metrics..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
        <div>
          <p className="font-semibold mb-1">Error Loading Dashboard Metrics</p>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => loadStats(true)}
          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const counts = stats?.counts || {};
  const recent = stats?.recent || { messages: [], projects: [], blogs: [] };

  const statCards = [
    {
      label: "Projects",
      value: counts.projects ?? 0,
      icon: FolderGit2,
      href: "/admin/projects",
      sub: "Featured case studies",
    },
    {
      label: "Skills",
      value: counts.skills ?? 0,
      icon: Zap,
      href: "/admin/skills",
      sub: "Across 6 technical domains",
    },
    {
      label: "Blogs",
      value: counts.blogs ?? 0,
      icon: BookOpen,
      href: "/admin/blogs",
      sub: "Technical articles & notes",
    },
    {
      label: "Experience",
      value: counts.experience ?? 0,
      icon: Briefcase,
      href: "/admin/experience",
      sub: "Career timeline records",
    },
    {
      label: "Services",
      value: counts.services ?? 0,
      icon: Layers,
      href: "/admin/services",
      sub: "Consulting & advisory",
    },
    {
      label: "Testimonials",
      value: counts.testimonials ?? 0,
      icon: Quote,
      href: "/admin/testimonials",
      sub: "Endorsements & reviews",
    },
    {
      label: "Messages",
      value: counts.messages ?? 0,
      icon: Mail,
      href: "/admin/messages",
      sub: (counts.unreadMessages || 0) > 0 ? `${counts.unreadMessages} unread inquiries` : "All read",
      highlight: (counts.unreadMessages || 0) > 0,
    },
    {
      label: "Media Library",
      value: counts.media ?? 0,
      icon: ImageIcon,
      href: "/admin/media",
      sub: "Uploaded images & assets",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Standardized Page Header */}
      <PageHeader
        title="System Overview"
        description="Real-time operational dashboard, live database metrics, and quick publishing shortcuts."
        breadcrumbs={["Admin", "Dashboard"]}
        action={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => loadStats(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] bg-[#FFFFFF] border border-[#E8E8E5] rounded-lg transition-colors shadow-sm disabled:opacity-50"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#C47A52]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#171717] bg-[#FFFFFF] border border-[#E8E8E5] hover:border-[#C47A52] rounded-lg transition-colors shadow-sm"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B6B6B]" />
            </Link>
            <Link
              href="/admin/projects"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Link>
          </div>
        }
      />

      {/* Welcome & System Status Banner */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-6 lg:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#C47A52]/10 text-[#C47A52] border border-[#C47A52]/20">
                <Sparkles className="w-3 h-3 text-[#C47A52]" />
                Production Engine Active
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8C9A86]/10 text-[#8C9A86] border border-[#8C9A86]/20">
                <Database className="w-3 h-3" />
                Dual Storage Synced
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#171717]">
              Welcome back, Arjun Mehta
            </h2>
            <p className="text-xs text-[#6B6B6B] max-w-2xl leading-relaxed">
              All portfolio content below is served via live REST endpoints. Modifications performed in this CMS immediately synchronize across the persistent database and reflect instantaneously on your public portfolio.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 shrink-0">
            <Link
              href="/admin/about"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#171717] bg-[#FAFAF8] border border-[#E8E8E5] hover:border-[#C47A52] hover:text-[#C47A52] rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit About & Email</span>
            </Link>
            <Link
              href="/admin/blogs"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#171717] bg-[#FAFAF8] border border-[#E8E8E5] hover:border-[#C47A52] hover:text-[#C47A52] rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Write Blog</span>
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#171717] bg-[#FAFAF8] border border-[#E8E8E5] hover:border-[#C47A52] hover:text-[#C47A52] rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Messages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Statistics Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
            Portfolio Metrics & Asset Counts
          </h3>
          <span className="text-[11px] text-[#6B6B6B]">Auto-refreshed live from database</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8E8E5] hover:border-[#C47A52]/50 hover:shadow-sm transition-all duration-200 group h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#6B6B6B] group-hover:text-[#171717] transition-colors">
                  {card.label}
                </span>
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    card.highlight
                      ? "bg-[#C47A52]/10 text-[#C47A52]"
                      : "bg-[#FAFAF8] text-[#6B6B6B] group-hover:text-[#C47A52] group-hover:bg-[#C47A52]/10"
                  }`}
                >
                  <card.icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold font-serif text-[#171717] mb-1">
                  {card.value}
                </div>
                <div className="text-[11px] text-[#6B6B6B] flex items-center justify-between gap-1">
                  <span className="truncate">{card.sub}</span>
                  <ArrowRight className="w-3 h-3 text-[#6B6B6B]/40 group-hover:text-[#C47A52] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Content Activity: Inquiries & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E5] mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C47A52]" />
                <h3 className="text-sm font-semibold text-[#171717]">Recent Inquiries</h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-medium text-[#C47A52] hover:underline flex items-center gap-1"
              >
                <span>View all messages</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {(recent?.messages || []).length === 0 ? (
              <p className="text-xs text-[#6B6B6B] py-8 text-center">
                No inquiries received yet. New contact messages will appear here immediately.
              </p>
            ) : (
              <div className="space-y-3">
                {(recent?.messages || []).slice(0, 4).map((msg: any) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    className="p-3.5 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]/70 hover:border-[#C47A52]/40 transition-colors block"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#171717] truncate max-w-[200px]">
                        {msg.name}
                      </span>
                      <Badge variant={msg.status === "UNREAD" ? "accent" : "default"}>
                        {msg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6B6B6B] line-clamp-1 mb-1.5">
                      {msg.subject || msg.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#6B6B6B]/80 font-mono">
                      <span>{msg.email}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E8E8E5] flex justify-between items-center text-xs text-[#6B6B6B]">
            <span>{counts.unreadMessages || 0} unread message{(counts.unreadMessages || 0) === 1 ? "" : "s"}</span>
            <Link href="/admin/messages" className="text-[#C47A52] hover:underline font-medium">
              Manage inquiries →
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E5] mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#C47A52]" />
                <h3 className="text-sm font-semibold text-[#171717]">Portfolio Projects</h3>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs font-medium text-[#C47A52] hover:underline flex items-center gap-1"
              >
                <span>View all projects</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {(recent?.projects || []).length === 0 ? (
              <p className="text-xs text-[#6B6B6B] py-8 text-center">
                No projects published yet. Click &quot;New Project&quot; to publish your first case study.
              </p>
            ) : (
              <div className="space-y-3">
                {(recent?.projects || []).slice(0, 4).map((proj: any) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]/70 flex items-center justify-between hover:border-[#C47A52]/40 transition-colors"
                  >
                    <div className="truncate mr-3">
                      <h4 className="text-xs font-semibold text-[#171717] truncate">{proj.title}</h4>
                      <span className="text-[11px] text-[#6B6B6B]">
                        {proj.category} · {proj.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {proj.featured && <Badge variant="accent">Featured</Badge>}
                      <Link
                        href="/admin/projects"
                        className="p-1.5 text-[#6B6B6B] hover:text-[#C47A52] hover:bg-white rounded transition-colors"
                        title="Edit project"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E8E8E5] flex justify-between items-center text-xs text-[#6B6B6B]">
            <span>{counts.projects || 0} total case studies live</span>
            <Link href="/admin/projects" className="text-[#C47A52] hover:underline font-medium">
              Create case study →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
