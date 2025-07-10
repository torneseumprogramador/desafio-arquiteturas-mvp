const IProdutoRepository = require("../../domain/repositories/IProdutoRepository");
const Produto = require("../../domain/entities/Produto");
const mysqlConnection = require("../database/MySQLConnection");

class MySQLProdutoRepository extends IProdutoRepository {
  constructor() {
    super();
    this.tableName = "produtos";
  }

  async listarTodos() {
    try {
      const query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
      const [rows] = await mysqlConnection.execute(query);

      return rows.map((row) => Produto.fromJSON(row));
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw new Error("Erro ao buscar produtos no banco de dados");
    }
  }

  async buscarPorId(id) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      const [rows] = await mysqlConnection.execute(query, [id]);

      if (rows.length === 0) {
        throw new Error("Produto não encontrado");
      }

      return Produto.fromJSON(rows[0]);
    } catch (error) {
      if (error.message === "Produto não encontrado") {
        throw error;
      }
      console.error("Erro ao buscar produto por ID:", error);
      throw new Error("Erro ao buscar produto no banco de dados");
    }
  }

  async criar(produto) {
    try {
      const erros = produto.validar();
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(", ")}`);
      }

      const query = `
                INSERT INTO ${this.tableName} (nome, preco, descricao, quantidade, created_at, updated_at)
                VALUES (?, ?, ?, ?, NOW(), NOW())
            `;

      const [result] = await mysqlConnection.execute(query, [
        produto.nome,
        produto.preco,
        produto.descricao,
        produto.quantidade,
      ]);

      return await this.buscarPorId(result.insertId);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  }

  async atualizar(id, produto) {
    try {
      const erros = produto.validar();
      if (erros.length > 0) {
        throw new Error(`Dados inválidos: ${erros.join(", ")}`);
      }

      const query = `
                UPDATE ${this.tableName} 
                SET nome = ?, preco = ?, descricao = ?, quantidade = ?, updated_at = NOW()
                WHERE id = ?
            `;

      const [result] = await mysqlConnection.execute(query, [
        produto.nome,
        produto.preco,
        produto.descricao,
        produto.quantidade,
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Produto não encontrado");
      }

      return await this.buscarPorId(id);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }

  async excluir(id) {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const [result] = await mysqlConnection.execute(query, [id]);

      if (result.affectedRows === 0) {
        throw new Error("Produto não encontrado");
      }

      return true;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      throw error;
    }
  }

  async buscarPorNome(nome) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE nome LIKE ? ORDER BY nome`;
      const [rows] = await mysqlConnection.execute(query, [`%${nome}%`]);

      return rows.map((row) => Produto.fromJSON(row));
    } catch (error) {
      console.error("Erro ao buscar produtos por nome:", error);
      throw new Error("Erro ao buscar produtos no banco de dados");
    }
  }

  async buscarPorPreco(min, max) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE preco BETWEEN ? AND ? ORDER BY preco`;
      const [rows] = await mysqlConnection.execute(query, [min, max]);

      return rows.map((row) => Produto.fromJSON(row));
    } catch (error) {
      console.error("Erro ao buscar produtos por preço:", error);
      throw new Error("Erro ao buscar produtos no banco de dados");
    }
  }

  async contarTotal() {
    try {
      const query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      const [rows] = await mysqlConnection.execute(query);

      return rows[0].total;
    } catch (error) {
      console.error("Erro ao contar produtos:", error);
      throw new Error("Erro ao contar produtos no banco de dados");
    }
  }
}

module.exports = MySQLProdutoRepository;
