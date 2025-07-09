/**
 * Modelo de Produto para o MVP Frontend
 * Representa a estrutura de dados de um produto
 */
class Produto {
    constructor(id, nome, preco, descricao, quantidade) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
        this.quantidade = quantidade;
    }

    /**
     * Cria um produto a partir de dados brutos
     * @param {Object} dados - Dados do produto
     * @returns {Produto} Instância do produto
     */
    static criar(dados) {
        return new Produto(
            dados.id,
            dados.nome,
            dados.preco,
            dados.descricao,
            dados.quantidade
        );
    }

    /**
     * Valida os dados do produto
     * @returns {Array} Lista de erros encontrados
     */
    validar() {
        const erros = [];

        if (!this.nome || this.nome.trim().length === 0) {
            erros.push('Nome é obrigatório');
        }

        if (!this.preco || this.preco <= 0) {
            erros.push('Preço deve ser maior que zero');
        }

        if (this.quantidade === undefined || this.quantidade < 0) {
            erros.push('Quantidade deve ser zero ou maior');
        }

        return erros;
    }

    /**
     * Converte para objeto JSON
     * @returns {Object} Dados do produto
     */
    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            preco: this.preco,
            descricao: this.descricao,
            quantidade: this.quantidade
        };
    }
}

// Exportar para uso global (MVP não usa módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Produto;
} else {
    window.Produto = Produto;
} 