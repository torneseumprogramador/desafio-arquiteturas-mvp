const mysql = require("mysql2/promise");

class MySQLConnection {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || "mysql",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "produtos_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }

  async connect() {
    if (this.pool) return; // já conectado

    const maxRetries = 30;
    const retryDelay = 1000; // 1 segundo

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🔄 Tentativa ${attempt}/${maxRetries} de conectar ao MySQL...`,
        );

        // Criar pool
        this.pool = mysql.createPool(this.config);

        // Testar conexão
        await this.testConnection();

        console.log("✅ Pool de conexões MySQL criado com sucesso");
        return;
      } catch (error) {
        console.log(`❌ Tentativa ${attempt} falhou: ${error.message}`);

        if (this.pool) {
          try {
            await this.pool.end();
          } catch (endError) {
            // Ignorar erro ao fechar pool
          }
          this.pool = null;
        }

        if (attempt === maxRetries) {
          console.error("❌ Erro ao criar pool MySQL:", error);
          throw error;
        }

        // Aguardar antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  async testConnection() {
    if (!this.pool) {
      throw new Error("Pool não inicializado");
    }

    // Testar com uma query simples
    await this.pool.execute("SELECT 1");
  }

  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
        console.log("🔌 Pool de conexões MySQL fechado");
      }
    } catch (error) {
      console.error("❌ Erro ao fechar pool MySQL:", error);
      throw error;
    }
  }

  async execute(query, params = []) {
    try {
      if (!this.pool) {
        throw new Error("Pool MySQL não inicializado");
      }
      return await this.pool.execute(query, params);
    } catch (error) {
      console.error("❌ Erro ao executar query:", error);
      throw error;
    }
  }

  async query(query, params = []) {
    try {
      if (!this.pool) {
        throw new Error("Pool MySQL não inicializado");
      }
      const [rows] = await this.pool.query(query, params);
      return rows;
    } catch (error) {
      console.error("❌ Erro ao executar query:", error);
      throw error;
    }
  }

  async beginTransaction() {
    // Não implementado para pool (usar transações diretamente nas conexões do pool se necessário)
    throw new Error(
      "Transações devem ser feitas em conexões individuais do pool",
    );
  }

  async commit() {
    throw new Error(
      "Transações devem ser feitas em conexões individuais do pool",
    );
  }

  async rollback() {
    throw new Error(
      "Transações devem ser feitas em conexões individuais do pool",
    );
  }

  isConnected() {
    return this.pool !== null;
  }
}

// Exportar uma instância singleton
const mysqlConnection = new MySQLConnection();

module.exports = mysqlConnection;
