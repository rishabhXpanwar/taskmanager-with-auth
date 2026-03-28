import api from "./axios";

export const getAllUsers = () => api.get("/admin/users");
export const getUserById = (id) => api.get(`/admin/users/${id}`);

export const getAllTasks = () => api.get("/admin/tasks");
export const deleteTaskByAdmin = (id) => api.delete(`/admin/tasks/${id}`);

export const updateRole = (id, role) =>
  api.patch(`/admin/users/${id}/role`, { role });

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);