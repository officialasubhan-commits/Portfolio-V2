"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "@/services/api";
import {
  useToast,
  LoadingSpinner,
  Badge,
  EmptyState,
  Modal,
  ConfirmDialog,
  PageHeader,
} from "@/components/admin/AdminUI";
import {
  Plus,
  Edit2,
  Trash2,
  FolderGit2,
  Search,
  ExternalLink,
  Star,
  LayoutGrid,
  List,
  Code2,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    category: "Machine Learning",
    year: "2026",
    description: "",
    longDescription: "",
    technologies: "",
    mainImage: "/images/project-ai-dashboard.jpg",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects();
      setProjects(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      category: "Machine Learning",
      year: new Date().getFullYear().toString(),
      description: "",
      longDescription: "",
      technologies: "Python, PyTorch, Kubernetes",
      mainImage: "/images/project-ai-dashboard.jpg",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      displayOrder: (projects.length || 0) + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (proj: any) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      subtitle: proj.subtitle || "",
      category: proj.category,
      year: proj.year,
      description: proj.description,
      longDescription: proj.longDescription || "",
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.join(", ")
        : proj.technologies || "",
      mainImage: proj.mainImage,
      githubUrl: proj.githubUrl || "",
      liveUrl: proj.liveUrl || "",
      featured: proj.featured || false,
      displayOrder: proj.displayOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
        addToast(`Project '${formData.title}' updated successfully.`);
      } else {
        await api.createProject(payload);
        addToast(`Project '${formData.title}' created successfully.`);
      }
      setModalOpen(false);
      fetchProjects();
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
      await api.deleteProject(deleteId);
      addToast("Project deleted successfully.");
      setDeleteId(null);
      fetchProjects();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const categories = ["ALL", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects Portfolio"
        description="Manage enterprise AI/ML case studies, architecture details, and live demonstrations."
        breadcrumbs={["Admin", "Content", "Projects"]}
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        }
      />

      {/* Controls Bar: Search + Category Pills + View Mode */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E8E5] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search projects by title, category, slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-[#6B6B6B]">
              Showing <strong className="text-[#171717]">{filteredProjects.length}</strong> of {projects.length}
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#E8E8E5] rounded-lg p-0.5 bg-[#FAFAF8]">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-[#FFFFFF] text-[#C47A52] shadow-xs"
                    : "text-[#6B6B6B] hover:text-[#171717]"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#FFFFFF] text-[#C47A52] shadow-xs"
                    : "text-[#6B6B6B] hover:text-[#171717]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E8E8E5]/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-[#C47A52] text-white"
                  : "bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#171717] border border-[#E8E8E5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Content */}
      {loading ? (
        <LoadingSpinner size="lg" label="Loading projects from database..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects found"
          description="Create your first project case study to showcase on the portfolio."
          action={
            <button
              onClick={openCreateModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg"
            >
              Add Project
            </button>
          }
        />
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] border-b border-[#E8E8E5] text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Technologies</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#FAFAF8]/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-[#FAFAF8] border border-[#E8E8E5]">
                          <Image
                            src={proj.mainImage || "/images/project-ai-platform.jpg"}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#171717] hover:text-[#C47A52] transition-colors flex items-center gap-2">
                            <span>{proj.title}</span>
                            {proj.featured && (
                              <Star className="w-3 h-3 fill-[#C47A52] text-[#C47A52]" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#6B6B6B] font-mono">
                            /{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="accent">{proj.category}</Badge>
                      <span className="text-[11px] text-[#6B6B6B] block mt-0.5">{proj.year}</span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(proj.technologies) ? proj.technologies : []).slice(0, 3).map((t: string) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FAFAF8] border border-[#E8E8E5] text-[#6B6B6B]"
                          >
                            {t}
                          </span>
                        ))}
                        {Array.isArray(proj.technologies) && proj.technologies.length > 3 && (
                          <span className="px-1 py-0.5 text-[10px] text-[#6B6B6B]">
                            +{proj.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {proj.featured ? (
                        <Badge variant="accent">Featured</Badge>
                      ) : (
                        <Badge variant="default">Standard</Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-[#6B6B6B]">
                      {proj.displayOrder ?? 0}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md text-[#6B6B6B] hover:text-[#C47A52] hover:bg-[#FAFAF8] transition-colors"
                            title="Open Live Demonstration"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF8] transition-colors"
                            title="View GitHub Repository"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-md text-[#6B6B6B] hover:text-[#C47A52] hover:bg-[#FAFAF8] transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(proj.id)}
                          className="p-1.5 rounded-md text-[#6B6B6B] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Project"
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
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] p-5 flex flex-col justify-between hover:border-[#C47A52]/40 transition-all hover:shadow-xs group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-medium text-[#C47A52] uppercase tracking-wider block">
                      {proj.category} · {proj.year}
                    </span>
                    <h3 className="text-base font-semibold text-[#171717] group-hover:text-[#C47A52] transition-colors">
                      {proj.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {proj.featured && (
                      <Badge variant="accent" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C47A52] text-[#C47A52]" />
                        <span>Featured</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#6B6B6B] line-clamp-2 mb-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(Array.isArray(proj.technologies) ? proj.technologies : []).slice(0, 5).map((t: string) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAFAF8] border border-[#E8E8E5] text-[#6B6B6B]"
                    >
                      {t}
                    </span>
                  ))}
                  {Array.isArray(proj.technologies) && proj.technologies.length > 5 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-[#6B6B6B]">
                      +{proj.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#6B6B6B] font-mono">/{proj.slug}</span>

                <div className="flex items-center gap-2">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-[#6B6B6B] hover:text-[#C47A52]"
                      title="Open Live URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-[#6B6B6B] hover:text-[#171717]"
                      title="GitHub"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1 text-[#6B6B6B] hover:text-[#C47A52]"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(proj.id)}
                    className="p-1 text-[#6B6B6B] hover:text-red-600"
                    title="Delete Project"
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
        title={editingProject ? `Edit Project: ${editingProject.title}` : "Create New Project"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. aether-ai"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Machine Learning, Computer Vision"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Short Description *</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Long Description</label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="PyTorch, Kafka, React, Kubernetes"
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Main Image URL</label>
            <input
              type="text"
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Live Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] focus:ring-2 focus:ring-[#C47A52]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-[#E8E8E5] text-[#C47A52] focus:ring-[#C47A52]"
              />
              <span className="font-medium">Feature on Homepage</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[#6B6B6B]">Display Order:</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value, 10),
                  })
                }
                className="w-16 px-2 py-1 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded text-[#171717]"
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
              {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
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
        title="Delete Project"
        message="Are you sure you want to delete this project? It will be permanently removed."
      />
    </div>
  );
}
