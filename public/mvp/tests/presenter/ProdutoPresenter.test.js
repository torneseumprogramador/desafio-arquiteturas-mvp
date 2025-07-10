/**
 * @jest-environment jsdom
 */

const ProdutoPresenter = require('../../presenters/ProdutoPresenter.js');

global.showConfirmModal = jest.fn((msg, cb) => cb && cb());

describe('ProdutoPresenter', () => {
  let presenter, mockView, mockService;

  beforeEach(() => {
    mockView = {
      mostrarMensagem: jest.fn(),
      setFormularioHabilitado: jest.fn(),
      setCarregando: jest.fn(),
      limparFormulario: jest.fn(),
      preencherFormulario: jest.fn(),
      renderProdutos: jest.fn()
    };
    mockService = {
      criarProduto: jest.fn().mockResolvedValue({}),
      atualizarProduto: jest.fn().mockResolvedValue({}),
      buscarProdutoPorId: jest.fn().mockResolvedValue({ id: 1, nome: 'Editado' }),
      excluirProduto: jest.fn().mockResolvedValue(true),
      listarProdutos: jest.fn().mockResolvedValue([])
    };
    presenter = new ProdutoPresenter(mockView, mockService);
  });

  it('deve criar produto com sucesso', async () => {
    await presenter.criarProduto({ nome: 'Novo' });
    expect(mockService.criarProduto).toHaveBeenCalled();
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Produto criado com sucesso!', 'success');
    expect(mockView.limparFormulario).toHaveBeenCalled();
  });

  it('deve lançar erro ao criar produto', async () => {
    mockService.criarProduto.mockRejectedValueOnce(new Error('Falha'));
    await expect(presenter.criarProduto({ nome: 'Novo' })).rejects.toThrow('Falha');
  });

  it('deve atualizar produto com sucesso', async () => {
    presenter.produtoEmEdicao = { id: 1 };
    await presenter.atualizarProduto({ nome: 'Atualizado' });
    expect(mockService.atualizarProduto).toHaveBeenCalledWith(1, { nome: 'Atualizado' });
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Produto atualizado com sucesso!', 'success');
    expect(presenter.produtoEmEdicao).toBeNull();
  });

  it('deve lançar erro ao atualizar produto', async () => {
    presenter.produtoEmEdicao = { id: 1 };
    mockService.atualizarProduto.mockRejectedValueOnce(new Error('Falha update'));
    await expect(presenter.atualizarProduto({ nome: 'X' })).rejects.toThrow('Falha update');
  });

  it('deve buscar produto para edição', async () => {
    await presenter.editarProduto(1);
    expect(mockService.buscarProdutoPorId).toHaveBeenCalledWith(1);
    expect(mockView.preencherFormulario).toHaveBeenCalledWith({ id: 1, nome: 'Editado' });
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Editando produto: Editado', 'info');
  });

  it('deve mostrar erro ao buscar produto para edição', async () => {
    mockService.buscarProdutoPorId.mockRejectedValueOnce(new Error('Falha busca'));
    await presenter.editarProduto(1);
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Erro ao carregar produto para edição: Falha busca', 'error');
  });

  it('deve cancelar edição', () => {
    presenter.produtoEmEdicao = { id: 1 };
    presenter.cancelarEdicao();
    expect(presenter.produtoEmEdicao).toBeNull();
    expect(mockView.limparFormulario).toHaveBeenCalled();
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Edição cancelada', 'info');
  });

  it('deve validar dados e retornar erros', () => {
    const erros = presenter.validarDados({ nome: '', preco: 0, quantidade: -1 });
    expect(erros).toContain('Nome é obrigatório');
    expect(erros).toContain('Preço deve ser maior que zero');
    expect(erros).toContain('Quantidade deve ser zero ou maior');
  });

  it('deve chamar setupEventListeners e handleProdutoSubmit', () => {
    const spy = jest.spyOn(presenter, 'handleProdutoSubmit').mockImplementation(() => {});
    const event = new CustomEvent('produtoSubmit', { detail: { nome: 'Teste', preco: 1, quantidade: 1 } });
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('deve inicializar e carregar produtos', async () => {
    await presenter.inicializar();
    expect(mockView.setCarregando).toHaveBeenCalled();
    expect(mockService.listarProdutos).toHaveBeenCalled();
    expect(mockView.renderProdutos).toHaveBeenCalled();
  });

  it('deve mostrar erro ao inicializar', async () => {
    mockService.listarProdutos.mockRejectedValueOnce(new Error('Falha inicialização'));
    await presenter.inicializar();
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Erro ao carregar produtos: Falha inicialização', 'error');
  });

  it('deve carregar produtos e mostrar erro', async () => {
    mockService.listarProdutos.mockRejectedValueOnce(new Error('Falha carregar'));
    await presenter.carregarProdutos();
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Erro ao carregar produtos: Falha carregar', 'error');
  });

  it('deve handleProdutoSubmit com dados inválidos', async () => {
    const spy = jest.spyOn(presenter, 'validarDados').mockReturnValue(['erro']);
    await presenter.handleProdutoSubmit({ nome: '', preco: 0, quantidade: -1 });
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Dados inválidos: erro', 'error');
    spy.mockRestore();
  });

  it('deve handleProdutoSubmit com erro', async () => {
    jest.spyOn(presenter, 'validarDados').mockReturnValue([]);
    jest.spyOn(presenter, 'criarProduto').mockRejectedValueOnce(new Error('Falha submit'));
    await presenter.handleProdutoSubmit({ nome: 'X', preco: 1, quantidade: 1 });
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Erro ao salvar produto: Falha submit', 'error');
  });

  it('deve excluir produto com sucesso', async () => {
    await presenter.excluirProduto(1);
    expect(mockService.excluirProduto).toHaveBeenCalledWith(1);
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Produto excluído com sucesso!', 'success');
  });

  it('deve mostrar erro ao excluir produto', async () => {
    mockService.excluirProduto.mockRejectedValueOnce(new Error('Falha excluir'));
    await presenter.excluirProduto(1);
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Erro ao excluir produto: Falha excluir', 'error');
  });

  it('não deve lançar erro se form não existir em setupEventListeners', () => {
    // Remove todos os listeners e simula ausência de form
    document.body.innerHTML = '';
    expect(() => new ProdutoPresenter(mockView, mockService)).not.toThrow();
  });

  it('deve exportar ProdutoPresenter via CommonJS', () => {
    const mod = require('../../presenters/ProdutoPresenter.js');
    expect(typeof mod).toBe('function');
  });
}); 