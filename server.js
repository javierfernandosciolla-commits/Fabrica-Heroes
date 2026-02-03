require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/story', require('./routes/story'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/image', require('./routes/image'));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Fábrica de Héroes backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
