#!/bin/bash

# Script para executar testes do Backend API
# Uso: ./scripts/test-backend.sh [opção]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}Script de Testes do Backend API${NC}"
    echo ""
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  all         - Executa todos os testes com cobertura"
    echo "  watch       - Executa testes em modo watch"
    echo "  coverage    - Executa testes com relatório de cobertura"
    echo "  domain      - Executa apenas testes do Domain"
    echo "  application - Executa apenas testes da Application"
    echo "  infrastructure - Executa apenas testes da Infrastructure"
    echo "  integration - Executa apenas testes de integração"
    echo "  unit        - Executa apenas testes unitários"
    echo "  entities    - Executa apenas testes das entidades"
    echo "  services    - Executa apenas testes dos serviços"
    echo "  usecases    - Executa apenas testes dos use cases"
    echo "  controllers - Executa apenas testes dos controllers"
    echo "  help        - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 all"
    echo "  $0 coverage"
    echo "  $0 domain"
    echo "  $0 watch"
}

# Função para executar testes
run_tests() {
    local test_path="$1"
    local description="$2"
    
    echo -e "${BLUE}Executando: ${description}${NC}"
    echo "----------------------------------------"
    
    if npx jest --config jest.config.js "$test_path" --coverage; then
        echo -e "${GREEN}✅ ${description} - SUCESSO${NC}"
    else
        echo -e "${RED}❌ ${description} - FALHOU${NC}"
        return 1
    fi
    echo ""
}

# Verificar se Jest está instalado
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Erro: npx não encontrado. Instale o Node.js primeiro.${NC}"
    exit 1
fi

# Verificar se o arquivo jest.config.js existe
if [ ! -f "jest.config.js" ]; then
    echo -e "${RED}❌ Erro: jest.config.js não encontrado.${NC}"
    exit 1
fi

# Processar argumentos
case "${1:-all}" in
    "all")
        echo -e "${YELLOW}🚀 Executando TODOS os testes do Backend...${NC}"
        echo ""
        run_tests "tests" "Todos os testes do Backend"
        ;;
    
    "watch")
        echo -e "${YELLOW}👀 Executando testes em modo WATCH...${NC}"
        echo ""
        npx jest --config jest.config.js "tests" --watch
        ;;
    
    "coverage")
        echo -e "${YELLOW}📊 Executando testes com COBERTURA...${NC}"
        echo ""
        npx jest --config jest.config.js "tests" --coverage --verbose
        ;;
    
    "domain")
        echo -e "${YELLOW}🏗️  Executando testes do DOMAIN...${NC}"
        echo ""
        run_tests "tests/domain" "Testes do Domain Layer"
        ;;
    
    "application")
        echo -e "${YELLOW}📱 Executando testes da APPLICATION...${NC}"
        echo ""
        run_tests "tests/application" "Testes da Application Layer"
        ;;
    
    "infrastructure")
        echo -e "${YELLOW}🔧 Executando testes da INFRASTRUCTURE...${NC}"
        echo ""
        run_tests "tests/infrastructure" "Testes da Infrastructure Layer"
        ;;
    
    "integration")
        echo -e "${YELLOW}🔗 Executando testes de INTEGRAÇÃO...${NC}"
        echo ""
        run_tests "tests/integration" "Testes de Integração"
        ;;
    
    "unit")
        echo -e "${YELLOW}🧪 Executando testes UNITÁRIOS...${NC}"
        echo ""
        run_tests "tests/domain tests/application" "Testes Unitários (Domain + Application)"
        ;;
    
    "entities")
        run_tests "tests/domain/entities" "Testes das Entidades"
        ;;
    
    "services")
        run_tests "tests/domain/services" "Testes dos Serviços de Domínio"
        ;;
    
    "usecases")
        run_tests "tests/application/usecases" "Testes dos Use Cases"
        ;;
    
    "controllers")
        run_tests "tests/application/controllers" "Testes dos Controllers"
        ;;
    
    "help"|"-h"|"--help")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Opção inválida: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Testes do Backend concluídos!${NC}" 