const { pool } = require('./db');

const listar = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM categoria');
        return rows.map(c => ({ ...c, id_categoria: Number(c.id_categoria) }));
    } finally {
        if (conn) conn.release();
    }
};

const criar = async (nome) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query('INSERT INTO categoria (nome_categoria) VALUES (?)', [nome]);
        return { id_categoria: Number(res.insertId), nome_categoria: nome };
    } finally {
        if (conn) conn.release();
    }
};

const buscarPorId = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
        if (rows[0]) rows[0].id_categoria = Number(rows[0].id_categoria);
        return rows[0];
    } finally {
        if (conn) conn.release();
    }
};

const atualizar = async (id, nome) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('UPDATE categoria SET nome_categoria = ? WHERE id_categoria = ?', [nome, id]);
        return await buscarPorId(id);
    } finally {
        if (conn) conn.release();
    }
};

const deletar = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('DELETE FROM categoria WHERE id_categoria = ?', [id]);
        return true;
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { listar, criar, buscarPorId, atualizar, deletar };