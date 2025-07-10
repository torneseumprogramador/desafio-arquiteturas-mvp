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

// Modal de confirmação customizado
function showConfirmModal(message, onConfirm) {
    let modal = document.getElementById('custom-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-confirm-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <p id="custom-confirm-message"></p>
                <div class="modal-actions">
                    <button id="custom-confirm-cancel" class="btn-cancel">Cancelar</button>
                    <button id="custom-confirm-ok" class="btn-ok">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    document.getElementById('custom-confirm-message').textContent = message;
    modal.style.display = 'flex';
    // Eventos
    document.getElementById('custom-confirm-cancel').onclick = () => {
        modal.style.display = 'none';
    };
    document.getElementById('custom-confirm-ok').onclick = () => {
        modal.style.display = 'none';
        if (typeof onConfirm === 'function') onConfirm();
    };
}

// Adiciona estilos do modal customizado
(function addCustomModalStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    #custom-confirm-modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0; top: 0; right: 0; bottom: 0;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.35);
        font-family: inherit;
    }
    #custom-confirm-modal .modal-backdrop {
        position: absolute;
        left: 0; top: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.35);
    }
    #custom-confirm-modal .modal-content {
        position: relative;
        background: #222;
        color: #fff;
        border-radius: 12px;
        padding: 32px 28px 20px 28px;
        min-width: 320px;
        max-width: 90vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        z-index: 1;
        text-align: center;
        animation: modalFadeIn 0.2s;
    }
    #custom-confirm-modal .modal-content p {
        font-size: 1.1rem;
        margin-bottom: 24px;
    }
    #custom-confirm-modal .modal-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
    }
    #custom-confirm-modal .btn-cancel {
        background: #444;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 8px 22px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    }
    #custom-confirm-modal .btn-cancel:hover {
        background: #666;
    }
    #custom-confirm-modal .btn-ok {
        background: #4caf50;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 8px 22px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
    }
    #custom-confirm-modal .btn-ok:hover {
        background: #388e3c;
    }
    @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    `;
    document.head.appendChild(style);
})(); 