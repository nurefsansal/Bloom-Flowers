import apiClient from './apiClient';

export async function createOrder(data) {
  const response = await apiClient.post('/orders', data);
  return response.data;
}

export async function getOrders() {
  const response = await apiClient.get('/orders');
  return response.data;
}

export async function getOrderById(id) {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
}

export async function getAllOrders() {
  const response = await apiClient.get('/orders/admin');
  return response.data;
}

export async function getOrderByIdAdmin(id) {
  const response = await apiClient.get(`/orders/admin/${id}`);
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await apiClient.put(
    `/orders/admin/${id}/status`,
    {
      status,
    }
  );

  return response.data;
}