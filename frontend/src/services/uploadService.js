import api from './api';

export const uploadService = {
  /**
   * Upload an image file to the backend
   * @param {File} file 
   * @param {'blogs'|'profiles'|'content'} category 
   * @returns {Promise<{ url: string, originalFilename: string, sizeBytes: number }>}
   */
  async uploadImage(file, category = 'content') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data || response.data;
  },
};

export default uploadService;
