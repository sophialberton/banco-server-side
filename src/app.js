const express = require('express');
const produtoRoutes = require('./routes/produto.routes');
// const authRoutes = require('./routes/auth.routes'); 

const app = express();
app.use(express.json());

// Rotas
app.use('/api', produtoRoutes);
// app.use('/auth', authRoutes);

module.exports = app;