const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const proteger = async (req, res, next) => {
  let token;

  // Verificar se o token JWT está presente no cabeçalho Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obter o token
      token = req.headers.authorization.split(' ')[1];

      // Decodificar o token
      const decodificado = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar o usuário pelo ID decodificado e anexar à requisição (excluindo a senha)
      req.usuario = await Usuario.findById(decodificado.id);

      if (!req.usuario) {
        return res.status(401).json({
          status: 'error',
          message: 'Acesso negado. Usuário não encontrado.'
        });
      }

      return next();
    } catch (error) {
      console.error('Erro na validação do token:', error.message);
      return res.status(401).json({
        status: 'error',
        message: 'Acesso negado. Token inválido ou expirado.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Acesso negado. Token não fornecido.'
    });
  }
};

const admin = (req, res, next) => {
  if (req.usuario && req.usuario.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    status: 'error',
    message: 'Acesso negado. Recurso exclusivo para administradores.'
  });
};

module.exports = { proteger, admin };
