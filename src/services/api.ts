/**
 * Unified REST API Service for Portfolio Frontend & Custom CMS
 * Connects to Node.js + Express Backend (:5000)
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cms_access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cms_refresh_token");
};

export const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem("cms_access_token", accessToken);
  if (refreshToken) localStorage.setItem("cms_refresh_token", refreshToken);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cms_access_token");
  localStorage.removeItem("cms_refresh_token");
  localStorage.removeItem("cms_user");
};

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; message?: string }> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getAccessToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (netErr: any) {
    const isConnRefused =
      netErr?.message?.includes("fetch failed") ||
      netErr?.message?.includes("Failed to fetch") ||
      netErr?.name === "TypeError";
    const err: any = new Error(
      isConnRefused
        ? "Unable to connect to the backend API server (port 5000). Please ensure the backend is started."
        : netErr?.message || "Network request failed."
    );
    err.isNetworkError = true;
    throw err;
  }

  // Handle Token Expiry & Automatic Refresh for CMS requests
  if (res.status === 401 && getRefreshToken() && !endpoint.includes("/auth/")) {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: getRefreshToken() }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
        headers["Authorization"] = `Bearer ${refreshData.data.accessToken}`;
        // Retry initial request
        res = await fetch(url, { ...options, headers });
      } else {
        clearTokens();
      }
    } catch {
      clearTokens();
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    let errorMsg = data.message;
    if (data.error?.issues && Array.isArray(data.error.issues) && data.error.issues.length > 0) {
      errorMsg = data.error.issues.map((i: any) => i.message).join(". ");
    } else if (typeof data.error === "string") {
      errorMsg = data.error;
    } else if (data.error?.message) {
      errorMsg = data.error.message;
    }
    if (!errorMsg) {
      errorMsg = `Request failed with status ${res.status}`;
    }

    const err: any = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // System Health
  checkHealth: async () => {
    try {
      const rootUrl = API_BASE.replace(/\/api\/?$/, "");
      const res = await fetch(`${rootUrl}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },
  // Auth
  getSetupStatus: () => request<{ setupRequired: boolean; setupCompleted: boolean; tempEmailHint?: string | null }>("/auth/setup-status"),
  setupAdmin: (data: { tempEmail: string; tempPassword: string; permanentEmail: string; newPassword: string; confirmPassword: string }) =>
    request("/auth/setup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request("/auth/me"),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEmail: (data: { currentPassword: string; newEmail: string; confirmEmail: string }) =>
    request("/auth/email", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  resetContent: (data: { email: string; password: string; confirm: boolean }) =>
    request("/admin/reset-content", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProfile: (data: any) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  logout: () => {
    clearTokens();
  },

  // Dashboard
  getDashboardStats: () => request("/dashboard/stats"),

  // About
  getAbout: () => request("/about"),
  updateAbout: (data: any) =>
    request("/about", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Skills
  getSkills: (params = "") => request(`/skills${params}`),
  createSkill: (data: any) =>
    request("/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSkill: (id: string, data: any) =>
    request(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSkill: (id: string) => request(`/skills/${id}`, { method: "DELETE" }),

  // Projects
  getProjects: (params = "") => request(`/projects${params}`),
  getProject: (slugOrId: string) => request(`/projects/${slugOrId}`),
  createProject: (data: any) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: any) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) => request(`/projects/${id}`, { method: "DELETE" }),

  // Blogs
  getBlogs: (params = "") => request(`/blogs${params}`),
  getBlog: (slugOrId: string) => request(`/blogs/${slugOrId}`),
  createBlog: (data: any) =>
    request("/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBlog: (id: string, data: any) =>
    request(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteBlog: (id: string) => request(`/blogs/${id}`, { method: "DELETE" }),

  // Experience
  getExperience: () => request("/experience"),
  createExperience: (data: any) =>
    request("/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateExperience: (id: string, data: any) =>
    request(`/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteExperience: (id: string) =>
    request(`/experience/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => request("/testimonials"),
  createTestimonial: (data: any) =>
    request("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, data: any) =>
    request(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: string) =>
    request(`/testimonials/${id}`, { method: "DELETE" }),

  // Services
  getServices: () => request("/services"),
  createService: (data: any) =>
    request("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: any) =>
    request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) => request(`/services/${id}`, { method: "DELETE" }),

  // Media
  getMedia: () => request("/media"),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/upload/image", {
      method: "POST",
      body: formData,
    });
  },
  deleteMedia: (id: string) => request(`/media/${id}`, { method: "DELETE" }),

  // Contact & Messages
  submitContact: (payload: { name: string; email: string; subject?: string; message: string }) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMessages: (status = "") =>
    request(`/messages${status ? `?status=${status}` : ""}`),
  getMessage: (id: string) => request(`/messages/${id}`),
  updateMessageStatus: (id: string, status: string) =>
    request(`/messages/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteMessage: (id: string) => request(`/messages/${id}`, { method: "DELETE" }),
};
