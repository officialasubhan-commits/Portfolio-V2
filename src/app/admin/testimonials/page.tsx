"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, Badge, EmptyState, Modal, ConfirmDialog, PageHeader } from "@/components/admin/AdminUI";
import { Plus, Edit2, Trash2, Quote } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    organization: "",
    testimonial: "",
    avatarImage: "",
    displayOrder: 0,
    published: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.getTestimonials();
      setTestimonials(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      role: "",
      organization: "",
      testimonial: "",
      avatarImage: "",
      displayOrder: (testimonials.length || 0) + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      organization: item.organization,
      testimonial: item.testimonial,
      avatarImage: item.avatarImage || "",
      displayOrder: item.displayOrder || 0,
      published: item.published ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.updateTestimonial(editingItem.id, formData);
        addToast(`Testimonial from '${formData.name}' updated.`);
      } else {
        await api.createTestimonial(formData);
        addToast(`Testimonial from '${formData.name}' added.`);
      }
      setModalOpen(false);
      fetchTestimonials();
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
      await api.deleteTestimonial(deleteId);
      addToast("Testimonial deleted successfully.");
      setDeleteId(null);
      fetchTestimonials();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client & Peer Testimonials"
        description="Manage endorsements from engineering leaders, colleagues, and collaborators."
        breadcrumbs={["Admin", "Content", "Testimonials"]}
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" label="Loading testimonials..." />
      ) : testimonials.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add endorsements from engineering colleagues and clients."
          action={
            <button
              onClick={openCreateModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C47A52] rounded-lg"
            >
              Add Testimonial
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-5 flex flex-col justify-between hover:border-[#C47A52]/40 transition-all hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#171717]">{item.name}</h3>
                    <p className="text-xs text-[#6B6B6B]">
                      {item.role},{" "}
                      <span className="font-medium text-[#C47A52]">
                        {item.organization}
                      </span>
                    </p>
                  </div>
                  <Badge variant={item.published ? "success" : "default"}>
                    {item.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <p className="text-xs text-[#6B6B6B] italic leading-relaxed mb-4 border-l-2 border-[#C47A52]/40 pl-3">
                  "{item.testimonial}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#6B6B6B]">Order: {item.displayOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1 text-[#6B6B6B] hover:text-[#C47A52]"
                    title="Edit Testimonial"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1 text-[#6B6B6B] hover:text-red-600"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit Testimonial: ${editingItem.name}` : "Add Testimonial"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Author Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Research Director, VP Engineering"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Organization *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="DeepMind, Synthetix"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Testimonial Quote *</label>
            <textarea
              rows={4}
              required
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-[#E8E8E5] text-[#C47A52] focus:ring-[#C47A52]"
              />
              <span className="font-medium">Published</span>
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
                {saving ? "Saving..." : editingItem ? "Update Testimonial" : "Create Testimonial"}
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial endorsement?"
      />
    </div>
  );
}
