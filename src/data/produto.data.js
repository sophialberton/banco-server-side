const { pool } = require('./db');

// Listar todos (com nome da categoria - JOIN)
const listar = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT p.cod_produto, p.nome_produto, p.qtde_produto, 
                   c.nome_categoria, c.id_categoria
            FROM produto p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
        `;
        return await conn.query(query);
    } finally {
        if (conn) conn.release();
    }
};

// Criar produto (O Trigger no banco vai gerar o pedido automaticamente)
const criar = async (produto) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'INSERT INTO produto (nome_produto, qtde_produto, id_categoria) VALUES (?, ?, ?)';
        const res = await conn.query(query, [produto.nome_produto, produto.qtde_produto, produto.id_categoria]);
        return { cod_produto: res.insertId, ...produto };
    } finally {
        if (conn) conn.release();
    }
};

// Buscar por ID
const buscarPorId = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query('SELECT * FROM produto WHERE cod_produto = ?', [id]);
        return res[0];
    } finally {
        if (conn) conn.release();
    }
};

// Atualizar
const atualizar = async (id, dados) => {
    let conn;
    try {
        conn = await pool.getConnection();
        // Exemplo simplificado. No projeto real, monte a query dinamicamente.
        const query = 'UPDATE produto SET nome_produto = ?, qtde_produto = ? WHERE cod_produto = ?';
        await conn.query(query, [dados.nome_produto, dados.qtde_produto, id]);
        return await buscarPorId(id);
    } finally {
        if (conn) conn.release();
    }
};

// Deletar
const deletar = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('DELETE FROM produto WHERE cod_produto = ?', [id]);
        return true;
    } finally {
        if (conn) conn.release();
    }
};

// CONSULTA 1: Por Categoria (Requisito do PDF/Prompt)
const buscarPorCategoria = async (idCategoria) => {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query('SELECT * FROM produto WHERE id_categoria = ?', [idCategoria]);
    } finally {
        if (conn) conn.release();
    }
};

// CONSULTA 2: Por Quantidade de Pedido (Requisito do Prompt)
const buscarPorQtdePedido = async (qtde) => {
    let conn;
    try {
        conn = await pool.getConnection();
        // Join para trazer dados do produto também
        const query = `
            SELECT ped.num_pedido, ped.qtde_pedido, p.nome_produto 
            FROM pedido ped
            JOIN produto p ON ped.cod_produto = p.cod_produto
            WHERE ped.qtde_pedido = ?
        `;
        return await conn.query(query, [qtde]);
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { listar, criar, buscarPorId, atualizar, deletar, buscarPorCategoria, buscarPorQtdePedido };