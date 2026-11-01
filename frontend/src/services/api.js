import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization Token to outgoing requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Unified Error Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Token expired or invalid
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

// 1. Health
export const getHealth = async () => {
    const response = await api.get('/');
    return response.data;
};

// 2. Prediction API
export const predictLandslide = async (data) => {
    const response = await api.post('/predict', data);
    return response.data;
};

// 3. Auth API
export const loginUser = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.put('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
    });
    return response.data;
};

export const requestPasswordReset = async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
};

export const confirmPasswordReset = async (email, resetCode, newPassword) => {
    const response = await api.post('/api/auth/reset-password', {
        email,
        reset_code: resetCode,
        new_password: newPassword,
    });
    return response.data;
};

// 4. Dashboard & Analytics API
export const getDashboardSummary = async () => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
};

export const getPredictionHistory = async (params = {}) => {
    const response = await api.get('/api/dashboard/history', { params });
    return response.data;
};

export const deletePrediction = async (predId) => {
    const response = await api.delete(`/api/dashboard/history/${predId}`);
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get('/api/dashboard/analytics');
    return response.data;
};

// 5. Saved Locations API
export const getSavedLocations = async () => {
    const response = await api.get('/api/dashboard/locations');
    return response.data;
};

export const createSavedLocation = async (locationData) => {
    const response = await api.post('/api/dashboard/locations', locationData);
    return response.data;
};

export const deleteSavedLocation = async (locId) => {
    const response = await api.delete(`/api/dashboard/locations/${locId}`);
    return response.data;
};

export default api;
