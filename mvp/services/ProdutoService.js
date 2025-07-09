/**
 * Serviço de Produtos para o MVP Frontend
 * Gerencia a comunicação com a API
 */
class ProdutoService {
    constructor() {
        this.baseURL = '/api/produtos';
    }

    /**
     * Lista todos os produtos
     * @returns {Promise<Array>} Lista de produtos
     */
    async listarProdutos() {
        try {
            const response = await fetch(this.baseURL);
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.warn('API não disponível:', error.message);
            return [];
        }
    }

    /**
     * Busca um produto por ID
     * @param {number} id - ID do produto
     * @returns {Promise<Object>} Produto encontrado
     */
    async buscarProdutoPorId(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`);
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Produto não encontrado');
        } catch (error) {
            console.warn('API não disponível:', error.message);
            throw new Error('Produto não encontrado');
        }
    }

    /**
     * Cria um novo produto
     * @param {Object} produto - Dados do produto
     * @returns {Promise<Object>} Produto criado
     */
    async criarProduto(produto) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produto)
            });
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Erro ao criar produto');
        } catch (error) {
            console.warn('API não disponível:', error.message);
            throw new Error('Erro ao criar produto');
        }
    }

    /**
     * Atualiza um produto existente
     * @param {number} id - ID do produto
     * @param {Object} produto - Dados atualizados
     * @returns {Promise<Object>} Produto atualizado
     */
    async atualizarProduto(id, produto) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produto)
            });
            if (response.ok) {
                return await response.json();
            }
            throw new Error('Erro ao atualizar produto');
        } catch (error) {
            console.warn('API não disponível:', error.message);
            throw new Error('Erro ao atualizar produto');
        }
    }

    /**
     * Exclui um produto
     * @param {number} id - ID do produto
     * @returns {Promise<boolean>} True se excluído com sucesso
     */
    async excluirProduto(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                return true;
            }
            throw new Error('Erro ao excluir produto');
        } catch (error) {
            console.warn('API não disponível:', error.message);
            throw new Error('Erro ao excluir produto');
        }
    }
}

// Exportar para uso global (MVP não usa módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProdutoService;
} else {
    window.ProdutoService = ProdutoService;
} 