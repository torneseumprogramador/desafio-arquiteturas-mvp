class CriarProdutoUseCase {
  constructor(produtoService) {
    this.produtoService = produtoService;
  }

  async executar(dados) {
    return await this.produtoService.criarProduto(dados);
  }
}

module.exports = CriarProdutoUseCase;
