import api from './api';

export const getRestaurants = () => api.get('/restaurants');
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (formData) =>
  api.post('/restaurants', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateRestaurant = (id, formData) =>
  api.put(`/restaurants/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);
