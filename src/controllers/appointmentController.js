// server/src/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const appointmentController = {
    /**
     * Obtém os agendamentos do usuário logado (cliente ou profissional).
     */
    getAppointments: async (req, res, next) => {
        try {
            const isPro = req.user.role === 'pro';
            const query = isPro ? { professional: req.user._id } : { user: req.user._id };

            const appointments = await Appointment.find({ ...query, canceled: false })
                .populate('user', 'name email')
                .populate('professional', 'name email')
                .sort('date');

            res.json(appointments);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Cria um novo agendamento (somente para clientes).
     */
    createAppointment: async (req, res, next) => {
        if (req.user.role !== 'user') {
            return res.status(403).json({ error: 'Apenas clientes podem criar agendamentos.' });
        }

        try {
            const { title, date, notes, professionalId } = req.body;

            // TODO: Adicionar validações de horário, data e disponibilidade

            const appointment = await Appointment.create({
                title,
                date,
                notes,
                user: req.user._id,
                professional: professionalId
            });

            res.status(201).json(appointment);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Cancela um agendamento.
     */
    cancelAppointment: async (req, res, next) => {
        try {
            const { id } = req.params;

            const appointment = await Appointment.findOneAndUpdate(
                {
                    _id: id,
                    $or: [{ user: req.user._id }, { professional: req.user._id }] // Permite que o cliente ou o profissional cancele
                },
                { canceled: true },
                { new: true }
            );

            if (!appointment) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }

            res.json(appointment);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = appointmentController;