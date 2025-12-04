// menu_cli.js
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

// URL base da sua API N3
const API_BASE_URL = 'http://localhost:3000';

// Variável para armazenar o Token JWT após o login
let AUTH_TOKEN = null;

const rl = readline.createInterface({ input, output });

/**
 * Função utilitária para fazer requisições à API.
 * Adiciona automaticamente o Token JWT se estiver logado.
 */
async function fazerRequisicao(endpoint, config = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`\n=> [REQ] ${config.method || 'GET'} ${url}`);

    // Configura cabeçalhos padrões
    if (!config.headers) {
        config.headers = {};
    }
    
    // Se tivermos um token, adicionamos ao cabeçalho (padrão Bearer)
    if (AUTH_TOKEN) {
        config.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    // Se tiver corpo e não for GET, define Content-Type
    if (config.body && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, config);
        
        let data = {};
        const contentType = response.headers.get('content-type');
        
        // Tenta ler JSON, texto ou nada
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else if (response.status !== 204) {
             data = await response.text();
        }

        console.log(`[STATUS] ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            console.error('[ERRO NA API]:', data.erro || data.error || data);
            // Se der erro 401/403, pode ser token expirado
            if (response.status === 401 || response.status === 403) {
                console.warn('⚠️  Acesso negado. Verifique se você está logado.');
            }
        } else {
            if (response.status === 204) {
                 console.log('[SUCESSO] Operação realizada.');
            } else {
                console.log('[RESPOSTA]:');
                console.dir(data, { depth: null, colors: true });
            }
        }
        return { ok: response.ok, data };

    } catch (error) {
        console.error('\n[ERRO DE CONEXÃO]: Não foi possível conectar à API.');
        console.error('Certifique-se de que o servidor (node server.js) está rodando.');
        console.error('Detalhe:', error.message);
        return { ok: false };
    }
}

// ------------------- Funções de Autenticação -------------------

async function login() {
    console.log('\n--- 🔐 LOGIN (Gerar Token) ---');
    console.log('Use um usuário cadastrado no banco (tabela usuario).');
    
    const username = await rl.question('Username: ');
    const password = await rl.question('Password: ');

    const config = {
        method: 'POST',
        body: JSON.stringify({ username, password })
    };

    const resultado = await fazerRequisicao('/auth/login', config);
    
    if (resultado.ok && resultado.data.token) {
        AUTH_TOKEN = resultado.data.token;
        console.log('\n✅ Login realizado com sucesso! Token armazenado na memória.');
    } else {
        console.log('\n❌ Falha no login.');
    }
}

async function registrarUsuario() {
    console.log('\n--- 📝 REGISTRAR NOVO USUÁRIO ---');
    
    const nome = await rl.question('Nome completo: ');
    const username = await rl.question('Username (login): ');
    const password = await rl.question('Password: ');

    const config = {
        method: 'POST',
        body: JSON.stringify({ nome, username, password })
    };

    await fazerRequisicao('/auth/register', config);
}

// ------------------- Funções CRUD de Produtos -------------------

async function criarProduto() {
    console.log('\n--- 📦 CADASTRAR PRODUTO ---');
    console.log('OBS: Se Quantidade <= 3 ou entre 4 e 6, o Trigger gerará um Pedido automático.');
    
    const nome = await rl.question('Nome do Produto: ');
    const qtde = await rl.question('Quantidade em Estoque: ');
    const categoria = await rl.question('ID da Categoria (ex: 1): ');

    const produto = {
        nome_produto: nome.trim(),
        qtde_produto: parseInt(qtde),
        id_categoria: parseInt(categoria)
    };

    const config = {
        method: 'POST',
        body: JSON.stringify(produto)
    };

    await fazerRequisicao('/api/produto', config);
}

async function listarProdutos() {
    console.log('\n--- 📋 LISTAR TODOS OS PRODUTOS ---');
    await fazerRequisicao('/api/produto');
}

async function buscarProdutoPorId() {
    console.log('\n--- 🔍 BUSCAR PRODUTO POR ID ---');
    const id = await rl.question('Digite o ID do Produto: ');
    await fazerRequisicao(`/api/produto/${id.trim()}`);
}

async function atualizarProduto() {
    console.log('\n--- ✏️ ATUALIZAR PRODUTO ---');
    const id = await rl.question('ID do produto a atualizar: ');
    
    console.log('Deixe em branco para manter o valor atual.');
    const nome = await rl.question('Novo Nome: ');
    const qtde = await rl.question('Nova Quantidade: ');

    const dados = {};
    if (nome.trim()) dados.nome_produto = nome.trim();
    if (qtde.trim()) dados.qtde_produto = parseInt(qtde);

    if (Object.keys(dados).length === 0) {
        console.log('Nenhuma alteração informada.');
        return;
    }

    const config = {
        method: 'PUT',
        body: JSON.stringify(dados)
    };

    await fazerRequisicao(`/api/produto/${id.trim()}`, config);
}

async function deletarProduto() {
    console.log('\n--- 🗑️ DELETAR PRODUTO ---');
    const id = await rl.question('ID do produto a deletar: ');
    
    const confirm = await rl.question(`Tem certeza que deseja apagar o produto ${id}? (S/N): `);
    if (confirm.toUpperCase() === 'S') {
        await fazerRequisicao(`/api/produto/${id.trim()}`, { method: 'DELETE' });
    }
}

// ------------------- Consultas Específicas N3 -------------------

async function produtosPorCategoria() {
    console.log('\n--- 📂 PRODUTOS POR CATEGORIA ---');
    const idCat = await rl.question('ID da Categoria: ');
    await fazerRequisicao(`/api/categoria/${idCat.trim()}/produtos`);
}

async function pedidosPorQuantidade() {
    console.log('\n--- 🚚 PEDIDOS POR QUANTIDADE ---');
    console.log('(Retorna pedidos que tenham quantidade solicitada maior ou igual ao informado)');
    const qtde = await rl.question('Quantidade mínima do pedido: ');
    await fazerRequisicao(`/api/pedido/quantidade/${qtde.trim()}`);
}

// ------------------- Menu Principal -------------------

async function menuPrincipal() {
    console.log('\n========================================');
    console.log('   CLI - BANCO DE DADOS N3 (MARIADB)');
    console.log('========================================');
    
    let rodando = true;
    while (rodando) {
        const statusLogin = AUTH_TOKEN ? 'LOGADO ✅' : 'DESLOGADO ❌';
        console.log(`\nStatus: ${statusLogin}`);
        console.log('--- Auth ---');
        console.log('1. Fazer Login (Obter Token)');
        console.log('2. Registrar Usuário');
        console.log('--- Produtos (CRUD) ---');
        console.log('3. Listar Produtos');
        console.log('4. Criar Produto (Trigger Automático)');
        console.log('5. Buscar Produto por ID');
        console.log('6. Atualizar Produto');
        console.log('7. Deletar Produto');
        console.log('--- Consultas N3 ---');
        console.log('8. Consultar Produtos por Categoria');
        console.log('9. Consultar Pedidos por Quantidade');
        console.log('--- Sair ---');
        console.log('0. Sair');

        const escolha = await rl.question('Escolha uma opção: ');
        
        switch (escolha.trim()) {
            case '1': await login(); break;
            case '2': await registrarUsuario(); break;
            case '3': await listarProdutos(); break;
            case '4': await criarProduto(); break;
            case '5': await buscarProdutoPorId(); break;
            case '6': await atualizarProduto(); break;
            case '7': await deletarProduto(); break;
            case '8': await produtosPorCategoria(); break;
            case '9': await pedidosPorQuantidade(); break;
            case '0': 
                rodando = false; 
                break;
            default: 
                console.log('Opção inválida.');
        }
    }
    rl.close();
}

// Inicia o menu
menuPrincipal();