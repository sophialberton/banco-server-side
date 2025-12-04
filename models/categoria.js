const { dataTypes } = require('sequelize')
const db = require('../config/database')

const categoria = db.define('categoria', {
    id_categoria: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_categoria: {
        type: dataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'categoria',
    timestamps: false
})

module.exports = categoria
