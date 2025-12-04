const pedidoService = require('../service/pedido.service');

exports.listar = async (req, res) => {
    try {
        const lista = await pedidoService.listarPedidos();
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};