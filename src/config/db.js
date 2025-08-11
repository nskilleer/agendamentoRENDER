const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI não definido');
        process.exit(1);
    }
    try {
        await mongoose.connect(uri, {
            // opções modernas do mongoose
        });
        console.log('MongoDB conectado');
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', err);
        process.exit(1);
    }
}

module.exports = { connectDB };
