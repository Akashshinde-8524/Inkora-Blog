import api from './api';

export const commentService = {
  // Fetch all comments for a blog post
  async getBlogComments(blogId) {
    const res = await api.get(`/blogs/${blogId}/comments`);
    return res.data;
  },

  // Add a new comment to a blog post
  async addComment(blogId, content) {
    const res = await api.post(`/blogs/${blogId}/comments`, { content });
    return res.data;
  },

  // Delete a comment by ID
  async deleteComment(commentId) {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },
};

export default commentService;
