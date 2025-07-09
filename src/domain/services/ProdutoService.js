const Produto = require('../entities/Produto');

class ProdutoService {
    constructor(produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    async listarProdutos() {
        try {
            return await this.produtoRepository.listarTodos();
        } catch (error) {
            console.error('Erro no serviço ao listar produtos:', error);
            throw error;
        }
    }

    async buscarProdutoPorId(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }
            
            return await this.produtoRepository.buscarPorId(parseInt(id));
        } catch (error) {
            console.error('Erro no serviço ao buscar produto:', error);
            throw error;
        }
    }

    async criarProduto(dados) {
        try {
            // Criar entidade de domínio
            const produto = Produto.criar(
                dados.nome,
                dados.preco,
                dados.descricao,
                dados.quantidade
            );

            // Validar dados
            const erros = produto.validar();
            if (erros.length > 0) {
                throw new Error(`Dados inválidos: ${erros.join(', ')}`);
            }

            // Salvar no repositório
            return await this.produtoRepository.criar(produto);
        } catch (error) {
            console.error('Erro no serviço ao criar produto:', error);
            throw error;
        }
    }

    async atualizarProduto(id, dados) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            // Buscar produto existente
            const produtoExistente = await this.produtoRepository.buscarPorId(parseInt(id));
            
            // Atualizar dados
            produtoExistente.nome = dados.nome || produtoExistente.nome;
            produtoExistente.preco = dados.preco || produtoExistente.preco;
            produtoExistente.descricao = dados.descricao || produtoExistente.descricao;
            produtoExistente.quantidade = dados.quantidade !== undefined ? dados.quantidade : produtoExistente.quantidade;

            // Validar dados atualizados
            const erros = produtoExistente.validar();
            if (erros.length > 0) {
                throw new Error(`Dados inválidos: ${erros.join(', ')}`);
            }

            // Salvar no repositório
            return await this.produtoRepository.atualizar(parseInt(id), produtoExistente);
        } catch (error) {
            console.error('Erro no serviço ao atualizar produto:', error);
            throw error;
        }
    }

    async excluirProduto(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            // Verificar se produto existe
            await this.produtoRepository.buscarPorId(parseInt(id));
            
            // Excluir do repositório
            return await this.produtoRepository.excluir(parseInt(id));
        } catch (error) {
            console.error('Erro no serviço ao excluir produto:', error);
            throw error;
        }
    }

    async buscarProdutosPorNome(nome) {
        try {
            if (!nome || nome.trim().length === 0) {
                throw new Error('Nome é obrigatório para busca');
            }

            return await this.produtoRepository.buscarPorNome(nome.trim());
        } catch (error) {
            console.error('Erro no serviço ao buscar produtos por nome:', error);
            throw error;
        }
    }

    async buscarProdutosPorPreco(min, max) {
        try {
            if (min === undefined || max === undefined) {
                throw new Error('Preço mínimo e máximo são obrigatórios');
            }

            if (min < 0 || max < 0) {
                throw new Error('Preços não podem ser negativos');
            }

            if (min > max) {
                throw new Error('Preço mínimo não pode ser maior que o máximo');
            }

            return await this.produtoRepository.buscarPorPreco(min, max);
        } catch (error) {
            console.error('Erro no serviço ao buscar produtos por preço:', error);
            throw error;
        }
    }

    async atualizarEstoque(id, quantidade) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            const produto = await this.produtoRepository.buscarPorId(parseInt(id));
            produto.atualizarEstoque(quantidade);

            return await this.produtoRepository.atualizar(parseInt(id), produto);
        } catch (error) {
            console.error('Erro no serviço ao atualizar estoque:', error);
            throw error;
        }
    }

    async aplicarDesconto(id, percentual) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }

            const produto = await this.produtoRepository.buscarPorId(parseInt(id));
            produto.aplicarDesconto(percentual);

            return await this.produtoRepository.atualizar(parseInt(id), produto);
        } catch (error) {
            console.error('Erro no serviço ao aplicar desconto:', error);
            throw error;
        }
    }

    async obterEstatisticas() {
        try {
            const produtos = await this.produtoRepository.listarTodos();
            const total = await this.produtoRepository.contarTotal();

            const estatisticas = {
                total: total,
                valorTotal: produtos.reduce((sum, p) => sum + (p.preco * p.quantidade), 0),
                quantidadeTotal: produtos.reduce((sum, p) => sum + p.quantidade, 0),
                precoMedio: produtos.length > 0 ? produtos.reduce((sum, p) => sum + p.preco, 0) / produtos.length : 0,
                produtosComEstoqueBaixo: produtos.filter(p => p.quantidade < 10).length
            };

            return estatisticas;
        } catch (error) {
            console.error('Erro no serviço ao obter estatísticas:', error);
            throw error;
        }
    }
}

module.exports = ProdutoService; 