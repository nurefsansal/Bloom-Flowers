import apiClient from './apiClient';

export async function getProducts() {
  const response = await apiClient.get('/products');
  return response.data;
}

export async function getProductById(id) {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
}

export async function createProduct(data) {
  const formData = new FormData();

  formData.append('Name', data.name);
  formData.append('Description', data.description || '');
  formData.append('Price', data.price);
  formData.append('StockQuantity', data.stockQuantity);
  formData.append('CategoryId', data.categoryId);

  if (data.image) {
    formData.append('Image', data.image);
  }

  const response = await apiClient.post('/products', formData);

  return response.data;
}

export async function updateProduct(id, data) {
  const formData = new FormData();

  formData.append('Name', data.name);
  formData.append('Description', data.description || '');
  formData.append('Price', data.price);
  formData.append('StockQuantity', data.stockQuantity);
  formData.append('CategoryId', data.categoryId);

  if (data.image) {
    formData.append('Image', data.image);
  }

  const response = await apiClient.put(
    `/products/${id}`,
    formData
  );

  return response.data;
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`);
}