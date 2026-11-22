import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export const pharmacyAPI = {
  getAll: async () => {
    const response = await api.get('/pharmacies');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/pharmacies/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/pharmacies', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/pharmacies/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/pharmacies/${id}`);
    return response.data;
  }
};

export const medicineAPI = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const response = await api.get(`/medicines?${searchParams.toString()}`);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get(`/medicines?search=${encodeURIComponent(query)}&isActive=true`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/medicines', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/medicines/${id}`, data);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/medicines/${id}/status`);
    return response.data;
  },
  importMedicines: async (data) => {
    const response = await api.post('/medicines/import', data);
    return response.data;
  }
};

export const inventoryAPI = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const response = await api.get(`/inventory?${searchParams.toString()}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  }
};

export const searchAPI = {
  searchMedicines: async (requestPayload) => {
    // requestPayload: { medicines: [{id, quantity}], location: string }
    const response = await api.post('/search', requestPayload);
    return response.data;
  }
};

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const routingAPI = {
  calculateRoute: async (origin, destinations) => {
    const response = await api.post('/route/calculate', { origin, destinations });
    return response.data;
  }
};

export const optimizationAPI = {
  getPharmacyPlan: async (requestPayload) => {
    const response = await api.post('/optimization/pharmacy-plan', requestPayload);
    return response.data;
  }
};

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  googleLogin: async (credential, mode = 'login') => {
    const response = await api.post('/auth/google', { credential, mode });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default api;


export const shortageAPI = {
  predictShortage: async (pharmacyId, medicineId) => {
    const response = await api.post('/shortage/predict', { pharmacyId, medicineId });
    return response.data;
  }
};

export const reliabilityAPI = {
  getReliability: async (pharmacyId) => {
    const response = await api.get(`/pharmacies/${pharmacyId}/reliability`);
    return response.data;
  }
};

export const deliveryTimeAPI = {
  predictDeliveryTime: async (pharmacyId, location) => {
    const response = await api.post('/delivery-time/predict', { pharmacyId, location });
    return response.data;
  }
};

export const recommendationAPI = {
  getRecommendations: async (medicineId, qty = 1) => {
    const response = await api.get(`/recommendations/${medicineId}?qty=${qty}`);
    return response.data;
  }
};

export const userAPI = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

export const adminAPI = {
  getSystemStatus: async () => {
    const response = await api.get('/admin/system-status');
    return response.data;
  },
  getMetrics: () => api.get('/admin/metrics'),
};
