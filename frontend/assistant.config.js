const API_BASE_URL = import.meta.env?.VITE_API_URL || "https://krishi-ai-2-4j3k.onrender.com";
window.API_BASE_URL = API_BASE_URL;
const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
window.getApiUrl = getApiUrl;
export { API_BASE_URL, getApiUrl };
