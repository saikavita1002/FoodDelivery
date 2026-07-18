import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (foodId, quantity = 1) => api.post('/cart/add', { foodId, quantity });
export const updateCartItem = (foodId, quantity) => api.put('/cart/update', { foodId, quantity });
export const removeFromCart = (foodId) => api.delete(`/cart/remove/${foodId}`);
