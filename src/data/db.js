const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost', // Ajuste conforme seu ambiente
    user: 'root',
    password: '',
    database: 'n3_banco',
    connectionLimit: 5,
    multipleStatements: true // Importante para criar várias tabelas de uma vez
});

async function initDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();

        // 1. Criação das Tabelas
        // Seguindo o enunciado: Produto, Categoria, Pedido, Usuario
        const sql = `
            CREATE TABLE IF NOT EXISTS categoria (
                id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                nome_categoria VARCHAR(100) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS produto (
                cod_produto INT AUTO_INCREMENT PRIMARY KEY,
                nome_produto VARCHAR(100) NOT NULL,
                qtde_produto INT NOT NULL,
                id_categoria INT,
                FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
            );

            CREATE TABLE IF NOT EXISTS pedido (
                num_pedido INT AUTO_INCREMENT PRIMARY KEY,
                cod_produto INT,
                qtde_pedido INT NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cod_produto) REFERENCES produto(cod_produto)
            );

            CREATE TABLE IF NOT EXISTS usuario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                nome VARCHAR(100)
            );
        `;
        
        await conn.query(sql);
        console.log('Tabelas verificadas/criadas com sucesso.');

        // Opcional: Inserir uma categoria padrão para testes se não existir
        await conn.query(`INSERT IGNORE INTO categoria (id_categoria, nome_categoria) VALUES (1, 'Geral')`);

    } catch (err) {
        console.error('Erro ao iniciar banco:', err);
        throw err; // Para o servidor não subir se der erro no banco
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { pool, initDatabase };