export const API_URL = import.meta.env.VITE_APP_API_URL;

export const APP_ENDPOINTS = {
  signin: `${API_URL}auth/signin`,
  healthCheck: `${API_URL}healthCheck`,
  roles: `${API_URL}roles`,
  getOrCreateUsers: `${API_URL}users`,
  deleteOrEditUser: `${API_URL}users`,
};
