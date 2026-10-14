import api from './api';

export const userService = {
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  async getUserProfile(username) {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  async getUserBlogs(username, params = {}) {
    const response = await api.get(`/users/${username}/blogs`, { params });
    return response.data;
  },
};

export default userService;
