const Produto = require('../../models/Produto.js');

describe('Produto Model', () => {
  it('deve criar um produto válido', () => {
    const produto = new Produto(1, 'Notebook', 2500, 'Descrição', 5);
    expect(produto.id).toBe(1);
    expect(produto.nome).toBe('Notebook');
    expect(produto.preco).toBe(2500);
    expect(produto.descricao).toBe('Descrição');
    expect(produto.quantidade).toBe(5);
  });

  it('deve validar corretamente um produto válido', () => {
    const produto = new Produto(1, 'Notebook', 2500, 'Descrição', 5);
    expect(produto.validar()).toEqual([]);
  });

  it('deve retornar erros de validação para campos obrigatórios', () => {
    const produto = new Produto(null, '', 0, '', -1);
    const erros = produto.validar();
    expect(erros).toContain('Nome é obrigatório');
    expect(erros).toContain('Preço deve ser maior que zero');
    expect(erros).toContain('Quantidade deve ser zero ou maior');
  });

  it('deve converter para JSON corretamente', () => {
    const produto = new Produto(2, 'Mouse', 99.9, 'Mouse óptico', 10);
    expect(produto.toJSON()).toEqual({
      id: 2,
      nome: 'Mouse',
      preco: 99.9,
      descricao: 'Mouse óptico',
      quantidade: 10
    });
  });

  it('deve criar produto a partir de dados brutos', () => {
    const dados = { id: 3, nome: 'Teclado', preco: 150, descricao: 'Teclado mecânico', quantidade: 7 };
    const produto = Produto.criar(dados);
    expect(produto).toBeInstanceOf(Produto);
    expect(produto.nome).toBe('Teclado');
  });
}); 