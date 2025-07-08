# 🚀 Instruções Rápidas de Execução

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
├── models/Produto.js          # Modelo de dados
├── views/ProdutoView.js       # Interface do usuário
├── presenters/ProdutoPresenter.js # Lógica de apresentação
├── services/ProdutoService.js # Serviços de dados
├── index.html                 # Página principal
├── app.js                     # Aplicação frontend
├── server.js                  # Servidor backend
├── docker-compose.yml         # Configuração Docker
├── Dockerfile                 # Imagem Docker
├── init.sql                   # Script de inicialização do banco
└── package.json               # Dependências Node.js
```

## Funcionalidades

- ✅ Cadastrar produtos
- ✅ Listar produtos
- ✅ Editar produtos
- ✅ Excluir produtos
- ✅ Interface responsiva
- ✅ Persistência em MySQL
- ✅ API REST completa

## Arquitetura MVP

O projeto segue o padrão MVP (Model-View-Presenter):
- **Model**: Entidades de negócio
- **View**: Interface do usuário
- **Presenter**: Lógica de apresentação
- **Service**: Acesso a dados

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