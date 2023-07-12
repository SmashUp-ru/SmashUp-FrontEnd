import axios from 'axios';

// Создание экземпляра axios с базовым URL-адресом API
const api = axios.create({
  baseURL: 'https://api.smashup.ru',
});

export default api;