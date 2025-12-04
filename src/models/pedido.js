const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Pedido = db.define('Pedido', {
    num_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    qtde_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cod_produto: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'pedido',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
});

module.exports = Pedido;