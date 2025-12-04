const db = require('../config/database');
const categoria = require('./categoria');
const produto = require('./produto');
const pedido = require('./pedido');
const usuario = require('./usuario');

// Definir Associações (Relacionamentos)
// Categoria tem muitos Produtos
categoria.hasMany(produto, { foreignKey: 'id_categoria' });
produto.belongsTo(categoria, { foreignKey: 'id_categoria' });

// Produto pode ter muitos Pedidos (ou relação 1:N dependendo da regra, aqui assumimos que pedido referencia produto)
produto.hasMany(pedido, { foreignKey: 'cod_produto' });
pedido.belongsTo(produto, { foreignKey: 'cod_produto' });

// Sincronizar banco de dados (Cria tabelas se não existirem)
// OBS: Em produção, usamos migrations. Para trabalho escolar, sync é aceitável.
const dbSync = async () => {
    try {
        await db.sync(); // Use { force: true } se quiser recriar as tabelas do zero (apaga dados)
        console.log('Banco de dados sincronizado.');
    } catch (error) {
        console.error('Erro ao sincronizar banco:', error);
    }
};

module.exports = { db, categoria, produto, pedido, usuario, dbSync };