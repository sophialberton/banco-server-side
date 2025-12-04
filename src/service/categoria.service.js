const categoriaData = require('../data/categoria.data');

const criarCategoria = async (nome) => {
    if (!nome) throw new Error('Nome da categoria é obrigatório');
    return await categoriaData.criar(nome);
};

const listarCategorias = async () => {
    return await categoriaData.listar();
};

const atualizarCategoria = async (id, nome) => {
    if (!id || !nome) throw new Error('ID e Nome são obrigatórios');
    return await categoriaData.atualizar(id, nome);
};

const deletarCategoria = async (id) => {
    if (!id) throw new Error('ID é obrigatório');
    return await categoriaData.deletar(id);
};

module.exports = { criarCategoria, listarCategorias, atualizarCategoria, deletarCategoria };