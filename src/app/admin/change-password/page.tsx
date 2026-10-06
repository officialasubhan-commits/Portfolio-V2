"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { api, setTokens, getAccessToken, clearTokens } from "@/services/api";

export default function AdminChangePasswordPage() {
  const router = useRouter();

  // Form Fields
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status & Feedback States
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Load current authenticated user email
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    api
      .getMe()
      .then((res) => {
        if (res.data?.user) {
          setEmail(res.data.user.email);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        clearTokens();
        router.replace("/admin/login");
      })
      .finally(() => {
        setLoadingInitial(false);
      });
  }, [router]);

  // Password Policy Checks
  const policyChecks = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  // Password Strength Score (0 to 4)
  const strength = useMemo(() => {
    let score = 0;
    if (policyChecks.length) score += 1;
    if (policyChecks.uppercase && policyChecks.lowercase) score += 1;
    if (policyChecks.number) score += 1;
    if (policyChecks.special) score += 1;
    return score;
  }, [policyChecks]);

  const strengthLabel = useMemo(() => {
    if (!newPassword) return { text: "Too short", color: "text-[#666666]", bar: "bg-[#333333]" };
    if (strength <= 1) return { text: "Weak", color: "text-red-400", bar: "bg-red-500" };
    if (strength === 2) return { text: "Fair", color: "text-amber-400", bar: "bg-amber-500" };
    if (strength === 3) return { text: "Good", color: "text-blue-400", bar: "bg-blue-500" };
    return { text: "Strong", color: "text-emerald-400", bar: "bg-emerald-500" };
  }, [newPassword, strength]);

  const isPolicySatisfied =
    policyChecks.length &&
    policyChecks.uppercase &&
    policyChecks.lowercase &&
    policyChecks.number &&
    policyChecks.special;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Please enter your current/temporary password.");
      return;
    }

    if (!isPolicySatisfied) {
      setError("Your new password does not meet the security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password cannot be the same as your temporary password.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Update session with new fresh token
      const { user, accessToken, refreshToken } = res.data;
      setTokens(accessToken, refreshToken);
      localStorage.setItem("cms_user", JSON.stringify(user));

      setSuccess(true);

      // Smooth redirect to Admin Dashboard
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to create new password. Please verify your current temporary password and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-[#E8E4DE]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C47A52] to-[#8C5338] flex items-center justify-center animate-pulse">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-[#A88A52]">
          Securing Administrator Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#C47A52] selection:text-white overflow-hidden">
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C47A52]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8C9A86]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#888888] hover:text-[#E8E4DE] transition-colors py-1.5 px-3 rounded-lg bg-[#141414]/80 border border-[#2A2A2A] hover:border-[#3A3A3A] backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <span className="text-[11px] font-mono text-[#C47A52] px-2.5 py-1 rounded-md bg-[#C47A52]/10 border border-[#C47A52]/20">
          Initial Setup Required
        </span>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-[#141414]/90 backdrop-blur-xl border border-[#2A2A2A] shadow-2xl shadow-black/80 rounded-2xl p-7 sm:p-9 relative overflow-hidden">
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C47A52]/40 to-transparent" />

          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-[#1F1F1F] to-[#141414] border border-[#2E2E2E] shadow-inner mb-4 relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C47A52] to-[#995332] text-white flex items-center justify-center shadow-md">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-[#C47A52]/20 blur-sm -z-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#E8E4DE]">
              Create Your Admin Password
            </h1>
            <p className="mt-1.5 text-xs text-[#888888] font-sans">
              You logged in with a temporary password. For security, please create a permanent administrator password.
            </p>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-3 text-xs text-emerald-200"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-300">Password Established Successfully</p>
                  <p className="text-emerald-200/90 mt-0.5">
                    Redirecting to Admin Dashboard...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-xs text-red-200"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <p className="font-medium text-red-300">Validation Notice</p>
                  <p className="text-red-200/90 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Email */}
            <div>
              <label
                htmlFor="change-email"
                className="block text-xs font-mono uppercase tracking-wider text-[#AAAAAA] mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="change-email"
                  type="email"
                  readOnly
                  value={email}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#0E0E0E]/60 border border-[#2A2A2A] rounded-xl text-[#AAAAAA] cursor-not-allowed font-sans select-none"
                />
              </div>
            </div>

            {/* Current / Temporary Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="current-password"
                  className="block text-xs font-mono uppercase tracking-wider text-[#AAAAAA]"
                >
                  Temporary / Current Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-[11px] font-mono text-[#888888] hover:text-[#C47A52] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showCurrent ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter initial temporary password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#C47A52] focus:ring-1 focus:ring-[#C47A52] text-[#E8E4DE] placeholder:text-[#555555] transition-all font-sans"
                />
              </div>
            </div>

            {/* New Permanent Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-xs font-mono uppercase tracking-wider text-[#AAAAAA]"
                >
                  New Permanent Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-[11px] font-mono text-[#888888] hover:text-[#C47A52] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showNew ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#C47A52] focus:ring-1 focus:ring-[#C47A52] text-[#E8E4DE] placeholder:text-[#555555] transition-all font-sans"
                />
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#888888]">Password Strength:</span>
                    <span className={`font-semibold ${strengthLabel.color}`}>
                      {strengthLabel.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          strength >= step ? strengthLabel.bar : "bg-[#222222]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-mono uppercase tracking-wider text-[#AAAAAA]"
                >
                  Confirm New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-[11px] font-mono text-[#888888] hover:text-[#C47A52] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showConfirm ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Re-enter your new password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#C47A52] focus:ring-1 focus:ring-[#C47A52] text-[#E8E4DE] placeholder:text-[#555555] transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Policy Checklist */}
            <div className="p-3 bg-[#0E0E0E] border border-[#222222] rounded-xl space-y-1.5 text-[11px] font-mono text-[#888888]">
              <div className="flex items-center gap-2">
                {policyChecks.length ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#555555] shrink-0" />
                )}
                <span className={policyChecks.length ? "text-[#CCCCCC]" : "text-[#777777]"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {policyChecks.uppercase && policyChecks.lowercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#555555] shrink-0" />
                )}
                <span
                  className={
                    policyChecks.uppercase && policyChecks.lowercase
                      ? "text-[#CCCCCC]"
                      : "text-[#777777]"
                  }
                >
                  Uppercase and lowercase letters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {policyChecks.number ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#555555] shrink-0" />
                )}
                <span className={policyChecks.number ? "text-[#CCCCCC]" : "text-[#777777]"}>
                  At least one numeric digit (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {policyChecks.special ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-[#555555] shrink-0" />
                )}
                <span className={policyChecks.special ? "text-[#CCCCCC]" : "text-[#777777]"}>
                  At least one special symbol (!@#$%^&*)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || success}
              className="w-full relative group overflow-hidden flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C47A52]/20 hover:shadow-[#C47A52]/30 cursor-pointer pt-3"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating New Password...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Password Created!</span>
                </>
              ) : (
                <>
                  <span>Create New Password</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
