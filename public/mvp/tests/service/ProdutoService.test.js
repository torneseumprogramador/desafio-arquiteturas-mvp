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
}); 