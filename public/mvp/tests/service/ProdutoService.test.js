const ProdutoService = require('../../services/ProdutoService.js');

global.fetch = jest.fn();

// Silenciar warnings durante os testes
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  console.warn.mockRestore();
});

describe('ProdutoService', () => {
  let service;
  beforeEach(() => {
    service = new ProdutoService();
    fetch.mockClear();
  });

  it('deve buscar produto por ID com sucesso', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, nome: 'Teste' }) });
    const produto = await service.buscarProdutoPorId(1);
    expect(produto).toEqual({ id: 1, nome: 'Teste' });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/1'));
  });

  it('deve lançar erro ao buscar produto inexistente', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(service.buscarProdutoPorId(999)).rejects.toThrow('Produto não encontrado');
  });

  it('deve criar produto com sucesso', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2, nome: 'Novo' }) });
    const produto = await service.criarProduto({ nome: 'Novo' });
    expect(produto).toEqual({ id: 2, nome: 'Novo' });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }));
  });

  it('deve atualizar produto com sucesso', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, nome: 'Atualizado' }) });
    const produto = await service.atualizarProduto(1, { nome: 'Atualizado' });
    expect(produto).toEqual({ id: 1, nome: 'Atualizado' });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), expect.objectContaining({ method: 'PUT' }));
  });

  it('deve excluir produto com sucesso', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    const result = await service.excluirProduto(1);
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), expect.objectContaining({ method: 'DELETE' }));
  });

  it('deve lançar erro ao criar produto com falha', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(service.criarProduto({ nome: 'Falha' })).rejects.toThrow('Erro ao criar produto');
  });

  it('deve lançar erro ao criar produto por erro de rede', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(service.criarProduto({ nome: 'Falha' })).rejects.toThrow('Erro ao criar produto');
  });

  it('deve listar produtos com sucesso', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1 }]) });
    const produtos = await service.listarProdutos();
    expect(produtos).toEqual([{ id: 1 }]);
  });

  it('deve retornar lista vazia se listarProdutos não ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    const produtos = await service.listarProdutos();
    expect(produtos).toEqual([]);
  });

  it('deve retornar lista vazia se listarProdutos der erro', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    const produtos = await service.listarProdutos();
    expect(produtos).toEqual([]);
  });

  it('deve lançar erro ao atualizar produto com falha', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(service.atualizarProduto(1, { nome: 'X' })).rejects.toThrow('Erro ao atualizar produto');
  });

  it('deve lançar erro ao atualizar produto por erro de rede', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(service.atualizarProduto(1, { nome: 'X' })).rejects.toThrow('Erro ao atualizar produto');
  });

  it('deve lançar erro ao excluir produto com falha', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(service.excluirProduto(1)).rejects.toThrow('Erro ao excluir produto');
  });

  it('deve lançar erro ao excluir produto por erro de rede', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(service.excluirProduto(1)).rejects.toThrow('Erro ao excluir produto');
  });

  it('deve exportar ProdutoService via CommonJS', () => {
    const mod = require('../../services/ProdutoService.js');
    expect(typeof mod).toBe('function');
  });
}); 