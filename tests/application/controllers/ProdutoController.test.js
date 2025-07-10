const ProdutoController = require('../../../src/application/controllers/ProdutoController');
const Produto = require('../../../src/domain/entities/Produto');

describe('ProdutoController', () => {
  let controller;
  let mockCriarUseCase;
  let mockListarUseCase;
  let mockBuscarUseCase;
  let mockAtualizarUseCase;
  let mockExcluirUseCase;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockCriarUseCase = { executar: jest.fn() };
    mockListarUseCase = { executar: jest.fn() };
    mockBuscarUseCase = { executar: jest.fn() };
    mockAtualizarUseCase = { executar: jest.fn() };
    mockExcluirUseCase = { executar: jest.fn() };

    controller = new ProdutoController(
      mockCriarUseCase,
      mockListarUseCase,
      mockBuscarUseCase,
      mockAtualizarUseCase,
      mockExcluirUseCase
    );

    mockReq = {
      body: {},
      params: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('criar', () => {
    it('deve criar produto com sucesso', async () => {
      const dadosProduto = {
        nome: 'Notebook',
        preco: 2500.00,
        descricao: 'Notebook Dell',
        quantidade: 10
      };
      const produtoCriado = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);

      mockReq.body = dadosProduto;
      mockCriarUseCase.executar.mockResolvedValue(produtoCriado);

      await controller.criar(mockReq, mockRes);

      expect(mockCriarUseCase.executar).toHaveBeenCalledWith(dadosProduto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(produtoCriado);
    });

    it('deve retornar erro 400 quando dados inválidos', async () => {
      const dadosInvalidos = { nome: '', preco: -10 };
      mockReq.body = dadosInvalidos;

      const erro = new Error('Dados inválidos');
      mockCriarUseCase.executar.mockRejectedValue(erro);

      await controller.criar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Dados inválidos' });
    });

    it('deve retornar erro 500 quando erro interno', async () => {
      mockReq.body = { nome: 'Teste', preco: 100 };
      const erro = new Error('Erro interno');
      mockCriarUseCase.executar.mockRejectedValue(erro);

      await controller.criar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro interno' });
    });
  });

  describe('listar', () => {
    it('deve listar produtos com sucesso', async () => {
      const produtos = [
        new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10),
        new Produto(2, 'Mouse', 50.00, 'Mouse sem fio', 20)
      ];

      mockListarUseCase.executar.mockResolvedValue(produtos);

      await controller.listar(mockReq, mockRes);

      expect(mockListarUseCase.executar).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(produtos);
    });

    it('deve retornar lista vazia', async () => {
      mockListarUseCase.executar.mockResolvedValue([]);

      await controller.listar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('deve retornar erro 500 quando erro interno', async () => {
      const erro = new Error('Erro de conexão');
      mockListarUseCase.executar.mockRejectedValue(erro);

      await controller.listar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro de conexão' });
    });
  });

  describe('buscarPorId', () => {
    it('deve buscar produto por ID com sucesso', async () => {
      const produto = new Produto(1, 'Notebook', 2500.00, 'Notebook Dell', 10);
      mockReq.params = { id: '1' };

      mockBuscarUseCase.executar.mockResolvedValue(produto);

      await controller.buscarPorId(mockReq, mockRes);

      expect(mockBuscarUseCase.executar).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(produto);
    });

    it('deve retornar erro 404 quando produto não encontrado', async () => {
      mockReq.params = { id: '999' };

      const erro = new Error('Produto não encontrado');
      mockBuscarUseCase.executar.mockRejectedValue(erro);

      await controller.buscarPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    it('deve retornar erro 400 quando ID inválido', async () => {
      mockReq.params = { id: 'abc' };

      const erro = new Error('ID inválido');
      mockBuscarUseCase.executar.mockRejectedValue(erro);

      await controller.buscarPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'ID inválido' });
    });
  });

  describe('atualizar', () => {
    it('deve atualizar produto com sucesso', async () => {
      const dadosAtualizados = {
        nome: 'Notebook Atualizado',
        preco: 2800.00
      };
      const produtoAtualizado = new Produto(1, 'Notebook Atualizado', 2800.00, 'Notebook Dell', 10);

      mockReq.params = { id: '1' };
      mockReq.body = dadosAtualizados;

      mockAtualizarUseCase.executar.mockResolvedValue(produtoAtualizado);

      await controller.atualizar(mockReq, mockRes);

      expect(mockAtualizarUseCase.executar).toHaveBeenCalledWith(1, dadosAtualizados);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(produtoAtualizado);
    });

    it('deve retornar erro 404 quando produto não encontrado', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { nome: 'Teste' };

      const erro = new Error('Produto não encontrado');
      mockAtualizarUseCase.executar.mockRejectedValue(erro);

      await controller.atualizar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    it('deve retornar erro 400 quando dados inválidos', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { nome: '', preco: -10 };

      const erro = new Error('Dados inválidos');
      mockAtualizarUseCase.executar.mockRejectedValue(erro);

      await controller.atualizar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Dados inválidos' });
    });
  });

  describe('excluir', () => {
    it('deve excluir produto com sucesso', async () => {
      mockReq.params = { id: '1' };
      mockExcluirUseCase.executar.mockResolvedValue(true);

      await controller.excluir(mockReq, mockRes);

      expect(mockExcluirUseCase.executar).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('deve retornar erro 404 quando produto não encontrado', async () => {
      mockReq.params = { id: '999' };

      const erro = new Error('Produto não encontrado');
      mockExcluirUseCase.executar.mockRejectedValue(erro);

      await controller.excluir(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    it('deve retornar erro 400 quando ID inválido', async () => {
      mockReq.params = { id: 'abc' };

      const erro = new Error('ID inválido');
      mockExcluirUseCase.executar.mockRejectedValue(erro);

      await controller.excluir(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'ID inválido' });
    });
  });
}); 