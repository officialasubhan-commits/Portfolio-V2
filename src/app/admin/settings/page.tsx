"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  Mail,
  MapPin,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { api } from "@/services/api";
import { useToast } from "@/components/admin/AdminUI";

export default function SiteSettingsPage() {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    location: "",
    github: "",
    linkedin: "",
    resumeUrl: "",
    websiteTitle: "",
    metaDescription: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.getAbout()
      .then((res) => {
        if (res.data) {
          setAbout(res.data);
          setForm({
            name: res.data.name || "",
            title: res.data.title || "",
            email: res.data.email || "",
            location: res.data.location || "",
            github: res.data.github || "",
            linkedin: res.data.linkedin || "",
            resumeUrl: res.data.resumeUrl || "/resume.pdf",
            websiteTitle: res.data.websiteTitle || `${res.data.name || "Portfolio"} | ${res.data.title || "Portfolio Website"}`,
            metaDescription: res.data.metaDescription || (res.data.bio ? res.data.bio.slice(0, 160) : ""),
          });
        }
      })
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.updateAbout({
        ...(about || {}),
        ...form,
      });

      setSuccess("Site settings and global configuration saved successfully!");
      addToast("Global portfolio configuration has been updated.", "success");
    } catch (err: any) {
      setError(err.message || "Failed to save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#888888] font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#C47A52]/30 border-t-[#C47A52] rounded-full animate-spin mx-auto mb-3" />
        <span>Loading global site settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626]">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#C47A52]" />
          <h2 className="text-lg font-serif text-white">Global Site & SEO Settings</h2>
        </div>
        <p className="text-xs text-[#888888] mt-1">
          Configure site identity, metadata, primary contact channels, and social links for this customer deployment.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Site Identity & SEO */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
            <Globe className="w-4 h-4" />
            <span>Site Identity & SEO</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Website Meta Title
              </label>
              <input
                type="text"
                required
                value={form.websiteTitle}
                onChange={(e) => setForm({ ...form, websiteTitle: e.target.value })}
                placeholder="e.g. Alex Morgan | AI Engineer & Architect"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Resume Download Link / URL
              </label>
              <input
                type="text"
                value={form.resumeUrl}
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                placeholder="/resume.pdf or https://..."
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
              Meta Description (Search Engines)
            </label>
            <textarea
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              placeholder="Search engine summary describing this portfolio and its capabilities..."
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Contact Channels */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
            <Mail className="w-4 h-4" />
            <span>Primary Contact & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Public Inquiries Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@example.com"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Location / Base
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. San Francisco, CA & Remote"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social & Professional Links */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
            <Share2 className="w-4 h-4" />
            <span>Social & Professional Profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C47A52]/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <span>Saving Settings...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Global Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
