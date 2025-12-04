const { Pedido, Produto } = require('../models/index');

const listarPedidos = async () => {
    // Busca todos os pedidos e traz junto os dados do Produto (Join)
    return await Pedido.findAll({
        include: [{ model: Produto }]
    });
};

module.exports = { listarPedidos };