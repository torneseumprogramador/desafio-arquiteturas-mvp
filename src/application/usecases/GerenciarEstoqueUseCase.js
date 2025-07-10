class GerenciarEstoqueUseCase {
  constructor(produtoService) {
    this.produtoService = produtoService;
  }

  async atualizarEstoque(id, quantidade) {
    return await this.produtoService.atualizarEstoque(id, quantidade);
  }

  async aplicarDesconto(id, percentual) {
    return await this.produtoService.aplicarDesconto(id, percentual);
  }
}

module.exports = GerenciarEstoqueUseCase;
