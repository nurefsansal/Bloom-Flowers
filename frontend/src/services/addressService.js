import apiClient from './apiClient';

export async function getAddresses() {
  const response = await apiClient.get('/addresses');
  return response.data;
}

export async function createAddress(data) {
  const response = await apiClient.post('/addresses', data);
  return response.data;
}