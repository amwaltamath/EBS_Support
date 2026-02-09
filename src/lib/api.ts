const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
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
  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (email, password, name) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),
  getMe: () => apiCall("/auth/me"),
};

// Vendors
export const vendors = {
  getAll: () => apiCall("/vendors"),
  getById: (id) => apiCall(`/vendors/${id}`),
  create: (data) =>
    apiCall("/vendors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/vendors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/vendors/${id}`, {
      method: "DELETE",
    }),
};

// Team
export const team = {
  getAll: () => apiCall("/team"),
  getById: (id) => apiCall(`/team/${id}`),
  update: (id, data) =>
    apiCall(`/team/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/team/${id}`, {
      method: "DELETE",
    }),
};

// Documents
export const documents = {
  getByVendor: (vendorId) => apiCall(`/documents/vendor/${vendorId}`),
  upload: (vendorId, title, file) => {
    const formData = new FormData();
    formData.append("vendorId", vendorId);
    formData.append("title", title);
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const headers = {};
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
  delete: (id) =>
    apiCall(`/documents/${id}`, {
      method: "DELETE",
    }),
};
