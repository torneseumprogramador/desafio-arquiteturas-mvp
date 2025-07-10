const ProdutoPresenter = require('../../presenters/ProdutoPresenter.js');

describe('ProdutoPresenter', () => {
  let presenter, mockView, mockService;

  beforeEach(() => {
    mockView = {
      mostrarMensagem: jest.fn(),
      setFormularioHabilitado: jest.fn(),
      setCarregando: jest.fn(),
      limparFormulario: jest.fn(),
      preencherFormulario: jest.fn()
    };
    mockService = {
      criarProduto: jest.fn().mockResolvedValue({}),
      atualizarProduto: jest.fn().mockResolvedValue({}),
      buscarProdutoPorId: jest.fn().mockResolvedValue({ id: 1, nome: 'Editado' }),
      excluirProduto: jest.fn().mockResolvedValue(true)
    };
    presenter = new ProdutoPresenter(mockView, mockService);
  });

  it('deve criar produto com sucesso', async () => {
    await presenter.criarProduto({ nome: 'Novo' });
    expect(mockService.criarProduto).toHaveBeenCalled();
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Produto criado com sucesso!', 'success');
    expect(mockView.limparFormulario).toHaveBeenCalled();
  });

  it('deve atualizar produto com sucesso', async () => {
    presenter.produtoEmEdicao = { id: 1 };
    await presenter.atualizarProduto({ nome: 'Atualizado' });
    expect(mockService.atualizarProduto).toHaveBeenCalledWith(1, { nome: 'Atualizado' });
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Produto atualizado com sucesso!', 'success');
    expect(presenter.produtoEmEdicao).toBeNull();
  });

  it('deve buscar produto para edição', async () => {
    await presenter.editarProduto(1);
    expect(mockService.buscarProdutoPorId).toHaveBeenCalledWith(1);
    expect(mockView.preencherFormulario).toHaveBeenCalledWith({ id: 1, nome: 'Editado' });
    expect(mockView.mostrarMensagem).toHaveBeenCalledWith('Editando produto: Editado', 'info');
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
}); 