const { Produto, Categoria, Pedido } = require('../models/index');
const { Op } = require('sequelize');

const criarProduto = async (dados) => {
    if (!dados.nome_produto || !dados.qtde_produto || !dados.id_categoria) {
        throw new Error('Nome, quantidade e categoria são obrigatórios.');
    }
    // O Trigger SQL fará a criação automática do pedido
    return await Produto.create(dados);
};

const listarProdutos = async () => {
    // Busca com Join (Eager Loading)
    return await Produto.findAll({
        include: [{ model: Categoria }]
    });
};

const buscarProdutoPorId = async (id) => {
    const produto = await Produto.findByPk(id, {
        include: [{ model: Categoria }]
    });
    if (!produto) throw new Error('Produto não encontrado.');
    return produto;
};

const atualizarProduto = async (id, dados) => {
    const produto = await buscarProdutoPorId(id);
    await produto.update(dados);
    return produto;
};

const deletarProduto = async (id) => {
    const produto = await buscarProdutoPorId(id);
    await produto.destroy();
    return true;
};

// Consultas Específicas
const buscarPorCategoria = async (id) => {
    return await Produto.findAll({
        where: { id_categoria: id },
        include: [{ model: Categoria }]
    });
};

const buscarPedidosPorQuantidade = async (qtde) => {
    return await Pedido.findAll({
        where: { qtde_pedido: { [Op.gte]: qtde } },
        include: [{ model: Produto }]
    });
};

module.exports = { 
    criarProduto, listarProdutos, buscarProdutoPorId, 
    atualizarProduto, deletarProduto, buscarPorCategoria, buscarPedidosPorQuantidade 
};