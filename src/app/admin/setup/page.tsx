"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  KeyRound,
  Mail,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { api, setTokens } from "@/services/api";

export default function AdminSetupPage() {
  const router = useRouter();

  // Form Fields
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [permanentEmail, setPermanentEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if setup is already complete or fetch hint
  useEffect(() => {
    api.getSetupStatus()
      .then((res) => {
        if (res.data?.setupCompleted) {
          // Already configured, redirect to login
          router.replace("/admin/login");
        } else if (res.data?.tempEmailHint) {
          setTempEmail(res.data.tempEmailHint);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingStatus(false));
  }, [router]);

  // Password Policy Rules
  const requirements = [
    { label: "At least 8 characters long", met: newPassword.length >= 8 },
    { label: "Contains at least one uppercase letter (A-Z)", met: /[A-Z]/.test(newPassword) },
    { label: "Contains at least one lowercase letter (a-z)", met: /[a-z]/.test(newPassword) },
    { label: "Contains at least one number (0-9)", met: /[0-9]/.test(newPassword) },
    { label: "Contains at least one special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(newPassword) },
    {
      label: "Different from temporary password",
      met: Boolean(newPassword && tempPassword && newPassword !== tempPassword),
    },
    {
      label: "Passwords match",
      met: Boolean(newPassword && confirmPassword && newPassword === confirmPassword),
    },
  ];

  // Strength score
  const passedCount = requirements.filter((r) => r.met).length;
  const strengthPercentage = Math.round((passedCount / requirements.length) * 100);

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { text: "None", color: "text-[#666666]", barColor: "bg-[#333333]" };
    if (passedCount <= 3) return { text: "Weak", color: "text-red-400", barColor: "bg-red-500" };
    if (passedCount <= 5) return { text: "Moderate", color: "text-amber-400", barColor: "bg-amber-500" };
    return { text: "Strong", color: "text-emerald-400", barColor: "bg-emerald-500" };
  };

  const strength = getStrengthLabel();
  const allRequirementsMet = requirements.every((r) => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tempEmail.trim() || !tempPassword) {
      setError("Please provide your current temporary administrator credentials.");
      return;
    }

    if (!permanentEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(permanentEmail.trim())) {
      setError("Please enter a valid permanent administrator email address.");
      return;
    }

    if (!allRequirementsMet) {
      setError("Please ensure all security policy requirements are met before proceeding.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.setupAdmin({
        tempEmail: tempEmail.trim(),
        tempPassword,
        permanentEmail: permanentEmail.trim(),
        newPassword,
        confirmPassword,
      });

      const { user, accessToken, refreshToken } = res.data;

      // Save tokens and permanent user info
      setTokens(accessToken, refreshToken);
      localStorage.setItem("cms_user", JSON.stringify(user));
      sessionStorage.setItem("cms_user", JSON.stringify(user));

      setSuccess(true);

      // Redirect directly to CMS Dashboard after brief confirmation
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to complete administrator setup. Please verify your temporary credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C47A52]/30 border-t-[#C47A52] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EEEEEE] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#C47A52]/10 via-[#2A1D16]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C47A52]/10 border border-[#C47A52]/30 text-[#C47A52] text-xs font-mono tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initial System Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">
            Set Up Your CMS
          </h1>
          <p className="text-sm text-[#888888] max-w-md mx-auto leading-relaxed">
            Create your permanent administrator account. This account will be used to manage this website and its content.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-sm text-emerald-200">Setup Completed Successfully!</p>
                <p className="text-[#888888] mt-0.5">Permanent account created. Redirecting to CMS dashboard...</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Temporary Credentials Verification */}
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>1. Verify Temporary Credentials</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Current Temporary Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Current Temporary Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showTempPassword ? "text" : "password"}
                    required
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Enter current bootstrap password"
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTempPassword(!showTempPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showTempPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Permanent Administrator Identity */}
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>2. Create Permanent Administrator Identity</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Permanent Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={permanentEmail}
                    onChange={(e) => setPermanentEmail(e.target.value)}
                    placeholder="your-real-email@domain.com"
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#666666] mt-1">
                  This permanent email will replace the temporary email and become your permanent login identity.
                </p>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  New Permanent Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Choose a strong permanent password"
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Confirm Permanent Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter permanent password"
                    className="w-full bg-[#111111] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            <div className="p-4 rounded-xl bg-[#111111] border border-[#242424] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#888888] font-mono">Password Strength:</span>
                <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
              </div>
              <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.barColor}`}
                  style={{ width: `${strengthPercentage}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 pt-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                        req.met ? "text-emerald-400" : "text-[#444444]"
                      }`}
                    />
                    <span className={req.met ? "text-[#CCCCCC]" : "text-[#666666]"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !allRequirementsMet}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C47A52]/20 hover:shadow-[#C47A52]/30 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Configuring Account...</span>
                </>
              ) : (
                <>
                  <span>Activate Permanent Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security badge */}
        <p className="text-center text-[11px] font-mono text-[#555555] mt-6">
          Encrypted with Bcrypt (12 rounds) &bull; Stateless JWT &bull; Zero Plaintext Exposure
        </p>
      </motion.div>
    </div>
  );
}
