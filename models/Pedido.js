const mongoose = require('mongoose');

const ItemPedidoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: [true, 'O produto é obrigatório no item do pedido']
  },
  quantidade: {
    type: Number,
    required: [true, 'A quantidade é obrigatória'],
    min: [1, 'A quantidade mínima deve ser 1']
  },
  precoUnitario: {
    type: Number,
    required: [true, 'O preço unitário histórico é obrigatório']
  }
});

const PedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'O pedido precisa estar associado a um cliente']
    },
    itens: {
      type: [ItemPedidoSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'O pedido precisa ter pelo menos um item.'
      }
    },
    total: {
      type: Number,
      required: [true, 'O valor total do pedido é obrigatório'],
      min: [0, 'O total não pode ser negativo']
    },
    status: {
      type: String,
      enum: {
        values: ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'],
        message: '{VALUE} não é um status de pedido válido'
      },
      default: 'pendente'
    },
    observacoes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pedido', PedidoSchema);
