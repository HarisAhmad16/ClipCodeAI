export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_V1_STR = '/api/v1';

export const getApiUrl = (path) => {
    return `${API_BASE_URL}${API_V1_STR}${path}`;
};