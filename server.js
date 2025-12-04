const app = require('./src/app');
const { dbSync } = require('./src/models/index'); // Importa do index dos models

// Sincroniza o banco e inicia o servidor
dbSync().then(() => {
    app.listen(3000, () => {
        console.log('Servidor N3 (Sequelize) rodando na porta 3000');
    });
});