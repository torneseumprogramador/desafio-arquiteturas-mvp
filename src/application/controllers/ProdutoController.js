const CriarProdutoUseCase = require('../usecases/CriarProdutoUseCase');
const AtualizarProdutoUseCase = require('../usecases/AtualizarProdutoUseCase');
const ExcluirProdutoUseCase = require('../usecases/ExcluirProdutoUseCase');
const BuscarProdutoUseCase = require('../usecases/BuscarProdutoUseCase');
const GerenciarEstoqueUseCase = require('../usecases/GerenciarEstoqueUseCase');
const ObterEstatisticasUseCase = require('../usecases/ObterEstatisticasUseCase');

class ProdutoController {
    constructor(produtoService) {
        this.produtoService = produtoService;
        
        // Inicializar casos de uso
        this.criarProdutoUseCase = new CriarProdutoUseCase(produtoService);
        this.atualizarProdutoUseCase = new AtualizarProdutoUseCase(produtoService);
        this.excluirProdutoUseCase = new ExcluirProdutoUseCase(produtoService);
        this.buscarProdutoUseCase = new BuscarProdutoUseCase(produtoService);
        this.gerenciarEstoqueUseCase = new GerenciarEstoqueUseCase(produtoService);
        this.obterEstatisticasUseCase = new ObterEstatisticasUseCase(produtoService);
    }

    // Listar todos os produtos
    async listarProdutos(req, res) {
        try {
            const produtos = await this.buscarProdutoUseCase.executarLista();
            res.json(produtos.map(produto => produto.toJSON()));
        } catch (error) {
            console.error('Erro no controller ao listar produtos:', error);
            res.status(500).json({ 
                error: 'Erro interno do servidor',
                message: error.message 
            });
        }
    }

