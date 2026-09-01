import axios from "axios";

const API_BASE_URL = "https://nirvana-mep-api-ffa0h4hsbtdkeucv.southeastasia-01.azurewebsites.net";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
};

export const lvmdpAPI = {
  getAll: () => api.get("/api/lvmdp"),
  create: (data) => api.post("/api/lvmdp", data),
  delete: (id) => api.delete(`/api/lvmdp/${id}`),
};

export const stpAPI = {
  getAll: () => api.get("/api/stp"),
  getById: (id) => api.get(`/api/stp/${id}`),
  create: (data) => api.post("/api/stp", data),
  update: (id, data) => api.put(`/api/stp/${id}`, data),
  delete: (id) => api.delete(`/api/stp/${id}`),
};

export const waterLevelsAPI = {
  getAll: () => api.get("/api/water-levels"),
  getById: (id) => api.get(`/api/water-levels/${id}`),
  create: (data) => api.post("/api/water-levels", data),
  update: (id, data) => api.put(`/api/water-levels/${id}`, data),
  delete: (id) => api.delete(`/api/water-levels/${id}`),
};

export const elektrikalPlnAPI = {
  getAll: () => api.get("/api/elektrikal-pln"),
  getById: (id) => api.get(`/api/elektrikal-pln/${id}`),
  create: (data) => api.post("/api/elektrikal-pln", data),
  update: (id, data) => api.put(`/api/elektrikal-pln/${id}`, data),
  delete: (id) => api.delete(`/api/elektrikal-pln/${id}`),
};

export const checkSheetsAPI = {
  getAll: () => api.get("/api/check-sheets"),
  create: (data) => api.post("/api/check-sheets", data),
};

export const photoAPI = {
  getAll: () => api.get("/api/photo-documentation"),
  create: (data) =>
    api.post("/api/photo-documentation", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const shiftHandoverAPI = {
  getAll: () => api.get("/api/shift-handover"),
  create: (data) => api.post("/api/shift-handover", data),
};

export const dashboardAPI = {
  getSummary: () => api.get("/api/dashboard/summary"),
};
export const reportAPI = {
  getAll: () => api.get("/api/reports"),
  getById: (id) => api.get(`/api/reports/${id}`),
  create: (data) => api.post("/api/reports", data),
  update: (id, data) => api.put(`/api/reports/${id}`, data),
  delete: (id) => api.delete(`/api/reports/${id}`),
};

export const gensetLogAPI = {
  getAll: () => api.get("/api/genset-log"),
  getById: (id) => api.get(`/api/genset-log/${id}`),
  create: (data) => api.post("/api/genset-log", data),
  update: (id, data) => api.put(`/api/genset-log/${id}`, data),
  delete: (id) => api.delete(`/api/genset-log/${id}`),
};

export default api;
