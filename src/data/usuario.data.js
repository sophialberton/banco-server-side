const { pool } = require('./db');

const listar = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        // Não retornamos o password_hash por segurança
        const rows = await conn.query('SELECT id, username, nome FROM usuario');
        return rows.map(u => ({ ...u, id: Number(u.id) })); // Converte BigInt
    } finally {
        if (conn) conn.release();
    }
};

const criar = async (dados, hashSenha) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(
            'INSERT INTO usuario (username, password_hash, nome) VALUES (?, ?, ?)',
            [dados.username, hashSenha, dados.nome]
        );
        return { id: Number(res.insertId), ...dados };
    } finally {
        if (conn) conn.release();
    }
};

const buscarPorId = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT id, username, nome FROM usuario WHERE id = ?', [id]);
        if (rows[0]) rows[0].id = Number(rows[0].id);
        return rows[0];
    } finally {
        if (conn) conn.release();
    }
};

const atualizar = async (id, dados, novoHash) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let campos = [];
        let valores = [];

        if (dados.nome) { campos.push('nome = ?'); valores.push(dados.nome); }
        if (dados.username) { campos.push('username = ?'); valores.push(dados.username); }
        if (novoHash) { campos.push('password_hash = ?'); valores.push(novoHash); }

        if (campos.length === 0) return await buscarPorId(id);

        valores.push(id);
        await conn.query(`UPDATE usuario SET ${campos.join(', ')} WHERE id = ?`, valores);
        return await buscarPorId(id);
    } finally {
        if (conn) conn.release();
    }
};

const deletar = async (id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('DELETE FROM usuario WHERE id = ?', [id]);
        return true;
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { listar, criar, buscarPorId, atualizar, deletar };