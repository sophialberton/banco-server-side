const express = require('express');
const produtoRoutes = require('./routes/produto.routes');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes'); // NOVO
const categoriaRoutes = require('./routes/categoria.routes'); // NOVO

const app = express();
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);

module.exports = app;