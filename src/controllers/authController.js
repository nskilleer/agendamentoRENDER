// server/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, role } = req.body;
            const exists = await User.findOne({ email });
            if (exists) {
                return res.status(400).json({ error: 'Email já cadastrado.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashedPassword, role });

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token
            });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ error: 'Credenciais inválidas.' });
            }

            const ok = await bcrypt.compare(password, user.password);

            if (!ok) {
                return res.status(400).json({ error: 'Credenciais inválidas.' });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = authController;