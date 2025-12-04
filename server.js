const app = require('./src/app');
const { initDatabase } = require('./src/data/db');

initDatabase().then(() => {
    app.listen(3000, () => {
        console.log('Servidor N3 rodando na porta 3000');
    });
}).catch(err => {
    console.error('Falha ao iniciar:', err);
});