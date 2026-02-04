import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getToken = () => localStorage.getItem("token");

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ View All Medicines
export const fetchAllMedicines = () => api.get("/manager/medicines");

// ✅ Search by name
export const searchMedicineByName = (name) =>
  api.get(`/manager/medicine/search?name=${name}`);

// ✅ View medicine by ID
export const fetchMedicineById = (id) => api.get(`/manager/medicine/${id}`);

// ✅ Delete by ID
export const deleteMedicineById = (id) => api.delete(`/manager/medicine/${id}`);

// ✅ Update medicine by ID (expiryDate should not be sent / changed)
export const updateMedicineById = (id, payload) =>
  api.put(`/manager/medicine/${id}`, payload);
