/**
 * View de Produtos para o MVP Frontend
 * Gerencia a interface do usuário e interações visuais
 */
class ProdutoView {
    constructor() {
        this.container = document.getElementById('produtos-container');
        this.form = document.getElementById('produto-form');
        this.setupEventListeners();
    }

    /**
     * Configura os event listeners da view
     */
    setupEventListeners() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const produto = {
                nome: formData.get('nome'),
                preco: parseFloat(formData.get('preco')),
                descricao: formData.get('descricao'),
                quantidade: parseInt(formData.get('quantidade'))
            };
            
            const event = new CustomEvent('produtoSubmit', { detail: produto });
            document.dispatchEvent(event);
            
            this.form.reset();
        });
    }

    /**
     * Renderiza a lista de produtos
     * @param {Array} produtos - Lista de produtos para exibir
     */
    renderProdutos(produtos) {
        this.container.innerHTML = '';
        
        if (produtos.length === 0) {
            this.container.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">Nenhum produto cadastrado ainda.</p>';
            return;
        }
        
        produtos.forEach(produto => {
            const produtoElement = this.createProdutoElement(produto);
            this.container.appendChild(produtoElement);
        });
    }

    /**
     * Cria um elemento HTML para um produto
     * @param {Object} produto - Dados do produto
     * @returns {HTMLElement} Elemento HTML do produto
     */
    createProdutoElement(produto) {
        const div = document.createElement('div');
        div.className = 'produto-card';
        div.innerHTML = `
            <h3>${produto.nome}</h3>
            <p><strong>Preço:</strong> R$ ${Number(produto.preco).toFixed(2)}</p>
            <p><strong>Descrição:</strong> ${produto.descricao}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
            <div class="produto-actions">
                <button onclick="app.editarProduto(${produto.id})" class="btn-edit">✏️ Editar</button>
                <button onclick="app.excluirProduto(${produto.id})" class="btn-delete">🗑️ Excluir</button>
            </div>
        `;
        return div;
    }

    /**
     * Exibe uma mensagem para o usuário
     * @param {string} mensagem - Texto da mensagem
     * @param {string} tipo - Tipo da mensagem (success, error, info, warning)
     */
    mostrarMensagem(mensagem, tipo = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo}`;
        alertDiv.textContent = mensagem;
        
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    /**
     * Preenche o formulário com dados de um produto
     * @param {Object} produto - Dados do produto
     */
    preencherFormulario(produto) {
        const nome = document.getElementById('nome');
        const preco = document.getElementById('preco');
        const descricao = document.getElementById('descricao');
        const quantidade = document.getElementById('quantidade');
        if (nome) nome.value = produto.nome;
        if (preco) preco.value = produto.preco;
        if (descricao) descricao.value = produto.descricao;
        if (quantidade) quantidade.value = produto.quantidade;
    }

    /**
     * Limpa o formulário
     */
    limparFormulario() {
        if (this.form) this.form.reset();
    }

    /**
     * Habilita ou desabilita o formulário
     * @param {boolean} habilitado - Se o formulário deve estar habilitado
     */
    setFormularioHabilitado(habilitado) {
        if (!this.form) return;
        const inputs = this.form.querySelectorAll('input, textarea, button[type="submit"]');
        inputs.forEach(input => {
            input.disabled = !habilitado;
        });
    }

    /**
     * Mostra ou esconde um indicador de carregamento
     * @param {boolean} carregando - Se deve mostrar o indicador
     */
    setCarregando(carregando) {
        const loadingDiv = document.getElementById('loading-indicator');
        if (loadingDiv) {
            loadingDiv.style.display = carregando ? 'block' : 'none';
        }
    }
}

// Exportar para uso global (MVP não usa módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProdutoView;
} else {
    window.ProdutoView = ProdutoView;
} 