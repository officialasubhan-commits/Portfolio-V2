"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner } from "@/components/admin/AdminUI";
import { Save, Plus, Trash2 } from "lucide-react";

export default function AdminAboutPage() {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await api.getAbout();
      if (res.data) {
        setFormData(res.data);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to load about details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleStatChange = (index: number, field: string, val: any) => {
    const updated = [...(formData.stats || [])];
    updated[index] = { ...updated[index], [field]: val };
    handleChange("stats", updated);
  };

  const addStat = () => {
    const updated = [
      ...(formData.stats || []),
      { value: 10, suffix: "+", label: "New Metric" },
    ];
    handleChange("stats", updated);
  };

  const removeStat = (index: number) => {
    const updated = (formData.stats || []).filter((_: any, i: number) => i !== index);
    handleChange("stats", updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateAbout(formData);
      setFormData(res.data);
      addToast("About details successfully saved to database.", "success");
    } catch (err: any) {
      addToast(err.message || "Failed to update about details.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="Loading About configuration..." />;
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#171717]">About Information</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Configure your professional biography, core philosophy, and portfolio metrics.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8E8E5] shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#171717] border-b border-[#E8E8E5] pb-3">
            Primary Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Professional Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Hero Headline</label>
              <input
                type="text"
                value={formData.headline || ""}
                onChange={(e) => handleChange("headline", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Detailed Bio</label>
            <textarea
              rows={4}
              value={formData.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] leading-relaxed"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8E8E5] shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#171717] border-b border-[#E8E8E5] pb-3">
            Contact & Social Profiles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Public Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github || ""}
                onChange={(e) => handleChange("github", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin || ""}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8E8E5] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <h3 className="text-sm font-semibold text-[#171717]">Portfolio Statistics</h3>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1 text-xs text-[#C47A52] hover:underline font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(formData.stats || []).map((stat: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg flex items-center gap-3"
              >
                <div className="w-16">
                  <label className="block text-[10px] text-[#6B6B6B]">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(i, "value", parseInt(e.target.value, 10))
                    }
                    className="w-full p-1 text-xs bg-[#FFFFFF] border border-[#E8E8E5] rounded text-[#171717]"
                  />
                </div>
                <div className="w-12">
                  <label className="block text-[10px] text-[#6B6B6B]">Suffix</label>
                  <input
                    type="text"
                    value={stat.suffix || ""}
                    onChange={(e) => handleStatChange(i, "suffix", e.target.value)}
                    className="w-full p-1 text-xs bg-[#FFFFFF] border border-[#E8E8E5] rounded text-[#171717] text-center"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-[#6B6B6B]">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(i, "label", e.target.value)}
                    className="w-full p-1 text-xs bg-[#FFFFFF] border border-[#E8E8E5] rounded text-[#171717]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="p-1.5 text-[#6B6B6B] hover:text-red-600 self-end mb-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
