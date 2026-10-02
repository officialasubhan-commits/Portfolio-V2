"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, Badge, EmptyState, Modal, ConfirmDialog } from "@/components/admin/AdminUI";
import { Plus, Edit2, Trash2, Zap, Search } from "lucide-react";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Machine Learning",
    proficiency: 90,
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const categories = [
    "Machine Learning",
    "Deep Learning",
    "MLOps & Infrastructure",
    "Languages",
    "Cloud & DevOps",
    "Frontend",
  ];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.getSkills();
      setSkills(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: categories[0],
      proficiency: 90,
      displayOrder: (skills.length || 0) + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill: any) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      displayOrder: skill.displayOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSkill) {
        await api.updateSkill(editingSkill.id, formData);
        addToast(`Skill '${formData.name}' updated successfully.`);
      } else {
        await api.createSkill(formData);
        addToast(`Skill '${formData.name}' created successfully.`);
      }
      setModalOpen(false);
      fetchSkills();
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
      await api.deleteSkill(deleteId);
      addToast("Skill deleted successfully.");
      setDeleteId(null);
      fetchSkills();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCategory =
      selectedCategory === "ALL" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#171717]">Skills & Expertise</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Manage technical proficiencies, frameworks, and display order across all 6 categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E8E5] flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "ALL"
                ? "bg-[#C47A52] text-white"
                : "bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#171717]"
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#C47A52] text-white"
                  : "bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table */}
      {loading ? (
        <LoadingSpinner size="lg" label="Loading skills from database..." />
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No skills found"
          description="No skills match your filter criteria. Add a skill to get started."
          action={
            <button
              onClick={openCreateModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C47A52] rounded-lg"
            >
              Add First Skill
            </button>
          }
        />
      ) : (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Proficiency</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5] text-xs">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-[#FAFAF8]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#171717]">{skill.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant="sage">{skill.category}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[#FAFAF8] rounded-full h-1.5 border border-[#E8E8E5] overflow-hidden">
                        <div
                          className="bg-[#C47A52] h-full rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="text-[#6B6B6B] font-mono text-[11px]">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#6B6B6B] font-mono">
                    {skill.displayOrder}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1 text-[#6B6B6B] hover:text-[#C47A52] transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(skill.id)}
                        className="p-1 text-[#6B6B6B] hover:text-red-600 transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? `Edit Skill: ${editingSkill.name}` : "Create New Skill"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Skill Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. PyTorch, Kubernetes, TypeScript"
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                Proficiency % (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.proficiency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proficiency: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E8E5] flex items-center justify-end gap-3">
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
              {saving ? "Saving..." : editingSkill ? "Update Skill" : "Create Skill"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? It will be removed from your public portfolio."
      />
    </div>
  );
}
