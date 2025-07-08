-- Script de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container MySQL é criado

USE produtos_db;

-- Criar tabela de produtos se não existir
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    quantidade INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO produtos (nome, preco, descricao, quantidade) VALUES
('Notebook Dell Inspiron', 2999.99, 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD', 10),
('Mouse Gamer RGB', 89.90, 'Mouse gamer com 6 botões e iluminação RGB', 25),
('Teclado Mecânico', 299.90, 'Teclado mecânico com switches Cherry MX Blue', 15),
('Monitor 24" Full HD', 599.90, 'Monitor LED 24 polegadas com resolução Full HD', 8),
('Webcam HD', 129.90, 'Webcam com resolução HD e microfone integrado', 20),
('Headset Gamer', 199.90, 'Headset com microfone e cancelamento de ruído', 12),
('SSD 500GB', 299.90, 'SSD SATA de 500GB para upgrade de performance', 30),
('Memória RAM 8GB', 159.90, 'Memória DDR4 8GB para desktop', 40);

-- Criar índices para melhor performance
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_produtos_preco ON produtos(preco);
CREATE INDEX idx_produtos_created_at ON produtos(created_at); 