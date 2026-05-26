// API Configuration
const API_BASE_URL = 'https://krishi-ai-2-4j3k.onrender.com';
window.API_BASE_URL = API_BASE_URL;

// Helper function to construct API endpoints
const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
window.getApiUrl = getApiUrl;
