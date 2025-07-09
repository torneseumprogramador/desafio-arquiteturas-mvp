const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Infrastructure
const mysqlConnection = require('./infrastructure/database/MySQLConnection');
const DatabaseInitializer = require('./infrastructure/database/DatabaseInitializer');
const MySQLProdutoRepository = require('./infrastructure/repositories/MySQLProdutoRepository');
const ProdutoRoutes = require('./application/routes/ProdutoRoutes');
const ErrorHandler = require('./application/middleware/ErrorHandler');

// Domain
const ProdutoService = require('./domain/services/ProdutoService');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.produtoRepository = null;
        this.produtoService = null;
    }

    async initialize() {
        try {
            // Conectar ao banco de dados
            await mysqlConnection.connect();
            
            // Inicializar banco de dados (tabelas e dados de exemplo)
            await DatabaseInitializer.initialize();
            
            // Inicializar repositório
            this.produtoRepository = new MySQLProdutoRepository();
            
            // Inicializar serviço
            this.produtoService = new ProdutoService(this.produtoRepository);
            
            // Configurar middleware
            this.setupMiddleware();
            
            // Configurar rotas
            this.setupRoutes();
            
            // Configurar tratamento de erros
            this.setupErrorHandling();
            
            console.log('✅ Servidor inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar servidor:', error);
            throw error;
        }
    }

    setupMiddleware() {
        // CORS
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true
        }));

        // Body parser
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });

        // Servir arquivos estáticos
        this.app.use(express.static(path.join(__dirname, '../..')));
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'OK', 
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // API routes
        const produtoRoutes = new ProdutoRoutes(this.produtoService);
        this.app.use('/api/produtos', produtoRoutes.getRouter());

        // Rota para servir o arquivo HTML
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../index.html'));
        });

        // Rota para qualquer outra requisição (SPA)
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../index.html'));
        });
    }

    setupErrorHandling() {
        // Middleware para rotas não encontradas
        this.app.use(ErrorHandler.notFound);
        
        // Middleware para tratamento de erros
        this.app.use(ErrorHandler.handleError);
    }

    async start() {
        try {
            await this.initialize();
            
            this.app.listen(this.port, () => {
                console.log(`🚀 Servidor rodando na porta ${this.port}`);
                console.log(`📱 Acesse: http://localhost:${this.port}`);
                console.log(`🗄️  phpMyAdmin: http://localhost:8080`);
                console.log(`🏥 Health Check: http://localhost:${this.port}/health`);
            });
        } catch (error) {
            console.error('❌ Erro ao iniciar servidor:', error);
            process.exit(1);
        }
    }

    async stop() {
        try {
            await mysqlConnection.disconnect();
            console.log('🔌 Servidor parado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao parar servidor:', error);
        }
    }
}

// Tratamento de sinais para graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
    await server.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
    await server.stop();
    process.exit(0);
});

// Iniciar servidor
const server = new Server();
server.start().catch(console.error);

module.exports = server; 