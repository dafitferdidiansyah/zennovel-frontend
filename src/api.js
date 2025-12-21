import axios from 'axios';

// Ganti ini saja jika URL berubah
// export const BASE_URL = 'https://dafit29.pythonanywhere.com'; 
export const BASE_URL = 'http://localhost:8000';
export const API_URL = `${BASE_URL}/api`;

export const api = {
  // Gunakan API_URL disini
  getHomeData: (token) => {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      return axios.get(`${API_URL}/home/`, config);
  },
  getNovels: (params) => axios.get(`${API_URL}/novels/`, { params }),
  getDetail: (id, token) => {
    // Tambahkan header Authorization jika token ada
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return axios.get(`${API_URL}/novels/${id}`, config);
},
  getChapter: (id) => axios.get(`${API_URL}/chapters/${id}/`),
  updateProgress: (novelId, chapterId, token) => axios.post(
      `${API_URL}/progress/${novelId}/${chapterId}/`, 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
  ),
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
  getNovelsByTag: (tag) => axios.get(`${API_URL}/novels/?tag=${tag}`),
  getNovelsByGenre: (genre) => axios.get(`${API_URL}/novels/?genre=${genre}`),
  getGenres: () => axios.get(`${API_URL}/genres/`),

};