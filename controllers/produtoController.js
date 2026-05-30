const Produto = require('../models/Produto');

// @desc    Listar todos os produtos (com filtros opcionais)
// @route   GET /api/produtos
// @access  Público
const listarProdutos = async (req, res, next) => {
  try {
    const { categoria, disponivel } = req.query;
    const filtro = {};

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (disponivel) {
      filtro.disponivel = disponivel === 'true';
    }

    const produtos = await Produto.find(filtro).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      results: produtos.length,
      data: produtos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter um produto específico pelo ID
// @route   GET /api/produtos/:id
// @access  Público
const obterProdutoPorId = async (req, res, next) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        status: 'error',
        message: 'Produto não encontrado'
      });
    }

    res.json({
      status: 'success',
      data: produto
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Criar um novo produto
// @route   POST /api/produtos
// @access  Privado (Admin)
const criarProduto = async (req, res, next) => {
  try {
    const { nome, descricao, preco, categoria, imagemUrl, disponivel } = req.body;

    const produto = await Produto.create({
      nome,
      descricao,
      preco,
      categoria,
      imagemUrl: imagemUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // Imagem padrão caso não fornecida
      disponivel: disponivel !== undefined ? disponivel : true
    });

    res.status(201).json({
      status: 'success',
      message: 'Produto criado com sucesso',
      data: produto
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar um produto existente
// @route   PUT /api/produtos/:id
// @access  Privado (Admin)
const atualizarProduto = async (req, res, next) => {
  try {
    const { nome, descricao, preco, categoria, imagemUrl, disponivel } = req.body;

    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        status: 'error',
        message: 'Produto não encontrado'
      });
    }

    // Atualizar dados
    produto.nome = nome || produto.nome;
    produto.descricao = descricao || produto.descricao;
    produto.preco = preco !== undefined ? preco : produto.preco;
    produto.categoria = categoria || produto.categoria;
    produto.imagemUrl = imagemUrl !== undefined ? imagemUrl : produto.imagemUrl;
    produto.disponivel = disponivel !== undefined ? disponivel : produto.disponivel;

    const produtoAtualizado = await produto.save();

    res.json({
      status: 'success',
      message: 'Produto atualizado com sucesso',
      data: produtoAtualizado
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Excluir um produto
// @route   DELETE /api/produtos/:id
// @access  Privado (Admin)
const excluirProduto = async (req, res, next) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);

    if (!produto) {
      return res.status(404).json({
        status: 'error',
        message: 'Produto não encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto
};
