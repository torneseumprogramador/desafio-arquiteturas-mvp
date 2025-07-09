# 📚 Documentação da API - Gerenciador de Produtos

## 🌐 Base URL
```
http://localhost:3000/api
```

## 🔍 Endpoints

### 📦 Produtos

#### Listar todos os produtos
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

#### Buscar produto por ID
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

#### Criar novo produto
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

#### Atualizar produto
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

#### Excluir produto
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

### 🔍 Busca

#### Buscar produtos por nome
```http
GET /api/produtos/busca/nome?nome=notebook
```

**Parâmetros:**
- `nome` (string): Nome ou parte do nome do produto

#### Buscar produtos por preço
```http
GET /api/produtos/busca/preco?min=100&max=500
```

**Parâmetros:**
- `min` (number): Preço mínimo
- `max` (number): Preço máximo

### 🛠️ Operações de Negócio

#### Atualizar estoque
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

#### Aplicar desconto
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

### 📊 Relatórios

#### Obter estatísticas
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

### 🏥 Health Check

#### Verificar status da API
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

## 📋 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 500 | Internal Server Error - Erro interno do servidor |

## 🔧 Exemplos de Uso

### cURL

#### Listar produtos
```bash
curl http://localhost:3000/api/produtos
```

#### Criar produto
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

#### Atualizar produto
```bash
curl -X PUT http://localhost:3000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Produto Atualizado",
    "preco": 149.90
  }'
```

#### Excluir produto
```bash
curl -X DELETE http://localhost:3000/api/produtos/1
```

### JavaScript (Fetch)

#### Listar produtos
```javascript
fetch('http://localhost:3000/api/produtos')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Criar produto
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

## 🚨 Tratamento de Erros

### Formato de Erro
```json
{
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro"
}
```

### Exemplos de Erros

#### Produto não encontrado
```json
{
  "error": "Produto não encontrado",
  "message": "Produto não encontrado"
}
```

#### Dados inválidos
```json
{
  "error": "Dados inválidos",
  "message": "Dados inválidos: Nome é obrigatório, Preço deve ser maior que zero"
}
```

#### Parâmetros obrigatórios
```json
{
  "error": "Parâmetros obrigatórios",
  "message": "Parâmetros \"min\" e \"max\" são obrigatórios"
}
```

## 🔒 Validações

### Produto
- **nome**: Obrigatório, máximo 255 caracteres
- **preco**: Obrigatório, deve ser maior que zero
- **quantidade**: Obrigatório, não pode ser negativo
- **descricao**: Opcional

### Busca por Preço
- **min**: Obrigatório, não pode ser negativo
- **max**: Obrigatório, não pode ser negativo
- **min** não pode ser maior que **max**

### Atualização de Estoque
- **quantidade**: Obrigatório
- Não pode resultar em estoque negativo

### Aplicação de Desconto
- **percentual**: Obrigatório
- Deve estar entre 0 e 100

## 📈 Limites e Performance

- **Tamanho máximo do body**: 10MB
- **Timeout de conexão**: 60 segundos
- **Pool de conexões**: 10 conexões simultâneas
- **Índices otimizados**: nome, preço, data de criação

## 🔄 Versionamento

A API está na versão 1.0. Mudanças futuras serão versionadas adequadamente.

## 📞 Suporte

Para dúvidas sobre a API, consulte:
- **Professor**: Danilo Aparecido
- **Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)
- **Curso**: Arquiteturas de Software Modernas 