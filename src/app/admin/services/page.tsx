"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, Badge, EmptyState, Modal, ConfirmDialog, PageHeader } from "@/components/admin/AdminUI";
import { Plus, Edit2, Trash2, Layers, CheckCircle2 } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    features: "",
    displayOrder: 0,
    published: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.getServices();
      setServices(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      serviceName: "",
      description: "",
      features: "Feature item 1\nFeature item 2\nFeature item 3",
      displayOrder: (services.length || 0) + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (svc: any) => {
    setEditingService(svc);
    setFormData({
      serviceName: svc.serviceName,
      description: svc.description,
      features: Array.isArray(svc.features)
        ? svc.features.join("\n")
        : svc.features || "",
      displayOrder: svc.displayOrder || 0,
      published: svc.published ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        features: formData.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingService) {
        await api.updateService(editingService.id, payload);
        addToast(`Service '${formData.serviceName}' updated.`);
      } else {
        await api.createService(payload);
        addToast(`Service '${formData.serviceName}' added.`);
      }
      setModalOpen(false);
      fetchServices();
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
      await api.deleteService(deleteId);
      addToast("Service deleted successfully.");
      setDeleteId(null);
      fetchServices();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consulting & Technical Services"
        description="Manage advisory capabilities, ML architecture consulting, and technical delivery scopes."
        breadcrumbs={["Admin", "Content", "Services"]}
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" label="Loading services..." />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No services configured"
          description="Add advisory or development services to showcase."
          action={
            <button
              onClick={openCreateModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C47A52] rounded-lg"
            >
              Add Service
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-5 flex flex-col justify-between hover:border-[#C47A52]/40 transition-all hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-[#171717]">{svc.serviceName}</h3>
                  <Badge variant={svc.published ? "success" : "default"}>
                    {svc.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">{svc.description}</p>

                {/* Features list */}
                {Array.isArray(svc.features) && svc.features.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    {svc.features.map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C9A86] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#6B6B6B]">Order: {svc.displayOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(svc)}
                    className="p-1 text-[#6B6B6B] hover:text-[#C47A52]"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(svc.id)}
                    className="p-1 text-[#6B6B6B] hover:text-red-600"
                    title="Delete Service"
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
        title={editingService ? `Edit Service: ${editingService.serviceName}` : "Add Service"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Service Name *</label>
            <input
              type="text"
              required
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              placeholder="e.g. Production Model Distillation & Optimization"
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              Included Features (one per line)
            </label>
            <textarea
              rows={4}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Domain-specific fine-tuning&#10;Inference quantization&#10;Latency benchmarking"
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
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
                {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
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
        title="Delete Service"
        message="Are you sure you want to delete this consulting service offering?"
      />
    </div>
  );
}
