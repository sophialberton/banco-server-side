const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

const JWT_SECRET = 'segredo_super_secreto';

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Sequelize: findOne
        const user = await Usuario.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password, nome } = req.body;
        if (!username || !password) return res.status(400).json({ erro: 'Dados incompletos' });

        const hash = await bcrypt.hash(password, 10);
        
        // Sequelize: create
        const novo = await Usuario.create({
            username,
            password_hash: hash,
            nome
        });

        res.status(201).json({ id: novo.id, username: novo.username, nome: novo.nome });

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ erro: 'Usuário já existe' });
        }
        res.status(500).json({ erro: err.message });
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