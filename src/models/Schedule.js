// server/src/models/Schedule.js
const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia o modelo de usuário com a 'role' 'pro'
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        required: true
    },
    startTime: {
        type: String, // ex: "09:00"
        required: true
    },
    endTime: {
        type: String, // ex: "18:00"
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
