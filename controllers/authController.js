const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Helper para gerar o token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/auth/registrar
// @access  Público
const registrar = async (req, res, next) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Verificar se o usuário já existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        status: 'error',
        message: 'Este e-mail já está cadastrado'
      });
    }

    // Criar o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      role: role || 'cliente' // Permite registrar admin para testes do projeto integrador
    });

    if (usuario) {
      res.status(201).json({
        status: 'success',
        message: 'Usuário registrado com sucesso',
        data: {
          _id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          token: gerarToken(usuario._id)
        }
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Dados do usuário inválidos'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Autenticar usuário e obter token (Login)
// @route   POST /api/auth/login
// @access  Público
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Validar se e-mail e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça e-mail e senha'
      });
    }

    // Buscar usuário e selecionar a senha explicitamente (pois está marcada com select: false)
    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({
        status: 'error',
        message: 'E-mail ou senha incorretos'
      });
    }

    res.json({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        token: gerarToken(usuario._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrar,
  login
};
