import api from './api';

export const blogService = {
  async createBlog(blogData) {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  async updateBlog(id, blogData) {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  async deleteBlog(id) {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  async publishBlog(id) {
    const response = await api.post(`/blogs/${id}/publish`);
    return response.data;
  },

  async unpublishBlog(id) {
    const response = await api.post(`/blogs/${id}/unpublish`);
    return response.data;
  },

  async getBlogBySlug(slug) {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  async getBlogById(id) {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  async getExploreBlogs(params = {}) {
    const response = await api.get('/blogs/explore', { params });
    return response.data;
  },

  async searchBlogs(query, params = {}) {
    const response = await api.get('/blogs/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },

  async getAuthorBlogs(params = {}) {
    const response = await api.get('/dashboard/blogs', { params });
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default blogService;
