const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiCall(endpoint: string, options: Record<string, any> = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, name: string) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),
  getMe: () => apiCall("/auth/me"),
};

// Vendors
export const vendors = {
  getAll: () => apiCall("/vendors"),
  getById: (id: number) => apiCall(`/vendors/${id}`),
  create: (data: any) =>
    apiCall("/vendors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall(`/vendors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall(`/vendors/${id}`, {
      method: "DELETE",
    }),
};

// Team
export const team = {
  getAll: () => apiCall("/team"),
  getById: (id: number) => apiCall(`/team/${id}`),
  update: (id: number, data: any) =>
    apiCall(`/team/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall(`/team/${id}`, {
      method: "DELETE",
    }),
};

// Documents
export const documents = {
  getByVendor: (vendorId: number) => apiCall(`/documents/vendor/${vendorId}`),
  upload: (vendorId: number, title: string, file: File) => {
    const formData = new FormData();
    formData.append("vendorId", vendorId.toString());
    formData.append("title", title);
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_BASE}/documents/upload`, {
      method: "POST",
      headers,
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      return res.json();
    });
  },
  delete: (id: number) =>
    apiCall(`/documents/${id}`, {
      method: "DELETE",
    }),
};
