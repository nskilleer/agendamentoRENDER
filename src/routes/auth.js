const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email já cadastrado' });
        const user = await User.create({ name, email, password, role });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });
        const ok = await user.comparePassword(password);
        if (!ok) return res.status(400).json({ error: 'Credenciais inválidas' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) { next(err); }
});

module.exports = router;
