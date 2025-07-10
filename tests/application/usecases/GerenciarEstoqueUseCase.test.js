const GerenciarEstoqueUseCase = require("../../../src/application/usecases/GerenciarEstoqueUseCase");
const Produto = require("../../../src/domain/entities/Produto");

describe("GerenciarEstoqueUseCase", () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      buscarPorId: jest.fn(),
      atualizar: jest.fn(),
    };
    useCase = new GerenciarEstoqueUseCase(mockRepository);
  });

  describe("Executar", () => {
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

      const resultado = await useCase.executar(1, 15);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.atualizar).toHaveBeenCalledWith(
        1,
        expect.any(Produto),
      );
      expect(resultado).toEqual(produtoAtualizado);
      expect(resultado.quantidade).toBe(15);
    });

    it("deve aceitar quantidade zero", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      const produtoAtualizado = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell",
        0,
      );

      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.atualizar.mockResolvedValue(produtoAtualizado);

      const resultado = await useCase.executar(1, 0);

      expect(resultado.quantidade).toBe(0);
    });

    it("deve lançar erro quando produto não existe", async () => {
      mockRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999, 15)).rejects.toThrow(
        "Produto não encontrado",
      );
      expect(mockRepository.atualizar).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando ID é inválido", async () => {
      await expect(useCase.executar(null, 15)).rejects.toThrow("ID inválido");
      await expect(useCase.executar(undefined, 15)).rejects.toThrow(
        "ID inválido",
      );
      await expect(useCase.executar("abc", 15)).rejects.toThrow("ID inválido");
      await expect(useCase.executar(-1, 15)).rejects.toThrow("ID inválido");
    });

    it("deve lançar erro quando quantidade é negativa", async () => {
      await expect(useCase.executar(1, -5)).rejects.toThrow(
        "Quantidade não pode ser negativa",
      );
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
      mockRepository.atualizar.mockResolvedValue(produto);

      const resultado = await useCase.executar(0, 10);

      expect(resultado.id).toBe(0);
    });

    it("deve propagar erro do repositório na busca", async () => {
      const erro = new Error("Erro de conexão");
      mockRepository.buscarPorId.mockRejectedValue(erro);

      await expect(useCase.executar(1, 15)).rejects.toThrow("Erro de conexão");
    });

    it("deve propagar erro do repositório na atualização", async () => {
      const produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      const erro = new Error("Erro ao atualizar");
      mockRepository.atualizar.mockRejectedValue(erro);

      await expect(useCase.executar(1, 15)).rejects.toThrow(
        "Erro ao atualizar",
      );
    });
  });
});
