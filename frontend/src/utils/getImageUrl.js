const API_BASE_URL = 'https://localhost:7290';

export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return '';
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}