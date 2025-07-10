/**
 * @jest-environment jsdom
 */

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
  });

  describe('Métodos de Formulário', () => {
    it('deve obter dados do formulário via setupEventListeners', () => {
      const spy = jest.spyOn(document, 'dispatchEvent');
      document.getElementById('nome').value = 'Teste';
      document.getElementById('preco').value = '10.50';
      document.getElementById('descricao').value = 'Descrição teste';
      document.getElementById('quantidade').value = '5';

      // Simular submit do formulário
      const form = document.getElementById('produto-form');
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      // O evento produtoSubmit deve ser disparado
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('deve limpar formulário', () => {
      document.getElementById('nome').value = 'Teste';
      document.getElementById('preco').value = '10.50';
      
      view.limparFormulario();
      
      expect(document.getElementById('nome').value).toBe('');
      expect(document.getElementById('preco').value).toBe('');
      expect(document.getElementById('descricao').value).toBe('');
      expect(document.getElementById('quantidade').value).toBe('');
    });

    it('deve preencher formulário com dados', () => {
      const produto = {
        id: 1,
        nome: 'Produto Teste',
        preco: 25.00,
        descricao: 'Descrição do produto',
        quantidade: 10
      };

      view.preencherFormulario(produto);

      expect(document.getElementById('nome').value).toBe('Produto Teste');
      expect(document.getElementById('preco').value).toBe('25');
      expect(document.getElementById('descricao').value).toBe('Descrição do produto');
      expect(document.getElementById('quantidade').value).toBe('10');
    });

    it('deve habilitar/desabilitar formulário', () => {
      const form = document.getElementById('produto-form');
      
      view.setFormularioHabilitado(false);
      const inputs = form.querySelectorAll('input, textarea, button[type="submit"]');
      inputs.forEach(input => {
        expect(input.disabled).toBe(true);
      });
      
      view.setFormularioHabilitado(true);
      inputs.forEach(input => {
        expect(input.disabled).toBe(false);
      });
    });
  });

  describe('Renderização de Produtos', () => {
    it('deve renderizar lista de produtos', () => {
      const produtos = [
        { id: 1, nome: 'Produto 1', preco: 10.00, descricao: 'Desc 1', quantidade: 5 },
        { id: 2, nome: 'Produto 2', preco: 20.00, descricao: 'Desc 2', quantidade: 3 }
      ];

      view.renderProdutos(produtos);

      const container = document.getElementById('produtos-container');
      expect(container.innerHTML).toContain('Produto 1');
      expect(container.innerHTML).toContain('Produto 2');
      expect(container.innerHTML).toContain('R$ 10.00');
      expect(container.innerHTML).toContain('R$ 20.00');
    });

    it('deve renderizar lista vazia', () => {
      view.renderProdutos([]);

      const container = document.getElementById('produtos-container');
      expect(container.innerHTML).toContain('Nenhum produto cadastrado ainda');
    });

    it('deve criar elemento de produto corretamente', () => {
      const produto = { 
        id: 1, 
        nome: 'Produto Teste', 
        preco: 10.00, 
        descricao: 'Descrição teste', 
        quantidade: 2 
      };
      
      const el = view.createProdutoElement(produto);
      expect(el).toBeInstanceOf(HTMLElement);
      expect(el.innerHTML).toContain('Produto Teste');
      expect(el.innerHTML).toContain('R$ 10.00');
      expect(el.innerHTML).toContain('Descrição teste');
      expect(el.innerHTML).toContain('2');
    });
  });

  describe('Mensagens', () => {
    it('deve mostrar mensagem de sucesso', () => {
      view.mostrarMensagem('Operação realizada com sucesso!', 'success');

      const alert = document.querySelector('.alert-success');
      expect(alert).not.toBeNull();
      expect(alert.textContent).toBe('Operação realizada com sucesso!');
    });

    it('deve mostrar mensagem de erro', () => {
      view.mostrarMensagem('Erro na operação', 'error');

      const alert = document.querySelector('.alert-error');
      expect(alert).not.toBeNull();
      expect(alert.textContent).toBe('Erro na operação');
    });

    it('deve limpar mensagem após tempo', (done) => {
      view.mostrarMensagem('Mensagem temporária', 'info');

      setTimeout(() => {
        const alert = document.querySelector('.alert-info');
        expect(alert).toBeNull();
        done();
      }, 3100);
    });
  });

  describe('Loading', () => {
    it('deve mostrar loading', () => {
      view.setCarregando(true);

      const loading = document.getElementById('loading-indicator');
      expect(loading.style.display).toBe('block');
    });

    it('deve esconder loading', () => {
      view.setCarregando(false);

      const loading = document.getElementById('loading-indicator');
      expect(loading.style.display).toBe('none');
    });
  });

  describe('Event Listeners', () => {
    it('deve configurar event listeners no construtor', () => {
      // O setupEventListeners é chamado no construtor
      expect(view.form).not.toBeNull();
    });

    it('não deve lançar erro se form não existir', () => {
      document.body.innerHTML = '<div id="produtos-container"></div>';
      expect(() => new ProdutoView()).not.toThrow();
    });

    it('não deve lançar erro se campos não existirem em preencherFormulario', () => {
      document.body.innerHTML = '<form id="produto-form"></form><div id="produtos-container"></div>';
      view = new ProdutoView();
      expect(() => view.preencherFormulario({ nome: 'X', preco: 1, descricao: 'Y', quantidade: 2 })).not.toThrow();
    });
  });

  describe('Export', () => {
    it('deve exportar ProdutoView via CommonJS', () => {
      const mod = require('../../views/ProdutoView.js');
      expect(typeof mod).toBe('function');
    });
  });
}); 