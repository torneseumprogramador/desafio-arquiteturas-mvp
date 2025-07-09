/**
 * Aplicação Principal do MVP
 * Coordena a inicialização e funcionamento do sistema
 */
class App {
    constructor() {
        this.produtoView = null;
        this.produtoService = null;
        this.produtoPresenter = null;
    }

    /**
     * Inicializa a aplicação
     */
    async inicializar() {
        try {
            console.log('🚀 Inicializando MVP...');
            
            // Inicializar componentes
            this.produtoView = new ProdutoView();
            this.produtoService = new ProdutoService();
            this.produtoPresenter = new ProdutoPresenter(this.produtoView, this.produtoService);

            // Inicializar presenter
            await this.produtoPresenter.inicializar();

            console.log('✅ MVP inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar MVP:', error);
            this.mostrarErro('Erro ao inicializar aplicação: ' + error.message);
        }
    }

    /**
     * Inicia a edição de um produto
     * @param {number} id - ID do produto
     */
    editarProduto(id) {
        if (this.produtoPresenter) {
            this.produtoPresenter.editarProduto(id);
        }
    }

    /**
     * Exclui um produto
     * @param {number} id - ID do produto
     */
    excluirProduto(id) {
        if (this.produtoPresenter) {
            this.produtoPresenter.excluirProduto(id);
        }
    }

    /**
     * Cancela a edição de um produto
     */
    cancelarEdicao() {
        if (this.produtoPresenter) {
            this.produtoPresenter.cancelarEdicao();
        }
    }

    /**
     * Exibe uma mensagem de erro
     * @param {string} mensagem - Mensagem de erro
     */
    mostrarErro(mensagem) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-error';
        alertDiv.textContent = mensagem;
        
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Instância global da aplicação
const app = new App();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    app.inicializar();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
} else {
    window.app = app;
} 