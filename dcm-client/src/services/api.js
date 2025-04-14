import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7269/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// const api = axios.create({
//   baseURL: "/api", // Replace with your actual base URL if needed
// });

// Categories API
export const fetchCategories = async () => {
  const response = await api.get("/Categories");
  return response.data;
};

export const fetchCategoryById = async (categoryId) => {
  const response = await api.get(`/Categories/${categoryId}`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/Categories", data);
  return response.data;
};

export const updateCategory = async (categoryId, data) => {
  const response = await api.put(`/Categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/Categories/${categoryId}`);
  return response.data;
};

// Tags API
export const fetchTags = async () => {
  const response = await api.get("/Tags");
  return response.data;
};

// Sessions API
export const fetchSessionsByCategory = async (categoryId) => {
  const response = await api.get(`/Sessions/category/${categoryId}`);
  return response.data;
};

export const fetchPreviewSessions = async (data) => {
  const response = await api.post("/Sessions/previewSession", data);
  return response.data;
};

export default api;
