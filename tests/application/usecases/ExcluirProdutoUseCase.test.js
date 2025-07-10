const ExcluirProdutoUseCase = require('../../../src/application/usecases/ExcluirProdutoUseCase');
const Produto = require('../../../src/domain/entities/Produto');

describe('ExcluirProdutoUseCase', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      buscarPorId: jest.fn(),
      excluir: jest.fn()
    };
    useCase = new ExcluirProdutoUseCase(mockRepository);
  });

  describe('Executar', () => {
    it('deve excluir produto existente', async () => {
      const produto = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.excluir.mockResolvedValue(true);

      const resultado = await useCase.executar(1);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.excluir).toHaveBeenCalledWith(1);
      expect(resultado).toBe(true);
    });

    it('deve lançar erro quando produto não existe', async () => {
      mockRepository.buscarPorId.mockResolvedValue(null);

      await expect(useCase.executar(999)).rejects.toThrow('Produto não encontrado');
      expect(mockRepository.excluir).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando ID é inválido', async () => {
      await expect(useCase.executar(null)).rejects.toThrow('ID inválido');
      await expect(useCase.executar(undefined)).rejects.toThrow('ID inválido');
      await expect(useCase.executar('')).rejects.toThrow('ID inválido');
      await expect(useCase.executar(-1)).rejects.toThrow('ID inválido');
    });

    it('deve aceitar ID zero', async () => {
      const produto = new Produto(0, 'Produto Zero', 100.00, 'Produto com ID zero', 5);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.excluir.mockResolvedValue(true);

      const resultado = await useCase.executar(0);

      expect(resultado).toBe(true);
    });

    it('deve propagar erro do repositório na busca', async () => {
      const erro = new Error('Erro de conexão');
      mockRepository.buscarPorId.mockRejectedValue(erro);

      await expect(useCase.executar(1)).rejects.toThrow('Erro de conexão');
    });

    it('deve propagar erro do repositório na exclusão', async () => {
      const produto = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      const erro = new Error('Erro ao excluir');
      mockRepository.excluir.mockRejectedValue(erro);

      await expect(useCase.executar(1)).rejects.toThrow('Erro ao excluir');
    });

    it('deve verificar se produto existe antes de excluir', async () => {
      const produto = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      mockRepository.buscarPorId.mockResolvedValue(produto);
      mockRepository.excluir.mockResolvedValue(true);

      await useCase.executar(1);

      expect(mockRepository.buscarPorId).toHaveBeenCalledBefore(mockRepository.excluir);
    });
  });
}); 