const ErrorHandler = require("../../../src/application/middleware/ErrorHandler");

describe("ErrorHandler", () => {
  let errorHandler;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("handle", () => {
    it("deve tratar erro genérico", () => {
      const erro = new Error("Erro genérico");

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro genérico",
        message: "Erro interno do servidor",
      });
    });

    it("deve tratar erro de validação", () => {
      const erro = new Error("Dados inválidos");
      erro.name = "ValidationError";

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Dados inválidos",
        message: "Dados de entrada inválidos",
      });
    });

    it("deve tratar erro de não encontrado", () => {
      const erro = new Error("Produto não encontrado");
      erro.name = "NotFoundError";

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Produto não encontrado",
        message: "Recurso não encontrado",
      });
    });

    it("deve tratar erro de banco de dados", () => {
      const erro = new Error("Erro de conexão");
      erro.name = "DatabaseError";

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro de conexão",
        message: "Erro de banco de dados",
      });
    });

    it("deve tratar erro de sintaxe JSON", () => {
      const erro = new SyntaxError("Unexpected token");
      erro.status = 400;

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unexpected token",
        message: "Erro de sintaxe na requisição",
      });
    });

    it("deve tratar erro com status customizado", () => {
      const erro = new Error("Erro customizado");
      erro.status = 422;

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro customizado",
        message: "Erro interno do servidor",
      });
    });

    it("deve tratar erro sem mensagem", () => {
      const erro = new Error();

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "",
        message: "Erro interno do servidor",
      });
    });

    it("deve tratar erro com stack trace em desenvolvimento", () => {
      process.env.NODE_ENV = "development";
      const erro = new Error("Erro de desenvolvimento");

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro de desenvolvimento",
        message: "Erro interno do servidor",
        stack: erro.stack,
      });

      // Restaurar ambiente
      process.env.NODE_ENV = "test";
    });

    it("deve não incluir stack trace em produção", () => {
      process.env.NODE_ENV = "production";
      const erro = new Error("Erro de produção");

      errorHandler.handle(erro, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro de produção",
        message: "Erro interno do servidor",
      });

      // Restaurar ambiente
      process.env.NODE_ENV = "test";
    });
  });

  describe("notFound", () => {
    it("deve retornar erro 404 para rota não encontrada", () => {
      errorHandler.notFound(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Rota não encontrada",
        message: "A rota solicitada não existe",
      });
    });
  });
});
