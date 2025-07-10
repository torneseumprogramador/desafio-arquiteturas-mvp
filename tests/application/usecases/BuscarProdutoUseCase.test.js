const BuscarProdutoUseCase = require("../../../src/application/usecases/BuscarProdutoUseCase");
const Produto = require("../../../src/domain/entities/Produto");

describe("BuscarProdutoUseCase", () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      buscarPorId: jest.fn(),
    };
    useCase = new BuscarProdutoUseCase(mockRepository);
  });

  describe("Executar", () => {
    it("deve retornar produto encontrado", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);

      const resultado = await useCase.executar(1);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(produto);
      expect(resultado.id).toBe(1);
      expect(resultado.nome).toBe("Notebook");
    });

    it("deve lançar erro quando produto não encontrado", async () => {
      mockRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999)).rejects.toThrow(
        "Produto não encontrado",
      );
    });

    it("deve lançar erro quando ID é inválido", async () => {
      await expect(useCase.executar(null)).rejects.toThrow("ID inválido");
      await expect(useCase.executar(undefined)).rejects.toThrow("ID inválido");
      await expect(useCase.executar("")).rejects.toThrow("ID inválido");
      await expect(useCase.executar(-1)).rejects.toThrow("ID inválido");
    });

    it("deve aceitar ID zero", async () => {
      const produto = new Produto(
        0,
        "Produto Zero",
        100.0,
        "Produto com ID zero",
        5,
      );
      mockRepository.buscarPorId.mockResolvedValue(produto);

      const resultado = await useCase.executar(0);

      expect(resultado.id).toBe(0);
    });

    it("deve propagar erro do repositório", async () => {
      const erro = new Error("Erro de conexão");
      mockRepository.buscarPorId.mockRejectedValue(erro);

      await expect(useCase.executar(1)).rejects.toThrow("Erro de conexão");
    });

    it("deve buscar produto com dados completos", async () => {
      const produto = new Produto(
        1,
        "Notebook Dell Inspiron",
        2500.0,
        "Notebook Dell Inspiron 15 polegadas",
        10,
      );
      mockRepository.buscarPorId.mockResolvedValue(produto);

      const resultado = await useCase.executar(1);

      expect(resultado.id).toBe(1);
      expect(resultado.nome).toBe("Notebook Dell Inspiron");
      expect(resultado.preco).toBe(2500.0);
      expect(resultado.descricao).toBe("Notebook Dell Inspiron 15 polegadas");
      expect(resultado.quantidade).toBe(10);
    });
  });
});
