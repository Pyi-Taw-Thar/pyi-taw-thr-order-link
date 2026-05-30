import api from './axios';

interface LoginData {
  token: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
  };
}

const HARDCODED_PASSWORD = 'password123';

const authService = {
  login: async (phone: string): Promise<void> => {
    const response = await api.post<{ success: boolean; data: LoginData }>('/customer/login', {
      phone,
      password: HARDCODED_PASSWORD,
    });
    const { token, customer } = response.data.data;

    localStorage.setItem('access_token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user_phone', customer.phone);
    localStorage.setItem('user_info', JSON.stringify(customer));
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_info');
  },

  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },
};

export default authService;
