import apiClient from './apiClient';

export async function getDashboardSummary() {
  const response = await apiClient.get('/dashboard/summary');
  return response.data;
}

export async function getDashboardAnalytics() {
  const response = await apiClient.get('/dashboard/analytics');
  return response.data;
}
