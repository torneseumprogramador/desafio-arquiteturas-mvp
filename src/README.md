# 🔧 API Backend - Gerenciador de Produtos

## 📋 Sobre a API

Esta é a **API Backend** do sistema de gerenciamento de produtos. Implementa **Clean Architecture** com separação clara de responsabilidades, fornecendo endpoints REST para comunicação com o frontend.

## 🏗️ Arquitetura Clean Architecture

### 📁 Estrutura de Camadas

```
src/
├── domain/                    # 🎯 Camada de Domínio
│   ├── entities/             # Entidades de negócio
│   │   └── Produto.js
│   ├── repositories/         # Interfaces de repositório
│   │   └── IProdutoRepository.js
│   └── services/             # Regras de negócio
│       └── ProdutoService.js
├── application/              # 🔄 Camada de Aplicação
│   ├── usecases/            # Casos de uso específicos
│   │   ├── ListarProdutosUseCase.js
│   │   ├── CriarProdutoUseCase.js
│   │   ├── AtualizarProdutoUseCase.js
│   │   ├── ExcluirProdutoUseCase.js
│   │   ├── BuscarProdutoUseCase.js
│   │   ├── GerenciarEstoqueUseCase.js
│   │   └── ObterEstatisticasUseCase.js
│   ├── controllers/         # Controladores HTTP
│   │   └── ProdutoController.js
│   ├── routes/              # Definição de rotas
│   │   └── ProdutoRoutes.js
│   └── middleware/          # Middlewares
│       └── ErrorHandler.js
├── infrastructure/           # 🛠️ Camada de Infraestrutura
│   ├── database/            # Configuração e inicialização do banco
│   │   ├── MySQLConnection.js
│   │   └── DatabaseInitializer.js
│   └── repositories/        # Implementações concretas dos repositórios
│       └── MySQLProdutoRepository.js
└── server.js                # 🚀 Ponto de entrada da aplicação
```

### 🔄 Fluxo de Dependências

```
Infrastructure → Application → Domain
     ↑              ↑
     └──────────────┘
```

- **Domain**: Não depende de nenhuma camada externa
- **Application**: Depende apenas do Domain
- **Infrastructure**: Depende do Domain e Application

## 🚀 Funcionalidades da API

### ✅ Endpoints Implementados

#### 📦 CRUD de Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

#### 🔍 Busca e Filtros
- `GET /api/produtos/buscar/nome?nome=termo` - Buscar por nome
- `GET /api/produtos/buscar/preco?min=100&max=500` - Buscar por faixa de preço

#### 🛠️ Operações de Negócio
- `PATCH /api/produtos/:id/estoque` - Atualizar estoque
- `PATCH /api/produtos/:id/desconto` - Aplicar desconto

#### 📊 Relatórios
- `GET /api/produtos/estatisticas` - Obter estatísticas

#### 🏥 Health Check
- `GET /health` - Verificar status da API

### 🎯 Regras de Negócio Implementadas

- **Validação de Dados**: Nome obrigatório, preço positivo, quantidade não negativa
- **Gestão de Estoque**: Controle de quantidade disponível
- **Aplicação de Descontos**: Percentual válido (0-100%)
- **Busca Inteligente**: Por nome (parcial) e faixa de preço
- **Estatísticas**: Total, valor total, quantidade média, produtos com estoque baixo

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MySQL**: Banco de dados relacional
- **Docker**: Containerização

### Arquitetura
- **Clean Architecture**: Separação de responsabilidades
- **SOLID**: Princípios aplicados
- **Dependency Injection**: Inversão de dependências
- **Repository Pattern**: Abstração de acesso a dados

## 🗄️ Banco de Dados

### Tabela `produtos`
```sql
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    quantidade INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Configuração
- **Host**: `mysql` (Docker) ou `localhost` (desenvolvimento)
- **Porta**: `3306`
- **Usuário**: `root`
- **Senha**: `password`
- **Database**: `produtos_db`

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=produtos_db

# Configurações de CORS
CORS_ORIGIN=http://localhost:3000
```

### Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start

# Executar testes
npm test
```

## 📊 Estrutura de Respostas

### Sucesso
```json
{
  "id": 1,
  "nome": "Produto Exemplo",
  "preco": 99.90,
  "descricao": "Descrição do produto",
  "quantidade": 10,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### Erro
```json
{
  "error": "Tipo de erro",
  "message": "Descrição detalhada do erro"
}
```

## 🔍 Logs e Monitoramento

### Logs da Aplicação
- **Console**: Logs detalhados em desenvolvimento
- **Arquivo**: Logs estruturados em produção
- **Níveis**: INFO, WARN, ERROR, DEBUG

### Health Check
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── unit/              # Testes unitários
├── integration/       # Testes de integração
└── e2e/              # Testes end-to-end
```

### Executar Testes
```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Todos os testes
npm run test
```

## 🚀 Deploy

### Docker
```bash
# Construir imagem
docker build -t gerenciador-produtos-api .

# Executar container
docker run -p 3000:3000 gerenciador-produtos-api
```

### Docker Compose
```bash
# Executar com banco de dados
docker-compose up --build
```

## 📚 Documentação Completa da API

### 🌐 Base URL
```
http://localhost:3000/api
```

### 📋 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 500 | Internal Server Error - Erro interno do servidor |

### 🔍 Endpoints Detalhados

#### 📦 CRUD de Produtos

##### Listar todos os produtos
```http
GET /api/produtos
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Notebook Dell Inspiron",
    "preco": 2999.99,
    "descricao": "Notebook com processador Intel i5, 8GB RAM, 256GB SSD",
    "quantidade": 10,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

##### Buscar produto por ID
```http
GET /api/produtos/{id}
```

**Parâmetros:**
- `id` (number): ID do produto

**Resposta:**
```json
{
  "id": 1,
  "nome": "Notebook Dell Inspiron",
  "preco": 2999.99,
  "descricao": "Notebook com processador Intel i5, 8GB RAM, 256GB SSD",
  "quantidade": 10,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

##### Criar novo produto
```http
POST /api/produtos
```

**Body:**
```json
{
  "nome": "Novo Produto",
  "preco": 99.90,
  "descricao": "Descrição do produto",
  "quantidade": 10
}
```

**Resposta:**
```json
{
  "id": 9,
  "nome": "Novo Produto",
  "preco": 99.90,
  "descricao": "Descrição do produto",
  "quantidade": 10,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

##### Atualizar produto
```http
PUT /api/produtos/{id}
```

**Parâmetros:**
- `id` (number): ID do produto

**Body:**
```json
{
  "nome": "Produto Atualizado",
  "preco": 149.90,
  "descricao": "Nova descrição",
  "quantidade": 15
}
```

##### Excluir produto
```http
DELETE /api/produtos/{id}
```

**Parâmetros:**
- `id` (number): ID do produto

**Resposta:**
```json
{
  "message": "Produto excluído com sucesso"
}
```

#### 🔍 Busca e Filtros

##### Buscar produtos por nome
```http
GET /api/produtos/busca/nome?nome=notebook
```

**Parâmetros:**
- `nome` (string): Nome ou parte do nome do produto

##### Buscar produtos por preço
```http
GET /api/produtos/busca/preco?min=100&max=500
```

**Parâmetros:**
- `min` (number): Preço mínimo
- `max` (number): Preço máximo

#### 🛠️ Operações de Negócio

##### Atualizar estoque
```http
PATCH /api/produtos/{id}/estoque
```

**Parâmetros:**
- `id` (number): ID do produto

**Body:**
```json
{
  "quantidade": 5
}
```

##### Aplicar desconto
```http
PATCH /api/produtos/{id}/desconto
```

**Parâmetros:**
- `id` (number): ID do produto

**Body:**
```json
{
  "percentual": 10
}
```

#### 📊 Relatórios

##### Obter estatísticas
```http
GET /api/produtos/relatorios/estatisticas
```

**Resposta:**
```json
{
  "total": 8,
  "valorTotal": 4568.28,
  "quantidadeTotal": 170,
  "precoMedio": 571.04,
  "produtosComEstoqueBaixo": 2
}
```

#### 🏥 Health Check

##### Verificar status da API
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### 🔧 Exemplos de Uso

#### cURL

##### Listar produtos
```bash
curl http://localhost:3000/api/produtos
```

##### Criar produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Produto",
    "preco": 99.90,
    "descricao": "Descrição do produto",
    "quantidade": 10
  }'
```

##### Atualizar produto
```bash
curl -X PUT http://localhost:3000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Produto Atualizado",
    "preco": 149.90
  }'
