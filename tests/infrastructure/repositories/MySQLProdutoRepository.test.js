const MySQLProdutoRepository = require("../../../src/infrastructure/repositories/MySQLProdutoRepository");
const Produto = require("../../../src/domain/entities/Produto");

// Mock do pool de conexão MySQL
jest.mock("../../../src/infrastructure/database/MySQLConnection", () => ({
  getConnection: jest.fn(),
}));

describe("MySQLProdutoRepository", () => {
  let repository;
  let mockConnection;
  let mockPool;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      release: jest.fn(),
    };

    mockPool = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    };

    // Mock do pool global
    global.mysqlPool = mockPool;

    repository = new MySQLProdutoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("criar", () => {
    it("deve criar produto com sucesso", async () => {
      const produto = new Produto(
        null,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );
      const produtoCriado = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );

      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { insertId: 1 });
      });

      const resultado = await repository.criar(produto);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "INSERT INTO produtos (nome, preco, descricao, quantidade) VALUES (?, ?, ?, ?)",
        ["Notebook", 2500.0, "Notebook Dell", 10],
        expect.any(Function),
      );
      expect(resultado.id).toBe(1);
      expect(resultado.nome).toBe("Notebook");
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando falha na criação", async () => {
      const produto = new Produto(
        null,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );

      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(new Error("Erro no banco"), null);
      });

      await expect(repository.criar(produto)).rejects.toThrow("Erro no banco");
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("listarTodos", () => {
    it("deve listar todos os produtos", async () => {
      const produtosMock = [
        {
          id: 1,
          nome: "Notebook",
          preco: 2500.0,
          descricao: "Notebook Dell",
          quantidade: 10,
        },
        {
          id: 2,
          nome: "Mouse",
          preco: 50.0,
          descricao: "Mouse sem fio",
          quantidade: 20,
        },
      ];

      mockConnection.query.mockImplementation((sql, callback) => {
        callback(null, produtosMock);
      });

      const resultado = await repository.listarTodos();

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM produtos ORDER BY id",
        expect.any(Function),
      );
      expect(resultado).toHaveLength(2);
      expect(resultado[0]).toBeInstanceOf(Produto);
      expect(resultado[0].id).toBe(1);
      expect(resultado[1].id).toBe(2);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve retornar lista vazia quando não há produtos", async () => {
      mockConnection.query.mockImplementation((sql, callback) => {
        callback(null, []);
      });

      const resultado = await repository.listarTodos();

      expect(resultado).toEqual([]);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando falha na listagem", async () => {
      mockConnection.query.mockImplementation((sql, callback) => {
        callback(new Error("Erro de conexão"), null);
      });

      await expect(repository.listarTodos()).rejects.toThrow("Erro de conexão");
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("buscarPorId", () => {
    it("deve buscar produto por ID com sucesso", async () => {
      const produtoMock = {
        id: 1,
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell",
        quantidade: 10,
      };

      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, [produtoMock]);
      });

      const resultado = await repository.buscarPorId(1);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM produtos WHERE id = ?",
        [1],
        expect.any(Function),
      );
      expect(resultado).toBeInstanceOf(Produto);
      expect(resultado.id).toBe(1);
      expect(resultado.nome).toBe("Notebook");
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve retornar null quando produto não encontrado", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      const resultado = await repository.buscarPorId(999);

      expect(resultado).toBeNull();
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando falha na busca", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(new Error("Erro de busca"), null);
      });

      await expect(repository.buscarPorId(1)).rejects.toThrow("Erro de busca");
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("atualizar", () => {
    it("deve atualizar produto com sucesso", async () => {
      const produto = new Produto(
        1,
        "Notebook Atualizado",
        2800.0,
        "Notebook Dell Atualizado",
        15,
      );

      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const resultado = await repository.atualizar(produto);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "UPDATE produtos SET nome = ?, preco = ?, descricao = ?, quantidade = ? WHERE id = ?",
        ["Notebook Atualizado", 2800.0, "Notebook Dell Atualizado", 15, 1],
        expect.any(Function),
      );
      expect(resultado).toEqual(produto);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando produto não existe", async () => {
      const produto = new Produto(999, "Notebook", 2500.0, "Notebook Dell", 10);

      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      await expect(repository.atualizar(produto)).rejects.toThrow(
        "Produto não encontrado",
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando falha na atualização", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);

      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(new Error("Erro de atualização"), null);
      });

      await expect(repository.atualizar(produto)).rejects.toThrow(
        "Erro de atualização",
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("excluir", () => {
    it("deve excluir produto com sucesso", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const resultado = await repository.excluir(1);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "DELETE FROM produtos WHERE id = ?",
        [1],
        expect.any(Function),
      );
      expect(resultado).toBe(true);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando produto não existe", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      await expect(repository.excluir(999)).rejects.toThrow(
        "Produto não encontrado",
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando falha na exclusão", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(new Error("Erro de exclusão"), null);
      });

      await expect(repository.excluir(1)).rejects.toThrow("Erro de exclusão");
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("gerenciarEstoque", () => {
    it("deve atualizar quantidade em estoque com sucesso", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const resultado = await repository.gerenciarEstoque(1, 15);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "UPDATE produtos SET quantidade = ? WHERE id = ?",
        [15, 1],
        expect.any(Function),
      );
      expect(resultado).toBe(true);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("deve lançar erro quando produto não existe para gerenciar estoque", async () => {
      mockConnection.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 0 });
      });

      await expect(repository.gerenciarEstoque(999, 15)).rejects.toThrow(
        "Produto não encontrado",
      );
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
});
