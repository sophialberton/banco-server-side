const express = require('express');
const { dbSync, usuario } = require('./models/index');
const produtoRoutes = require('./routes/produtoRoutes'); // Importando rotas
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = 'chave_super_secreta_n3';

// =============================
// 📌 ROTAS DE AUTENTICAÇÃO
// =============================

app.post('/auth/register', async (req, res) => {
    try {
        const { username, password, nome } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Dados incompletos' });

        const hash = await bcrypt.hash(password, 10);
        const u = await usuario.create({ username, password_hash: hash, nome });
        res.json({ id: u.id, username: u.username });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar', detalhe: err.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const u = await usuario.findOne({ where: { username } });
        
        if (!u || !(await bcrypt.compare(password, u.password_hash))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: u.id, username: u.username }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Erro no login', detalhe: err.message });
    }
});

// =============================
// 🔒 MIDDLEWARE DE AUTENTICAÇÃO
// =============================
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const token = authHeader.split(' ')[1]; // Esperado: "Bearer <token>"

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.usuario = decoded;
        next();
    });
}

// =============================
// 📌 ROTAS DA APLICAÇÃO
// =============================

// Rota pública de teste
app.get('/', (req, res) => res.send('API N3 Banco de Dados Rodando'));

// Rotas de produtos (Protegidas pelo Middleware? Opcional. Vou proteger as de escrita.)
// Para proteger todas, use: app.use('/api', authMiddleware, produtoRoutes);
app.use('/api', produtoRoutes); 

// Inicialização
const PORT = 3000;
dbSync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});