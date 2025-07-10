const ListarProdutosUseCase = require('../../../src/application/usecases/ListarProdutosUseCase');
const Produto = require('../../../src/domain/entities/Produto');

describe('ListarProdutosUseCase', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      listarTodos: jest.fn()
    };
    useCase = new ListarProdutosUseCase(mockRepository);
  });

  describe('Executar', () => {
    it('deve retornar lista de produtos', async () => {
      const produtos = [
        new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10),
        new Produto(2, 'Mouse', 50.00, 'Mouse sem fio', 20)
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);

      const resultado = await useCase.executar();

      expect(mockRepository.listarTodos).toHaveBeenCalled();
      expect(resultado).toEqual(produtos);
      expect(resultado).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há produtos', async () => {
      mockRepository.listarTodos.mockResolvedValue([]);

      const resultado = await useCase.executar();

      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });

    it('deve propagar erro do repositório', async () => {
      const erro = new Error('Erro ao conectar com banco');
      mockRepository.listarTodos.mockRejectedValue(erro);

      await expect(useCase.executar()).rejects.toThrow('Erro ao conectar com banco');
    });

    it('deve retornar produtos com dados completos', async () => {
      const produtos = [
        new Produto(1, 'Notebook', 2500.00, 'Notebook Dell Inspiron', 10),
        new Produto(2, 'Mouse', 50.00, 'Mouse sem fio Logitech', 20),
        new Produto(3, 'Teclado', 150.00, 'Teclado mecânico', 15)
      ];

      mockRepository.listarTodos.mockResolvedValue(produtos);

      const resultado = await useCase.executar();

      expect(resultado[0].id).toBe(1);
      expect(resultado[0].nome).toBe('Notebook');
      expect(resultado[0].preco).toBe(2500.00);
      expect(resultado[1].id).toBe(2);
      expect(resultado[1].nome).toBe('Mouse');
      expect(resultado[2].id).toBe(3);
      expect(resultado[2].nome).toBe('Teclado');
    });
  });
}); 