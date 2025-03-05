import axios from 'axios';
const BASE_URL ='http://localhost:1502'
const axiosInstance = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