```

##### Excluir produto
```bash
curl -X DELETE http://localhost:3000/api/produtos/1
```

#### JavaScript (Fetch)

##### Listar produtos
```javascript
fetch('http://localhost:3000/api/produtos')
  .then(response => response.json())
  .then(data => console.log(data));
```

##### Criar produto
```javascript
fetch('http://localhost:3000/api/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome: 'Novo Produto',
    preco: 99.90,
    descricao: 'Descrição do produto',
    quantidade: 10
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 🚨 Tratamento de Erros

#### Formato de Erro
```json
{
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro"
}
```

#### Exemplos de Erros

##### Produto não encontrado
```json
{
  "error": "Produto não encontrado",
  "message": "Produto não encontrado"
}
```

##### Dados inválidos
```json
{
  "error": "Dados inválidos",
  "message": "Dados inválidos: Nome é obrigatório, Preço deve ser maior que zero"
}
```

##### Parâmetros obrigatórios
```json
{
  "error": "Parâmetros obrigatórios",
  "message": "Parâmetros \"min\" e \"max\" são obrigatórios"
}
```

### 🔒 Validações

#### Produto
- **nome**: Obrigatório, máximo 255 caracteres
- **preco**: Obrigatório, deve ser maior que zero
- **quantidade**: Obrigatório, não pode ser negativo
- **descricao**: Opcional

#### Busca por Preço
- **min**: Obrigatório, não pode ser negativo
- **max**: Obrigatório, não pode ser negativo
- **min** não pode ser maior que **max**

#### Atualização de Estoque
- **quantidade**: Obrigatório
- Não pode resultar em estoque negativo

#### Aplicação de Desconto
- **percentual**: Obrigatório
- Deve estar entre 0 e 100

### 📈 Limites e Performance

- **Tamanho máximo do body**: 10MB
- **Timeout de conexão**: 60 segundos
- **Pool de conexões**: 10 conexões simultâneas
- **Índices otimizados**: nome, preço, data de criação

### 🔄 Versionamento

A API está na versão 1.0. Mudanças futuras serão versionadas adequadamente.

## 🎓 Conceitos Aplicados

### Clean Architecture
- **Independência de Frameworks**: Domain não depende de Express
- **Testabilidade**: Cada camada pode ser testada independentemente
- **Independência de UI**: Lógica de negócio separada da interface
- **Independência de Banco**: Interfaces abstraem implementações

### SOLID
- **S**: Single Responsibility Principle
- **O**: Open/Closed Principle
- **L**: Liskov Substitution Principle
- **I**: Interface Segregation Principle
- **D**: Dependency Inversion Principle

## 🔗 Integração com Frontend

A API é consumida pelo MVP Frontend (`/mvp`):
- **Comunicação**: REST API via HTTP
- **Formato**: JSON
- **CORS**: Configurado para permitir requisições do frontend
- **Autenticação**: Não implementada (MVP)

## 📚 Sobre o Curso

Esta API demonstra a aplicação prática dos conceitos do curso **Arquiteturas de Software Modernas** do [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software).

**Professor**: Danilo Aparecido  
**Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br) 