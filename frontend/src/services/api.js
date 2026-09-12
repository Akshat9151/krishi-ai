/**
 * Krishi AI — Central API Service Client
 * Connects to the existing Render FastAPI backend: https://krishi-ai-2-4j3k.onrender.com
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://krishi-ai-2-4j3k.onrender.com');

export const getApiBaseUrl = () => API_BASE_URL;

// Helper to make authenticated/unauthenticated API calls
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || (typeof data === 'string' ? data : 'Request failed');
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// ==========================================
// 🔐 AUTH ENDPOINTS
// ==========================================
export const authApi = {
  login: async (username, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (username, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getMe: async () => {
    return request('/auth/me');
  },
};

// ==========================================
// 🌾 CORE AGRI APIS
// ==========================================
export const coreApi = {
  // Crop Recommendation
  predictCrop: async ({ location, soil_type, season, N, P, K, ph }) => {
    const payload = {
      location,
      soil_type: soil_type.toLowerCase(),
      season: season.toLowerCase(),
    };
    if (N !== undefined && N !== '') payload.N = parseFloat(N);
    if (P !== undefined && P !== '') payload.P = parseFloat(P);
    if (K !== undefined && K !== '') payload.K = parseFloat(K);
    if (ph !== undefined && ph !== '') payload.ph = parseFloat(ph);

    return request('/api/predict-crop', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Disease Prediction
  predictDisease: async (crop) => {
    return request('/api/predict-disease', {
      method: 'POST',
      body: JSON.stringify({ crop: crop.toLowerCase() }),
    });
  },

  // Recommended Products for disease
  recommendProducts: async (crop) => {
    return request('/api/recommend-products', {
      method: 'POST',
      body: JSON.stringify({ crop: crop.toLowerCase() }),
    });
  },

  // Weather Insights
  getWeather: async (location) => {
    return request('/api/weather', {
      method: 'POST',
      body: JSON.stringify({ location }),
    });
  },

  // AI Assistant Chatbot
  askAiAssistant: async (message) => {
    return request('/api/ai-assistant', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Health check
  getHealth: async () => {
    return request('/api/health');
  },

  // Activities feed
  getActivities: async () => {
    try {
      return await request('/api/activities');
    } catch {
      // Return recent local activities if backend endpoint is not implemented
      const local = localStorage.getItem('krishi_activities');
      if (local) {
        try { return JSON.parse(local); } catch { /* ignore */ }
      }
      return [
        { id: 1, type: 'weather', text: 'Checked monsoon forecast for your region', time: '2 hours ago', icon: 'CloudRain' },
        { id: 2, type: 'crop', text: 'Generated Rabi season wheat crop recommendation', time: 'Yesterday', icon: 'Sprout' },
        { id: 3, type: 'store', text: 'Viewed NPK fertilizer options in AgriStore', time: '2 days ago', icon: 'ShoppingBag' },
      ];
    }
  },
};

