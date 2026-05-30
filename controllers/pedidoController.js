const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');

// @desc    Criar um novo pedido
// @route   POST /api/pedidos
// @access  Privado (Cliente/Admin)
const criarPedido = async (req, res, next) => {
  try {
    const { itens, observacoes, tipoEntrega, endereco, metodoPagamento } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'O pedido precisa conter pelo menos um item válido.'
      });
    }

    let total = 0;
    const itensProcessados = [];

    // Validar itens e calcular o preço total do banco de dados (evita fraude do frontend)
    for (const item of itens) {
      const produto = await Produto.findById(item.produto);
      if (!produto) {
        return res.status(404).json({
          status: 'error',
          message: `Produto com ID ${item.produto} não encontrado.`
        });
      }

      if (!produto.disponivel) {
        return res.status(400).json({
          status: 'error',
          message: `O produto '${produto.nome}' não está disponível no momento.`
        });
      }

      const precoUnitario = produto.preco;
      const quantidade = parseInt(item.quantidade, 10);

      if (isNaN(quantidade) || quantidade <= 0) {
        return res.status(400).json({
          status: 'error',
          message: `Quantidade inválida para o produto '${produto.nome}'.`
        });
      }

      total += precoUnitario * quantidade;

      itensProcessados.push({
        produto: produto._id,
        quantidade,
        precoUnitario
      });
    }

    // Se for entrega, adicionar taxa fixa de R$ 5,00
    if (tipoEntrega === 'entrega') {
      total += 5.00;
    }

    // Criar o pedido associado ao usuário autenticado (req.usuario._id)
    const novoPedido = await Pedido.create({
      cliente: req.usuario._id,
      itens: itensProcessados,
      total,
      observacoes: observacoes || '',
      tipoEntrega: tipoEntrega || 'retirada',
      endereco: tipoEntrega === 'entrega' ? (endereco || '') : '',
      metodoPagamento: metodoPagamento || 'pix'
    });

    // Popular os dados dos produtos para a resposta
    const pedidoPopulado = await Pedido.findById(novoPedido._id)
      .populate('itens.produto', 'nome categoria imagemUrl')
      .populate('cliente', 'nome email');

    res.status(201).json({
      status: 'success',
      message: 'Pedido criado com sucesso!',
      data: pedidoPopulado
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Listar os pedidos do próprio usuário logado
// @route   GET /api/pedidos
// @access  Privado (Cliente)
const listarMeusPedidos = async (req, res, next) => {
  try {
    // Se for admin, a rota de listagem geral pode ser diferente, ou filtramos por query.
    // Aqui listamos os pedidos do usuário autenticado no token, ordenados pelos mais novos.
    let pedidos;

    // Se o usuário for admin e passar o parâmetro 'todos=true', ele lista tudo
    if (req.usuario.role === 'admin' && req.query.todos === 'true') {
      pedidos = await Pedido.find()
        .populate('itens.produto', 'nome preco categoria imagemUrl')
        .populate('cliente', 'nome email')
        .sort({ createdAt: -1 });
    } else {
      // Cliente normal só vê os seus próprios
      pedidos = await Pedido.find({ cliente: req.usuario._id })
        .populate('itens.produto', 'nome preco categoria imagemUrl')
        .populate('cliente', 'nome email')
        .sort({ createdAt: -1 });
    }

    res.json({
      status: 'success',
      results: pedidos.length,
      data: pedidos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar status do pedido
// @route   PATCH /api/pedidos/:id
// @access  Privado (Admin)
const atualizarStatusPedido = async (req, res, next) => {
  try {
    const { status } = req.body;
    const statusValidos = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];

    if (!status || !statusValidos.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status de pedido inválido. Valores permitidos: ' + statusValidos.join(', ')
      });
    }

    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        status: 'error',
        message: 'Pedido não encontrado'
      });
    }

    pedido.status = status;
    const pedidoAtualizado = await pedido.save();

    const pedidoPopulado = await Pedido.findById(pedidoAtualizado._id)
      .populate('itens.produto', 'nome preco categoria imagemUrl')
      .populate('cliente', 'nome email');

    res.json({
      status: 'success',
      message: 'Status do pedido atualizado com sucesso',
      data: pedidoPopulado
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarPedido,
  listarMeusPedidos,
  atualizarStatusPedido
};
