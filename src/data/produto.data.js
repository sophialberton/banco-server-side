const { pool } = require('./db');

// Listar todos
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
        const rows = await conn.query(query);
        
        // Converte BigInts para número normal/string na listagem também, se houver
        return rows.map(row => ({
            ...row,
            cod_produto: Number(row.cod_produto), // Converte ID para Number
            qtde_produto: Number(row.qtde_produto),
            id_categoria: Number(row.id_categoria)
        }));
    } finally {
        if (conn) conn.release();
    }
};

// Criar produto
const criar = async (produto) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'INSERT INTO produto (nome_produto, qtde_produto, id_categoria) VALUES (?, ?, ?)';
        const res = await conn.query(query, [produto.nome_produto, produto.qtde_produto, produto.id_categoria]);
        
        // CORREÇÃO: Converter BigInt insertId para Number
        return { 
            cod_produto: Number(res.insertId), 
            ...produto 
        };
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
        if (res[0]) {
            // Conversão de segurança
            res[0].cod_produto = Number(res[0].cod_produto);
        }
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
        // Constrói query dinâmica
        let campos = [];
        let valores = [];
        
        if (dados.nome_produto) { campos.push('nome_produto = ?'); valores.push(dados.nome_produto); }
        if (dados.qtde_produto) { campos.push('qtde_produto = ?'); valores.push(dados.qtde_produto); }
        
        if (campos.length === 0) return await buscarPorId(id);

        valores.push(id);
        const query = `UPDATE produto SET ${campos.join(', ')} WHERE cod_produto = ?`;
        
        await conn.query(query, valores);
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

const buscarPorCategoria = async (idCategoria) => {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query('SELECT * FROM produto WHERE id_categoria = ?', [idCategoria]);
    } finally {
        if (conn) conn.release();
    }
};

const buscarPorQtdePedido = async (qtde) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT ped.num_pedido, ped.qtde_pedido, p.nome_produto 
            FROM pedido ped
            JOIN produto p ON ped.cod_produto = p.cod_produto
            WHERE ped.qtde_pedido >= ?
        `;
        return await conn.query(query, [qtde]);
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { listar, criar, buscarPorId, atualizar, deletar, buscarPorCategoria, buscarPorQtdePedido };