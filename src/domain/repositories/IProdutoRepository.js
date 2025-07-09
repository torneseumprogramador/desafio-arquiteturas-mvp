/**
 * Interface para repositório de produtos
 * Define os contratos que qualquer implementação de repositório deve seguir
 */
class IProdutoRepository {
    /**
     * Lista todos os produtos
     * @returns {Promise<Array>} Lista de produtos
     */
    async listarTodos() {
        throw new Error('Método listarTodos deve ser implementado');
    }

    /**
     * Busca um produto por ID
     * @param {number} id - ID do produto
     * @returns {Promise<Object>} Produto encontrado
     * @throws {Error} Se produto não for encontrado
     */
    async buscarPorId(id) {
        throw new Error('Método buscarPorId deve ser implementado');
    }

    /**
     * Cria um novo produto
     * @param {Object} produto - Dados do produto
     * @returns {Promise<Object>} Produto criado
     */
    async criar(produto) {
        throw new Error('Método criar deve ser implementado');
    }

    /**
     * Atualiza um produto existente
     * @param {number} id - ID do produto
     * @param {Object} produto - Dados atualizados do produto
     * @returns {Promise<Object>} Produto atualizado
     * @throws {Error} Se produto não for encontrado
     */
    async atualizar(id, produto) {
        throw new Error('Método atualizar deve ser implementado');
    }

    /**
     * Exclui um produto
     * @param {number} id - ID do produto
     * @returns {Promise<boolean>} True se excluído com sucesso
     * @throws {Error} Se produto não for encontrado
     */
    async excluir(id) {
        throw new Error('Método excluir deve ser implementado');
    }

    /**
     * Busca produtos por nome (busca parcial)
     * @param {string} nome - Nome ou parte do nome do produto
     * @returns {Promise<Array>} Lista de produtos encontrados
     */
    async buscarPorNome(nome) {
        throw new Error('Método buscarPorNome deve ser implementado');
    }

    /**
     * Busca produtos por faixa de preço
     * @param {number} precoMin - Preço mínimo
     * @param {number} precoMax - Preço máximo
     * @returns {Promise<Array>} Lista de produtos encontrados
     */
    async buscarPorPreco(precoMin, precoMax) {
        throw new Error('Método buscarPorPreco deve ser implementado');
    }

    /**
     * Busca produtos com estoque baixo
     * @param {number} quantidadeMinima - Quantidade mínima para considerar estoque baixo
     * @returns {Promise<Array>} Lista de produtos com estoque baixo
     */
    async buscarComEstoqueBaixo(quantidadeMinima = 10) {
        throw new Error('Método buscarComEstoqueBaixo deve ser implementado');
    }

    /**
     * Conta o total de produtos
     * @returns {Promise<number>} Total de produtos
     */
    async contarTotal() {
        throw new Error('Método contarTotal deve ser implementado');
    }

    /**
     * Verifica se um produto existe
     * @param {number} id - ID do produto
     * @returns {Promise<boolean>} True se produto existe
     */
    async existe(id) {
        throw new Error('Método existe deve ser implementado');
    }

    /**
     * Busca produtos ordenados por preço
     * @param {string} ordem - 'asc' para crescente, 'desc' para decrescente
     * @returns {Promise<Array>} Lista de produtos ordenados
     */
    async buscarOrdenadosPorPreco(ordem = 'asc') {
        throw new Error('Método buscarOrdenadosPorPreco deve ser implementado');
    }

    /**
     * Busca produtos ordenados por nome
     * @param {string} ordem - 'asc' para crescente, 'desc' para decrescente
     * @returns {Promise<Array>} Lista de produtos ordenados
     */
    async buscarOrdenadosPorNome(ordem = 'asc') {
        throw new Error('Método buscarOrdenadosPorNome deve ser implementado');
    }

    /**
     * Busca produtos ordenados por data de criação
     * @param {string} ordem - 'asc' para crescente, 'desc' para decrescente
     * @returns {Promise<Array>} Lista de produtos ordenados
     */
    async buscarOrdenadosPorData(ordem = 'desc') {
        throw new Error('Método buscarOrdenadosPorData deve ser implementado');
    }

    /**
     * Busca produtos com paginação
     * @param {number} pagina - Número da página (começa em 1)
     * @param {number} limite - Quantidade de itens por página
     * @returns {Promise<Object>} Objeto com produtos e metadados de paginação
     */
    async buscarComPaginacao(pagina = 1, limite = 10) {
        throw new Error('Método buscarComPaginacao deve ser implementado');
    }

    /**
     * Busca produtos por múltiplos critérios
     * @param {Object} filtros - Objeto com critérios de busca
     * @returns {Promise<Array>} Lista de produtos encontrados
     */
    async buscarComFiltros(filtros) {
        throw new Error('Método buscarComFiltros deve ser implementado');
    }

    /**
     * Atualiza apenas o estoque de um produto
     * @param {number} id - ID do produto
     * @param {number} quantidade - Nova quantidade em estoque
     * @returns {Promise<Object>} Produto atualizado
     */
    async atualizarEstoque(id, quantidade) {
        throw new Error('Método atualizarEstoque deve ser implementado');
    }

    /**
     * Atualiza apenas o preço de um produto
     * @param {number} id - ID do produto
     * @param {number} preco - Novo preço
     * @returns {Promise<Object>} Produto atualizado
     */
    async atualizarPreco(id, preco) {
        throw new Error('Método atualizarPreco deve ser implementado');
    }

    /**
     * Busca produtos que contenham um termo em qualquer campo
     * @param {string} termo - Termo para busca
     * @returns {Promise<Array>} Lista de produtos encontrados
     */
    async buscarPorTermo(termo) {
        throw new Error('Método buscarPorTermo deve ser implementado');
    }

    /**
     * Obtém estatísticas básicas dos produtos
     * @returns {Promise<Object>} Objeto com estatísticas
     */
    async obterEstatisticas() {
        throw new Error('Método obterEstatisticas deve ser implementado');
    }
}

module.exports = IProdutoRepository;