const express = require('express');
const router = express.Router();
const {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto
} = require('../controllers/produtoController');
const { proteger, admin } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', listarProdutos);
router.get('/:id', obterProdutoPorId);

// Rotas restritas para Administradores
router.post('/', proteger, admin, criarProduto);
router.put('/:id', proteger, admin, atualizarProduto);
router.delete('/:id', proteger, admin, excluirProduto);

module.exports = router;