    // Buscar produto por ID
    async buscarProdutoPorId(req, res) {
        try {
            const { id } = req.params;
            const produto = await this.buscarProdutoUseCase.executarPorId(id);
            res.json(produto.toJSON());
        } catch (error) {
            console.error('Erro no controller ao buscar produto:', error);
            
            if (error.message === 'Produto não encontrado' || error.message === 'ID inválido') {
                res.status(404).json({ 
                    error: 'Produto não encontrado',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Criar novo produto
    async criarProduto(req, res) {
        try {
            const { nome, preco, descricao, quantidade } = req.body;
            
            // Validação básica dos dados de entrada
            if (!nome || !preco || quantidade === undefined) {
                return res.status(400).json({ 
                    error: 'Dados obrigatórios',
                    message: 'Nome, preço e quantidade são obrigatórios' 
                });
            }

            const produto = await this.criarProdutoUseCase.executar({
                nome,
                preco: parseFloat(preco),
                descricao: descricao || '',
                quantidade: parseInt(quantidade)
            });

            res.status(201).json(produto.toJSON());
        } catch (error) {
            console.error('Erro no controller ao criar produto:', error);
            
            if (error.message.includes('Dados inválidos')) {
                res.status(400).json({ 
                    error: 'Dados inválidos',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Atualizar produto
    async atualizarProduto(req, res) {
        try {
            const { id } = req.params;
            const { nome, preco, descricao, quantidade } = req.body;

            const produto = await this.atualizarProdutoUseCase.executar(id, {
                nome,
                preco: preco !== undefined ? parseFloat(preco) : undefined,
                descricao,
                quantidade: quantidade !== undefined ? parseInt(quantidade) : undefined
            });

            res.json(produto.toJSON());
        } catch (error) {
            console.error('Erro no controller ao atualizar produto:', error);
            
            if (error.message === 'Produto não encontrado' || error.message === 'ID inválido') {
                res.status(404).json({ 
                    error: 'Produto não encontrado',
                    message: error.message 
                });
            } else if (error.message.includes('Dados inválidos')) {
                res.status(400).json({ 
                    error: 'Dados inválidos',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Excluir produto
    async excluirProduto(req, res) {
        try {
            const { id } = req.params;
            await this.excluirProdutoUseCase.executar(id);
            
            res.json({ 
                message: 'Produto excluído com sucesso' 
            });
        } catch (error) {
            console.error('Erro no controller ao excluir produto:', error);
            
            if (error.message === 'Produto não encontrado' || error.message === 'ID inválido') {
                res.status(404).json({ 
                    error: 'Produto não encontrado',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Buscar produtos por nome
    async buscarProdutosPorNome(req, res) {
        try {
            const { nome } = req.query;
            
            if (!nome) {
                return res.status(400).json({ 
                    error: 'Parâmetro obrigatório',
                    message: 'Parâmetro "nome" é obrigatório' 
                });
            }

            const produtos = await this.buscarProdutoUseCase.executarPorNome(nome);
            res.json(produtos.map(produto => produto.toJSON()));
        } catch (error) {
            console.error('Erro no controller ao buscar produtos por nome:', error);
            res.status(500).json({ 
                error: 'Erro interno do servidor',
                message: error.message 
            });
        }
    }

    // Buscar produtos por preço
    async buscarProdutosPorPreco(req, res) {
        try {
            const { min, max } = req.query;
            
            if (!min || !max) {
                return res.status(400).json({ 
                    error: 'Parâmetros obrigatórios',
                    message: 'Parâmetros "min" e "max" são obrigatórios' 
                });
            }

            const produtos = await this.buscarProdutoUseCase.executarPorPreco(
                parseFloat(min), 
                parseFloat(max)
            );
            res.json(produtos.map(produto => produto.toJSON()));
        } catch (error) {
            console.error('Erro no controller ao buscar produtos por preço:', error);
            
            if (error.message.includes('Preços não podem ser negativos') || 
                error.message.includes('Preço mínimo não pode ser maior')) {
                res.status(400).json({ 
                    error: 'Parâmetros inválidos',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Atualizar estoque
    async atualizarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;
            
            if (quantidade === undefined) {
                return res.status(400).json({ 
                    error: 'Dados obrigatórios',
                    message: 'Quantidade é obrigatória' 
                });
            }

            const produto = await this.gerenciarEstoqueUseCase.atualizarEstoque(id, parseInt(quantidade));
            res.json(produto.toJSON());
        } catch (error) {
            console.error('Erro no controller ao atualizar estoque:', error);
            
            if (error.message === 'Produto não encontrado' || error.message === 'ID inválido') {
                res.status(404).json({ 
                    error: 'Produto não encontrado',
                    message: error.message 
                });
            } else if (error.message.includes('Quantidade insuficiente')) {
                res.status(400).json({ 
                    error: 'Operação inválida',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Aplicar desconto
    async aplicarDesconto(req, res) {
        try {
            const { id } = req.params;
            const { percentual } = req.body;
            
            if (percentual === undefined) {
                return res.status(400).json({ 
                    error: 'Dados obrigatórios',
                    message: 'Percentual é obrigatório' 
                });
            }

            const produto = await this.gerenciarEstoqueUseCase.aplicarDesconto(id, parseFloat(percentual));
            res.json(produto.toJSON());
        } catch (error) {
            console.error('Erro no controller ao aplicar desconto:', error);
            
            if (error.message === 'Produto não encontrado' || error.message === 'ID inválido') {
                res.status(404).json({ 
                    error: 'Produto não encontrado',
                    message: error.message 
                });
            } else if (error.message.includes('Percentual de desconto inválido')) {
                res.status(400).json({ 
                    error: 'Parâmetro inválido',
                    message: error.message 
                });
            } else {
                res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    message: error.message 
                });
            }
        }
    }

    // Obter estatísticas
    async obterEstatisticas(req, res) {
        try {
            const estatisticas = await this.obterEstatisticasUseCase.executar();
            res.json(estatisticas);
        } catch (error) {
            console.error('Erro no controller ao obter estatísticas:', error);
            res.status(500).json({ 
                error: 'Erro interno do servidor',
                message: error.message 
            });
        }
    }
}

module.exports = ProdutoController; 