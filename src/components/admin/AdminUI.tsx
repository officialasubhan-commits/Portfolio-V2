"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";

/* ─── TOAST CONTEXT ─── */
interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 ${
              toast.type === "success"
                ? "bg-[#FFFFFF] border-[#8C9A86]/40 text-[#171717]"
                : toast.type === "error"
                ? "bg-[#FFFFFF] border-red-200 text-[#171717]"
                : "bg-[#FFFFFF] border-[#E8E8E5] text-[#171717]"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#8C9A86] shrink-0 mt-0.5" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[#C47A52] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6B6B6B] hover:text-[#171717] transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

/* ─── MODAL ─── */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#171717]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col z-10 text-[#171717]`}
      >
        <div className="px-6 py-4 border-b border-[#E8E8E5] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#171717]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#6B6B6B] hover:text-[#171717] hover:bg-[#FAFAF8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ─── CONFIRM DIALOG ─── */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-full shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#6B6B6B] leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E8E8E5]">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#171717] rounded-lg border border-[#E8E8E5] hover:bg-[#FAFAF8] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/* ─── BADGE ─── */
export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "sage" | "success" | "warning" | "danger";
  className?: string;
}) {
  const variants = {
    default: "bg-[#FAFAF8] text-[#6B6B6B] border-[#E8E8E5]",
    accent: "bg-[#C47A52]/10 text-[#C47A52] border-[#C47A52]/20",
    sage: "bg-[#8C9A86]/10 text-[#8C9A86] border-[#8C9A86]/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

/* ─── LOADING SPINNER ─── */
export function LoadingSpinner({
  size = "md",
  label = "Loading data...",
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizes[size] || sizes.md} rounded-full border-[#E8E8E5] border-t-[#C47A52] animate-spin`}
      />
      {label && <p className="text-xs text-[#6B6B6B] font-medium tracking-wide">{label}</p>}
    </div>
  );
}

/* ─── EMPTY STATE ─── */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: any;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-16 px-4 bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] border-dashed">
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FAFAF8] flex items-center justify-center text-[#6B6B6B] mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#171717] mb-1">{title}</h3>
      {description && <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto mb-6 leading-relaxed">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

/* ─── PAGE HEADER ─── */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: {
  title: string;
  description?: string;
  breadcrumbs?: string[];
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E8E5]">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B6B6B] mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#E8E8E5]">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? "text-[#C47A52]" : ""}>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-xl font-serif font-bold text-[#171717] tracking-tight">{title}</h1>
        {description && <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}

/* ─── CARD ─── */
export function Card({
  children,
  className = "",
  padding = "p-5",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={`bg-[#FFFFFF] rounded-xl border border-[#E8E8E5] shadow-xs ${padding} ${className}`}>
      {children}
    </div>
  );
}

