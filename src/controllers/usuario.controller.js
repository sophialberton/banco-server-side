const service = require('../service/usuario.service');

exports.listar = async (req, res) => {
    try {
        const lista = await service.listarUsuarios();
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.criar = async (req, res) => {
    try {
        const novo = await service.criarUsuario(req.body);
        res.status(201).json(novo);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'Username já existe' });
        res.status(500).json({ erro: err.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const atualizado = await service.atualizarUsuario(req.params.id, req.body);
        res.json(atualizado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        await service.deletarUsuario(req.params.id);
        res.json({ mensagem: 'Usuário deletado' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};