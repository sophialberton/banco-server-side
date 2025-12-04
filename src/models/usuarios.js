const { DataTypes } = require('sequelize');
const db = require('../config/database');

const usuario = db.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'usuario',
    timestamps: true
});

module.exports = usuario;