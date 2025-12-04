const express = require('express');
const produtoRoutes = require('./routes/produto.routes');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const adminRoutes = require('./routes/admin.routes'); // <--- NOVO

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/admin', adminRoutes); // <--- NOVO

module.exports = app;