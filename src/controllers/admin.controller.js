const { dbReset } = require('../models/index');

exports.resetarBanco = async (req, res) => {
    try {
        await dbReset();
        res.json({ mensagem: 'Banco de dados resetado com sucesso! Todas as tabelas foram limpas.' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao resetar banco', detalhe: err.message });
    }
};