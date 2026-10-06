"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { api, setTokens, clearTokens } from "@/services/api";
import { useToast } from "@/components/admin/AdminUI";

export default function AdminSecurityPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Email Change State
  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
    confirmEmail: "",
  });
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Password Change State
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  useEffect(() => {
    api.getMe()
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  // Password Policy Rules
  const passRequirements = [
    { label: "At least 8 characters long", met: passForm.newPassword.length >= 8 },
    { label: "Contains at least one uppercase letter (A-Z)", met: /[A-Z]/.test(passForm.newPassword) },
    { label: "Contains at least one lowercase letter (a-z)", met: /[a-z]/.test(passForm.newPassword) },
    { label: "Contains at least one number (0-9)", met: /[0-9]/.test(passForm.newPassword) },
    { label: "Contains at least one special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(passForm.newPassword) },
    {
      label: "Passwords match",
      met: Boolean(passForm.newPassword && passForm.confirmPassword && passForm.newPassword === passForm.confirmPassword),
    },
  ];

  const allPassRequirementsMet = passRequirements.every((r) => r.met);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!emailForm.currentPassword) {
      setEmailError("Please enter your current administrator password to authorize this change.");
      return;
    }

    if (!emailForm.newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) {
      setEmailError("Please enter a valid new administrator email address.");
      return;
    }

    if (emailForm.newEmail.toLowerCase() !== emailForm.confirmEmail.toLowerCase()) {
      setEmailError("New email address and confirmation email address do not match.");
      return;
    }

    setUpdatingEmail(true);

    try {
      const res = await api.updateEmail({
        currentPassword: emailForm.currentPassword,
        newEmail: emailForm.newEmail.trim().toLowerCase(),
        confirmEmail: emailForm.confirmEmail.trim().toLowerCase(),
      });

      if (res.data?.accessToken) {
        setTokens(res.data.accessToken, res.data.refreshToken);
      }
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("cms_user", JSON.stringify(res.data.user));
      }

      setEmailSuccess("Administrator email updated successfully. Your new login email is active.");
      addToast(`Admin email updated to ${emailForm.newEmail.trim().toLowerCase()}`, "success");

      setEmailForm({
        currentPassword: "",
        newEmail: "",
        confirmEmail: "",
      });
    } catch (err: any) {
      setEmailError(err.message || "Failed to update administrator email. Check your current password.");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!passForm.currentPassword) {
      setPassError("Please enter your current administrator password.");
      return;
    }

    if (!allPassRequirementsMet) {
      setPassError("Please ensure all password policy requirements are met.");
      return;
    }

    setUpdatingPass(true);

    try {
      const res = await api.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
        confirmPassword: passForm.confirmPassword,
      });

      if (res.data?.accessToken) {
        setTokens(res.data.accessToken, res.data.refreshToken);
      }

      setPassSuccess("Administrator password updated successfully. Active session refreshed.");
      addToast("Your new administrator password is now active.", "success");

      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setPassError(err.message || "Failed to change administrator password. Verify current password.");
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    clearTokens();
    router.replace("/admin/login");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#C47A52]" />
            <h2 className="text-lg font-serif text-white">Administrator Account Security</h2>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            Manage your authenticated administrator email, password, and session access.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#1F1F1F] text-[#CCCCCC] font-mono">
              Email: <strong className="text-white">{user?.email || "Loading..."}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono">
              Role: {user?.role || "ADMIN"}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#1F1F1F] text-[#888888] font-mono">
              Status: Permanent Account
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-[#222222] hover:bg-red-950/40 hover:text-red-400 border border-[#333333] hover:border-red-800/60 text-xs font-medium text-[#AAAAAA] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Change Admin Email */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52] mb-1">
              <Mail className="w-4 h-4" />
              <span>Change Administrator Email</span>
            </div>
            <p className="text-xs text-[#888888] mb-6">
              Update the primary email address used to log into this CMS. Requires password confirmation.
            </p>

            {emailError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{emailError}</span>
              </div>
            )}

            {emailSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{emailSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showEmailPass ? "text" : "password"}
                    required
                    value={emailForm.currentPassword}
                    onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPass(!showEmailPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showEmailPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  New Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                    placeholder="new-email@domain.com"
                    className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Confirm New Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailForm.confirmEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
                    placeholder="Re-enter new email"
                    className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingEmail}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#C47A52]/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {updatingEmail ? (
                  <span>Updating Email...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save New Email</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Section 2: Change Admin Password */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C47A52] mb-1">
              <KeyRound className="w-4 h-4" />
              <span>Change Administrator Password</span>
            </div>
            <p className="text-xs text-[#888888] mb-6">
              Update your account password. Requires verification of your current password.
            </p>

            {passError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    placeholder="Enter strong new password"
                    className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAAAAA] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#C47A52] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999]"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#242424] space-y-1.5 text-[11px]">
                {passRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        req.met ? "text-emerald-400" : "text-[#444444]"
                      }`}
                    />
                    <span className={req.met ? "text-[#CCCCCC]" : "text-[#666666]"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={updatingPass || !allPassRequirementsMet}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#C47A52]/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {updatingPass ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
