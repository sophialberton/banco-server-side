const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('n3_banco', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Define como true se quiser ver o SQL no console
    timezone: '-03:00' // Ajuste para seu fuso horário
});

module.exports = sequelize;