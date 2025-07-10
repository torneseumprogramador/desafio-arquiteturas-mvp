const IProdutoRepository = require("../../../src/domain/repositories/IProdutoRepository");

describe("IProdutoRepository Interface", () => {
  let repository;

  beforeEach(() => {
    repository = new IProdutoRepository();
  });

  describe("Métodos não implementados", () => {
    it("deve lançar erro ao chamar listarTodos", async () => {
      await expect(repository.listarTodos()).rejects.toThrow(
        "Método listarTodos deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarPorId", async () => {
      await expect(repository.buscarPorId(1)).rejects.toThrow(
        "Método buscarPorId deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar criar", async () => {
      const produto = { nome: "Teste", preco: 100 };
      await expect(repository.criar(produto)).rejects.toThrow(
        "Método criar deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar atualizar", async () => {
      const produto = { nome: "Teste", preco: 100 };
      await expect(repository.atualizar(1, produto)).rejects.toThrow(
        "Método atualizar deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar excluir", async () => {
      await expect(repository.excluir(1)).rejects.toThrow(
        "Método excluir deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarPorNome", async () => {
      await expect(repository.buscarPorNome("teste")).rejects.toThrow(
        "Método buscarPorNome deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarPorPreco", async () => {
      await expect(repository.buscarPorPreco(10, 100)).rejects.toThrow(
        "Método buscarPorPreco deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarComEstoqueBaixo", async () => {
      await expect(repository.buscarComEstoqueBaixo(10)).rejects.toThrow(
        "Método buscarComEstoqueBaixo deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarComEstoqueBaixo com valor padrão", async () => {
      await expect(repository.buscarComEstoqueBaixo()).rejects.toThrow(
        "Método buscarComEstoqueBaixo deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar contarTotal", async () => {
      await expect(repository.contarTotal()).rejects.toThrow(
        "Método contarTotal deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar existe", async () => {
      await expect(repository.existe(1)).rejects.toThrow(
        "Método existe deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarOrdenadosPorPreco", async () => {
      await expect(repository.buscarOrdenadosPorPreco("asc")).rejects.toThrow(
        "Método buscarOrdenadosPorPreco deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarOrdenadosPorPreco com valor padrão", async () => {
      await expect(repository.buscarOrdenadosPorPreco()).rejects.toThrow(
        "Método buscarOrdenadosPorPreco deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarOrdenadosPorNome", async () => {
      await expect(repository.buscarOrdenadosPorNome("asc")).rejects.toThrow(
        "Método buscarOrdenadosPorNome deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarOrdenadosPorNome com valor padrão", async () => {
      await expect(repository.buscarOrdenadosPorNome()).rejects.toThrow(
        "Método buscarOrdenadosPorNome deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarOrdenadosPorData", async () => {
      await expect(repository.buscarOrdenadosPorData("desc")).rejects.toThrow(
        "Método buscarOrdenadosPorData deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarOrdenadosPorData com valor padrão", async () => {
      await expect(repository.buscarOrdenadosPorData()).rejects.toThrow(
        "Método buscarOrdenadosPorData deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarComPaginacao", async () => {
      await expect(repository.buscarComPaginacao(1, 10)).rejects.toThrow(
        "Método buscarComPaginacao deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarComPaginacao com valores padrão", async () => {
      await expect(repository.buscarComPaginacao()).rejects.toThrow(
        "Método buscarComPaginacao deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarComFiltros", async () => {
      const filtros = { nome: "teste", precoMin: 10 };
      await expect(repository.buscarComFiltros(filtros)).rejects.toThrow(
        "Método buscarComFiltros deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar atualizarEstoque", async () => {
      await expect(repository.atualizarEstoque(1, 15)).rejects.toThrow(
        "Método atualizarEstoque deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar atualizarPreco", async () => {
      await expect(repository.atualizarPreco(1, 150.0)).rejects.toThrow(
        "Método atualizarPreco deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar buscarPorTermo", async () => {
      await expect(repository.buscarPorTermo("teste")).rejects.toThrow(
        "Método buscarPorTermo deve ser implementado",
      );
    });

    it("deve lançar erro ao chamar obterEstatisticas", async () => {
      await expect(repository.obterEstatisticas()).rejects.toThrow(
        "Método obterEstatisticas deve ser implementado",
      );
    });
  });

  describe("Contrato da Interface", () => {
    it("deve ter todos os métodos obrigatórios definidos", () => {
      const metodos = [
        "listarTodos",
        "buscarPorId",
        "criar",
        "atualizar",
        "excluir",
        "buscarPorNome",
        "buscarPorPreco",
        "buscarComEstoqueBaixo",
        "contarTotal",
        "existe",
        "buscarOrdenadosPorPreco",
        "buscarOrdenadosPorNome",
        "buscarOrdenadosPorData",
        "buscarComPaginacao",
        "buscarComFiltros",
        "atualizarEstoque",
        "atualizarPreco",
        "buscarPorTermo",
        "obterEstatisticas",
      ];

      metodos.forEach((metodo) => {
        expect(typeof repository[metodo]).toBe("function");
      });
    });

    it("deve ser uma classe instanciável", () => {
      expect(repository).toBeInstanceOf(IProdutoRepository);
    });
  });
});
