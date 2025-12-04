const { dataTypes } = require('sequelize')
const db = require('../config/database')
const categoria = require('./categoria')

const produto = db.define('produto', {
    cod_produto: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_produto: {
        type: dataTypes.STRING(100),
        allowNull: false
    },
    qtde_produto: {
        type: dataTypes.INTEGER,
        allowNull: false
    },
    id_categoria: {
        type: dataTypes.INTEGER,
        references: {
            model: categoria,
            key: 'id_categoria'
        }
    }
}, {
    tableName: 'produto',
    timestamps: false
})

produto.belongsTo(categoria, { foreignKey: 'id_categoria' })

module.exports = produto

