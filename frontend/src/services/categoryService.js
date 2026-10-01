import apiClient from './apiClient';

export async function getCategories() {
  const response = await apiClient.get('/categories');

  return response.data;
}

export async function createCategory(data) {
  const response = await apiClient.post('/categories', data);

  return response.data;
}

export async function updateCategory(id, data) {
  const response = await apiClient.put(`/categories/${id}`, data);

  return response.data;
}

export async function deleteCategory(id) {
  await apiClient.delete(`/categories/${id}`);
}