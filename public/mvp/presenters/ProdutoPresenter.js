/**
 * Presenter de Produtos para o MVP Frontend
 * Coordena a comunicação entre View e Service
 */
class ProdutoPresenter {
    constructor(view, service) {
        this.view = view;
        this.service = service;
        this.produtoEmEdicao = null;
        this.setupEventListeners();
    }

    /**
     * Configura os event listeners do presenter
     */
    setupEventListeners() {
        document.addEventListener('produtoSubmit', (e) => {
            this.handleProdutoSubmit(e.detail);
        });
    }

    /**
     * Inicializa o presenter
     */
    async inicializar() {
        try {
            this.view.setCarregando(true);
            await this.carregarProdutos();
        } catch (error) {
            this.view.mostrarMensagem('Erro ao carregar produtos: ' + error.message, 'error');
        } finally {
            this.view.setCarregando(false);
        }
    }

    /**
     * Carrega e exibe a lista de produtos
     */
    async carregarProdutos() {
        try {
            this.view.setCarregando(true);
            const produtos = await this.service.listarProdutos();
            this.view.renderProdutos(produtos);
        } catch (error) {
            this.view.mostrarMensagem('Erro ao carregar produtos: ' + error.message, 'error');
        } finally {
            this.view.setCarregando(false);
        }
    }

    /**
     * Manipula o envio do formulário de produto
     * @param {Object} produtoData - Dados do produto do formulário
     */
    async handleProdutoSubmit(produtoData) {
        try {
            // Validar dados
            const erros = this.validarDados(produtoData);
            if (erros.length > 0) {
                this.view.mostrarMensagem('Dados inválidos: ' + erros.join(', '), 'error');
                return;
            }

            this.view.setFormularioHabilitado(false);
            this.view.setCarregando(true);

            if (this.produtoEmEdicao) {
                await this.atualizarProduto(produtoData);
            } else {
                await this.criarProduto(produtoData);
            }
        } catch (error) {
            this.view.mostrarMensagem('Erro ao salvar produto: ' + error.message, 'error');
        } finally {
            this.view.setFormularioHabilitado(true);
            this.view.setCarregando(false);
        }
    }

    /**
     * Cria um novo produto
     * @param {Object} produtoData - Dados do produto
     */
    async criarProduto(produtoData) {
        try {
            await this.service.criarProduto(produtoData);
            this.view.mostrarMensagem('Produto criado com sucesso!', 'success');
            this.view.limparFormulario();
            await this.carregarProdutos();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Atualiza um produto existente
     * @param {Object} produtoData - Dados atualizados do produto
     */
    async atualizarProduto(produtoData) {
        try {
            await this.service.atualizarProduto(this.produtoEmEdicao.id, produtoData);
            this.view.mostrarMensagem('Produto atualizado com sucesso!', 'success');
            this.produtoEmEdicao = null;
            this.view.limparFormulario();
            await this.carregarProdutos();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Inicia a edição de um produto
     * @param {number} id - ID do produto
     */
    async editarProduto(id) {
        try {
            this.view.setCarregando(true);
            const produto = await this.service.buscarProdutoPorId(id);
            this.produtoEmEdicao = produto;
            this.view.preencherFormulario(produto);
            this.view.mostrarMensagem('Editando produto: ' + produto.nome, 'info');
        } catch (error) {
            this.view.mostrarMensagem('Erro ao carregar produto para edição: ' + error.message, 'error');
        } finally {
            this.view.setCarregando(false);
        }
    }

    /**
     * Exclui um produto
     * @param {number} id - ID do produto
     */
    async excluirProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                this.view.setCarregando(true);
                await this.service.excluirProduto(id);
                this.view.mostrarMensagem('Produto excluído com sucesso!', 'success');
                await this.carregarProdutos();
            } catch (error) {
                this.view.mostrarMensagem('Erro ao excluir produto: ' + error.message, 'error');
            } finally {
                this.view.setCarregando(false);
            }
        }
    }

    /**
     * Cancela a edição de um produto
     */
    cancelarEdicao() {
        this.produtoEmEdicao = null;
        this.view.limparFormulario();
        this.view.mostrarMensagem('Edição cancelada', 'info');
    }

    /**
     * Valida os dados do produto
     * @param {Object} dados - Dados a serem validados
     * @returns {Array} Lista de erros encontrados
     */
    validarDados(dados) {
        const erros = [];

        if (!dados.nome || dados.nome.trim().length === 0) {
            erros.push('Nome é obrigatório');
        }

        if (!dados.preco || dados.preco <= 0) {
            erros.push('Preço deve ser maior que zero');
        }

        if (dados.quantidade === undefined || dados.quantidade < 0) {
            erros.push('Quantidade deve ser zero ou maior');
        }

        return erros;
    }
}

// Exportar para uso global (MVP não usa módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProdutoPresenter;
} else {
    window.ProdutoPresenter = ProdutoPresenter;
} 