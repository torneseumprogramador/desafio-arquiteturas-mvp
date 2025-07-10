const CriarProdutoUseCase = require("../../../src/application/usecases/CriarProdutoUseCase");
const Produto = require("../../../src/domain/entities/Produto");

describe("CriarProdutoUseCase", () => {
  let useCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      criar: jest.fn(),
    };
    useCase = new CriarProdutoUseCase(mockRepository);
  });

  describe("Executar", () => {
    it("deve criar um produto válido", async () => {
      const dadosProduto = {
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell Inspiron",
        quantidade: 10,
      };

      const produtoCriado = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell Inspiron",
        10,
      );
      mockRepository.criar.mockResolvedValue(produtoCriado);

      const resultado = await useCase.executar(dadosProduto);

      expect(mockRepository.criar).toHaveBeenCalledWith(expect.any(Produto));
      expect(resultado).toEqual(produtoCriado);
      expect(resultado.id).toBe(1);
      expect(resultado.nome).toBe("Notebook");
    });

    it("deve validar dados antes de criar", async () => {
      const dadosInvalidos = {
        nome: "",
        preco: -10,
        quantidade: -5,
      };

      await expect(useCase.executar(dadosInvalidos)).rejects.toThrow(
        "Dados inválidos",
      );
      expect(mockRepository.criar).not.toHaveBeenCalled();
    });

    it("deve rejeitar quando nome está vazio", async () => {
      const dadosProduto = {
        nome: "",
        preco: 2500.0,
        descricao: "Notebook Dell Inspiron",
        quantidade: 10,
      };

      await expect(useCase.executar(dadosProduto)).rejects.toThrow(
        "Dados inválidos",
      );
    });

    it("deve rejeitar quando preço é negativo", async () => {
      const dadosProduto = {
        nome: "Notebook",
        preco: -100,
        descricao: "Notebook Dell Inspiron",
        quantidade: 10,
      };

      await expect(useCase.executar(dadosProduto)).rejects.toThrow(
        "Dados inválidos",
      );
    });

    it("deve rejeitar quando quantidade é negativa", async () => {
      const dadosProduto = {
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell Inspiron",
        quantidade: -5,
      };

      await expect(useCase.executar(dadosProduto)).rejects.toThrow(
        "Dados inválidos",
      );
    });

    it("deve aceitar quantidade zero", async () => {
      const dadosProduto = {
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell Inspiron",
        quantidade: 0,
      };

      const produtoCriado = new Produto(
        1,
        "Notebook",
        2500.0,
        "Notebook Dell Inspiron",
        0,
      );
      mockRepository.criar.mockResolvedValue(produtoCriado);

      const resultado = await useCase.executar(dadosProduto);

      expect(resultado.quantidade).toBe(0);
    });

    it("deve propagar erro do repositório", async () => {
      const dadosProduto = {
        nome: "Notebook",
        preco: 2500.0,
        descricao: "Notebook Dell Inspiron",
        quantidade: 10,
      };

      const erro = new Error("Erro no banco de dados");
      mockRepository.criar.mockRejectedValue(erro);

      await expect(useCase.executar(dadosProduto)).rejects.toThrow(
        "Erro no banco de dados",
      );
    });

    it("deve criar produto com dados mínimos", async () => {
      const dadosProduto = {
        nome: "Mouse",
        preco: 50.0,
        quantidade: 5,
      };

      const produtoCriado = new Produto(1, "Mouse", 50.0, "", 5);
      mockRepository.criar.mockResolvedValue(produtoCriado);

      const resultado = await useCase.executar(dadosProduto);

      expect(resultado.nome).toBe("Mouse");
      expect(resultado.descricao).toBe("");
    });
  });
});
