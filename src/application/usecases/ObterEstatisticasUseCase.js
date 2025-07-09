class ObterEstatisticasUseCase {
    constructor(produtoService) {
        this.produtoService = produtoService;
    }

    async executar() {
        return await this.produtoService.obterEstatisticas();
    }
}

module.exports = ObterEstatisticasUseCase; 