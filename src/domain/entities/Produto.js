class Produto {
    constructor(id, nome, preco, descricao, quantidade) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Regras de negócio
    validar() {
        const erros = [];
        
        if (!this.nome || this.nome.trim().length === 0) {
            erros.push('Nome é obrigatório');
        }
        
        if (!this.preco || this.preco <= 0) {
            erros.push('Preço deve ser maior que zero');
        }
        
        if (this.quantidade < 0) {
            erros.push('Quantidade não pode ser negativa');
        }
        
        if (this.nome && this.nome.length > 255) {
            erros.push('Nome deve ter no máximo 255 caracteres');
        }
        
        return erros;
    }

    // Métodos de domínio
    atualizarEstoque(quantidade) {
        if (this.quantidade + quantidade < 0) {
            throw new Error('Quantidade insuficiente em estoque');
        }
        this.quantidade += quantidade;
        this.updatedAt = new Date();
    }

    aplicarDesconto(percentual) {
        if (percentual < 0 || percentual > 100) {
            throw new Error('Percentual de desconto inválido');
        }
        this.preco = this.preco * (1 - percentual / 100);
        this.updatedAt = new Date();
    }

    // Factory methods
    static criar(nome, preco, descricao, quantidade) {
        return new Produto(null, nome, preco, descricao, quantidade);
    }

    static fromJSON(json) {
        const produto = new Produto(
            json.id,
            json.nome,
            json.preco,
            json.descricao,
            json.quantidade
        );
        
        if (json.created_at) {
            produto.createdAt = new Date(json.created_at);
        }
        
        if (json.updated_at) {
            produto.updatedAt = new Date(json.updated_at);
        }
        
        return produto;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            preco: this.preco,
            descricao: this.descricao,
            quantidade: this.quantidade,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}

module.exports = Produto; 