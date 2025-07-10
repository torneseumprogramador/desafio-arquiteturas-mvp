class ExcluirProdutoUseCase {
  constructor(produtoService) {
    this.produtoService = produtoService;
  }

  async executar(id) {
    return await this.produtoService.excluirProduto(id);
  }
}

module.exports = ExcluirProdutoUseCase;
