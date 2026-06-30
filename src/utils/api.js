import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});
// Payments
export const createBookingOrder = (data) => API.post('/payments/create-order', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);
export const fetchMyBookings = () => API.get('/payments/my-bookings');
export const fetchReceivedBookings = () => API.get('/payments/received-bookings');
export const createLinkedAccount = (data) => API.post('/payments/linked-account', data);
// Properties
export const fetchProperties = (params) => API.get('/properties', { params });
export const fetchFeatured = () => API.get('/properties/featured');
export const fetchProperty = (id) => API.get(`/properties/${id}`);
export const fetchMyProperties = () => API.get('/properties/my');
export const createProperty = (data) => API.post('/properties', data);
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Users
export const updateProfile = (data) => API.put('/users/profile', data);
export const toggleFavorite = (id) => API.post(`/users/favorites/${id}`);
export const getFavorites = () => API.get('/users/favorites');

export default API;
