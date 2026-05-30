require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeAndCoffee';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(' Conectado ao MongoDB com sucesso!');
  })
  .catch((err) => {
    console.error(' Erro ao conectar ao MongoDB:', err.message);
  });

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor Code&Coffee funcionando!',
    timestamp: new Date()
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Exemplo de direcionamento para SPA
app.get('*', (req, res, next) => {
  // Se a rota começar com /api, não direciona para o frontend, deixa bater nas rotas da API ou 404
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de tratamento de erros global
app.use(errorHandler);

// Inicializar Servidor
app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});
