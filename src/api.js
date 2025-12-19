import axios from 'axios';

// Ganti URL ini dengan URL PythonAnywhere Anda
const BASE_URL = 'https://dafit29.pythonanywhere.com/api';

export const api = {
  getNovels: () => axios.get(`${BASE_URL}/novels/`),
  getDetail: (id) => axios.get(`${BASE_URL}/novels/${id}/`),
  getChapter: (id) => axios.get(`${BASE_URL}/chapters/${id}/`)
};