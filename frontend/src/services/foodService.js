import api from './api';

export const getFoods = (restaurantId) =>
  api.get('/foods', { params: restaurantId ? { restaurantId } : {} });
export const searchFoods = (query) => api.get('/foods/search', { params: { q: query } });
export const getFoodById = (id) => api.get(`/foods/${id}`);
export const addFood = (formData) =>
  api.post('/foods', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateFood = (id, formData) =>
  api.put(`/foods/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteFood = (id) => api.delete(`/foods/${id}`);
