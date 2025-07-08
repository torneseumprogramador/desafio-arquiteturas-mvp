class ProdutoPresenter {
    constructor(view, service) {
        this.view = view;
        this.service = service;
        this.produtoEmEdicao = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('produtoSubmit', (e) => {
            this.handleProdutoSubmit(e.detail);
        });
    }

    async inicializar() {
        try {
            await this.carregarProdutos();
        } catch (error) {
            this.view.mostrarMensagem('Erro ao carregar produtos: ' + error.message, 'error');
        }
    }

    async carregarProdutos() {
        try {
            const produtos = await this.service.listarProdutos();
            this.view.renderProdutos(produtos);
        } catch (error) {
            this.view.mostrarMensagem('Erro ao carregar produtos: ' + error.message, 'error');
        }
    }

    async handleProdutoSubmit(produtoData) {
        try {
            if (this.produtoEmEdicao) {
                await this.atualizarProduto(produtoData);
            } else {
                await this.criarProduto(produtoData);
            }
        } catch (error) {
            this.view.mostrarMensagem('Erro ao salvar produto: ' + error.message, 'error');
        }
    }

    async criarProduto(produtoData) {
        try {
            await this.service.criarProduto(produtoData);
            this.view.mostrarMensagem('Produto criado com sucesso!', 'success');
            await this.carregarProdutos();
        } catch (error) {
            throw error;
        }
    }

    async atualizarProduto(produtoData) {
        try {
            await this.service.atualizarProduto(this.produtoEmEdicao.id, produtoData);
            this.view.mostrarMensagem('Produto atualizado com sucesso!', 'success');
            this.produtoEmEdicao = null;
            await this.carregarProdutos();
        } catch (error) {
            throw error;
        }
    }

    async editarProduto(id) {
        try {
            const produto = await this.service.buscarProdutoPorId(id);
            this.produtoEmEdicao = produto;
            this.view.preencherFormulario(produto);
            this.view.mostrarMensagem('Editando produto: ' + produto.nome, 'info');
        } catch (error) {
            this.view.mostrarMensagem('Erro ao carregar produto para edição: ' + error.message, 'error');
        }
    }

    async excluirProduto(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await this.service.excluirProduto(id);
                this.view.mostrarMensagem('Produto excluído com sucesso!', 'success');
                await this.carregarProdutos();
            } catch (error) {
                this.view.mostrarMensagem('Erro ao excluir produto: ' + error.message, 'error');
            }
        }
    }

    cancelarEdicao() {
        this.produtoEmEdicao = null;
        document.getElementById('produto-form').reset();
        this.view.mostrarMensagem('Edição cancelada', 'info');
    }
}

module.exports = ProdutoPresenter; 