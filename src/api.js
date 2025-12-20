import axios from 'axios';

// Ganti ini saja jika URL berubah
export const BASE_URL = 'https://dafit29.pythonanywhere.com'; 
export const API_URL = `${BASE_URL}/api`;

export const api = {
  // Gunakan API_URL disini
  getHomeData: () => axios.get(`${API_URL}/home/`),
  getNovels: (params) => axios.get(`${API_URL}/novels/`, { params }),
  getDetail: (id) => axios.get(`${API_URL}/novels/${id}/`),
  getChapter: (id) => axios.get(`${API_URL}/chapters/${id}/`),
  
  // Auth
  login: (creds) => axios.post(`${API_URL}/token/`, creds),
  register: (data) => axios.post(`${API_URL}/register/`, data),
  
  // User Features
  getBookmarks: (token) => axios.get(`${API_URL}/bookmarks/`, { headers: { Authorization: `Bearer ${token}` } }),
  toggleBookmark: (id, token) => axios.post(`${API_URL}/bookmarks/toggle/${id}/`, {}, { headers: { Authorization: `Bearer ${token}` } }),
  
  // Comments
  getComments: (chapterId) => axios.get(`${API_URL}/comments/${chapterId}/`),
  postComment: (chapterId, text, token) => axios.post(
      `${API_URL}/comments/post/${chapterId}/`, 
      { text: text }, 
      { headers: { Authorization: `Bearer ${token}` } }
  ),
  deleteComment: (commentId, token) => axios.delete(
      `${API_URL}/comments/delete/${commentId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
  ),
  // Ratings
  rateNovel: (id, score, token) => axios.post(`${API_URL}/novels/${id}/rate/`, { score }, { headers: { Authorization: `Bearer ${token}` } }),
  getNovelsByTag: (slug) => axios.get(`${API_URL}/tag/${slug}/`),
};