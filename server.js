const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configuração do banco de dados
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'produtos_db'
};

// Pool de conexões MySQL
let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        
        // Testar conexão
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao banco de dados MySQL');
        connection.release();
        
        // Criar tabela se não existir
        await createTableIfNotExists();
        
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
        // Em desenvolvimento, usar dados mock
        console.log('🔄 Usando dados mock para desenvolvimento...');
    }
}

async function createTableIfNotExists() {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS produtos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            preco DECIMAL(10,2) NOT NULL,
            descricao TEXT,
            quantidade INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    
    try {
        await pool.execute(createTableSQL);
        console.log('✅ Tabela produtos criada/verificada');
        
        // Inserir dados de exemplo se a tabela estiver vazia
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM produtos');
        if (rows[0].count === 0) {
            await insertSampleData();
        }
    } catch (error) {
        console.error('❌ Erro ao criar tabela:', error.message);
    }
}

async function insertSampleData() {
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
        }
    ];
    
    try {
        for (const produto of sampleData) {
            await pool.execute(
                'INSERT INTO produtos (nome, preco, descricao, quantidade) VALUES (?, ?, ?, ?)',
                [produto.nome, produto.preco, produto.descricao, produto.quantidade]
            );
        }
        console.log('✅ Dados de exemplo inseridos');
    } catch (error) {
        console.error('❌ Erro ao inserir dados de exemplo:', error.message);
    }
}

// Rotas da API
app.get('/api/produtos', async (req, res) => {
    try {
        if (pool) {
            const [rows] = await pool.execute('SELECT * FROM produtos ORDER BY created_at DESC');
            res.json(rows);
        } else {
            // Fallback para dados mock
            res.json([
                {
                    id: 1,
                    nome: 'Notebook Dell Inspiron',
                    preco: 2999.99,
                    descricao: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD',
                    quantidade: 10
                },
                {
                    id: 2,
                    nome: 'Mouse Gamer RGB',
                    preco: 89.90,
                    descricao: 'Mouse gamer com 6 botões e iluminação RGB',
                    quantidade: 25
                }
            ]);
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (pool) {
            const [rows] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json(rows[0]);
        } else {
            // Fallback mock
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/produtos', async (req, res) => {
    try {
        const { nome, preco, descricao, quantidade } = req.body;
        
        if (!nome || !preco || quantidade === undefined) {
            return res.status(400).json({ error: 'Nome, preço e quantidade são obrigatórios' });
        }
        
        if (pool) {
            const [result] = await pool.execute(
                'INSERT INTO produtos (nome, preco, descricao, quantidade) VALUES (?, ?, ?, ?)',
                [nome, preco, descricao, quantidade]
            );
            
            const [newProduct] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [result.insertId]);
            res.status(201).json(newProduct[0]);
        } else {
            // Fallback mock
            const newProduct = {
                id: Date.now(),
                nome,
                preco,
                descricao,
                quantidade
            };
            res.status(201).json(newProduct);
        }
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, descricao, quantidade } = req.body;
        
        if (!nome || !preco || quantidade === undefined) {
            return res.status(400).json({ error: 'Nome, preço e quantidade são obrigatórios' });
        }
        
        if (pool) {
            const [result] = await pool.execute(
                'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, quantidade = ? WHERE id = ?',
                [nome, preco, descricao, quantidade, id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            const [updatedProduct] = await pool.execute('SELECT * FROM produtos WHERE id = ?', [id]);
            res.json(updatedProduct[0]);
        } else {
            // Fallback mock
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (pool) {
            const [result] = await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            res.json({ message: 'Produto excluído com sucesso' });
        } else {
            // Fallback mock
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar servidor
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📱 Acesse: http://localhost:${PORT}`);
        console.log(`🗄️  phpMyAdmin: http://localhost:8080`);
    });
}

startServer().catch(console.error); 