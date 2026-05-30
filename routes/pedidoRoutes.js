const express = require('express');
const router = express.Router();
const {
  criarPedido,
  listarMeusPedidos,
  atualizarStatusPedido
} = require('../controllers/pedidoController');
const { proteger, admin } = require('../middleware/authMiddleware');

// Todas as rotas de pedidos exigem autenticação
router.use(proteger);

// Rotas do cliente autenticado
router.post('/', criarPedido);
router.get('/', listarMeusPedidos);

// Rota do administrador para gerenciar status do pedido
router.patch('/:id', admin, atualizarStatusPedido);

module.exports = router;
