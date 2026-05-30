const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      trim: true
    },
    descricao: {
      type: String,
      required: [true, 'A descrição do produto é obrigatória'],
      trim: true
    },
    preco: {
      type: Number,
      required: [true, 'O preço do produto é obrigatório'],
      min: [0, 'O preço não pode ser negativo']
    },
    categoria: {
      type: String,
      required: [true, 'A categoria do produto é obrigatória'],
      enum: {
        values: ['cafe', 'bebida', 'acompanhamento', 'sobremesa'],
        message: '{VALUE} não é uma categoria válida'
      }
    },
    imagemUrl: {
      type: String,
      default: ''
    },
    disponivel: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Produto', ProdutoSchema);
