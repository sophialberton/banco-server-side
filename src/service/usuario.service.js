const { Usuario } = require('../models/index');
const bcrypt = require('bcrypt');

const criarUsuario = async (dados) => {
    if (!dados.username || !dados.password) throw new Error('Username e Password são obrigatórios');
    
    const hash = await bcrypt.hash(dados.password, 10);
    
    try {
        const novo = await Usuario.create({
            username: dados.username,
            password_hash: hash,
            nome: dados.nome
        });
        // Remove hash do retorno por segurança
        const { password_hash, ...usuarioSemSenha } = novo.toJSON();
        return usuarioSemSenha;
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Username já existe');
        }
        throw err;
    }
};

const listarUsuarios = async () => {
    return await Usuario.findAll({
        attributes: ['id', 'username', 'nome'] // Seleciona apenas campos seguros
    });
};

const atualizarUsuario = async (id, dados) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error('Usuário não encontrado');

    let updateData = { ...dados };
    if (dados.password) {
        updateData.password_hash = await bcrypt.hash(dados.password, 10);
    }
    
    await usuario.update(updateData);
    return usuario;
};

const deletarUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error('Usuário não encontrado');
    await usuario.destroy();
    return true;
};

module.exports = { criarUsuario, listarUsuarios, atualizarUsuario, deletarUsuario };