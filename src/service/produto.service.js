const produtoData = require('../data/produto.data');

// Criar
const criarProduto = async (dados) => {
    if (!dados.nome_produto || !dados.qtde_produto || !dados.id_categoria) {
        throw new Error('Nome, quantidade e categoria são obrigatórios.');
    }
    // A regra do Pedido (<=3 ou entre 4-7) é feita pelo TRIGGER no Banco, não aqui.
    return await produtoData.criar(dados);
};

// Listar Todos
const listarProdutos = async () => {
    return await produtoData.listar();
};

// Buscar por ID
const buscarProdutoPorId = async (id) => {
    if (!id) throw new Error('ID do produto é obrigatório.');
    
    const produto = await produtoData.buscarPorId(id);
    if (!produto) {
        throw new Error('Produto não encontrado.');
    }
    return produto;
};

// Atualizar
const atualizarProduto = async (id, dados) => {
    if (!id) throw new Error('ID do produto é obrigatório.');
    
    // Verifica se existe antes de atualizar
    await buscarProdutoPorId(id); 
    
    return await produtoData.atualizar(id, dados);
};

// Deletar
const deletarProduto = async (id) => {
    if (!id) throw new Error('ID do produto é obrigatório.');
    
    // Verifica se existe antes
    await buscarProdutoPorId(id);
    
    return await produtoData.deletar(id);
};

// Consultas Específicas
const buscarPorCategoria = async (id) => {
    return await produtoData.buscarPorCategoria(id);
};

const buscarPedidosPorQuantidade = async (qtde) => {
    return await produtoData.buscarPorQtdePedido(qtde);
};

module.exports = { 
    criarProduto, 
    listarProdutos, 
    buscarProdutoPorId, 
    atualizarProduto, 
    deletarProduto, 
    buscarPorCategoria, 
    buscarPedidosPorQuantidade 
};