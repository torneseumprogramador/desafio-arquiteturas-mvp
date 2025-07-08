class Produto {
    constructor(id, nome, preco, descricao, quantidade) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
        this.quantidade = quantidade;
    }

    static fromJSON(json) {
        return new Produto(
            json.id,
            json.nome,
            json.preco,
            json.descricao,
            json.quantidade
        );
    }

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

module.exports = Produto; 