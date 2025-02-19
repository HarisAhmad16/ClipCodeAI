import { getApiUrl } from './config';

class ApiClient {
    async request(endpoint, options = {}) {
        const { data, ...customConfig } = options;
        
        const config = {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            ...customConfig,
        };

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(getApiUrl(endpoint), config);
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject({ detail: 'Session expired. Please login again.' });
            }

            if (!response.ok) {
                const error = await response.json();
                return Promise.reject(error);
            }

            return response.json();
        } catch (error) {
            console.error('API Error:', error);
            return Promise.reject(error);
        }
    }

    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, data, options) {
        return this.request(endpoint, { ...options, method: 'POST', data });
    }

    patch(endpoint, data, options) {
        return this.request(endpoint, { ...options, method: 'PATCH', data });
    }

    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();