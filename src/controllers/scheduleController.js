// server/src/controllers/scheduleController.js
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');

const scheduleController = {
    /**
     * Adiciona um horário de funcionamento para o profissional logado.
     */
    addSchedule: async (req, res, next) => {
        try {
            const { dayOfWeek, startTime, endTime } = req.body;
            const professionalId = req.user._id;

            // TODO: Adicionar validação para evitar horários duplicados ou sobrepostos

            const schedule = new Schedule({
                professional: professionalId,
                dayOfWeek,
                startTime,
                endTime
            });
            await schedule.save();

            res.status(201).json({ message: 'Horário de funcionamento salvo com sucesso!', schedule });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Obtém todos os horários de funcionamento do profissional logado.
     */
    getSchedulesByProfessional: async (req, res, next) => {
        try {
            const professionalId = req.user._id;
            const schedules = await Schedule.find({ professional: professionalId });
            res.json(schedules);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Obtém os horários disponíveis de um profissional para um cliente.
     * Lógica completa de verificação de disponibilidade.
     */
    getAvailableHours: async (req, res, next) => {
        try {
            const { professionalId, date } = req.query;
            if (!professionalId || !date) {
                return res.status(400).json({ error: 'Parâmetros professionalId e date são obrigatórios.' });
            }

            const selectedDate = new Date(date);
            const dayOfWeek = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
            const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

            // 1. Encontra os horários de funcionamento do profissional para o dia da semana
            const professionalSchedules = await Schedule.find({
                professional: professionalId,
                dayOfWeek: capitalizedDay
            });

            if (professionalSchedules.length === 0) {
                return res.json([]); // Nenhum horário de funcionamento para este dia
            }

            // 2. Encontra todos os agendamentos já existentes para o profissional nesta data
            const existingAppointments = await Appointment.find({
                professional: professionalId,
                date: {
                    $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                    $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
                },
                canceled: false
            }).populate('service');

            // 3. Calcula os horários disponíveis
            const availableHours = [];
            const now = new Date();

            professionalSchedules.forEach(schedule => {
                let currentHour = new Date(selectedDate.setHours(parseInt(schedule.startTime.split(':')[0]), parseInt(schedule.startTime.split(':')[1]), 0));
                const endTime = new Date(selectedDate.setHours(parseInt(schedule.endTime.split(':')[0]), parseInt(schedule.endTime.split(':')[1]), 0));

                while (currentHour < endTime) {
                    const serviceDuration = 30; // Duração padrão do serviço em minutos, ou buscar do Service model
                    const slotEnd = new Date(currentHour.getTime() + serviceDuration * 60000);

                    // Verifica se o horário não está no passado e não se sobrepõe a um agendamento existente
                    const isOverlapping = existingAppointments.some(appointment => {
                        const appointmentStart = new Date(appointment.date);
                        const appointmentEnd = new Date(appointmentStart.getTime() + appointment.service.duration * 60000);

                        // Lógica de sobreposição
                        return (currentHour < appointmentEnd && slotEnd > appointmentStart);
                    });

                    if (!isOverlapping && currentHour > now) {
                        availableHours.push({
                            time: currentHour.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                            timestamp: currentHour.toISOString()
                        });
                    }

                    currentHour = slotEnd;
                }
            });

            res.json(availableHours);
        } catch (err) {
            next(err);
        }
    }
};

module.exports = scheduleController;