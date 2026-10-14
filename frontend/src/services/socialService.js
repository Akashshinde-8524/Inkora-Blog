import api from './api';

export const socialService = {
  // Toggle like on a blog post
  async toggleLike(blogId) {
    const res = await api.post(`/blogs/${blogId}/like`);
    return res.data;
  },

  // Toggle bookmark / save on a blog post
  async toggleBookmark(blogId) {
    const res = await api.post(`/blogs/${blogId}/bookmark`);
    return res.data;
  },

  // Get current user's bookmarked stories
  async getUserBookmarks(page = 0, size = 10) {
    const res = await api.get('/dashboard/bookmarks', {
      params: { page, size },
    });
    return res.data;
  },

  // Follow or unfollow an author by username
  async toggleFollow(username) {
    const res = await api.post(`/users/${username}/follow`);
    return res.data;
  },

  // Get personalized feed of stories from followed authors
  async getFollowingFeed(page = 0, size = 10) {
    const res = await api.get('/blogs/feed', {
      params: { page, size },
    });
    return res.data;
  },
};

export default socialService;
