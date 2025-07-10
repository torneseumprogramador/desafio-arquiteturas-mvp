class ErrorHandler {
  static handleError(err, req, res, next) {
    console.error("Erro não tratado:", err);

    // Se a resposta já foi enviada, não podemos enviar novamente
    if (res.headersSent) {
      return next(err);
    }

    // Erros de validação
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Erro de validação",
        message: err.message,
        details: err.details,
      });
    }

    // Erros de sintaxe JSON
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        error: "JSON inválido",
        message: "O corpo da requisição contém JSON inválido",
      });
    }

    // Erros de rota não encontrada
    if (err.status === 404) {
      return res.status(404).json({
        error: "Rota não encontrada",
        message: "A rota solicitada não existe",
      });
    }

    // Erros de método não permitido
    if (err.status === 405) {
      return res.status(405).json({
        error: "Método não permitido",
        message: "O método HTTP não é permitido para esta rota",
      });
    }

    // Erros de banco de dados
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Conflito de dados",
        message: "Já existe um registro com os dados fornecidos",
      });
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "Referência inválida",
        message: "Tentativa de referenciar um registro que não existe",
      });
    }

    // Erros de conexão com banco
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      return res.status(503).json({
        error: "Serviço indisponível",
        message: "Erro de conexão com o banco de dados",
      });
    }

    // Erro genérico para produção
    const isDevelopment = process.env.NODE_ENV === "development";

    res.status(err.status || 500).json({
      error: "Erro interno do servidor",
      message: isDevelopment
        ? err.message
        : "Ocorreu um erro interno no servidor",
      ...(isDevelopment && { stack: err.stack }),
    });
  }

  static notFound(req, res, next) {
    const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
  }

  static methodNotAllowed(req, res, next) {
    const error = new Error(
      `Método ${req.method} não permitido para ${req.originalUrl}`,
    );
    error.status = 405;
    next(error);
  }
}

module.exports = ErrorHandler;
