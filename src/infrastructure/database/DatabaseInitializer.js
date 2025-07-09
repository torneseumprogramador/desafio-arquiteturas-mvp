const mysqlConnection = require('./MySQLConnection');

class DatabaseInitializer {
    static async initialize() {
        try {
            await this.createTableIfNotExists();
            await this.insertSampleDataIfEmpty();
            console.log('✅ Banco de dados inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar banco de dados:', error);
            throw error;
        }
    }

    static async createTableIfNotExists() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                preco DECIMAL(10,2) NOT NULL,
                descricao TEXT,
                quantidade INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_produtos_nome (nome),
                INDEX idx_produtos_preco (preco),
                INDEX idx_produtos_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        try {
            await mysqlConnection.execute(createTableSQL);
            console.log('✅ Tabela produtos criada/verificada');
        } catch (error) {
            console.error('❌ Erro ao criar tabela:', error);
            throw error;
        }
    }

    static async insertSampleDataIfEmpty() {
        try {
            const [rows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM produtos');
            
            if (rows[0].count === 0) {
                await this.insertSampleData();
                console.log('✅ Dados de exemplo inseridos');
            } else {
                console.log('ℹ️  Tabela já contém dados, pulando inserção de exemplo');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar/inserir dados de exemplo:', error);
            throw error;
        }
    }

    static async insertSampleData() {
        const sampleData = [
            {
                nome: 'Notebook Dell Inspiron',
                preco: 2999.99,
                descricao: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD',
                quantidade: 10
            },
            {
                nome: 'Mouse Gamer RGB',
                preco: 89.90,
                descricao: 'Mouse gamer com 6 botões e iluminação RGB',
                quantidade: 25
            },
            {
                nome: 'Teclado Mecânico',
                preco: 299.90,
                descricao: 'Teclado mecânico com switches Cherry MX Blue',
                quantidade: 15
            },
            {
                nome: 'Monitor 24" Full HD',
                preco: 599.90,
                descricao: 'Monitor LED 24 polegadas com resolução Full HD',
                quantidade: 8
            },
            {
                nome: 'Webcam HD',
                preco: 129.90,
                descricao: 'Webcam com resolução HD e microfone integrado',
                quantidade: 20
            },
            {
                nome: 'Headset Gamer',
                preco: 199.90,
                descricao: 'Headset com microfone e cancelamento de ruído',
                quantidade: 12
            },
            {
                nome: 'SSD 500GB',
                preco: 299.90,
                descricao: 'SSD SATA de 500GB para upgrade de performance',
                quantidade: 30
            },
            {
                nome: 'Memória RAM 8GB',
                preco: 159.90,
                descricao: 'Memória DDR4 8GB para desktop',
                quantidade: 40
            }
        ];
        
        try {
            for (const produto of sampleData) {
                await mysqlConnection.execute(
                    'INSERT INTO produtos (nome, preco, descricao, quantidade) VALUES (?, ?, ?, ?)',
                    [produto.nome, produto.preco, produto.descricao, produto.quantidade]
                );
            }
        } catch (error) {
            console.error('❌ Erro ao inserir dados de exemplo:', error);
            throw error;
        }
    }

    static async resetDatabase() {
        try {
            await mysqlConnection.execute('DROP TABLE IF EXISTS produtos');
            console.log('🗑️  Tabela produtos removida');
            
            await this.initialize();
            console.log('🔄 Banco de dados resetado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao resetar banco de dados:', error);
            throw error;
        }
    }
}

module.exports = DatabaseInitializer; 