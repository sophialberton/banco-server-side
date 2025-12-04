const produtoService = require('../service/produto.service');

// Função auxiliar para padronizar erros
const tratarErro = (res, erro) => {
    // Se a mensagem for "Produto não encontrado", retorna 404, senão 500 ou 400
    if (erro.message.includes('não encontrado')) {
        return res.status(404).json({ erro: erro.message });
    }
    res.status(500).json({ erro: erro.message });
};

exports.criar = async (req, res) => {
    try {
        const novo = await produtoService.criarProduto(req.body);
        res.status(201).json(novo);
    } catch (err) {
        tratarErro(res, err);
    }
};

exports.listar = async (req, res) => {
    try {
        const lista = await produtoService.listarProdutos();
        res.json(lista);
    } catch (err) {
        tratarErro(res, err);
    }
};

exports.buscar = async (req, res) => {
    try {
        const item = await produtoService.buscarProdutoPorId(req.params.id);
        res.json(item);
    } catch (err) {
        tratarErro(res, err);
    }
};

exports.atualizar = async (req, res) => {
    try {
        const atualizado = await produtoService.atualizarProduto(req.params.id, req.body);
        res.json(atualizado);
    } catch (err) {
        tratarErro(res, err);
    }
};

exports.deletar = async (req, res) => {
    try {
        await produtoService.deletarProduto(req.params.id);
        res.json({ mensagem: 'Produto deletado com sucesso' });
    } catch (err) {
        tratarErro(res, err);
    }
};

// Consultas Específicas
exports.porCategoria = async (req, res) => {
    try {
        const lista = await produtoService.buscarPorCategoria(req.params.id);
        res.json(lista);
    } catch (err) {
        tratarErro(res, err);
    }
};

exports.porPedidos = async (req, res) => {
    try {
        const lista = await produtoService.buscarPedidosPorQuantidade(req.params.qtde);
        res.json(lista);
    } catch (err) {
        tratarErro(res, err);
    }
};