// server/src/routes/appointments.js
const express = require('express');
const auth = require('../middlewares/authMiddleware');
const serviceController = require('../controllers/serviceController');
const scheduleController = require('../controllers/scheduleController');
const appointmentController = require('../controllers/appointmentController');
const User = require('../models/User');

const router = express.Router();

// Rotas públicas (não precisam de autenticação)
// ----------------------------------------------------------------------
// Rota para buscar todos os profissionais
router.get('/public/professionals', async (req, res, next) => {
    try {
        const professionals = await User.find({ role: 'pro' }).select('-password');
        res.json(professionals);
    } catch (err) { next(err); }
});

// Rota para buscar serviços de um profissional específico
router.get('/public/services/:professionalId', serviceController.getServicesForClient);

// Rota para buscar horários disponíveis de um profissional em uma data específica
router.get('/public/available-hours', scheduleController.getAvailableHours);

// Rotas privadas (precisam de autenticação)
// ----------------------------------------------------------------------
router.use(auth); // Aplica o middleware de autenticação para todas as rotas abaixo

// Rotas para Agendamentos
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

// Rotas para Serviços do Profissional
router.post('/services', serviceController.addService);
router.get('/services', serviceController.getServicesByProfessional);

// Rotas para Horários do Profissional
router.post('/schedules', scheduleController.addSchedule);
router.get('/schedules', scheduleController.getSchedulesByProfessional);


module.exports = router;