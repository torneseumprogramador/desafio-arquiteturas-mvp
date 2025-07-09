const express = require('express');
const ProdutoController = require('../controllers/ProdutoController');

class ProdutoRoutes {
    constructor(produtoService) {
        this.router = express.Router();
        this.produtoController = new ProdutoController(produtoService);
        this.configurarRotas();
    }

    configurarRotas() {
        // Rotas básicas CRUD
        this.router.get('/produtos', (req, res) => this.produtoController.listarProdutos(req, res));
        this.router.get('/produtos/:id', (req, res) => this.produtoController.buscarProdutoPorId(req, res));
        this.router.post('/produtos', (req, res) => this.produtoController.criarProduto(req, res));
        this.router.put('/produtos/:id', (req, res) => this.produtoController.atualizarProduto(req, res));
        this.router.delete('/produtos/:id', (req, res) => this.produtoController.excluirProduto(req, res));

        // Rotas de busca
        this.router.get('/produtos/buscar/nome', (req, res) => this.produtoController.buscarProdutosPorNome(req, res));
        this.router.get('/produtos/buscar/preco', (req, res) => this.produtoController.buscarProdutosPorPreco(req, res));

        // Rotas de operações específicas
        this.router.patch('/produtos/:id/estoque', (req, res) => this.produtoController.atualizarEstoque(req, res));
        this.router.patch('/produtos/:id/desconto', (req, res) => this.produtoController.aplicarDesconto(req, res));

        // Rota de estatísticas
        this.router.get('/produtos/estatisticas', (req, res) => this.produtoController.obterEstatisticas(req, res));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProdutoRoutes; 