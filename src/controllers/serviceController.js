// server/src/controllers/serviceController.js
const Service = require('../models/Service');

const serviceController = {
    /**
     * Adiciona um novo serviço para o profissional logado.
     */
    addService: async (req, res, next) => {
        try {
            const { name, duration, price } = req.body;
            const professionalId = req.user._id;

            const service = new Service({
                name,
                duration,
                price,
                professional: professionalId
            });
            await service.save();

            res.status(201).json({ message: 'Serviço adicionado com sucesso!', service });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Obtém todos os serviços de um profissional específico.
     */
    getServicesByProfessional: async (req, res, next) => {
        try {
            const professionalId = req.user._id;
            const services = await Service.find({ professional: professionalId });
            res.json(services);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Obtém serviços de todos os profissionais para o cliente.
     * Rota pública.
     */
    getAllServicesForClients: async (req, res, next) => {
        try {
            const services = await Service.find().populate('professional', 'name');
            res.json(services);
        } catch (err) {
            next(err);
        }
    },

    /**
     * Obtém os serviços de um profissional específico para a página do cliente.
     */
    getServicesForClient: async (req, res, next) => {
        try {
            const { professionalId } = req.params;
            const services = await Service.find({ professional: professionalId });
            res.json(services);
        } catch (err) {
            next(err);
        }
    }
};

module.exports = serviceController;