"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Activity,
  KeyRound,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { api, setTokens, getAccessToken } from "@/services/api";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form State - strictly empty by default, no hardcoded or visible credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback States
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<"auth" | "network" | "validation" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [checkingExistingAuth, setCheckingExistingAuth] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);

  // Check if user is already authenticated & check backend status
  useEffect(() => {
    let isMounted = true;

    async function initCheck() {
      // 1. Check if token already exists and is valid
      const existingToken = getAccessToken();
      if (existingToken) {
        if (isMounted) setCheckingExistingAuth(true);
        try {
          const res = await api.getMe();
          if (res.data?.user && isMounted) {
            if (res.data.user.mustChangePassword) {
              router.replace("/admin/setup");
            } else {
              router.replace("/admin");
            }
            return;
          }
        } catch {
          // Token is expired/invalid; stay on login page
        } finally {
          if (isMounted) setCheckingExistingAuth(false);
        }
      }

      // 2. Check Backend Health & Setup Status
      try {
        const isHealthy = await api.checkHealth();
        if (isMounted) {
          setBackendStatus(isHealthy ? "online" : "offline");
        }
        if (isHealthy) {
          const statusRes = await api.getSetupStatus();
          if (isMounted && statusRes.data?.setupRequired) {
            setSetupRequired(true);
          }
        }
      } catch {
        if (isMounted) {
          setBackendStatus("offline");
        }
      }
    }

    initCheck();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorType("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your administrator email address.");
      setErrorType("validation");
      return;
    }

    if (!password) {
      setError("Please enter your administrator password.");
      setErrorType("validation");
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.login(cleanEmail, password);
      const { user, accessToken, refreshToken } = res.data;

      // Persist auth tokens
      setTokens(accessToken, refreshToken);

      if (rememberMe) {
        localStorage.setItem("cms_user", JSON.stringify(user));
        localStorage.setItem("cms_remember", "true");
      } else {
        sessionStorage.setItem("cms_user", JSON.stringify(user));
      }

      // First-time login / Temporary password flow:
      // If mustChangePassword is true, DO NOT allow dashboard access yet. Redirect directly to setup!
      if (user.mustChangePassword) {
        router.push("/admin/setup");
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      if (err.isNetworkError) {
        setError(
          "Backend API server is unreachable at port 5000. Start the backend by running: cd backend && npm run dev"
        );
        setErrorType("network");
        setBackendStatus("offline");
      } else if (err.status === 401) {
        setError("Invalid email or password. Please verify your credentials and try again.");
        setErrorType("auth");
      } else if (err.status === 429) {
        setError("Too many login attempts. For security, please wait 15 minutes before retrying.");
        setErrorType("auth");
      } else {
        setError(err.message || "Authentication failed. Please verify your credentials.");
        setErrorType("auth");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExistingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-[#E8E4DE]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C47A52] to-[#8C5338] flex items-center justify-center shadow-lg shadow-[#C47A52]/20 animate-pulse">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs font-mono tracking-wider text-[#A88A52] uppercase">
            Verifying Administrator Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#C47A52] selection:text-white overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C47A52]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8C9A86]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Controls: Back link + Live Backend Pill */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#888888] hover:text-[#E8E4DE] transition-colors py-1.5 px-3 rounded-lg bg-[#141414]/80 border border-[#2A2A2A] hover:border-[#3A3A3A] backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Live Backend Indicator */}
        <div
          className={`inline-flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all ${
            backendStatus === "online"
              ? "bg-[#1A4A3A]/40 border-[#2A6A52]/50 text-[#6EE7B7]"
              : backendStatus === "offline"
              ? "bg-[#451A1A]/40 border-[#7F1D1D]/50 text-[#FCA5A5]"
              : "bg-[#1F1F1F]/60 border-[#333333] text-[#AAAAAA]"
          }`}
          title={
            backendStatus === "offline"
              ? "Backend API is offline. Run 'cd backend && npm run dev' in terminal."
              : "Backend API is online and responding at http://localhost:5000"
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus === "online"
                ? "bg-[#10B981] animate-pulse"
                : backendStatus === "offline"
                ? "bg-[#EF4444]"
                : "bg-amber-400 animate-ping"
            }`}
          />
          <span>
            {backendStatus === "online"
              ? "API Connected (:5000)"
              : backendStatus === "offline"
              ? "API Offline (:5000)"
              : "Checking API..."}
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        {setupRequired && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#C47A52]/10 border border-[#C47A52]/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#E0A080]">
              <Shield className="w-4 h-4 text-[#C47A52] flex-shrink-0" />
              <span>Initial CMS setup is pending.</span>
            </div>
            <Link
              href="/admin/setup"
              className="px-2.5 py-1 rounded-lg bg-[#C47A52] hover:bg-[#D48A62] text-white text-[11px] font-semibold whitespace-nowrap transition-colors"
            >
              Set Up &rarr;
            </Link>
          </div>
        )}

        <div className="bg-[#141414]/90 backdrop-blur-xl border border-[#2A2A2A] shadow-2xl shadow-black/80 rounded-2xl p-7 sm:p-9 relative overflow-hidden">
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C47A52]/40 to-transparent" />

          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-[#1F1F1F] to-[#141414] border border-[#2E2E2E] shadow-inner mb-4 relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C47A52] to-[#995332] text-white flex items-center justify-center font-serif font-bold text-xl shadow-md">
                A
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-[#C47A52]/20 blur-sm -z-10 group-hover:bg-[#C47A52]/30 transition-colors" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-[#E8E4DE]">
              Admin Portal
            </h1>
            <p className="mt-1.5 text-xs text-[#888888] font-sans">
              Enter authorized administrator credentials to manage Arjun Mehta&apos;s portfolio
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-xs text-red-200 backdrop-blur-sm"
              >
                {errorType === "network" ? (
                  <Activity className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 leading-relaxed">
                  <p className="font-medium text-red-300">
                    {errorType === "network" ? "Connection Issue" : "Authentication Alert"}
                  </p>
                  <p className="text-red-200/90 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-mono uppercase tracking-wider text-[#AAAAAA] mb-2"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#C47A52] focus:ring-1 focus:ring-[#C47A52] text-[#E8E4DE] placeholder:text-[#555555] transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-mono uppercase tracking-wider text-[#AAAAAA]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-mono text-[#888888] hover:text-[#C47A52] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showPassword ? (
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
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl focus:outline-none focus:border-[#C47A52] focus:ring-1 focus:ring-[#C47A52] text-[#E8E4DE] placeholder:text-[#555555] transition-all font-sans"
                />
              </div>
            </div>

            {/* Remember Me & Session Info */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#888888] hover:text-[#AAAAAA]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#333333] bg-[#0E0E0E] text-[#C47A52] focus:ring-[#C47A52] focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-[11px] font-mono text-[#666666]">
                JWT Session: 15m / 7d
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full relative group overflow-hidden flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C47A52] to-[#B36842] hover:from-[#D48A62] hover:to-[#C47A52] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C47A52]/20 hover:shadow-[#C47A52]/30 active:scale-[0.99] cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice Footer */}
        <p className="text-center text-[11px] font-mono text-[#555555] mt-6">
          Encrypted with Bcrypt (12 rounds) &bull; Protected by Helmet &bull; Rate Limited
        </p>
      </motion.div>
    </div>
  );
}
