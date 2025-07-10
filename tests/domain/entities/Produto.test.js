const Produto = require("../../../src/domain/entities/Produto");

describe("Produto Entity", () => {
  let produto;

  beforeEach(() => {
    produto = new Produto(1, "Notebook", 2500.0, "Notebook Dell Inspiron", 10);
  });

  describe("Constructor", () => {
    it("deve criar um produto com todos os atributos", () => {
      expect(produto.id).toBe(1);
      expect(produto.nome).toBe("Notebook");
      expect(produto.preco).toBe(2500.0);
      expect(produto.descricao).toBe("Notebook Dell Inspiron");
      expect(produto.quantidade).toBe(10);
    });

    it("deve criar um produto sem ID (novo produto)", () => {
      const novoProduto = new Produto(null, "Mouse", 50.0, "Mouse sem fio", 5);
      expect(novoProduto.id).toBeNull();
      expect(novoProduto.nome).toBe("Mouse");
    });
  });

  describe("Validação", () => {
    it("deve validar um produto válido", () => {
      const erros = produto.validar();
      expect(erros).toEqual([]);
    });

    it("deve retornar erro quando nome está vazio", () => {
      produto.nome = "";
      const erros = produto.validar();
      expect(erros).toContain("Nome é obrigatório");
    });

    it("deve retornar erro quando nome é null", () => {
      produto.nome = null;
      const erros = produto.validar();
      expect(erros).toContain("Nome é obrigatório");
    });

    it("deve retornar erro quando nome é undefined", () => {
      produto.nome = undefined;
      const erros = produto.validar();
      expect(erros).toContain("Nome é obrigatório");
    });

    it("deve retornar erro quando nome só tem espaços", () => {
      produto.nome = "   ";
      const erros = produto.validar();
      expect(erros).toContain("Nome é obrigatório");
    });

    it("deve retornar erro quando preço é zero", () => {
      produto.preco = 0;
      const erros = produto.validar();
      expect(erros).toContain("Preço deve ser maior que zero");
    });

    it("deve retornar erro quando preço é negativo", () => {
      produto.preco = -10;
      const erros = produto.validar();
      expect(erros).toContain("Preço deve ser maior que zero");
    });

    it("deve retornar erro quando preço é null", () => {
      produto.preco = null;
      const erros = produto.validar();
      expect(erros).toContain("Preço deve ser maior que zero");
    });

    it("deve retornar erro quando quantidade é negativa", () => {
      produto.quantidade = -5;
      const erros = produto.validar();
      expect(erros).toContain("Quantidade deve ser zero ou maior");
    });

    it("deve aceitar quantidade zero", () => {
      produto.quantidade = 0;
      const erros = produto.validar();
      expect(erros).toEqual([]);
    });

    it("deve retornar erro quando quantidade é undefined", () => {
      produto.quantidade = undefined;
      const erros = produto.validar();
      expect(erros).toContain("Quantidade deve ser zero ou maior");
    });

    it("deve retornar múltiplos erros", () => {
      produto.nome = "";
      produto.preco = -10;
      produto.quantidade = -5;
      const erros = produto.validar();
      expect(erros).toContain("Nome é obrigatório");
      expect(erros).toContain("Preço deve ser maior que zero");
      expect(erros).toContain("Quantidade deve ser zero ou maior");
      expect(erros.length).toBe(3);
    });
  });

  describe("Métodos", () => {
    it("deve retornar se é um produto novo (sem ID)", () => {
      const novoProduto = new Produto(null, "Mouse", 50.0, "Mouse sem fio", 5);
      expect(novoProduto.isNovo()).toBe(true);
      expect(produto.isNovo()).toBe(false);
    });

    it("deve atualizar quantidade em estoque", () => {
      produto.atualizarQuantidade(15);
      expect(produto.quantidade).toBe(15);
    });

    it("deve calcular valor total do estoque", () => {
      const valorTotal = produto.calcularValorTotal();
      expect(valorTotal).toBe(25000.0); // 2500 * 10
    });

    it("deve calcular valor total com quantidade zero", () => {
      produto.quantidade = 0;
      const valorTotal = produto.calcularValorTotal();
      expect(valorTotal).toBe(0);
    });
  });

  describe("Conversão", () => {
    it("deve converter para objeto JSON", () => {
      const json = produto.toJSON();
      expect(json).toEqual({
        id: 1,
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell Inspiron",
        quantidade: 10,
      });
    });

    it("deve converter produto sem ID para JSON", () => {
      const novoProduto = new Produto(null, "Mouse", 50.0, "Mouse sem fio", 5);
      const json = novoProduto.toJSON();
      expect(json).toEqual({
        id: null,
        nome: "Mouse",
        preco: 50.0,
        descricao: "Mouse sem fio",
        quantidade: 5,
      });
    });
  });
});
