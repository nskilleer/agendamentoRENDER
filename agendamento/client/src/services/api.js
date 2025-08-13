import axios from 'axios';

// URL base da sua API. Altere para a URL do seu servidor Render quando implantar.
const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;