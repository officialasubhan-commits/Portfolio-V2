"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, EmptyState, ConfirmDialog } from "@/components/admin/AdminUI";
import { UploadCloud, Trash2, Copy, Check, Image as ImageIcon, ExternalLink } from "lucide-react";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.getMedia();
      setMediaList(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load media assets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (file?: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast("File size exceeds 10MB limit.", "error");
      return;
    }

    setUploading(true);
    try {
      await api.uploadImage(file);
      addToast(`Image '${file.name}' uploaded successfully.`);
      fetchMedia();
    } catch (err: any) {
      addToast(err.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast("Asset URL copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteMedia(deleteId);
      addToast("Media asset deleted.");
      setDeleteId(null);
      fetchMedia();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-[#171717]">Media Library</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Upload, preview, and organize image assets used in projects, case studies, and blogs.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? "Uploading Image..." : "Upload New Image"}</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files?.[0]);
        }}
        className="border-2 border-dashed border-[#E8E8E5] hover:border-[#C47A52]/60 bg-[#FFFFFF] rounded-2xl p-8 text-center cursor-pointer transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-[#FAFAF8] flex items-center justify-center text-[#C47A52] mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-[#171717] mb-1">
          Click or drag & drop images here to upload
        </p>
        <p className="text-[11px] text-[#6B6B6B]">
          Supports PNG, JPG, WEBP, GIF, and SVG up to 10MB
        </p>
      </div>

      {/* Media Grid */}
      {loading ? (
        <LoadingSpinner size="lg" label="Loading media assets..." />
      ) : mediaList.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Media library is empty"
          description="Upload project screenshots or diagrams to generate URLs."
          action={
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C47A52] rounded-lg"
            >
              Upload Asset
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] overflow-hidden flex flex-col justify-between hover:border-[#C47A52]/40 transition-all hover:shadow-sm group"
            >
              <div className="aspect-square bg-[#FAFAF8] relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div className="p-3">
                <p
                  className="text-xs font-medium text-[#171717] truncate mb-0.5"
                  title={item.originalName}
                >
                  {item.originalName}
                </p>
                <p className="text-[10px] text-[#6B6B6B] mb-3">
                  {formatFileSize(item.size)} ·{" "}
                  {item.mimeType.split("/")[1]?.toUpperCase()}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E5]">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="flex items-center gap-1 text-[11px] text-[#C47A52] hover:underline font-medium"
                    title="Copy Image URL"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#8C9A86]" />
                        <span className="text-[#8C9A86]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-[#6B6B6B] hover:text-[#171717]"
                      title="View full image"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1 text-[#6B6B6B] hover:text-red-600"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Media Asset"
        message="Are you sure you want to delete this media file from server disk and database?"
      />
    </div>
  );
}
