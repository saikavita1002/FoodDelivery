import api from './api';

export const placeOrder = (deliveryAddress) => api.post('/orders', { deliveryAddress });
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const getRestaurantOrders = (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`);
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/status/${id}`, { status });
