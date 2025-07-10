# 🚀 Instruções Rápidas de Execução

> **Projeto do curso Arquiteturas de Software Modernas**  
> **Professor**: Danilo Aparecido - [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Passos para Executar

1. **Clone o repositório e entre na pasta:**

   ```bash
   cd desafio-arquiteturas-mvp
   ```

2. **Execute o projeto:**

   ```bash
   docker-compose up --build
   ```

3. **Aguarde a inicialização** (pode demorar alguns minutos na primeira execução)

4. **Acesse a aplicação:**
   - **Aplicação Web**: http://localhost:3000
   - **phpMyAdmin**: http://localhost:8080
     - Usuário: `root`
     - Senha: `password`

## Comandos Úteis

```bash
# Parar os containers
docker-compose down

# Ver logs em tempo real
docker-compose logs -f app

# Reconstruir containers
docker-compose up --build --force-recreate
```

## Estrutura do Projeto

```
desafio-arquiteturas-mvp/
├── src/
│   ├── domain/                    # Camada de Domínio
│   │   ├── entities/             # Entidades de negócio
│   │   │   └── Produto.js
│   │   ├── repositories/         # Interfaces de repositório
│   │   │   └── IProdutoRepository.js
│   │   └── services/             # Regras de negócio
│   │       └── ProdutoService.js
│   ├── application/              # Camada de Aplicação
│   │   ├── usecases/            # Casos de uso específicos
│   │   │   ├── ListarProdutosUseCase.js
│   │   │   ├── CriarProdutoUseCase.js
│   │   │   ├── AtualizarProdutoUseCase.js
│   │   │   ├── ExcluirProdutoUseCase.js
│   │   │   ├── BuscarProdutoUseCase.js
│   │   │   ├── GerenciarEstoqueUseCase.js
│   │   │   └── ObterEstatisticasUseCase.js
│   │   ├── controllers/         # Controladores HTTP
│   │   │   └── ProdutoController.js
│   │   ├── routes/              # Definição de rotas
│   │   │   └── ProdutoRoutes.js
│   │   └── middleware/          # Middlewares
│   │       └── ErrorHandler.js
│   ├── infrastructure/           # Camada de Infraestrutura
│   │   ├── database/            # Configuração e inicialização do banco
│   │   │   ├── MySQLConnection.js
│   │   │   └── DatabaseInitializer.js
│   │   └── repositories/        # Implementações concretas dos repositórios
│   │       └── MySQLProdutoRepository.js
│   └── server.js                # Ponto de entrada da aplicação
├── index.html                   # Página principal
├── app.js                       # Aplicação frontend
├── docker-compose.yml           # Configuração Docker
├── Dockerfile                   # Imagem Docker
├── init.sql                     # Script de inicialização do banco
├── package.json                 # Dependências Node.js
└── run.sh                       # Script de gerenciamento
```

## Funcionalidades

- ✅ Cadastrar produtos
- ✅ Listar produtos
- ✅ Editar produtos
- ✅ Excluir produtos
- ✅ Interface responsiva
- ✅ Persistência em MySQL
- ✅ API REST completa

## Arquitetura Clean Architecture

O projeto segue os princípios da Clean Architecture, organizando o código em camadas bem definidas:

### 🏗️ Camadas da Arquitetura

- **Domain**: Entidades de negócio e interfaces (regras de domínio)
- **Application**: Casos de uso, controladores, rotas e middlewares
- **Infrastructure**: Implementações concretas (banco de dados, frameworks)

### 📋 Responsabilidades

- **Domain**: Contém as regras de negócio puras, entidades e serviços de domínio
- **Application**: Contém casos de uso específicos da aplicação e comunicação HTTP
- **Infrastructure**: Implementa as interfaces definidas no domínio

### 🎓 Conceitos Aplicados

- **Clean Architecture**: Separação clara de responsabilidades
- **SOLID**: Princípios aplicados em toda a estrutura
- **Containerização**: Docker para facilitar deploy
- **Automação**: Scripts para gerenciamento

## Solução de Problemas

### Se o banco não conectar:

- Aguarde alguns minutos para o MySQL inicializar
- Verifique se a porta 3306 não está em uso
- Use `docker-compose logs mysql` para ver logs do banco

### Se a aplicação não carregar:

- Verifique se a porta 3000 não está em uso
- Use `docker-compose logs app` para ver logs da aplicação
- Tente `docker-compose restart app`

### Para limpar tudo e começar do zero:

```bash
docker-compose down -v
docker system prune -f
docker-compose up --build
```

---

## 📚 Sobre o Curso

Este projeto demonstra a aplicação prática dos conceitos do curso **Arquiteturas de Software Modernas** do [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software).

**Professor**: Danilo Aparecido  
**Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br)

> 💡 **Dica**: Para aprofundar seus conhecimentos em arquiteturas de software, recomendamos o curso completo!
