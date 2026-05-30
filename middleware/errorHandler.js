const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';
  let errors = null;

  // Erros do Mongoose (Erro de validação)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Erro de validação';
    errors = Object.values(err.errors).map((el) => el.message);
  }

  // Erro de chave duplicada do MongoDB (ex: registrar e-mail que já existe)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `O campo ${field} já está em uso`;
  }

  // Erro de CastError do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Recurso não encontrado com o ID fornecido: ${err.value}`;
  }

  // Resposta padrão da API
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
