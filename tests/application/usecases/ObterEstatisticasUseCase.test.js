const ObterEstatisticasUseCase = require("../../../src/application/usecases/ObterEstatisticasUseCase");
const Produto = require("../../../src/domain/entities/Produto");

describe("ObterEstatisticasUseCase", () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      listarTodos: jest.fn(),
      contarTotal: jest.fn(),
    };
    useCase = new ObterEstatisticasUseCase(mockRepository);
  });

  describe("Executar", () => {
    it("deve calcular estatísticas corretamente", async () => {
      const produtos = [
        new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10),
        new Produto(2, "Mouse", 50.0, "Mouse sem fio", 20),
        new Produto(3, "Teclado", 150.0, "Teclado mecânico", 5),
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);
      mockRepository.contarTotal.mockResolvedValue(3);

      const resultado = await useCase.executar();

      expect(mockRepository.listarTodos).toHaveBeenCalled();
      expect(mockRepository.contarTotal).toHaveBeenCalled();
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

      const resultado = await useCase.executar();

      expect(resultado).toEqual({
        total: 0,
        valorTotal: 0,
        quantidadeTotal: 0,
        precoMedio: 0,
        produtosComEstoqueBaixo: 0,
      });
    });

    it("deve calcular estatísticas com um produto", async () => {
      const produtos = [
        new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10),
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);
      mockRepository.contarTotal.mockResolvedValue(1);

      const resultado = await useCase.executar();

      expect(resultado).toEqual({
        total: 1,
        valorTotal: 2500 * 10, // 25000
        quantidadeTotal: 10,
        precoMedio: 2500,
        produtosComEstoqueBaixo: 0,
      });
    });

    it("deve calcular produtos com estoque baixo corretamente", async () => {
      const produtos = [
        new Produto(1, "Notebook", 2500.0, "Notebook Dell", 5), // estoque baixo
        new Produto(2, "Mouse", 50.0, "Mouse sem fio", 3), // estoque baixo
        new Produto(3, "Teclado", 150.0, "Teclado mecânico", 15), // estoque normal
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);
      mockRepository.contarTotal.mockResolvedValue(3);

      const resultado = await useCase.executar();

      expect(resultado.produtosComEstoqueBaixo).toBe(2); // notebook e mouse
    });

    it("deve propagar erro do repositório na listagem", async () => {
      const erro = new Error("Erro de conexão");
      mockRepository.listarTodos.mockRejectedValue(erro);

      await expect(useCase.executar()).rejects.toThrow("Erro de conexão");
    });

    it("deve propagar erro do repositório na contagem", async () => {
      const produtos = [
        new Produto(1, "Notebook", 2500.0, "Notebook Dell", 10),
      ];
      mockRepository.listarTodos.mockResolvedValue(produtos);
      const erro = new Error("Erro na contagem");
      mockRepository.contarTotal.mockRejectedValue(erro);

      await expect(useCase.executar()).rejects.toThrow("Erro na contagem");
    });

    it("deve calcular preço médio corretamente com valores decimais", async () => {
      const produtos = [
        new Produto(1, "Produto 1", 100.5, "Descrição 1", 5),
        new Produto(2, "Produto 2", 200.75, "Descrição 2", 3),
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);
      mockRepository.contarTotal.mockResolvedValue(2);

      const resultado = await useCase.executar();

      expect(resultado.precoMedio).toBe((100.5 + 200.75) / 2); // 150.625
    });

    it("deve calcular valor total com produtos de preço zero", async () => {
      const produtos = [
        new Produto(1, "Produto Gratuito", 0, "Produto gratuito", 10),
        new Produto(2, "Produto Pago", 100, "Produto pago", 5),
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);
      mockRepository.contarTotal.mockResolvedValue(2);

      const resultado = await useCase.executar();

      expect(resultado.valorTotal).toBe(0 * 10 + 100 * 5); // 500
    });
  });
});
