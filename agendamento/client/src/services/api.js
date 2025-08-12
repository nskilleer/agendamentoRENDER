import axios from 'axios';

// A URL base da API. Use a URL do Render em produção e 'http://localhost:3001/api' localmente.
// Renderizará um ambiente automaticamente e, se o Renderizar definir uma variável de ambiente `API_URL`,
// o código pode ser mais flexível.
const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Altere para a URL do seu servidor Render
});

// Função para configurar o token de autenticação
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;