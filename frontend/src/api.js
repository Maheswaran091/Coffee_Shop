import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  r => r,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const { data } = await axios.post('http://localhost:8000/api/auth/refresh/', { refresh });
          localStorage.setItem('access', data.access);
          err.config.headers.Authorization = `Bearer ${data.access}`;
          return API(err.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: d => API.post('/auth/register/', d),
  login: d => API.post('/auth/login/', d),
  profile: () => API.get('/auth/profile/'),
  updateProfile: d => API.put('/auth/profile/', d),
};

export const menuAPI = {
  categories: () => API.get('/categories/'),
  items: params => API.get('/menu/', { params }),
  item: id => API.get(`/menu/${id}/`),
  reviews: id => API.get(`/menu/${id}/reviews/`),
  addReview: (id, d) => API.post(`/menu/${id}/reviews/`, d),
};

export const tableAPI = {
  list: () => API.get('/tables/'),
};

export const bookingAPI = {
  list: () => API.get('/bookings/'),
  create: d => API.post('/bookings/', d, {
    headers: { 'Content-Type': 'application/json' }
  }),
  cancel: id => API.delete(`/bookings/${id}/`),
};

export const orderAPI = {
  list: () => API.get('/orders/'),
  create: d => API.post('/orders/', d),
  detail: id => API.get(`/orders/${id}/`),
  cancel: id => API.put(`/orders/${id}/`, { status: 'cancelled' }),
};

export const offerAPI = {
  list: () => API.get('/offers/'),
};

export const contactAPI = {
  send: d => API.post('/contact/', d),
};

export default API;
