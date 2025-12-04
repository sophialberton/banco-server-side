const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Produto = db.define('Produto', {
    cod_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_produto: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    qtde_produto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Foreign Key definida aqui explicitamente para o Sequelize entender o campo
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'produto',
    timestamps: false // Trigger cuida disso ou pode ativar se quiser created_at
});

module.exports = Produto;