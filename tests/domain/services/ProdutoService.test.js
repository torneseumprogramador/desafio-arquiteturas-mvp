const ProdutoService = require("../../../src/domain/services/ProdutoService");
const Produto = require("../../../src/domain/entities/Produto");

describe("ProdutoService Domain", () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      listarTodos: jest.fn(),
      buscarPorId: jest.fn(),
      criar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
      buscarPorNome: jest.fn(),
      buscarPorPreco: jest.fn(),
      contarTotal: jest.fn(),
    };
    service = new ProdutoService(mockRepository);
  });

  describe("listarProdutos", () => {
    it("deve listar produtos com sucesso", async () => {
      const produtos = [
        new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10),
        new Produto(2, "Mouse", 50.0, "Mouse sem fio", 20),
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);

      const resultado = await service.listarProdutos();

      expect(mockRepository.listarTodos).toHaveBeenCalled();
      expect(resultado).toEqual(produtos);
    });

    it("deve propagar erro do repositório", async () => {
      const erro = new Error("Erro de conexão");
      mockRepository.listarTodos.mockRejectedValue(erro);

      await expect(service.listarProdutos()).rejects.toThrow("Erro de conexão");
    });
  });

  describe("buscarProdutoPorId", () => {
    it("deve buscar produto por ID válido", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);

      const resultado = await service.buscarProdutoPorId(1);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(produto);
    });

    it("deve converter string para número", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);

      await service.buscarProdutoPorId("1");

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
    });

    it("deve lançar erro quando ID é null", async () => {
      await expect(service.buscarProdutoPorId(null)).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve lançar erro quando ID é undefined", async () => {
      await expect(service.buscarProdutoPorId(undefined)).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve lançar erro quando ID não é número", async () => {
      await expect(service.buscarProdutoPorId("abc")).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve lançar erro quando ID é zero", async () => {
      await expect(service.buscarProdutoPorId(0)).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve propagar erro do repositório", async () => {
      const erro = new Error("Produto não encontrado");
      mockRepository.buscarPorId.mockRejectedValue(erro);

      await expect(service.buscarProdutoPorId(1)).rejects.toThrow(
        "Produto não encontrado",
      );
    });
  });

  describe("criarProduto", () => {
    it("deve criar produto válido", async () => {
      const dados = {
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell",
        quantidade: 10,
      };
      const produtoCriado = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );

      mockRepository.criar.mockResolvedValue(produtoCriado);

      const resultado = await service.criarProduto(dados);

      expect(mockRepository.criar).toHaveBeenCalledWith(expect.any(Produto));
      expect(resultado).toEqual(produtoCriado);
    });

    it("deve validar dados antes de criar", async () => {
      const dadosInvalidos = {
        nome: "",
        preco: -10,
        quantidade: -5,
      };

      await expect(service.criarProduto(dadosInvalidos)).rejects.toThrow(
        "Dados inválidos",
      );
      expect(mockRepository.criar).not.toHaveBeenCalled();
    });

    it("deve propagar erro do repositório", async () => {
      const dados = { nome: "Teste", preco: 100, quantidade: 5 };
      const erro = new Error("Erro no banco");
      mockRepository.criar.mockRejectedValue(erro);

      await expect(service.criarProduto(dados)).rejects.toThrow(
        "Erro no banco",
      );
    });
  });

  describe("atualizarProduto", () => {
    it("deve atualizar produto existente", async () => {
      const produtoExistente = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );
      const dadosAtualizados = {
        nome: "Notebook Atualizado",
        preco: 2800.0,
      };
      const produtoAtualizado = new Produto(
        1,
        "Notebook Atualizado",
        2800.0,
        "Notebook Dell",
        10,
      );

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      mockRepository.atualizar.mockResolvedValue(produtoAtualizado);

      const resultado = await service.atualizarProduto(1, dadosAtualizados);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.atualizar).toHaveBeenCalledWith(
        1,
        expect.any(Produto),
      );
      expect(resultado).toEqual(produtoAtualizado);
    });

    it("deve manter valores originais quando não fornecidos", async () => {
      const produtoExistente = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );
      const dadosParciais = { nome: "Notebook Novo" };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      mockRepository.atualizar.mockResolvedValue(produtoExistente);

      await service.atualizarProduto(1, dadosParciais);

      expect(mockRepository.atualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          nome: "Notebook Novo",
          preco: 2500.0,
          descricao: "Notebook Dell",
          quantidade: 10,
        }),
      );
    });

    it("deve aceitar quantidade zero", async () => {
      const produtoExistente = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );
      const dadosAtualizados = { quantidade: 0 };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      mockRepository.atualizar.mockResolvedValue(produtoExistente);

      await service.atualizarProduto(1, dadosAtualizados);

      expect(mockRepository.atualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          quantidade: 0,
        }),
      );
    });

    it("deve lançar erro quando ID é inválido", async () => {
      await expect(service.atualizarProduto(null, {})).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.atualizarProduto(undefined, {})).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.atualizarProduto("abc", {})).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve validar dados atualizados", async () => {
      const produtoExistente = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );
      const dadosInvalidos = { nome: "", preco: -100 };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);

      await expect(service.atualizarProduto(1, dadosInvalidos)).rejects.toThrow(
        "Dados inválidos",
      );
      expect(mockRepository.atualizar).not.toHaveBeenCalled();
    });

    it("deve propagar erro do repositório", async () => {
      const produtoExistente = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        10,
      );
      const dadosAtualizados = { nome: "Teste" };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      const erro = new Error("Erro no banco");
      mockRepository.atualizar.mockRejectedValue(erro);

      await expect(
        service.atualizarProduto(1, dadosAtualizados),
      ).rejects.toThrow("Erro no banco");
    });
  });

  describe("excluirProduto", () => {
    it("deve excluir produto existente", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.excluir.mockResolvedValue(true);

      const resultado = await service.excluirProduto(1);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.excluir).toHaveBeenCalledWith(1);
      expect(resultado).toBe(true);
    });

    it("deve lançar erro quando ID é inválido", async () => {
      await expect(service.excluirProduto(null)).rejects.toThrow("ID inválido");
      await expect(service.excluirProduto(undefined)).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.excluirProduto("abc")).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve propagar erro do repositório", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      const erro = new Error("Erro ao excluir");
      mockRepository.excluir.mockRejectedValue(erro);

      await expect(service.excluirProduto(1)).rejects.toThrow(
        "Erro ao excluir",
      );
    });
  });

  describe("buscarProdutosPorNome", () => {
    it("deve buscar produtos por nome válido", async () => {
      const produtos = [
        new Produto(1, "Notebook Dell", 2500.0, "Notebook Dell", 10),
        new Produto(2, "Notebook HP", 2300.0, "Notebook HP", 5),
      ];

      mockRepository.buscarPorNome.mockResolvedValue(produtos);

      const resultado = await service.buscarProdutosPorNome("Notebook");

      expect(mockRepository.buscarPorNome).toHaveBeenCalledWith("Notebook");
      expect(resultado).toEqual(produtos);
    });

    it("deve lançar erro quando nome está vazio", async () => {
      await expect(service.buscarProdutosPorNome("")).rejects.toThrow(
        "Nome é obrigatório para busca",
      );
      await expect(service.buscarProdutosPorNome("   ")).rejects.toThrow(
        "Nome é obrigatório para busca",
      );
    });

    it("deve lançar erro quando nome é null", async () => {
      await expect(service.buscarProdutosPorNome(null)).rejects.toThrow(
        "Nome é obrigatório para busca",
      );
    });

    it("deve lançar erro quando nome é undefined", async () => {
      await expect(service.buscarProdutosPorNome(undefined)).rejects.toThrow(
        "Nome é obrigatório para busca",
      );
    });

    it("deve trimar espaços do nome", async () => {
      mockRepository.buscarPorNome.mockResolvedValue([]);

      await service.buscarProdutosPorNome("  Notebook  ");

      expect(mockRepository.buscarPorNome).toHaveBeenCalledWith("Notebook");
    });

    it("deve propagar erro do repositório", async () => {
      const erro = new Error("Erro de busca");
      mockRepository.buscarPorNome.mockRejectedValue(erro);

      await expect(service.buscarProdutosPorNome("teste")).rejects.toThrow(
        "Erro de busca",
      );
    });
  });

  describe("buscarProdutosPorPreco", () => {
    it("deve buscar produtos por faixa de preço válida", async () => {
      const produtos = [
        new Produto(1, "Mouse", 50.0, "Mouse sem fio", 20),
        new Produto(2, "Teclado", 150.0, "Teclado mecânico", 15),
      ];

      mockRepository.buscarPorPreco.mockResolvedValue(produtos);

      const resultado = await service.buscarProdutosPorPreco(10, 200);

      expect(mockRepository.buscarPorPreco).toHaveBeenCalledWith(10, 200);
      expect(resultado).toEqual(produtos);
    });

    it("deve lançar erro quando preço mínimo é undefined", async () => {
      await expect(
        service.buscarProdutosPorPreco(undefined, 100),
      ).rejects.toThrow("Preço mínimo e máximo são obrigatórios");
    });

    it("deve lançar erro quando preço máximo é undefined", async () => {
      await expect(
        service.buscarProdutosPorPreco(10, undefined),
      ).rejects.toThrow("Preço mínimo e máximo são obrigatórios");
    });

    it("deve lançar erro quando preço mínimo é negativo", async () => {
      await expect(service.buscarProdutosPorPreco(-10, 100)).rejects.toThrow(
        "Preços não podem ser negativos",
      );
    });

    it("deve lançar erro quando preço máximo é negativo", async () => {
      await expect(service.buscarProdutosPorPreco(10, -100)).rejects.toThrow(
        "Preços não podem ser negativos",
      );
    });

    it("deve lançar erro quando preço mínimo é maior que máximo", async () => {
      await expect(service.buscarProdutosPorPreco(200, 100)).rejects.toThrow(
        "Preço mínimo não pode ser maior que o máximo",
      );
    });

    it("deve aceitar preços iguais", async () => {
      mockRepository.buscarPorPreco.mockResolvedValue([]);

      await service.buscarProdutosPorPreco(100, 100);

      expect(mockRepository.buscarPorPreco).toHaveBeenCalledWith(100, 100);
    });

    it("deve propagar erro do repositório", async () => {
      const erro = new Error("Erro de busca");
      mockRepository.buscarPorPreco.mockRejectedValue(erro);

      await expect(service.buscarProdutosPorPreco(10, 100)).rejects.toThrow(
        "Erro de busca",
      );
    });
  });

  describe("atualizarEstoque", () => {
    it("deve atualizar estoque com sucesso", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      const produtoAtualizado = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        15,
      );

      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.atualizar.mockResolvedValue(produtoAtualizado);

      const resultado = await service.atualizarEstoque(1, 15);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.atualizar).toHaveBeenCalledWith(
        1,
        expect.any(Produto),
      );
      expect(resultado).toEqual(produtoAtualizado);
    });

    it("deve lançar erro quando ID é inválido", async () => {
      await expect(service.atualizarEstoque(null, 15)).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.atualizarEstoque(undefined, 15)).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.atualizarEstoque("abc", 15)).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve propagar erro do repositório", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      const erro = new Error("Erro ao atualizar");
      mockRepository.atualizar.mockRejectedValue(erro);

      await expect(service.atualizarEstoque(1, 15)).rejects.toThrow(
        "Erro ao atualizar",
      );
    });
  });

  describe("aplicarDesconto", () => {
    it("deve aplicar desconto com sucesso", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      const produtoComDesconto = new Produto(
        1,
        "Notebook",
        2250.0,
        "Notebook Dell",
        10,
      );

      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.atualizar.mockResolvedValue(produtoComDesconto);

      const resultado = await service.aplicarDesconto(1, 10);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.atualizar).toHaveBeenCalledWith(
        1,
        expect.any(Produto),
      );
      expect(resultado).toEqual(produtoComDesconto);
    });

    it("deve lançar erro quando ID é inválido", async () => {
      await expect(service.aplicarDesconto(null, 10)).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.aplicarDesconto(undefined, 10)).rejects.toThrow(
        "ID inválido",
      );
      await expect(service.aplicarDesconto("abc", 10)).rejects.toThrow(
        "ID inválido",
      );
    });

    it("deve propagar erro do repositório", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      const erro = new Error("Erro ao aplicar desconto");
      mockRepository.atualizar.mockRejectedValue(erro);

      await expect(service.aplicarDesconto(1, 10)).rejects.toThrow(
        "Erro ao aplicar desconto",
      );
    });
  });

  describe("obterEstatisticas", () => {
    it("deve calcular estatísticas corretamente", async () => {
      const produtos = [
        new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10),
        new Produto(2, "Mouse", 50.0, "Mouse sem fio", 20),
        new Produto(3, "Teclado", 150.0, "Teclado mecânico", 5),
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);
      mockRepository.contarTotal.mockResolvedValue(3);

      const resultado = await service.obterEstatisticas();

      expect(resultado).toEqual({
        total: 3,
        valorTotal: 2500 * 10 + 50 * 20 + 150 * 5, // 25000 + 1000 + 750 = 26750
        quantidadeTotal: 10 + 20 + 5, // 35
        precoMedio: (2500 + 50 + 150) / 3, // 900
        produtosComEstoqueBaixo: 1, // apenas teclado com quantidade 5
      });
    });

    it("deve calcular estatísticas com lista vazia", async () => {
      mockRepository.listarTodos.mockResolvedValue([]);
      mockRepository.contarTotal.mockResolvedValue(0);

      const resultado = await service.obterEstatisticas();

      expect(resultado).toEqual({
        total: 0,
        valorTotal: 0,
        quantidadeTotal: 0,
        precoMedio: 0,
        produtosComEstoqueBaixo: 0,
      });
    });

    it("deve propagar erro do repositório", async () => {
      const erro = new Error("Erro ao obter estatísticas");
      mockRepository.listarTodos.mockRejectedValue(erro);

      await expect(service.obterEstatisticas()).rejects.toThrow(
        "Erro ao obter estatísticas",
      );
    });
  });
});
