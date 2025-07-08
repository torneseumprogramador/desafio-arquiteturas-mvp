# Usar Node.js 18 como base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 