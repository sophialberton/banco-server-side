const { Categoria } = require('../models/index');

const criarCategoria = async (nome) => {
    return await Categoria.create({ nome_categoria: nome });
};

const listarCategorias = async () => {
    return await Categoria.findAll();
};

const atualizarCategoria = async (id, nome) => {
    const cat = await Categoria.findByPk(id);
    if (!cat) throw new Error('Categoria não encontrada');
    await cat.update({ nome_categoria: nome });
    return cat;
};

const deletarCategoria = async (id) => {
    const cat = await Categoria.findByPk(id);
    if (!cat) throw new Error('Categoria não encontrada');
    
    try {
        await cat.destroy();
    } catch (err) {
        // Erro de foreign key
        throw new Error('Não é possível deletar: existem produtos vinculados.');
    }
    return true;
};

module.exports = { criarCategoria, listarCategorias, atualizarCategoria, deletarCategoria };