const usuarioData = require('../data/usuario.data');
const bcrypt = require('bcrypt');

const criarUsuario = async (dados) => {
    if (!dados.username || !dados.password) throw new Error('Username e Password são obrigatórios');
    
    // Hash da senha obrigatório
    const hash = await bcrypt.hash(dados.password, 10);
    return await usuarioData.criar(dados, hash);
};

const listarUsuarios = async () => {
    return await usuarioData.listar();
};

const atualizarUsuario = async (id, dados) => {
    let hash = null;
    if (dados.password) {
        hash = await bcrypt.hash(dados.password, 10);
    }
    return await usuarioData.atualizar(id, dados, hash);
};

const deletarUsuario = async (id) => {
    return await usuarioData.deletar(id);
};

module.exports = { criarUsuario, listarUsuarios, atualizarUsuario, deletarUsuario };