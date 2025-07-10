#!/bin/bash

# Script unificado para executar todos os testes do projeto
# Uso: ./scripts/test-all.sh [opção]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}Script Unificado de Testes - MVP Arquiteturas${NC}"
    echo ""
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  all         - Executa TODOS os testes (frontend + backend)"
    echo "  frontend    - Executa apenas testes do frontend"
    echo "  backend     - Executa apenas testes do backend"
    echo "  coverage    - Executa todos os testes com cobertura detalhada"
    echo "  watch       - Executa testes em modo watch (frontend)"
    echo "  watch-backend - Executa testes do backend em modo watch"
    echo "  quick       - Executa testes rápidos (sem cobertura)"
    echo "  ci          - Modo CI/CD (sem cores, com saída JSON)"
    echo "  help        - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 all"
    echo "  $0 frontend"
    echo "  $0 backend"
    echo "  $0 coverage"
    echo "  $0 watch"
}

# Função para executar testes do frontend
run_frontend_tests() {
    local mode="$1"
    echo -e "${CYAN}🎨 Executando testes do FRONTEND...${NC}"
    echo "========================================"
    
    case "$mode" in
        "coverage")
            npx jest --config jest.config.js "public/mvp/tests" --coverage --verbose
            ;;
        "watch")
            npx jest --config jest.config.js "public/mvp/tests" --watch
            ;;
        "quick")
            npx jest --config jest.config.js "public/mvp/tests"
            ;;
        *)
            npx jest --config jest.config.js "public/mvp/tests" --coverage
            ;;
    esac
}

# Função para executar testes do backend
run_backend_tests() {
    local mode="$1"
    echo -e "${PURPLE}🔧 Executando testes do BACKEND...${NC}"
    echo "========================================"
    
    case "$mode" in
        "coverage")
            npx jest --config jest.config.js "tests" --coverage --verbose
            ;;
        "watch")
            npx jest --config jest.config.js "tests" --watch
            ;;
        "quick")
            npx jest --config jest.config.js "tests"
            ;;
        *)
            npx jest --config jest.config.js "tests" --coverage
            ;;
    esac
}

# Função para modo CI/CD
run_ci_mode() {
    echo -e "${YELLOW}🤖 Modo CI/CD ativado${NC}"
    echo "Executando testes sem cores e com saída JSON..."
    
    # Frontend
    echo "Executando testes do frontend..."
    npx jest --config jest.config.js "public/mvp/tests" --coverage --json --outputFile=coverage/frontend-results.json
    
    # Backend
    echo "Executando testes do backend..."
    npx jest --config jest.config.js "tests" --coverage --json --outputFile=coverage/backend-results.json
    
    echo "Resultados salvos em coverage/frontend-results.json e coverage/backend-results.json"
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

# Criar diretório de cobertura se não existir
mkdir -p coverage

# Processar argumentos
case "${1:-all}" in
    "all")
        echo -e "${YELLOW}🚀 Executando TODOS os testes do projeto...${NC}"
        echo ""
        
        # Frontend
        if run_frontend_tests "default"; then
            echo -e "${GREEN}✅ Testes do Frontend - SUCESSO${NC}"
        else
            echo -e "${RED}❌ Testes do Frontend - FALHOU${NC}"
            exit 1
        fi
        
        echo ""
        
        # Backend
        if run_backend_tests "default"; then
            echo -e "${GREEN}✅ Testes do Backend - SUCESSO${NC}"
        else
            echo -e "${RED}❌ Testes do Backend - FALHOU${NC}"
            exit 1
        fi
        ;;
    
    "frontend")
        run_frontend_tests "default"
        ;;
    
    "backend")
        run_backend_tests "default"
        ;;
    
    "coverage")
        echo -e "${YELLOW}📊 Executando testes com COBERTURA DETALHADA...${NC}"
        echo ""
        
        # Frontend com cobertura
        run_frontend_tests "coverage"
        echo ""
        
        # Backend com cobertura
        run_backend_tests "coverage"
        ;;
    
    "watch")
        echo -e "${YELLOW}👀 Executando testes do FRONTEND em modo WATCH...${NC}"
        run_frontend_tests "watch"
        ;;
    
    "watch-backend")
        echo -e "${YELLOW}👀 Executando testes do BACKEND em modo WATCH...${NC}"
        run_backend_tests "watch"
        ;;
    
    "quick")
        echo -e "${YELLOW}⚡ Executando testes RÁPIDOS...${NC}"
        echo ""
        
        # Frontend rápido
        run_frontend_tests "quick"
        echo ""
        
        # Backend rápido
        run_backend_tests "quick"
        ;;
    
    "ci")
        run_ci_mode
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

echo ""
echo -e "${GREEN}🎉 Todos os testes concluídos com sucesso!${NC}"
echo -e "${BLUE}📁 Relatórios de cobertura disponíveis em: coverage/${NC}" 