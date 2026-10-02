"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, Badge, EmptyState, Modal, ConfirmDialog } from "@/components/admin/AdminUI";
import { Plus, Edit2, Trash2, BookOpen, Search } from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "/images/project-ai-dashboard.jpg",
    category: "Deep Learning",
    tags: "",
    readTime: "8 min read",
    published: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.getBlogs();
      setBlogs(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "## Overview\n\nWrite your technical article here in Markdown...",
      coverImage: "/images/project-ai-dashboard.jpg",
      category: "Deep Learning",
      tags: "AI, Transformers, Architecture",
      readTime: "6 min read",
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      readTime: blog.readTime || "5 min read",
      published: blog.published || false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingBlog) {
        await api.updateBlog(editingBlog.id, payload);
        addToast(`Blog '${formData.title}' updated successfully.`);
      } else {
        await api.createBlog(payload);
        addToast(`Blog '${formData.title}' created successfully.`);
      }
      setModalOpen(false);
      fetchBlogs();
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
      await api.deleteBlog(deleteId);
      addToast("Blog post deleted successfully.");
      setDeleteId(null);
      fetchBlogs();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && b.published) ||
      (statusFilter === "DRAFT" && !b.published);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#171717]">Blog & Editorial Posts</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Publish research articles, engineering essays, and system post-mortems.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E8E5] flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "PUBLISHED", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                statusFilter === st
                  ? "bg-[#C47A52] text-white"
                  : "bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts List */}
      {loading ? (
        <LoadingSpinner size="lg" label="Loading articles from database..." />
      ) : filteredBlogs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles found"
          description="Create your first article or adjust your filter."
          action={
            <button
              onClick={openCreateModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C47A52] rounded-lg"
            >
              Write Article
            </button>
          }
        />
      ) : (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                <th className="py-3 px-4">Title & Excerpt</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5] text-xs">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-[#FAFAF8]/50 transition-colors">
                  <td className="py-3 px-4 max-w-md">
                    <span className="font-semibold text-[#171717] block text-sm mb-0.5">
                      {blog.title}
                    </span>
                    <span className="text-[#6B6B6B] line-clamp-1 text-xs">
                      {blog.excerpt}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="sage">{blog.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-[#6B6B6B]">{blog.readTime}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={blog.published ? "success" : "default"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="p-1 text-[#6B6B6B] hover:text-[#C47A52] transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(blog.id)}
                        className="p-1 text-[#6B6B6B] hover:text-red-600 transition-colors"
                        title="Delete Article"
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
        title={editingBlog ? `Edit Article: ${editingBlog.title}` : "Write New Article"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="AI, Transformers, Architecture"
                className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">Excerpt *</label>
            <textarea
              rows={2}
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B6B6B] mb-1">
              Article Content (Markdown supported) *
            </label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52] leading-relaxed"
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
              <span className="font-medium">Publish immediately (visible on public site)</span>
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
                {saving ? "Saving..." : editingBlog ? "Update Article" : "Create Article"}
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
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
      />
    </div>
  );
}
