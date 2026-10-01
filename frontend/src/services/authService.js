import apiClient from './apiClient';

export async function register(fullName, email, password, phoneNumber) {
  const response = await apiClient.post('/auth/register', {
    fullName,
    email,
    password,
    phoneNumber,
  });
  return response.data;
}

export async function login(email, password) {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data;
}