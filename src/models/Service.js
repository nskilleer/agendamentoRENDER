// server/src/models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number, // Duração em minutos
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia o modelo de usuário, onde a 'role' é 'pro'
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);