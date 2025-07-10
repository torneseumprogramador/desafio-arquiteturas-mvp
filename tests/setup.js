// Setup para testes do backend
process.env.NODE_ENV = "test";
process.env.DB_HOST = "localhost";
process.env.DB_USER = "test_user";
process.env.DB_PASSWORD = "test_password";
process.env.DB_NAME = "test_db";
process.env.DB_PORT = "3306";

// Silenciar logs durante testes
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();
