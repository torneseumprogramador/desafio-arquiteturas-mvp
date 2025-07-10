const AtualizarProdutoUseCase = require('../../../src/application/usecases/AtualizarProdutoUseCase');
const Produto = require('../../../src/domain/entities/Produto');

describe('AtualizarProdutoUseCase', () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      buscarPorId: jest.fn(),
      atualizar: jest.fn()
    };
    useCase = new AtualizarProdutoUseCase(mockRepository);
  });

  describe('Executar', () => {
    it('deve atualizar produto existente', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: 2800.00,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 15
      };
      const produtoAtualizado = new Produto(1, 'Notebook Atualizado', 2800.00, 'Notebook Dell Atualizado', 15);

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      mockRepository.atualizar.mockResolvedValue(produtoAtualizado);

      const resultado = await useCase.executar(1, dadosAtualizados);

      expect(mockRepository.buscarPorId).toHaveBeenCalledWith(1);
      expect(mockRepository.atualizar).toHaveBeenCalledWith(expect.any(Produto));
      expect(resultado).toEqual(produtoAtualizado);
      expect(resultado.nome).toBe('Notebook Atualizado');
      expect(resultado.preco).toBe(2800.00);
    });

    it('deve lançar erro quando produto não existe', async () => {
      mockRepository.buscarPorId.mockResolvedValue(null);

      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: 2800.00,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 15
      };

      await expect(useCase.executar(999, dadosAtualizados)).rejects.toThrow('Produto não encontrado');
      expect(mockRepository.atualizar).not.toHaveBeenCalled();
    });

    it('deve validar dados antes de atualizar', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosInvalidos = {
        nome: '',
        preco: -100,
        quantidade: -5
      };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);

      await expect(useCase.executar(1, dadosInvalidos)).rejects.toThrow('Dados inválidos');
      expect(mockRepository.atualizar).not.toHaveBeenCalled();
    });

    it('deve rejeitar quando nome está vazio', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosAtualizados = {
        nome: '',
        preco: 2800.00,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 15
      };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);

      await expect(useCase.executar(1, dadosAtualizados)).rejects.toThrow('Dados inválidos');
    });

    it('deve rejeitar quando preço é negativo', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: -100,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 15
      };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);

      await expect(useCase.executar(1, dadosAtualizados)).rejects.toThrow('Dados inválidos');
    });

    it('deve aceitar quantidade zero', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: 2800.00,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 0
      };
      const produtoAtualizado = new Produto(1, 'Notebook Atualizado', 2800.00, 'Notebook Dell Atualizado', 0);

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      mockRepository.atualizar.mockResolvedValue(produtoAtualizado);

      const resultado = await useCase.executar(1, dadosAtualizados);

      expect(resultado.quantidade).toBe(0);
    });

    it('deve lançar erro quando ID é inválido', async () => {
      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: 2800.00,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 15
      };

      await expect(useCase.executar(null, dadosAtualizados)).rejects.toThrow('ID inválido');
      await expect(useCase.executar(undefined, dadosAtualizados)).rejects.toThrow('ID inválido');
      await expect(useCase.executar(-1, dadosAtualizados)).rejects.toThrow('ID inválido');
    });

    it('deve propagar erro do repositório', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: 2800.00,
        descricao: 'Notebook Dell Atualizado',
        quantidade: 15
      };

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      const erro = new Error('Erro no banco de dados');
      mockRepository.atualizar.mockRejectedValue(erro);

      await expect(useCase.executar(1, dadosAtualizados)).rejects.toThrow('Erro no banco de dados');
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      const produtoExistente = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      const dadosParciais = {
        nome: 'Notebook Novo Nome'
      };
      const produtoAtualizado = new Produto(1, 'Notebook Novo Nome', 2500.00, 'Notebook Dell', 10);

      mockRepository.buscarPorId.mockResolvedValue(produtoExistente);
      mockRepository.atualizar.mockResolvedValue(produtoAtualizado);

      const resultado = await useCase.executar(1, dadosParciais);

      expect(resultado.nome).toBe('Notebook Novo Nome');
      expect(resultado.preco).toBe(2500.00); // Mantém valor original
      expect(resultado.descricao).toBe('Notebook Dell'); // Mantém valor original
    });
  });
}); 