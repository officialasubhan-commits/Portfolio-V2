"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, Badge, EmptyState, Modal, ConfirmDialog } from "@/components/admin/AdminUI";
import { Plus, Edit2, Trash2, Briefcase, Calendar, MapPin } from "lucide-react";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "2026 — Present",
    location: "Bengaluru, India",
    description: "",
    achievements: "",
    technologies: "",
    current: false,
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const res = await api.getExperience();
      setExperiences(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load experience entries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      role: "",
      company: "",
      period: "2026 — Present",
      location: "Bengaluru, India",
      description: "",
      achievements: "Shipped enterprise feature\nReduced infrastructure latency by 40%",
      technologies: "Python, PyTorch, Kubernetes",
      current: false,
      displayOrder: (experiences.length || 0) + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: Array.isArray(exp.achievements)
        ? exp.achievements.join("\n")
        : exp.achievements || "",
      technologies: Array.isArray(exp.technologies)
        ? exp.technologies.join(", ")
        : exp.technologies || "",
      current: exp.current || false,
      displayOrder: exp.displayOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        achievements: formData.achievements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        technologies: formData.technologies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingExp) {
        await api.updateExperience(editingExp.id, payload);
        addToast(`Experience at '${formData.company}' updated successfully.`);
      } else {
        await api.createExperience(payload);
        addToast(`Experience at '${formData.company}' created successfully.`);
      }
      setModalOpen(false);
      fetchExperience();
    } catch (err: any) {
      addToast(err.message || "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteExperience(deleteId);
      addToast("Experience entry deleted successfully.");
      setDeleteId(null);
      fetchExperience();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#171717]">Career & Experience</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Document professional roles, research tenures, key achievements, and technologies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" label="Loading career history..." />
      ) : experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience records"
          description="Add your first company or research role."
          action={
            <button
              onClick={openCreateModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C47A52] rounded-lg"
            >
              Add Entry
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-5 hover:border-[#C47A52]/40 transition-all hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-[#171717]">{exp.role}</h3>
                    <span className="text-[#6B6B6B] text-xs">@</span>
                    <span className="text-sm font-serif font-bold text-[#C47A52]">{exp.company}</span>
                    {exp.current && <Badge variant="accent">Current Role</Badge>}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 text-[#6B6B6B] hover:text-[#C47A52] transition-colors rounded hover:bg-[#FAFAF8]"
                    title="Edit Entry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(exp.id)}
                    className="p-1.5 text-[#6B6B6B] hover:text-red-600 transition-colors rounded hover:bg-[#FAFAF8]"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#6B6B6B] leading-relaxed mb-3">{exp.description}</p>

              {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-xs text-[#6B6B6B]/90 space-y-1 mb-3 pl-1">
                  {exp.achievements.map((ach: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">
                      {ach}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-1 pt-2 border-t border-[#E8E8E5]">
                {(Array.isArray(exp.technologies) ? exp.technologies : []).map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAFAF8] border border-[#E8E8E5] text-[#6B6B6B]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExp ? `Edit Role: ${editingExp.role}` : "Add Experience Entry"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Company / Org *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Google DeepMind, Microsoft"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Senior Research Engineer"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Period *</label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="2025 — Present"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Bengaluru, India"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              Key Achievements (one per line)
            </label>
            <textarea
              rows={4}
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="Python, JAX, TPU, PyTorch"
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                className="rounded border-[#E8E8E5] text-[#C47A52] focus:ring-[#C47A52]"
              />
              <span className="font-medium">Current Position</span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] rounded-lg border border-[#E8E8E5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editingExp ? "Update Entry" : "Create Entry"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Experience Record"
        message="Are you sure you want to delete this career experience entry?"
      />
    </div>
  );
}
