const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, digite um e-mail válido']
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
      select: false // Não retorna a senha por padrão nas consultas
    },
    role: {
      type: String,
      enum: ['cliente', 'admin'],
      default: 'cliente'
    }
  },
  {
    timestamps: true
  }
);

// Criptografar a senha antes de salvar no banco
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para verificar se a senha está correta
UsuarioSchema.methods.compararSenha = async function (senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
