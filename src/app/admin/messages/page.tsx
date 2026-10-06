"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast, LoadingSpinner, Badge, EmptyState, Modal, ConfirmDialog, PageHeader } from "@/components/admin/AdminUI";
import { Mail, Trash2, CheckCircle2, Search } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Detail Modal State
  const [viewingMessage, setViewingMessage] = useState<any>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      setMessages(res.data || []);
    } catch (err: any) {
      addToast(err.message || "Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessageModal = async (msg: any) => {
    setViewingMessage(msg);

    // If message is UNREAD, automatically mark as READ
    if (msg.status === "UNREAD") {
      try {
        await api.updateMessageStatus(msg.id, "READ");
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "READ" } : m))
        );
      } catch (e: any) {
        console.warn("Could not mark read:", e.message);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "READ" ? "UNREAD" : "READ";
    try {
      await api.updateMessageStatus(id, nextStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
      );
      if (viewingMessage && viewingMessage.id === id) {
        setViewingMessage((prev: any) => ({ ...prev, status: nextStatus }));
      }
      addToast(`Message marked as ${nextStatus}.`);
    } catch (err: any) {
      addToast(err.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteMessage(deleteId);
      addToast("Message deleted successfully.");
      setDeleteId(null);
      if (viewingMessage && viewingMessage.id === deleteId) {
        setViewingMessage(null);
      }
      fetchMessages();
    } catch (err: any) {
      addToast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || "").toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Form Inquiries"
        description="Messages submitted through the public website contact form with real-time status tracking."
        breadcrumbs={["Admin", "Engagement", "Messages"]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E8E5] flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search inquiries by sender, email, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg text-[#171717] focus:outline-none focus:border-[#C47A52]"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "UNREAD", "READ", "ARCHIVED"].map((st) => (
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

      {/* Messages Table */}
      {loading ? (
        <LoadingSpinner size="lg" label="Loading contact messages..." />
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages found"
          description="Inquiries submitted via the public contact form will appear here."
        />
      ) : (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5] text-xs">
              {filteredMessages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-[#FAFAF8]/50 transition-colors cursor-pointer ${
                    msg.status === "UNREAD" ? "bg-[#C47A52]/[0.02] font-medium" : ""
                  }`}
                  onClick={() => openMessageModal(msg)}
                >
                  <td className="py-3 px-4">
                    <Badge variant={msg.status === "UNREAD" ? "accent" : "default"}>
                      {msg.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#171717] block">{msg.name}</span>
                    <span className="text-[11px] text-[#6B6B6B]">{msg.email}</span>
                  </td>
                  <td className="py-3 px-4 max-w-md">
                    <span className="font-medium text-[#171717] block truncate">
                      {msg.subject || "(No subject)"}
                    </span>
                    <span className="text-[#6B6B6B] line-clamp-1 text-[11px]">
                      {msg.message}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6B6B6B] text-[11px] whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(msg.id, msg.status)}
                        className="p-1 text-[#6B6B6B] hover:text-[#C47A52] transition-colors"
                        title={msg.status === "READ" ? "Mark as unread" : "Mark as read"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(msg.id)}
                        className="p-1 text-[#6B6B6B] hover:text-red-600 transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        isOpen={!!viewingMessage}
        onClose={() => setViewingMessage(null)}
        title={viewingMessage?.subject || "Contact Inquiry Details"}
        maxWidth="max-w-2xl"
      >
        {viewingMessage && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E5] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6B6B6B] block">From:</span>
                <span className="text-sm font-semibold text-[#171717]">
                  {viewingMessage.name}{" "}
                  <a
                    href={`mailto:${viewingMessage.email}`}
                    className="font-normal text-[#C47A52] hover:underline"
                  >
                    &lt;{viewingMessage.email}&gt;
                  </a>
                </span>
              </div>
              <div className="text-right">
                <Badge variant={viewingMessage.status === "UNREAD" ? "accent" : "default"}>
                  {viewingMessage.status}
                </Badge>
                <span className="text-[10px] text-[#6B6B6B] block mt-1">
                  {new Date(viewingMessage.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] block mb-1">
                Message Body:
              </span>
              <div className="p-4 bg-[#FAFAF8] border border-[#E8E8E5] rounded-xl text-xs text-[#171717] leading-relaxed whitespace-pre-wrap">
                {viewingMessage.message}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E8E5] flex items-center justify-between">
              <a
                href={`mailto:${viewingMessage.email}?subject=Re: ${encodeURIComponent(
                  viewingMessage.subject || "Portfolio Inquiry"
                )}`}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#C47A52] hover:bg-[#B36B45] rounded-lg transition-colors"
              >
                Reply via Email
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(viewingMessage.id, viewingMessage.status)}
                  className="px-3 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] rounded-lg border border-[#E8E8E5]"
                >
                  Mark as {viewingMessage.status === "READ" ? "Unread" : "Read"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(viewingMessage.id)}
                  className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Inquiry Message"
        message="Are you sure you want to delete this contact message?"
      />
    </div>
  );
}
