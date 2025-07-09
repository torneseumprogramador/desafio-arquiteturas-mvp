const mysql = require('mysql2/promise');

class MySQLConnection {
    constructor() {
        this.connection = null;
        this.config = {
            host: process.env.DB_HOST || 'mysql',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'produtos_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
            reconnect: true
        };
    }

    async connect() {
        try {
            // Primeiro, conectar sem especificar o banco para criá-lo se não existir
            const tempConfig = { ...this.config };
            delete tempConfig.database;
            
            const tempConnection = await mysql.createConnection(tempConfig);
            
            // Criar banco de dados se não existir
            await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${this.config.database}`);
            await tempConnection.end();
            
            // Conectar ao banco específico
            this.connection = await mysql.createConnection(this.config);
            
            console.log('✅ Conectado ao MySQL com sucesso');
        } catch (error) {
            console.error('❌ Erro ao conectar ao MySQL:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.connection) {
                await this.connection.end();
                console.log('🔌 Desconectado do MySQL');
            }
        } catch (error) {
            console.error('❌ Erro ao desconectar do MySQL:', error);
            throw error;
        }
    }

    async execute(query, params = []) {
        try {
            if (!this.connection) {
                throw new Error('Conexão com MySQL não estabelecida');
            }
            
            const [rows] = await this.connection.execute(query, params);
            return rows;
        } catch (error) {
            console.error('❌ Erro ao executar query:', error);
            throw error;
        }
    }

    async query(query, params = []) {
        try {
            if (!this.connection) {
                throw new Error('Conexão com MySQL não estabelecida');
            }
            
            const [rows] = await this.connection.query(query, params);
            return rows;
        } catch (error) {
            console.error('❌ Erro ao executar query:', error);
            throw error;
        }
    }

    async beginTransaction() {
        try {
            if (!this.connection) {
                throw new Error('Conexão com MySQL não estabelecida');
            }
            
            await this.connection.beginTransaction();
        } catch (error) {
            console.error('❌ Erro ao iniciar transação:', error);
            throw error;
        }
    }

    async commit() {
        try {
            if (!this.connection) {
                throw new Error('Conexão com MySQL não estabelecida');
            }
            
            await this.connection.commit();
        } catch (error) {
            console.error('❌ Erro ao fazer commit:', error);
            throw error;
        }
    }

    async rollback() {
        try {
            if (!this.connection) {
                throw new Error('Conexão com MySQL não estabelecida');
            }
            
            await this.connection.rollback();
        } catch (error) {
            console.error('❌ Erro ao fazer rollback:', error);
            throw error;
        }
    }

    isConnected() {
        return this.connection !== null;
    }
}

// Exportar uma instância singleton
const mysqlConnection = new MySQLConnection();

module.exports = mysqlConnection; 