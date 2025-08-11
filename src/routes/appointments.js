const express = require('express');
const Appointment = require('../models/Appointment');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res, next) => {
    try {
        const list = await Appointment.find({ user: req.user._id, canceled: false }).sort('date');
        res.json(list);
    } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
    try {
        const { title, date, notes } = req.body;
        const ap = await Appointment.create({ title, date, notes, user: req.user._id });
        res.status(201).json(ap);
    } catch (err) { next(err); }
});

router.patch('/:id/cancel', async (req, res, next) => {
    try {
        const ap = await Appointment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { canceled: true },
            { new: true }
        );
        if (!ap) return res.status(404).json({ error: 'Agendamento não encontrado' });
        res.json(ap);
    } catch (err) { next(err); }
});

module.exports = router;
