const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Categoria = db.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_categoria: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'categoria',
    timestamps: false
});

module.exports = Categoria;