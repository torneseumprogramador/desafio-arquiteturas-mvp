const express = require("express");
const ProdutoController = require("../controllers/ProdutoController");

class ProdutoRoutes {
  constructor(produtoService) {
    this.router = express.Router();
    this.produtoController = new ProdutoController(produtoService);
    this.configurarRotas();
  }

  configurarRotas() {
    // Rotas básicas CRUD
    this.router.get("/", (req, res) =>
      this.produtoController.listarProdutos(req, res),
    );
    this.router.get("/:id", (req, res) =>
      this.produtoController.buscarProdutoPorId(req, res),
    );
    this.router.post("/", (req, res) =>
      this.produtoController.criarProduto(req, res),
    );
    this.router.put("/:id", (req, res) =>
      this.produtoController.atualizarProduto(req, res),
    );
    this.router.delete("/:id", (req, res) =>
      this.produtoController.excluirProduto(req, res),
    );

    // Rotas de busca
    this.router.get("/buscar/nome", (req, res) =>
      this.produtoController.buscarProdutosPorNome(req, res),
    );
    this.router.get("/buscar/preco", (req, res) =>
      this.produtoController.buscarProdutosPorPreco(req, res),
    );

    // Rotas de operações específicas
    this.router.patch("/:id/estoque", (req, res) =>
      this.produtoController.atualizarEstoque(req, res),
    );
    this.router.patch("/:id/desconto", (req, res) =>
      this.produtoController.aplicarDesconto(req, res),
    );

    // Rota de estatísticas
    this.router.get("/estatisticas", (req, res) =>
      this.produtoController.obterEstatisticas(req, res),
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProdutoRoutes;
