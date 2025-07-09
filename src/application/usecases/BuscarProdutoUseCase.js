class BuscarProdutoUseCase {
    constructor(produtoService) {
        this.produtoService = produtoService;
    }

    async executarLista() {
        return await this.produtoService.listarProdutos();
    }

    async executarPorId(id) {
        return await this.produtoService.buscarProdutoPorId(id);
    }

    async executarPorNome(nome) {
        return await this.produtoService.buscarProdutosPorNome(nome);
    }

    async executarPorPreco(min, max) {
        return await this.produtoService.buscarProdutosPorPreco(min, max);
    }
}

module.exports = BuscarProdutoUseCase; 