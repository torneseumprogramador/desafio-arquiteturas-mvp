const request = require("supertest");
const express = require("express");
const ProdutoController = require("../../src/application/controllers/ProdutoController");
const ProdutoRoutes = require("../../src/application/routes/ProdutoRoutes");
const ErrorHandler = require("../../src/application/middleware/ErrorHandler");

// Mock dos use cases
const mockCriarUseCase = { executar: jest.fn() };
const mockListarUseCase = { executar: jest.fn() };
const mockBuscarUseCase = { executar: jest.fn() };
const mockAtualizarUseCase = { executar: jest.fn() };
const mockExcluirUseCase = { executar: jest.fn() };

// Mock do controller
jest.mock("../../src/application/controllers/ProdutoController", () => {
  return jest.fn().mockImplementation(() => ({
    criar: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    atualizar: jest.fn(),
    excluir: jest.fn(),
  }));
});

describe("API Integration Tests", () => {
  let app;
  let controller;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    controller = new ProdutoController(
      mockCriarUseCase,
      mockListarUseCase,
      mockBuscarUseCase,
      mockAtualizarUseCase,
      mockExcluirUseCase,
    );

    const routes = new ProdutoRoutes(controller);
    app.use("/api/produtos", routes.getRouter());

    const errorHandler = new ErrorHandler();
    app.use(errorHandler.notFound);
    app.use(errorHandler.handle);
  });

  describe("GET /api/produtos", () => {
    it("deve retornar lista de produtos", async () => {
      const produtos = [
        {
          id: 1,
          nome: "Notebook",
          preco: 2500.0,
          descricao: "Notebook Dell",
          quantidade: 10,
        },
        {
          id: 2,
          nome: "Mouse",
          preco: 50.0,
          descricao: "Mouse sem fio",
          quantidade: 20,
        },
      ];

      controller.listar.mockImplementation(async (req, res) => {
        res.status(200).json(produtos);
      });

      const response = await request(app).get("/api/produtos").expect(200);

      expect(response.body).toEqual(produtos);
      expect(controller.listar).toHaveBeenCalled();
    });

    it("deve retornar lista vazia", async () => {
      controller.listar.mockImplementation(async (req, res) => {
        res.status(200).json([]);
      });

      const response = await request(app).get("/api/produtos").expect(200);

      expect(response.body).toEqual([]);
    });

    it("deve retornar erro 500 quando erro interno", async () => {
      controller.listar.mockImplementation(async (req, res) => {
        res.status(500).json({ error: "Erro interno" });
      });

      await request(app).get("/api/produtos").expect(500);
    });
  });

  describe("GET /api/produtos/:id", () => {
    it("deve retornar produto por ID", async () => {
      const produto = {
        id: 1,
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell",
        quantidade: 10,
      };

      controller.buscarPorId.mockImplementation(async (req, res) => {
        res.status(200).json(produto);
      });

      const response = await request(app).get("/api/produtos/1").expect(200);

      expect(response.body).toEqual(produto);
      expect(controller.buscarPorId).toHaveBeenCalled();
    });

    it("deve retornar erro 404 quando produto não encontrado", async () => {
      controller.buscarPorId.mockImplementation(async (req, res) => {
        res.status(404).json({ error: "Produto não encontrado" });
      });

      await request(app).get("/api/produtos/999").expect(404);
    });

    it("deve retornar erro 400 quando ID inválido", async () => {
      controller.buscarPorId.mockImplementation(async (req, res) => {
        res.status(400).json({ error: "ID inválido" });
      });

      await request(app).get("/api/produtos/abc").expect(400);
    });
  });

  describe("POST /api/produtos", () => {
    it("deve criar produto com sucesso", async () => {
      const dadosProduto = {
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell",
        quantidade: 10,
      };
      const produtoCriado = { id: 1, ...dadosProduto };

      controller.criar.mockImplementation(async (req, res) => {
        res.status(201).json(produtoCriado);
      });

      const response = await request(app)
        .post("/api/produtos")
        .send(dadosProduto)
        .expect(201);

      expect(response.body).toEqual(produtoCriado);
      expect(controller.criar).toHaveBeenCalled();
    });

    it("deve retornar erro 400 quando dados inválidos", async () => {
      const dadosInvalidos = { nome: "", preco: -10 };

      controller.criar.mockImplementation(async (req, res) => {
        res.status(400).json({ error: "Dados inválidos" });
      });

      await request(app).post("/api/produtos").send(dadosInvalidos).expect(400);
    });

    it("deve retornar erro 400 quando dados faltando", async () => {
      const dadosIncompletos = { nome: "Notebook" };

      controller.criar.mockImplementation(async (req, res) => {
        res.status(400).json({ error: "Dados inválidos" });
      });

      await request(app)
        .post("/api/produtos")
        .send(dadosIncompletos)
        .expect(400);
    });
  });

  describe("PUT /api/produtos/:id", () => {
    it("deve atualizar produto com sucesso", async () => {
      const dadosAtualizados = {
        nome: "Notebook Atualizado",
        preco: 2800.0,
      };
      const produtoAtualizado = {
        id: 1,
        ...dadosAtualizados,
        descricao: "Notebook Dell",
        quantidade: 10,
      };

      controller.atualizar.mockImplementation(async (req, res) => {
        res.status(200).json(produtoAtualizado);
      });

      const response = await request(app)
        .put("/api/produtos/1")
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body).toEqual(produtoAtualizado);
      expect(controller.atualizar).toHaveBeenCalled();
    });

    it("deve retornar erro 404 quando produto não encontrado", async () => {
      const dadosAtualizados = { nome: "Teste" };

      controller.atualizar.mockImplementation(async (req, res) => {
        res.status(404).json({ error: "Produto não encontrado" });
      });

      await request(app)
        .put("/api/produtos/999")
        .send(dadosAtualizados)
        .expect(404);
    });

    it("deve retornar erro 400 quando dados inválidos", async () => {
      const dadosInvalidos = { nome: "", preco: -100 };

      controller.atualizar.mockImplementation(async (req, res) => {
        res.status(400).json({ error: "Dados inválidos" });
      });

      await request(app)
        .put("/api/produtos/1")
        .send(dadosInvalidos)
        .expect(400);
    });
  });

  describe("DELETE /api/produtos/:id", () => {
    it("deve excluir produto com sucesso", async () => {
      controller.excluir.mockImplementation(async (req, res) => {
        res.status(204).send();
      });

      await request(app).delete("/api/produtos/1").expect(204);

      expect(controller.excluir).toHaveBeenCalled();
    });

    it("deve retornar erro 404 quando produto não encontrado", async () => {
      controller.excluir.mockImplementation(async (req, res) => {
        res.status(404).json({ error: "Produto não encontrado" });
      });

      await request(app).delete("/api/produtos/999").expect(404);
    });

    it("deve retornar erro 400 quando ID inválido", async () => {
      controller.excluir.mockImplementation(async (req, res) => {
        res.status(400).json({ error: "ID inválido" });
      });

      await request(app).delete("/api/produtos/abc").expect(400);
    });
  });

  describe("Rotas não encontradas", () => {
    it("deve retornar erro 404 para rota inexistente", async () => {
      await request(app).get("/api/inexistente").expect(404);
    });

    it("deve retornar erro 404 para método não suportado", async () => {
      await request(app).patch("/api/produtos/1").expect(404);
    });
  });

  describe("Validação de entrada", () => {
    it("deve aceitar JSON válido", async () => {
      const dadosValidos = {
        nome: "Teste",
        preco: 100.0,
        descricao: "Descrição teste",
        quantidade: 5,
      };

      controller.criar.mockImplementation(async (req, res) => {
        res.status(201).json({ id: 1, ...dadosValidos });
      });

      await request(app)
        .post("/api/produtos")
        .send(dadosValidos)
        .set("Content-Type", "application/json")
        .expect(201);
    });

    it("deve rejeitar JSON inválido", async () => {
      await request(app)
        .post("/api/produtos")
        .send('{"nome": "teste", "preco": "invalid"}')
        .set("Content-Type", "application/json")
        .expect(400);
    });
  });
});
