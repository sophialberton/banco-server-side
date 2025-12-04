const { produto, categoria, pedido } = require('../models/index');
const { Op } = require('sequelize');

// Criar produto
// A lógica de criar pedido automático será feita pelo TRIGGER no banco de dados
exports.criar = async (req, res) => {
    try {
        const { nome_produto, qtde_produto, id_categoria } = req.body;
        const novo = await produto.create({ nome_produto, qtde_produto, id_categoria });
        res.status(201).json(novo);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao criar produto', detalhe: err.message });
    }
};

// Listar todos com Categoria
exports.listar = async (req, res) => {
    try {
        const lista = await produto.findAll({
            include: [{ model: categoria }] // Join com categoria
        });
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Buscar por ID
exports.buscar = async (req, res) => {
    try {
        const item = await produto.findByPk(req.params.id, {
            include: [{ model: categoria }]
        });
        if (!item) return res.status(404).json({ erro: 'Produto não encontrado' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Atualizar produto
exports.atualizar = async (req, res) => {
    try {
        // O Trigger também pode ser configurado para disparar no UPDATE se necessário
        await produto.update(req.body, {
            where: { cod_produto: req.params.id }
        });
        const atualizado = await produto.findByPk(req.params.id);
        res.json(atualizado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Deletar
exports.deletar = async (req, res) => {
    try {
        await produto.destroy({
            where: { cod_produto: req.params.id }
        });
        res.json({ mensagem: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Consulta: Produtos por Categoria (Requisito do Prompt)
exports.porCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const lista = await produto.findAll({
            where: { id_categoria: id },
            include: [{ model: categoria }]
        });
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Consulta: Produtos filtrados por quantidade (Ex: Produtos com estoque baixo)
// Ou conforme pedido no prompt: "consultas de produto... por quantidade de pedido" (interpretação pode variar, fiz por qtde_pedido na tabela pedido)
exports.porPedidos = async (req, res) => {
    try {
        const { qtde } = req.params;
        const lista = await pedido.findAll({
            where: { qtde_pedido: { [Op.gte]: qtde } }, // Maior ou igual a quantidade informada
            include: [{ model: produto }]
        });
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};