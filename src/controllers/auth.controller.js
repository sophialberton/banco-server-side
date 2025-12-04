const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../data/db'); // Idealmente teria um usuario.data.js

const JWT_SECRET = 'segredo_super_secreto';

exports.login = async (req, res) => {
    const { username, password } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const users = await conn.query('SELECT * FROM usuario WHERE username = ?', [username]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    } finally {
        if(conn) conn.release();
    }
};

// Middleware para proteger rotas
exports.verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ erro: 'Token não fornecido' });
    
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ erro: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
};