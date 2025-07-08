class ProdutoService {
    constructor() {
        this.baseURL = '/api/produtos';
    }

    async listarProdutos() {
        try {
            const response = await fetch(this.baseURL);
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro no serviço:', error);
            throw error;
        }
    }

    async buscarProdutoPorId(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro no serviço:', error);
            throw error;
        }
    }

    async criarProduto(produto) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produto)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao criar produto');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro no serviço:', error);
            throw error;
        }
    }

    async atualizarProduto(id, produto) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produto)
            });
            
            if (!response.ok) {
                throw new Error('Erro ao atualizar produto');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro no serviço:', error);
            throw error;
        }
    }

    async excluirProduto(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao excluir produto');
            }
            
            return true;
        } catch (error) {
            console.error('Erro no serviço:', error);
            throw error;
        }
    }
}

module.exports = ProdutoService; 