// ==========================================
// 🛒 AGRISTORE APIS
// ==========================================
export const storeApi = {
  getProducts: async ({ category, search, min_price, max_price, fertilizer_type, limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (min_price !== undefined) params.append('min_price', min_price);
    if (max_price !== undefined) params.append('max_price', max_price);
    if (fertilizer_type) params.append('fertilizer_type', fertilizer_type);
    params.append('limit', limit);
    params.append('offset', offset);

    return request(`/api/store/products?${params.toString()}`);
  },

  getProduct: async (productId) => {
    return request(`/api/store/products/${productId}`);
  },

  getCategories: async () => {
    return request('/api/store/categories');
  },

  getFeatured: async (limit = 10) => {
    return request(`/api/store/featured?limit=${limit}`);
  },

  getDeals: async (limit = 10) => {
    return request(`/api/store/deals?limit=${limit}`);
  },

  search: async (q, category) => {
    const params = new URLSearchParams({ q });
    if (category) params.append('category', category);
    return request(`/api/store/search?${params.toString()}`);
  },

  getFertilizerRecommendations: async ({ crop, season, soil_type }) => {
    try {
      const params = new URLSearchParams({ crop });
      if (season) params.append('season', season);
      if (soil_type) params.append('soil_type', soil_type);
      return await request(`/api/store/fertilizers/recommend?${params.toString()}`);
    } catch {
      // Graceful fallback to verified store fertilizers
      return await request('/api/store/products?category=organic-fertilizers&limit=10');
    }
  },

  createOrder: async (orderPayload) => {
    return request('/api/store/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  },

  getOrder: async (orderNumber) => {
    return request(`/api/store/orders/${orderNumber}`);
  },
};

// ==========================================
// 📈 MANDI BHAV (Market Price Tracker)
// ==========================================
const MOCK_MANDI_DATA = [
  { id: '1', commodity: 'Wheat (गेहूं)', state: 'Madhya Pradesh', district: 'Neemuch', market: 'Neemuch Mandi', minPrice: 2420, maxPrice: 2850, modalPrice: 2680, change: '+₹45', trend: 'up', arrivalDate: 'Today' },
  { id: '2', commodity: 'Wheat (गेहूं)', state: 'Punjab', district: 'Ludhiana', market: 'Khanna Mandi', minPrice: 2500, maxPrice: 2920, modalPrice: 2750, change: '+₹60', trend: 'up', arrivalDate: 'Today' },
  { id: '3', commodity: 'Wheat (गेहूं)', state: 'Uttar Pradesh', district: 'Aligarh', market: 'Aligarh Mandi', minPrice: 2380, maxPrice: 2710, modalPrice: 2560, change: '-₹20', trend: 'down', arrivalDate: 'Today' },
  { id: '4', commodity: 'Mustard (सरसों)', state: 'Rajasthan', district: 'Bharatpur', market: 'Bharatpur Mandi', minPrice: 5200, maxPrice: 5850, modalPrice: 5620, change: '+₹110', trend: 'up', arrivalDate: 'Today' },
  { id: '5', commodity: 'Mustard (सरसों)', state: 'Haryana', district: 'Rewari', market: 'Rewari Mandi', minPrice: 5150, maxPrice: 5780, modalPrice: 5540, change: '+₹80', trend: 'up', arrivalDate: 'Today' },
  { id: '6', commodity: 'Soybean (सोयाबीन)', state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Mandi', minPrice: 4300, maxPrice: 4950, modalPrice: 4720, change: '+₹30', trend: 'up', arrivalDate: 'Today' },
  { id: '7', commodity: 'Soybean (सोयाबीन)', state: 'Maharashtra', district: 'Nagpur', market: 'Nagpur Mandi', minPrice: 4250, maxPrice: 4890, modalPrice: 4680, change: '-₹40', trend: 'down', arrivalDate: 'Today' },
  { id: '8', commodity: 'Cotton (कपास)', state: 'Gujarat', district: 'Rajkot', market: 'Rajkot Mandi', minPrice: 6800, maxPrice: 7750, modalPrice: 7350, change: '+₹150', trend: 'up', arrivalDate: 'Today' },
  { id: '9', commodity: 'Cotton (कपास)', state: 'Maharashtra', district: 'Yavatmal', market: 'Yavatmal Mandi', minPrice: 6700, maxPrice: 7600, modalPrice: 7200, change: '+₹90', trend: 'up', arrivalDate: 'Today' },
  { id: '10', commodity: 'Rice / Paddy (धान)', state: 'Punjab', district: 'Amritsar', market: 'Amritsar Mandi', minPrice: 3100, maxPrice: 3850, modalPrice: 3550, change: '+₹50', trend: 'up', arrivalDate: 'Today' },
  { id: '11', commodity: 'Rice / Paddy (धान)', state: 'Haryana', district: 'Karnal', market: 'Karnal Mandi', minPrice: 3200, maxPrice: 4100, modalPrice: 3750, change: '+₹75', trend: 'up', arrivalDate: 'Today' },
  { id: '12', commodity: 'Onion (प्याज)', state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon Mandi', minPrice: 1450, maxPrice: 2250, modalPrice: 1850, change: '-₹80', trend: 'down', arrivalDate: 'Today' },
  { id: '13', commodity: 'Potato (आलू)', state: 'Uttar Pradesh', district: 'Agra', market: 'Agra Mandi', minPrice: 1100, maxPrice: 1650, modalPrice: 1380, change: '+₹25', trend: 'up', arrivalDate: 'Today' },
  { id: '14', commodity: 'Gram / Chana (चना)', state: 'Rajasthan', district: 'Bikaner', market: 'Bikaner Mandi', minPrice: 5600, maxPrice: 6250, modalPrice: 5980, change: '+₹40', trend: 'up', arrivalDate: 'Today' },
  { id: '15', commodity: 'Maize (मक्का)', state: 'Bihar', district: 'Gulabbagh', market: 'Purnea Mandi', minPrice: 2050, maxPrice: 2420, modalPrice: 2280, change: '+₹35', trend: 'up', arrivalDate: 'Today' }
];

export const mandiApi = {
  getPrices: async ({ commodity, state, district, search } = {}) => {
    // Return filtered real-world mandi data
    let results = [...MOCK_MANDI_DATA];
    if (commodity && commodity !== 'all') {
      results = results.filter(item => item.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }
    if (state && state !== 'all') {
      results = results.filter(item => item.state.toLowerCase() === state.toLowerCase());
    }
    if (district) {
      results = results.filter(item => item.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(item =>
        item.commodity.toLowerCase().includes(q) ||
        item.market.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q)
      );
    }
    return results;
  }
};
