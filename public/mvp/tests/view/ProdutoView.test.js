const ProdutoView = require('../../views/ProdutoView.js');

document.body.innerHTML = `
  <form id="produto-form">
    <input id="nome" name="nome" />
    <input id="preco" name="preco" />
    <input id="descricao" name="descricao" />
    <input id="quantidade" name="quantidade" />
    <button type="submit">Salvar</button>
  </form>
  <div id="produtos-container"></div>
  <div id="loading-indicator" style="display:none"></div>
`;

describe('ProdutoView', () => {
  let view;
  beforeEach(() => {
    view = new ProdutoView();
    if (document.getElementById('produtos-container'))
      document.getElementById('produtos-container').innerHTML = '';
    if (document.getElementById('produto-form'))
      document.getElementById('produto-form').reset();
    if (document.getElementById('loading-indicator'))
      document.getElementById('loading-indicator').style.display = 'none';
  });

  it('deve criar elemento de produto corretamente', () => {
    const produto = { id: 1, nome: 'Produto Teste', preco: 10, descricao: 'Desc', quantidade: 2 };
    const el = view.createProdutoElement(produto);
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.innerHTML).toContain('Produto Teste');
    expect(el.innerHTML).toContain('R$ 10.00');
    expect(el.innerHTML).toContain('Desc');
    expect(el.innerHTML).toContain('2');
  });

  it('deve exibir mensagem de sucesso', () => {
    view.mostrarMensagem('Sucesso!', 'success');
    const alert = document.querySelector('.alert-success');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Sucesso!');
  });

  it('deve exibir mensagem de erro', () => {
    view.mostrarMensagem('Erro!', 'error');
    const alert = document.querySelector('.alert-error');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Erro!');
  });

  it('deve renderizar mensagem de lista vazia', () => {
    view.renderProdutos([]);
    expect(view.container.innerHTML).toContain('Nenhum produto cadastrado ainda.');
  });

  it('deve renderizar lista de produtos', () => {
    const produtos = [
      { id: 1, nome: 'A', preco: 1, descricao: 'a', quantidade: 1 },
      { id: 2, nome: 'B', preco: 2, descricao: 'b', quantidade: 2 }
    ];
    view.renderProdutos(produtos);
    expect(view.container.querySelectorAll('.produto-card').length).toBe(2);
  });

  it('deve preencher o formulário com dados do produto', () => {
    const produto = { nome: 'X', preco: 99, descricao: 'Y', quantidade: 7 };
    view.preencherFormulario(produto);
    expect(document.getElementById('nome').value).toBe('X');
    expect(document.getElementById('preco').value).toBe('99');
    expect(document.getElementById('descricao').value).toBe('Y');
    expect(document.getElementById('quantidade').value).toBe('7');
  });

  it('deve limpar o formulário', () => {
    document.getElementById('nome').value = 'abc';
    view.limparFormulario();
    expect(document.getElementById('nome').value).toBe('');
  });

  it('deve desabilitar e habilitar o formulário', () => {
    view.setFormularioHabilitado(false);
    const inputs = document.querySelectorAll('#produto-form input, #produto-form textarea, #produto-form button[type="submit"]');
    inputs.forEach(input => expect(input.disabled).toBe(true));
    view.setFormularioHabilitado(true);
    inputs.forEach(input => expect(input.disabled).toBe(false));
  });

  it('deve mostrar e esconder o indicador de carregamento', () => {
    view.setCarregando(true);
    expect(document.getElementById('loading-indicator').style.display).toBe('block');
    view.setCarregando(false);
    expect(document.getElementById('loading-indicator').style.display).toBe('none');
  });

  it('não deve lançar erro se form não existir em setupEventListeners', () => {
    document.body.innerHTML = '<div id="produtos-container"></div>';
    expect(() => new ProdutoView()).not.toThrow();
  });

  it('não deve lançar erro se campos não existirem em preencherFormulario', () => {
    document.body.innerHTML = '<form id="produto-form"></form><div id="produtos-container"></div>';
    view = new ProdutoView();
    expect(() => view.preencherFormulario({ nome: 'X', preco: 1, descricao: 'Y', quantidade: 2 })).not.toThrow();
  });

  it('deve exportar ProdutoView via CommonJS', () => {
    const mod = require('../../views/ProdutoView.js');
    expect(typeof mod).toBe('function');
  });
}); 