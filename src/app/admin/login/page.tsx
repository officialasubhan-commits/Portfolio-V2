"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { api, setTokens } from "@/services/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@mehta.dev");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.login(email, password);
      const { user, accessToken, refreshToken } = res.data;
      setTokens(accessToken, refreshToken);
      localStorage.setItem("cms_user", JSON.stringify(user));
      router.push("/admin");
    } catch (err: any) {
      setError(
        err.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#171717]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-[#C47A52] text-white mx-auto flex items-center justify-center font-serif font-bold text-2xl mb-4 shadow-sm">
          A
        </div>
        <h2 className="text-2xl font-serif font-semibold text-[#171717] tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="mt-1 text-xs text-[#6B6B6B]">
          Enter credentials to access Arjun Mehta's portfolio administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFFFF] py-8 px-6 shadow-sm border border-[#E8E8E5] rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6B6B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mehta.dev"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg focus:outline-none focus:border-[#C47A52] text-[#171717] placeholder:text-[#6B6B6B]/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171717] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6B6B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#FAFAF8] border border-[#E8E8E5] rounded-lg focus:outline-none focus:border-[#C47A52] text-[#171717] placeholder:text-[#6B6B6B]/60 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#C47A52] hover:bg-[#B36B45] text-white text-xs font-semibold tracking-wide transition-colors disabled:opacity-60 shadow-sm"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E8E8E5] flex items-start gap-2.5 text-[11px] text-[#6B6B6B]">
            <ShieldCheck className="w-4 h-4 text-[#8C9A86] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#171717] block">
                Default Seed Credentials:
              </span>
              <code className="text-[#6B6B6B] select-all">admin@mehta.dev</code> /{" "}
              <code className="text-[#6B6B6B] select-all">Admin@123456</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
