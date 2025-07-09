class AtualizarProdutoUseCase {
    constructor(produtoService) {
        this.produtoService = produtoService;
    }

    async executar(id, dados) {
        return await this.produtoService.atualizarProduto(id, dados);
    }
}

module.exports = AtualizarProdutoUseCase; 