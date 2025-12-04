const produtoData = require('../data/produto.data');

const criarProduto = async (dados) => {
    if (!dados.nome_produto || !dados.qtde_produto || !dados.id_categoria) {
        throw new Error('Nome, quantidade e categoria são obrigatórios.');
    }
    // A lógica de criar Pedido (<=3 ou <7) NÃO FICA AQUI.
    // O PDF exige um TRIGGER no banco para isso.
    // Aqui apenas inserimos o produto.
    return await produtoData.criar(dados);
};

const listarProdutos = async () => {
    return await produtoData.listar();
};

const buscarPorCategoria = async (id) => {
    return await produtoData.buscarPorCategoria(id);
};

// ... exportar outras funções
module.exports = { criarProduto, listarProdutos, buscarPorCategoria };