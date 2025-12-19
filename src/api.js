import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Novel Data
  getHomeData: () => axios.get(`${BASE_URL}/home/`),
  getNovels: () => axios.get(`${BASE_URL}/novels/`),
  getDetail: (id) => axios.get(`${BASE_URL}/novels/${id}/`),
  getChapter: (id) => axios.get(`${BASE_URL}/chapters/${id}/`),
  
  // User Data (Butuh Token)
  login: (creds) => axios.post(`${BASE_URL}/token/`, creds),
  register: (data) => axios.post(`${BASE_URL}/register/`, data), // <--- TAMBAHAN
  
  // User Features
  getBookmarks: (token) => axios.get(`${BASE_URL}/bookmarks/`, { headers: { Authorization: `Bearer ${token}` } }),
  toggleBookmark: (id, token) => axios.post(`${BASE_URL}/bookmarks/toggle/${id}/`, {}, { headers: { Authorization: `Bearer ${token}` } }),

  // Comments System
  getComments: (chapterId) => axios.get(`${BASE_URL}/comments/${chapterId}/`),
  
  postComment: (chapterId, text, token) => axios.post(
      `${BASE_URL}/comments/post/${chapterId}/`, 
      { text: text }, 
      { headers: { Authorization: `Bearer ${token}` } }
  ),

  deleteComment: (commentId, token) => axios.delete(
      `${BASE_URL}/comments/delete/${commentId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
  ),
};