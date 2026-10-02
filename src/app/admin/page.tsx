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
} from "lucide-react";
import { LoadingSpinner, Badge } from "@/components/admin/AdminUI";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      setStats(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
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
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
        Error loading metrics: {error}
      </div>
    );
  }

  const { counts, recent } = stats;

  const statCards = [
    {
      label: "Projects",
      value: counts.projects,
      icon: FolderGit2,
      href: "/admin/projects",
      sub: "Featured enterprise case studies",
    },
    {
      label: "Skills",
      value: counts.skills,
      icon: Zap,
      href: "/admin/skills",
      sub: "Organized across 6 categories",
    },
    {
      label: "Blogs",
      value: counts.blogs,
      icon: BookOpen,
      href: "/admin/blogs",
      sub: "Published & draft articles",
    },
    {
      label: "Experience",
      value: counts.experience,
      icon: Briefcase,
      href: "/admin/experience",
      sub: "Career timeline records",
    },
    {
      label: "Testimonials",
      value: counts.testimonials,
      icon: Quote,
      href: "/admin/testimonials",
      sub: "Recommendations from leaders",
    },
    {
      label: "Services",
      value: counts.services,
      icon: Layers,
      href: "/admin/services",
      sub: "Consulting & advisory items",
    },
    {
      label: "Messages",
      value: counts.messages,
      icon: Mail,
      href: "/admin/messages",
      sub: counts.unreadMessages > 0 ? `${counts.unreadMessages} unread` : "All read",
      highlight: counts.unreadMessages > 0,
    },
    {
      label: "Media Assets",
      value: counts.media,
      icon: ImageIcon,
      href: "/admin/media",
      sub: "Images & documents",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E8E5] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#C47A52]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C47A52]">
              Live Production Content
            </span>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-[#171717]">
            Welcome back, Arjun
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-1 max-w-xl leading-relaxed">
            All system statistics below are queried directly from your persistent database. Changes made in this CMS immediately reflect across the public portfolio via the REST API.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#171717] bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg hover:border-[#C47A52] transition-colors"
          >
            <span>Visit Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#6B6B6B]" />
          </Link>
          <Link
            href="/admin/projects"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8E8E5] hover:border-[#C47A52]/40 transition-all hover:shadow-sm group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#6B6B6B]">{card.label}</span>
              <div
                className={`p-2 rounded-lg ${
                  card.highlight
                    ? "bg-[#C47A52]/10 text-[#C47A52]"
                    : "bg-[#FAFAF8] text-[#6B6B6B] group-hover:text-[#C47A52]"
                } transition-colors`}
              >
                <card.icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold font-serif text-[#171717] mb-1">
                {card.value}
              </div>
              <div className="text-[11px] text-[#6B6B6B] truncate flex items-center justify-between">
                <span>{card.sub}</span>
                <ArrowRight className="w-3 h-3 text-[#6B6B6B]/40 group-hover:text-[#C47A52] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Content Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E5] mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C47A52]" />
              <h3 className="text-sm font-semibold text-[#171717]">Recent Messages</h3>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-medium text-[#C47A52] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recent.messages.length === 0 ? (
            <p className="text-xs text-[#6B6B6B] py-6 text-center">No inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.messages.map((msg: any) => (
                <Link
                  key={msg.id}
                  href="/admin/messages"
                  className="p-3.5 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]/60 hover:border-[#C47A52]/40 transition-colors block"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#171717] truncate max-w-[200px]">
                      {msg.name}
                    </span>
                    <Badge variant={msg.status === "UNREAD" ? "accent" : "default"}>
                      {msg.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6B6B6B] line-clamp-1 mb-1">
                    {msg.subject || msg.message}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-[#6B6B6B]/80">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E5] mb-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#C47A52]" />
              <h3 className="text-sm font-semibold text-[#171717]">Recent Projects</h3>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-medium text-[#C47A52] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recent.projects.map((proj: any) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5]/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-[#171717]">{proj.title}</h4>
                  <span className="text-[11px] text-[#6B6B6B]">
                    {proj.category} · {proj.year}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {proj.featured && <Badge variant="accent">Featured</Badge>}
                  <Link
                    href="/admin/projects"
                    className="p-1 text-[#6B6B6B] hover:text-[#C47A52] transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
