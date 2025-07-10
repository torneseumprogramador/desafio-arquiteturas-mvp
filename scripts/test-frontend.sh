#!/bin/bash

# Script para executar testes do Frontend MVP
# Uso: ./scripts/test-frontend.sh [opção]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}Script de Testes do Frontend MVP${NC}"
    echo ""
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  all         - Executa todos os testes com cobertura"
    echo "  watch       - Executa testes em modo watch"
    echo "  coverage    - Executa testes com relatório de cobertura"
    echo "  model       - Executa apenas testes do Model"
    echo "  service     - Executa apenas testes do Service"
    echo "  view        - Executa apenas testes da View"
    echo "  presenter   - Executa apenas testes do Presenter"
    echo "  unit        - Executa apenas testes unitários"
    echo "  help        - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 all"
    echo "  $0 coverage"
    echo "  $0 model"
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
        echo -e "${YELLOW}🚀 Executando TODOS os testes do Frontend...${NC}"
        echo ""
        run_tests "public/mvp/tests" "Todos os testes do Frontend"
        ;;
    
    "watch")
        echo -e "${YELLOW}👀 Executando testes em modo WATCH...${NC}"
        echo ""
        npx jest --config jest.config.js "public/mvp/tests" --watch
        ;;
    
    "coverage")
        echo -e "${YELLOW}📊 Executando testes com COBERTURA...${NC}"
        echo ""
        npx jest --config jest.config.js "public/mvp/tests" --coverage --verbose
        ;;
    
    "model")
        run_tests "public/mvp/tests/model" "Testes do Model (Produto)"
        ;;
    
    "service")
        run_tests "public/mvp/tests/service" "Testes do Service (ProdutoService)"
        ;;
    
    "view")
        run_tests "public/mvp/tests/view" "Testes da View (ProdutoView)"
        ;;
    
    "presenter")
        run_tests "public/mvp/tests/presenter" "Testes do Presenter (ProdutoPresenter)"
        ;;
    
    "unit")
        echo -e "${YELLOW}🧪 Executando testes UNITÁRIOS...${NC}"
        echo ""
        run_tests "public/mvp/tests/model public/mvp/tests/service" "Testes Unitários (Model + Service)"
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

echo -e "${GREEN}🎉 Testes do Frontend concluídos!${NC}" 