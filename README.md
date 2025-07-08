# 🏪 Gerenciador de Produtos - MVP

Sistema MVP para gerenciamento de produtos desenvolvido com arquitetura limpa e Docker.

> **Projeto desenvolvido como parte do curso de Arquiteturas de Software Modernas**  
> **Professor**: Danilo Aparecido  
> **Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)

## 📋 Sobre o Projeto

Este é um sistema MVP (Minimum Viable Product) para gerenciamento de produtos que implementa os princípios da **arquitetura limpa**, seguindo as melhores práticas ensinadas no curso de **Arquiteturas de Software Modernas** do [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software).

O projeto demonstra a separação de responsabilidades em camadas bem definidas:

- **Models**: Entidades de negócio (regras de domínio)
- **Views**: Interface do usuário (apresentação)
- **Presenters**: Lógica de apresentação (coordenação)
- **Services**: Camada de acesso a dados (infraestrutura)

### 🎯 Objetivos do Projeto
- Demonstrar aplicação prática dos conceitos de arquitetura de software
- Implementar padrão MVP (Model-View-Presenter) de forma eficiente
- Utilizar containerização para facilitar deploy e desenvolvimento
- Criar uma base sólida para evolução do sistema

## 🏗️ Arquitetura

```
.
├── models/
│   └── Produto.js          # Modelo de dados do produto
├── views/
│   └── ProdutoView.js      # Interface do usuário
├── presenters/
│   └── ProdutoPresenter.js # Lógica de apresentação
├── services/
│   └── ProdutoService.js   # Serviços de acesso a dados
├── index.html              # Interface principal
├── app.js                  # Aplicação principal
├── server.js               # Servidor Express
├── docker-compose.yml      # Configuração Docker
├── Dockerfile              # Imagem Docker
├── run.sh                  # Script de inicialização
├── init.sql                # Script de inicialização do banco
└── README.md               # Documentação
```

## 🚀 Como Executar

### Pré-requisitos

- Docker
- Docker Compose

### Passos para Execução

#### 🚀 Método Rápido (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd desafio-arquiteturas-mvp
   ```

2. **Execute o script de inicialização:**
   ```bash
   ./run.sh
   ```

3. **Acesse a aplicação:**
   - **Aplicação Web**: http://localhost:3000
   - **phpMyAdmin**: http://localhost:8080
     - Usuário: `root`
     - Senha: `password`

#### 🔧 Método Manual

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd desafio-arquiteturas-mvp
   ```

2. **Execute com Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse a aplicação:**
   - **Aplicação Web**: http://localhost:3000
   - **phpMyAdmin**: http://localhost:8080
     - Usuário: `root`
     - Senha: `password`

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura da página
- **CSS3**: Estilização moderna e responsiva
- **JavaScript**: Lógica da aplicação
- **Arquitetura MVP**: Padrão de arquitetura

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MySQL**: Banco de dados relacional
- **Docker**: Containerização

### Infraestrutura
- **Docker Compose**: Orquestração de containers
- **MySQL 8.0**: Banco de dados
- **phpMyAdmin**: Interface de administração do banco
- **Script run.sh**: Automação de inicialização e gerenciamento

## 📊 Funcionalidades

### ✅ Implementadas
- ✅ Cadastro de produtos
- ✅ Listagem de produtos
- ✅ Edição de produtos
- ✅ Exclusão de produtos
- ✅ Interface responsiva
- ✅ Validação de formulários
- ✅ Mensagens de feedback
- ✅ Persistência em banco MySQL
- ✅ API REST completa
- ✅ Script de automação (run.sh)
- ✅ Verificações automáticas de ambiente

### 🔄 Funcionalidades da Arquitetura
- **Separação de Responsabilidades**: Cada camada tem sua função específica
- **Inversão de Dependência**: Presenter não depende diretamente da View
- **Testabilidade**: Estrutura facilita testes unitários
- **Manutenibilidade**: Código organizado e bem estruturado
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Clean Architecture**: Seguindo princípios de Robert C. Martin

## 🗄️ Estrutura do Banco de Dados

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

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

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
```

### Comandos Úteis

#### 🚀 Usando o Script (Recomendado)

```bash
# Iniciar a aplicação
./run.sh

# Parar a aplicação
./run.sh stop

# Reiniciar a aplicação
./run.sh restart

# Ver logs em tempo real
./run.sh logs

# Ver status dos containers
./run.sh status

# Limpar containers e volumes
./run.sh clean

# Ver ajuda
./run.sh help
```

#### 🔧 Comandos Docker Compose

```bash
# Executar em modo desenvolvimento
docker-compose up --build

# Parar os containers
docker-compose down

# Ver logs
docker-compose logs -f app

# Acessar container da aplicação
docker-compose exec app sh

# Acessar container do MySQL
docker-compose exec mysql mysql -u root -p
```

## 📱 Interface do Usuário

A interface foi desenvolvida com foco na experiência do usuário:

- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Interface Moderna**: Gradientes e animações suaves
- **Feedback Visual**: Mensagens de sucesso, erro e informação
- **Formulários Intuitivos**: Validação em tempo real
- **Ações Claras**: Botões com ícones e cores significativas

## 🔍 API Endpoints

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

### Exemplo de Uso da API

```bash
# Listar produtos
curl http://localhost:3000/api/produtos

