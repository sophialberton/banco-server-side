const { dataTypes } = require('sequelize')
const db = require('../config/database')
const produto = require('./produto')

const pedido = db.define('pedido', {
    num_pedido: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cod_produto: {
        type: dataTypes.INTEGER,
        references: {
            model: produto,
            key: 'cod_produto'
        }
    },
    qtde_pedido: {
        type: dataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'pedido',
    timestamps: false
})

pedido.belongsTo(produto, { foreignKey: 'cod_produto' })

module.exports = pedido
