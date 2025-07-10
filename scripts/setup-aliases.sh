#!/bin/bash

# Script para configurar aliases úteis para os testes
# Uso: source ./scripts/setup-aliases.sh

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Configurando aliases para testes...${NC}"

# Aliases para testes unificados
alias test-all='./scripts/test-all.sh'
alias test-frontend='./scripts/test-frontend.sh'
alias test-backend='./scripts/test-backend.sh'

# Aliases específicos para testes rápidos
alias test-quick='./scripts/test-all.sh quick'
alias test-watch='./scripts/test-all.sh watch'
alias test-watch-backend='./scripts/test-all.sh watch-backend'

# Aliases para cobertura
alias test-coverage='./scripts/test-all.sh coverage'
alias test-ci='./scripts/test-all.sh ci'

# Aliases específicos do frontend
alias test-fe='./scripts/test-frontend.sh'
alias test-fe-model='./scripts/test-frontend.sh model'
alias test-fe-service='./scripts/test-frontend.sh service'
alias test-fe-view='./scripts/test-frontend.sh view'
alias test-fe-presenter='./scripts/test-frontend.sh presenter'
alias test-fe-unit='./scripts/test-frontend.sh unit'
alias test-fe-watch='./scripts/test-frontend.sh watch'

# Aliases específicos do backend
alias test-be='./scripts/test-backend.sh'
alias test-be-domain='./scripts/test-backend.sh domain'
alias test-be-app='./scripts/test-backend.sh application'
alias test-be-infra='./scripts/test-backend.sh infrastructure'
alias test-be-integration='./scripts/test-backend.sh integration'
alias test-be-unit='./scripts/test-backend.sh unit'
alias test-be-entities='./scripts/test-backend.sh entities'
alias test-be-services='./scripts/test-backend.sh services'
alias test-be-usecases='./scripts/test-backend.sh usecases'
alias test-be-controllers='./scripts/test-backend.sh controllers'
alias test-be-watch='./scripts/test-backend.sh watch'

echo -e "${GREEN}✅ Aliases configurados com sucesso!${NC}"
echo ""
echo -e "${BLUE}📋 Aliases disponíveis:${NC}"
echo "  test-all              - Todos os testes"
echo "  test-frontend         - Testes do frontend"
echo "  test-backend          - Testes do backend"
echo "  test-quick            - Testes rápidos"
echo "  test-watch            - Watch frontend"
echo "  test-watch-backend    - Watch backend"
echo "  test-coverage         - Com cobertura"
echo "  test-ci               - Modo CI/CD"
echo ""
echo -e "${BLUE}🎨 Frontend específicos:${NC}"
echo "  test-fe               - Todos frontend"
echo "  test-fe-model         - Model"
echo "  test-fe-service       - Service"
echo "  test-fe-view          - View"
echo "  test-fe-presenter     - Presenter"
echo "  test-fe-unit          - Unitários"
echo "  test-fe-watch         - Watch"
echo ""
echo -e "${BLUE}🔧 Backend específicos:${NC}"
echo "  test-fe               - Todos backend"
echo "  test-be-domain        - Domain"
echo "  test-be-app           - Application"
echo "  test-be-infra         - Infrastructure"
echo "  test-be-integration   - Integration"
echo "  test-be-unit          - Unitários"
echo "  test-be-entities      - Entities"
echo "  test-be-services      - Services"
echo "  test-be-usecases      - Use Cases"
echo "  test-be-controllers   - Controllers"
echo "  test-be-watch         - Watch"
echo ""
echo -e "${GREEN}💡 Dica: Use 'test-all help' para ver todas as opções${NC}" 