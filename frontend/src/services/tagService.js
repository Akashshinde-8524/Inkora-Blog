import api from './api';

export const tagService = {
  async getAllTags() {
    const response = await api.get('/tags');
    return response.data;
  },
};

export default tagService;
