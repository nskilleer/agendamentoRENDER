// client/src/services/api.js
import axios from 'axios';

// Cria uma instância do Axios apontando para o seu backend
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

// Adiciona o token de autenticação em todas as requisições
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete api.defaults.headers.common['x-auth-token'];
    }
};

export default api;