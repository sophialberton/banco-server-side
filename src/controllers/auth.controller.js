const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../data/db');

const JWT_SECRET = 'segredo_super_secreto';

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM usuario WHERE username = ?', [username]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Correção para BigInt no ID se necessário
        const userId = typeof user.id === 'bigint' ? user.id.toString() : user.id;

        const token = jwt.sign({ id: userId, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    } finally {
        if(conn) conn.release();
    }
};

// Registrar
exports.register = async (req, res) => {
    const { username, password, nome } = req.body;
    let conn;
    try {
        if (!username || !password) {
            return res.status(400).json({ erro: 'Username e Password são obrigatórios' });
        }

        conn = await pool.getConnection();
        const hash = await bcrypt.hash(password, 10);
        
        const result = await conn.query(
            'INSERT INTO usuario (username, password_hash, nome) VALUES (?, ?, ?)', 
            [username, hash, nome]
        );

        // CORREÇÃO AQUI: Converter BigInt para String
        const newId = result.insertId.toString();

        res.status(201).json({ id: newId, username, nome });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: 'Usuário já existe' });
        }
        console.error(err); // Log do erro real no console
        res.status(500).json({ erro: err.message });
    } finally {
        if(conn) conn.release();
    }
};

exports.verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ erro: 'Token não fornecido' });
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
};