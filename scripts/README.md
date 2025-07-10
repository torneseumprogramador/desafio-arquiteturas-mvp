# Scripts de Teste - MVP Arquiteturas

Este diretório contém scripts shell para facilitar a execução dos testes do projeto.

## Scripts Disponíveis

### 1. `test-all.sh` - Script Unificado
Executa todos os testes do projeto (frontend + backend) com diferentes opções.

**Uso:**
```bash
./scripts/test-all.sh [opção]
```

**Opções:**
- `all` - Executa TODOS os testes (frontend + backend) - **padrão**
- `frontend` - Executa apenas testes do frontend
- `backend` - Executa apenas testes do backend
- `coverage` - Executa todos os testes com cobertura detalhada
- `watch` - Executa testes do frontend em modo watch
- `watch-backend` - Executa testes do backend em modo watch
- `quick` - Executa testes rápidos (sem cobertura)
- `ci` - Modo CI/CD (sem cores, com saída JSON)
- `help` - Mostra ajuda

**Exemplos:**
```bash
./scripts/test-all.sh          # Executa todos os testes
./scripts/test-all.sh frontend # Apenas frontend
./scripts/test-all.sh backend  # Apenas backend
./scripts/test-all.sh coverage # Com cobertura detalhada
./scripts/test-all.sh watch    # Frontend em modo watch
```

### 2. `test-frontend.sh` - Testes do Frontend
Executa testes específicos do frontend MVP.

**Uso:**
```bash
./scripts/test-frontend.sh [opção]
```

**Opções:**
- `all` - Executa todos os testes com cobertura - **padrão**
- `watch` - Executa testes em modo watch
- `coverage` - Executa testes com relatório de cobertura
- `model` - Executa apenas testes do Model
- `service` - Executa apenas testes do Service
- `view` - Executa apenas testes da View
- `presenter` - Executa apenas testes do Presenter
- `unit` - Executa apenas testes unitários
- `help` - Mostra ajuda

**Exemplos:**
```bash
./scripts/test-frontend.sh all      # Todos os testes
./scripts/test-frontend.sh model    # Apenas Model
./scripts/test-frontend.sh watch    # Modo watch
```

### 3. `test-backend.sh` - Testes do Backend
Executa testes específicos do backend API.

**Uso:**
```bash
./scripts/test-backend.sh [opção]
```

**Opções:**
- `all` - Executa todos os testes com cobertura - **padrão**
- `watch` - Executa testes em modo watch
- `coverage` - Executa testes com relatório de cobertura
- `domain` - Executa apenas testes do Domain
- `application` - Executa apenas testes da Application
- `infrastructure` - Executa apenas testes da Infrastructure
- `integration` - Executa apenas testes de integração
- `unit` - Executa apenas testes unitários
- `entities` - Executa apenas testes das entidades
- `services` - Executa apenas testes dos serviços
- `usecases` - Executa apenas testes dos use cases
- `controllers` - Executa apenas testes dos controllers
- `help` - Mostra ajuda

**Exemplos:**
```bash
./scripts/test-backend.sh all           # Todos os testes
./scripts/test-backend.sh domain        # Apenas Domain
./scripts/test-backend.sh usecases      # Apenas Use Cases
./scripts/test-backend.sh watch         # Modo watch
```

## Estrutura de Testes

### Frontend (MVP)
```
public/mvp/tests/
├── model/
│   └── Produto.test.js
├── service/
│   └── ProdutoService.test.js
├── view/
│   └── ProdutoView.test.js
└── presenter/
    └── ProdutoPresenter.test.js
```

### Backend (Clean Architecture)
```
tests/
├── domain/
│   ├── entities/
│   │   └── Produto.test.js
│   ├── repositories/
│   │   └── IProdutoRepository.test.js
│   └── services/
│       └── ProdutoService.test.js
├── application/
│   ├── controllers/
│   │   └── ProdutoController.test.js
│   ├── middleware/
│   │   └── ErrorHandler.test.js
│   └── usecases/
│       ├── AtualizarProdutoUseCase.test.js
│       ├── BuscarProdutoUseCase.test.js
│       ├── CriarProdutoUseCase.test.js
│       ├── ExcluirProdutoUseCase.test.js
│       ├── GerenciarEstoqueUseCase.test.js
│       ├── ListarProdutosUseCase.test.js
│       └── ObterEstatisticasUseCase.test.js
├── infrastructure/
│   └── repositories/
│       └── MySQLProdutoRepository.test.js
└── integration/
    └── api.test.js
```

## Cobertura de Testes

### Frontend
- **Model**: 100% de cobertura
- **Service**: 100% de cobertura
- **View**: 100% de cobertura
- **Presenter**: 100% de cobertura

### Backend
- **Domain**: 100% de cobertura
- **Application**: ~75% de cobertura
- **Infrastructure**: Cobertura parcial
- **Integration**: Testes de API completos

## Relatórios de Cobertura

Os relatórios de cobertura são gerados automaticamente na pasta `coverage/`:

- `coverage/lcov-report/index.html` - Relatório HTML principal
- `coverage/coverage-summary.json` - Resumo em JSON
- `coverage/frontend-results.json` - Resultados do frontend (modo CI)
- `coverage/backend-results.json` - Resultados do backend (modo CI)

## Modo CI/CD

Para integração contínua, use o modo CI:

```bash
./scripts/test-all.sh ci
```

Este modo:
- Remove cores do output
- Gera relatórios JSON
- É ideal para pipelines de CI/CD

## Dependências

Certifique-se de que as seguintes dependências estão instaladas:

```bash
npm install --save-dev jest supertest
```

## Configuração

Os scripts utilizam o arquivo `jest.config.js` na raiz do projeto para configuração do Jest.

## Troubleshooting

### Erro: "npx não encontrado"
- Instale o Node.js: https://nodejs.org/

### Erro: "jest.config.js não encontrado"
- Verifique se está no diretório raiz do projeto
- Execute: `ls jest.config.js`

### Testes falhando
- Verifique se todas as dependências estão instaladas: `npm install`
- Execute os testes individualmente para identificar o problema
- Verifique os logs de erro detalhados 