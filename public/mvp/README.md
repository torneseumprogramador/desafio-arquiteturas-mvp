# 🎯 MVP - Gerenciador de Produtos

## 📋 Sobre o MVP

Este é o **MVP (Minimum Viable Product)** do sistema de gerenciamento de produtos. Implementa o padrão **MVP (Model-View-Presenter)** no frontend, fornecendo uma interface completa para gerenciar produtos.

## 🏗️ Arquitetura MVP

### 📁 Estrutura de Arquivos

```
mvp/
├── models/
│   └── Produto.js          # Modelo de dados do produto
├── views/
│   └── ProdutoView.js      # Interface do usuário
├── presenters/
│   └── ProdutoPresenter.js # Lógica de apresentação
├── services/
│   └── ProdutoService.js   # Serviços de dados
├── app.js                  # Aplicação principal
└── README.md               # Esta documentação
```

### 🔄 Padrão MVP Implementado

- **Model**: `Produto.js` - Estrutura de dados e validações
- **View**: `ProdutoView.js` - Interface do usuário e interações visuais
- **Presenter**: `ProdutoPresenter.js` - Coordenação entre View e Service
- **Service**: `ProdutoService.js` - Comunicação com API e dados locais

## 🚀 Funcionalidades

### ✅ Implementadas

- ✅ Cadastrar produtos
- ✅ Listar produtos
- ✅ Editar produtos
- ✅ Excluir produtos
- ✅ Interface responsiva
- ✅ Validação de formulários
- ✅ Mensagens de feedback
- ✅ Indicadores de carregamento
- ✅ Comunicação com API REST

### 🎨 Interface do Usuário

- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Interface Moderna**: Gradientes e animações suaves
- **Feedback Visual**: Mensagens de sucesso, erro e informação
- **Formulários Intuitivos**: Validação em tempo real
- **Ações Claras**: Botões com ícones e cores significativas

## 🔧 Como Funciona

### 1. Inicialização

```javascript
// app.js inicializa todos os componentes
const app = new App();
app.inicializar();
```

### 2. Fluxo de Dados

```
User Action → View → Presenter → Service → API/Mock Data
     ↑                                    ↓
     ← View ← Presenter ← Service ← Response ←
```

### 3. Comunicação com API

- O `ProdutoService` se comunica exclusivamente com a API
- Se a API não estiver disponível, mostra lista vazia
- Mensagens de erro claras quando API não está disponível

## 📱 Uso da Interface

### Cadastrar Produto

1. Preencha o formulário com os dados do produto
2. Clique em "Cadastrar Produto"
3. O produto será salvo e a lista atualizada

### Editar Produto

1. Clique no botão "✏️ Editar" de um produto
2. O formulário será preenchido com os dados
3. Modifique os dados desejados
4. Clique em "Atualizar Produto"

### Excluir Produto

1. Clique no botão "🗑️ Excluir" de um produto
2. Confirme a exclusão no diálogo
3. O produto será removido da lista

### Cancelar Edição

1. Durante a edição, clique em "Cancelar"
2. O formulário será limpo e a edição cancelada

## 🛠️ Desenvolvimento

### Adicionando Novas Funcionalidades

1. **Model**: Adicione propriedades e validações em `Produto.js`
2. **Service**: Implemente métodos de comunicação em `ProdutoService.js`
3. **View**: Crie elementos de interface em `ProdutoView.js`
4. **Presenter**: Adicione lógica de coordenação em `ProdutoPresenter.js`

### Exemplo: Adicionar Campo "Categoria"

```javascript
// models/Produto.js
class Produto {
    constructor(id, nome, preco, descricao, quantidade, categoria) {
        // ... outros campos
        this.categoria = categoria;
    }

    validar() {
        const erros = [];
        // ... outras validações
        if (!this.categoria) {
            erros.push('Categoria é obrigatória');
        }
        return erros;
    }
}

// services/ProdutoService.js
async criarProduto(produto) {
    // Incluir categoria na requisição
}

// views/ProdutoView.js
createProdutoElement(produto) {
    // Adicionar categoria no HTML
}

// presenters/ProdutoPresenter.js
validarDados(dados) {
    // Validar categoria
}
```

## 🔗 Integração com API

O MVP se comunica exclusivamente com a API:

- **Com API**: Funciona normalmente com dados reais
- **Sem API**: Mostra lista vazia e mensagens de erro
- **Comunicação Direta**: Sem fallbacks ou dados mock

### Endpoints Utilizados

- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

## 🎓 Conceitos Aplicados

- **Separação de Responsabilidades**: Cada componente tem sua função
- **Inversão de Dependência**: Presenter não depende diretamente da View
- **Testabilidade**: Estrutura facilita testes unitários
- **Manutenibilidade**: Código organizado e bem estruturado
- **Escalabilidade**: Arquitetura preparada para crescimento

## 📚 Sobre o Curso

Este MVP demonstra a aplicação prática dos conceitos do curso **Arquiteturas de Software Modernas** do [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software).

**Professor**: Danilo Aparecido  
**Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br)
