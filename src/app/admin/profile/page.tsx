"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  User,
  Sparkles,
} from "lucide-react";
import { api } from "@/services/api";
import { useToast } from "@/components/admin/AdminUI";

const FALLBACK_HERO_IMAGE = "/images/hero-portrait.jpg";

export default function ProfileHeroPage() {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Feedback State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getAbout();
      if (res.data) {
        setAbout(res.data);
        setName(res.data.name || "");
        setTitle(res.data.title || "");
        setHeadline(res.data.headline || "");
        setBio(res.data.bio || "");
        setAvatarUrl(res.data.avatarUrl || "");
        setPreviewUrl(res.data.avatarUrl || FALLBACK_HERO_IMAGE);
      }
    } catch (err: any) {
      setError("Failed to load profile configuration from API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please upload a JPEG, PNG, WebP, GIF, or SVG image.");
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image file is too large. Maximum allowed size is 10MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadAndSaveImage = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    setError("");

    try {
      const uploadRes = await api.uploadImage(selectedFile);
      const uploadedUrl = uploadRes.data?.url;

      if (!uploadedUrl) {
        throw new Error("File upload succeeded but no URL was returned.");
      }

      setAvatarUrl(uploadedUrl);
      setPreviewUrl(uploadedUrl);
      setSelectedFile(null);

      // Auto-save to about profile
      await api.updateAbout({
        ...(about || {}),
        name,
        title,
        headline,
        bio,
        avatarUrl: uploadedUrl,
      });

      setSuccess("Profile image uploaded and applied to homepage successfully!");
      addToast("New profile image is now live on the homepage.", "success");
    } catch (err: any) {
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    setError("");
    setSuccess("");

    if (confirm("Remove custom profile image and restore the default starter image?")) {
      setAvatarUrl("");
      setPreviewUrl(FALLBACK_HERO_IMAGE);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      try {
        await api.updateAbout({
          ...(about || {}),
          name,
          title,
          headline,
          bio,
          avatarUrl: "",
        });

        setSuccess("Profile image reverted to starter default.");
        addToast("Profile image reverted to default starter graphic.", "info");
      } catch (err: any) {
        setError("Failed to update profile settings.");
      }
    }
  };

  const handleSaveTextDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      let finalAvatar = avatarUrl;

      // If a file was selected but not uploaded yet, upload it first
      if (selectedFile) {
        const uploadRes = await api.uploadImage(selectedFile);
        finalAvatar = uploadRes.data?.url || avatarUrl;
        setAvatarUrl(finalAvatar);
        setSelectedFile(null);
      }

      await api.updateAbout({
        ...(about || {}),
        name,
        title,
        headline,
        bio,
        avatarUrl: finalAvatar,
      });

      setSuccess("Profile and hero content saved successfully!");
      addToast("Homepage hero and profile details have been updated.", "success");
    } catch (err: any) {
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#888888] font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#C47A52]/30 border-t-[#C47A52] rounded-full animate-spin mx-auto mb-3" />
        <span>Loading Profile & Hero configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#C47A52]" />
          <h2 className="text-lg font-serif text-white">Profile & Hero Image Management</h2>
        </div>
        <p className="text-xs text-[#888888] mt-1">
          Customize the hero section displayed prominently on the homepage, including the hero portrait, name, and headline.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
                Homepage Hero Image
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                {avatarUrl ? "Custom Image Live" : "Default Starter Image"}
              </span>
            </div>

            {/* Preview Frame */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#333333] shadow-xl group">
              <img
                src={previewUrl || FALLBACK_HERO_IMAGE}
                alt="Profile Hero Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_HERO_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-[11px] text-[#CCCCCC] font-mono flex items-center justify-between">
                <span>Aspect: 3:4 Portrait</span>
                <span>{selectedFile ? "Pending Save" : "Active"}</span>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#333333] text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#C47A52]" />
                <span>{selectedFile ? "Choose Different Image" : "Upload New Image"}</span>
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUploadAndSaveImage}
                  disabled={uploadingImage}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#C47A52]/20 disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Upload & Apply Now</span>
                    </>
                  )}
                </button>
              )}

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="w-full py-2 px-4 rounded-xl hover:bg-red-950/30 border border-transparent hover:border-red-800/40 text-xs font-medium text-red-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Image</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-[#666666] leading-relaxed">
              Recommended: High-resolution vertical portrait (JPG, PNG, or WebP), minimum 800&times;1060px. Max size 10MB.
            </p>
          </div>
        </div>

        {/* Right Column: Hero Headline & Info */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSaveTextDetails} className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
                Hero Text & Identity
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                Syncs with Homepage
              </span>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Portfolio Owner Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
              <p className="text-[11px] text-[#666666] mt-1">
                Appears in the signature, navbar brand, and hero banner.
              </p>
            </div>

            {/* Professional Title */}
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Professional Title & Role
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Architect & AI Systems Engineer"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
              <p className="text-[11px] text-[#666666] mt-1">
                Displays directly above the hero title and in search engine metadata.
              </p>
            </div>

            {/* Hero Headline */}
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Hero Headline / Tagline
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Engineering Scalable Intelligence for Modern Systems"
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
              />
            </div>

            {/* Hero Bio / Statement */}
            <div>
              <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                Hero Introduction Statement
              </label>
              <textarea
                rows={4}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short introductory statement displayed in the hero section..."
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C47A52]/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer pt-3"
            >
              {saving ? (
                <span>Saving Profile Configuration...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile & Hero Configuration</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
