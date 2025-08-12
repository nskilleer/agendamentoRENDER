// server/src/index.js
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3001; // Usa a porta do ambiente (Render) ou 3001 localmente
const MONGO_URI = process.env.MONGO_URI;

// Conecta ao MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens
app.use(express.json()); // Habilita o Express a ler JSON no corpo das requisições

// Rotas da API
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api/appointments', appointmentRoutes); // Rotas de agendamentos, serviços, etc.

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});