# Criar produto
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Produto",
    "preco": 99.90,
    "descricao": "Descrição do produto",
    "quantidade": 10
  }'
```

## 🧪 Testes

Para executar testes (quando implementados):

```bash
# Instalar dependências
npm install

# Executar testes
npm test
```

## 🚀 Script de Automação

O projeto inclui um script `run.sh` que facilita o gerenciamento da aplicação:

### Funcionalidades do Script:
- ✅ **Verificações automáticas**: Docker, Docker Compose e portas disponíveis
- ✅ **Interface colorida**: Mensagens informativas e de erro bem organizadas
- ✅ **Comandos intuitivos**: start, stop, restart, logs, status, clean
- ✅ **Tratamento de erros**: Para o script se houver erro crítico
- ✅ **Informações de acesso**: Mostra URLs e credenciais após iniciar

### Exemplo de Uso:
```bash
# Iniciar aplicação
./run.sh

# Ver logs em tempo real
./run.sh logs

# Parar aplicação
./run.sh stop

# Ver ajuda completa
./run.sh help
```

## 📈 Próximos Passos

### Melhorias Sugeridas
- [ ] Implementar autenticação de usuários
- [ ] Adicionar upload de imagens para produtos
- [ ] Implementar sistema de categorias
- [ ] Adicionar relatórios e dashboards
- [ ] Implementar testes automatizados
- [ ] Adicionar cache Redis
- [ ] Implementar logs estruturados
- [ ] Adicionar monitoramento e métricas
- [ ] Expandir funcionalidades do script run.sh
- [ ] Adicionar backup automático do banco

### 🎓 Aprendizados do Curso
Este projeto demonstra a aplicação prática dos conceitos aprendidos no curso de **Arquiteturas de Software Modernas**:

- **Padrões Arquiteturais**: MVP, Clean Architecture
- **Princípios SOLID**: Aplicados em toda a estrutura
- **Containerização**: Docker e Docker Compose
- **Automação**: Scripts e CI/CD
- **Boas Práticas**: Código limpo e organizado

### Funcionalidades Avançadas
- [ ] Sistema de busca e filtros
- [ ] Paginação de resultados
- [ ] Exportação de dados (CSV, PDF)
- [ ] Notificações em tempo real
- [ ] Sistema de backup automático

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🎓 Sobre o Curso

Este projeto foi desenvolvido como parte do curso **Arquiteturas de Software Modernas** do [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software).

### 📚 O que você aprenderá no curso:
- **Fundamentos de Arquitetura**: Componentes, comunicação e organização
- **Padrões Arquiteturais**: Monolitos, microsserviços, eventos
- **Clean Architecture**: Princípios de Robert C. Martin
- **SOLID e DDD**: Domain-Driven Design e princípios SOLID
- **Ferramentas Modernas**: Docker, CI/CD, monitoramento
- **Boas Práticas**: Código limpo e manutenível

### 🔗 Links Úteis:
- **Curso Completo**: [Arquiteturas de Software Modernas](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)
- **Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br)
- **Professor**: Danilo Aparecido

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Danilo Aparecido**
- **Professor e Desenvolvedor** especializado em Arquiteturas de Software
- **Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)
- **Especialidades**: Arquiteturas de Software Modernas, Padrões de Projeto, Clean Architecture
- **Cursos**: Arquiteturas de Software, Desenvolvimento Web, Tecnologias Modernas

### Sobre o Autor
Danilo Aparecido é um professor e desenvolvedor experiente que dedica-se ao ensino de arquiteturas de software modernas. Através da plataforma [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software), oferece cursos especializados em:

- **Fundamentos de Arquitetura**: componentes, comunicação e organização de camadas
- **Padrões e Estilos**: monolitos, microsserviços, eventos e muito mais
- **Boas práticas e Design**: SOLID, DDD e Clean Architecture
- **Ferramentas e Deploy**: uso de containers, CI/CD e monitoramento

### Curso de Arquiteturas de Software
Este projeto MVP foi desenvolvido seguindo os princípios ensinados no curso de **Arquiteturas de Software Modernas** do [Tornese um Programador](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software), aplicando:

- ✅ **Padrão MVP** (Model-View-Presenter)
- ✅ **Separação de Responsabilidades**
- ✅ **Clean Architecture**
- ✅ **Boas Práticas de Desenvolvimento**
- ✅ **Containerização com Docker**
- ✅ **Automação de Infraestrutura**

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

---

## 📞 Contato e Suporte

**Professor**: Danilo Aparecido  
**Plataforma**: [Tornese um Programador](https://www.torneseumprogramador.com.br)  
**Curso**: [Arquiteturas de Software Modernas](https://www.torneseumprogramador.com.br/cursos/arquiteturas_software)

> 💡 **Dica**: Este projeto é um exemplo prático dos conceitos ensinados no curso. Para aprofundar seus conhecimentos em arquiteturas de software, recomendamos o curso completo! 