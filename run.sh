#!/bin/bash

# 🏪 Gerenciador de Produtos - MVP
# Script de inicialização da aplicação

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  🏪 Gerenciador de Produtos MVP${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para verificar se o Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
    
    print_message "Docker e Docker Compose encontrados ✓"
}

# Função para verificar se as portas estão disponíveis
check_ports() {
    local ports=("3000" "3306" "8080")
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Porta $port já está em uso. Certifique-se de que não há outras instâncias rodando."
        fi
    done
}

# Função para limpar containers antigos
cleanup() {
    print_message "Limpando containers antigos..."
    docker-compose down --remove-orphans 2>/dev/null || true
}

# Função para construir e iniciar a aplicação
start_application() {
    print_message "Construindo e iniciando a aplicação..."
    
    # Construir e iniciar os containers
    docker-compose up --build -d
    
    print_message "Aguardando inicialização dos serviços..."
    sleep 10
    
    # Verificar se os containers estão rodando
    if docker-compose ps | grep -q "Up"; then
        print_message "Aplicação iniciada com sucesso! ✓"
    else
        print_error "Erro ao iniciar a aplicação. Verifique os logs com: docker-compose logs"
        exit 1
    fi
}

# Função para mostrar informações de acesso
show_access_info() {
    echo ""
    echo -e "${BLUE}🌐 Informações de Acesso:${NC}"
    echo -e "${GREEN}   Aplicação Web:${NC} http://localhost:3000"
    echo -e "${GREEN}   phpMyAdmin:${NC}    http://localhost:8080"
    echo -e "${GREEN}   MySQL Port:${NC}     localhost:3306"
    echo -e "${GREEN}   Usuário MySQL:${NC} root"
    echo -e "${GREEN}   Senha MySQL:${NC}   password"
    echo ""
    echo -e "${BLUE}📋 Comandos Úteis:${NC}"
    echo -e "${GREEN}   Ver logs:${NC}       docker-compose logs -f"
    echo -e "${GREEN}   Parar:${NC}          docker-compose down"
    echo -e "${GREEN}   Reiniciar:${NC}      docker-compose restart"
    echo ""
}

# Função para mostrar logs
show_logs() {
    print_message "Mostrando logs da aplicação (Ctrl+C para sair)..."
    docker-compose logs -f
}

# Função para parar a aplicação
stop_application() {
    print_message "Parando a aplicação..."
    docker-compose down
    print_message "Aplicação parada ✓"
}

# Função para reiniciar a aplicação
restart_application() {
    print_message "Reiniciando a aplicação..."
    docker-compose restart
    print_message "Aplicação reiniciada ✓"
}

# Função para mostrar status
show_status() {
    print_message "Status dos containers:"
    docker-compose ps
}

# Função para limpar tudo
clean_all() {
    print_warning "Esta ação irá remover todos os containers, volumes e imagens relacionados ao projeto."
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Limpando tudo..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_message "Limpeza concluída ✓"
    else
        print_message "Operação cancelada."
    fi
}

# Função para mostrar ajuda
show_help() {
    echo ""
    echo -e "${BLUE}📖 Uso do script:${NC}"
    echo "  ./run.sh [comando]"
    echo ""
    echo -e "${BLUE}🔧 Comandos disponíveis:${NC}"
    echo -e "${GREEN}  start${NC}     - Iniciar a aplicação (padrão)"
    echo -e "${GREEN}  stop${NC}      - Parar a aplicação"
    echo -e "${GREEN}  restart${NC}   - Reiniciar a aplicação"
    echo -e "${GREEN}  logs${NC}      - Mostrar logs em tempo real"
    echo -e "${GREEN}  status${NC}    - Mostrar status dos containers"
    echo -e "${GREEN}  clean${NC}     - Limpar containers e volumes"
    echo -e "${GREEN}  help${NC}      - Mostrar esta ajuda"
    echo ""
}

# Função principal
main() {
    print_header
    
    # Verificar Docker
    check_docker
    
    # Verificar portas
    check_ports
    
    # Processar argumentos
    case "${1:-start}" in
        "start")
            cleanup
            start_application
            show_access_info
            ;;
        "stop")
            stop_application
            ;;
        "restart")
            restart_application
            show_access_info
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "clean")
            clean_all
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Comando inválido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@" 