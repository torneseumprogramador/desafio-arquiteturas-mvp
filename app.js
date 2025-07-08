// Importar classes (em um ambiente real, você usaria módulos ES6)
// Por enquanto, vamos assumir que as classes estão disponíveis globalmente

class App {
    constructor() {
        this.produtoView = null;
        this.produtoService = null;
        this.produtoPresenter = null;
    }

    async inicializar() {
        try {
            // Inicializar componentes
            this.produtoView = new ProdutoView();
            this.produtoService = new ProdutoService();
            this.produtoPresenter = new ProdutoPresenter(this.produtoView, this.produtoService);

            // Inicializar presenter
            await this.produtoPresenter.inicializar();

            console.log('Aplicação inicializada com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            this.mostrarErro('Erro ao inicializar aplicação: ' + error.message);
        }
    }

    // Métodos expostos globalmente para uso nos botões HTML
    editarProduto(id) {
        if (this.produtoPresenter) {
            this.produtoPresenter.editarProduto(id);
        }
    }

    excluirProduto(id) {
        if (this.produtoPresenter) {
            this.produtoPresenter.excluirProduto(id);
        }
    }

    cancelarEdicao() {
        if (this.produtoPresenter) {
            this.produtoPresenter.cancelarEdicao();
        }
    }

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

// Para desenvolvimento, vamos criar algumas classes mock se não existirem
if (typeof ProdutoView === 'undefined') {
    class ProdutoView {
        constructor() {
            this.container = document.getElementById('produtos-container');
            this.form = document.getElementById('produto-form');
            this.setupEventListeners();
        }

        setupEventListeners() {
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

        createProdutoElement(produto) {
            const div = document.createElement('div');
            div.className = 'produto-card';
            div.innerHTML = `
                <h3>${produto.nome}</h3>
                <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                <p><strong>Descrição:</strong> ${produto.descricao}</p>
                <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
                <div class="produto-actions">
                    <button onclick="app.editarProduto(${produto.id})" class="btn-edit">✏️ Editar</button>
                    <button onclick="app.excluirProduto(${produto.id})" class="btn-delete">🗑️ Excluir</button>
                </div>
            `;
            return div;
        }

        mostrarMensagem(mensagem, tipo = 'info') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${tipo}`;
            alertDiv.textContent = mensagem;
            
            document.body.insertBefore(alertDiv, document.body.firstChild);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }

        preencherFormulario(produto) {
            document.getElementById('nome').value = produto.nome;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('quantidade').value = produto.quantidade;
        }
    }
}

if (typeof ProdutoService === 'undefined') {
    class ProdutoService {
        constructor() {
            this.baseURL = '/api/produtos';
            this.produtos = [
                {
                    id: 1,
                    nome: 'Notebook Dell Inspiron',
                    preco: 2999.99,
                    descricao: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD',
                    quantidade: 10
                },
                {
                    id: 2,
                    nome: 'Mouse Gamer RGB',
                    preco: 89.90,
                    descricao: 'Mouse gamer com 6 botões e iluminação RGB',
                    quantidade: 25
                }
            ];
        }

        async listarProdutos() {
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 300));
            return this.produtos;
        }

        async buscarProdutoPorId(id) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const produto = this.produtos.find(p => p.id === id);
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            return produto;
        }

        async criarProduto(produto) {
            await new Promise(resolve => setTimeout(resolve, 400));
            const novoProduto = {
                ...produto,
                id: Math.max(...this.produtos.map(p => p.id)) + 1
            };
            this.produtos.push(novoProduto);
            return novoProduto;
        }

        async atualizarProduto(id, produto) {
            await new Promise(resolve => setTimeout(resolve, 400));
            const index = this.produtos.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error('Produto não encontrado');
            }
            this.produtos[index] = { ...this.produtos[index], ...produto };
            return this.produtos[index];
        }

        async excluirProduto(id) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const index = this.produtos.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error('Produto não encontrado');
            }
            this.produtos.splice(index, 1);
            return true;
        }
    }
}

if (typeof ProdutoPresenter === 'undefined') {
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
} 