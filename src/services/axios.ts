import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/customer/login');
    const msg = String(error.response?.data?.message || '').toLowerCase();
    const isTokenExpired =
      error.response?.status === 401 ||
      msg.includes('jwt expired') ||
      msg.includes('token expired') ||
      msg.includes('invalid token');

    if (isTokenExpired && !isLoginRequest) {
      // authService.logout() နှင့် တူညီ (auth.service က ဤဖိုင်ကို import လုပ်၍ circular import ရှောင်ရန် တိုက်ရိုက်ရေးသည်)
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('user_info');
      // URL မပြောင်းဘဲ reload — Login screen ပြပြီး login ဝင်လျှင် ဤ page သို့ ပြန်ရောက်မည်
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
