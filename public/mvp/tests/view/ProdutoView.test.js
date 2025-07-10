const ProdutoView = require('../../views/ProdutoView.js');

document.body.innerHTML = `
  <form id="produto-form"></form>
  <div id="produtos-container"></div>
`;

describe('ProdutoView', () => {
  let view;
  beforeEach(() => {
    view = new ProdutoView();
    document.getElementById('produtos-container').innerHTML = '';
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
}); 