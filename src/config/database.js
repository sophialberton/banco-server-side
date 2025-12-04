const { Sequelize } = require('sequelize');

module.exports = new Sequelize('n3_banco', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});