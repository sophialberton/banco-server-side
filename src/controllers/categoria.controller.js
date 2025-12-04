const service = require('../service/categoria.service');

exports.listar = async (req, res) => {
    try {
        const lista = await service.listarCategorias();
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.criar = async (req, res) => {
    try {
        const { nome_categoria } = req.body;
        const nova = await service.criarCategoria(nome_categoria);
        res.status(201).json(nova);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { nome_categoria } = req.body;
        const atualizada = await service.atualizarCategoria(req.params.id, nome_categoria);
        res.json(atualizada);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deletar = async (req, res) => {
    try {
        await service.deletarCategoria(req.params.id);
        res.json({ mensagem: 'Categoria deletada' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ erro: 'Não é possível apagar: Existem produtos nesta categoria.' });
        }
        res.status(500).json({ erro: err.message });
    }
};