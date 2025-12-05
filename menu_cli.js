// menu_cli.js
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const API_BASE_URL = 'http://localhost:3000';
let AUTH_TOKEN = null;

const rl = readline.createInterface({ input, output });

// --- Função Genérica de Requisição ---
async function fazerRequisicao(endpoint, config = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    // console.log(`\n=> [REQ] ${config.method || 'GET'} ${url}`); // Comentei para limpar o visual

    if (!config.headers) config.headers = {};
    if (AUTH_TOKEN) config.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    if (config.body && !config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';

    try {
        const response = await fetch(url, config);
        let data = {};
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else if (response.status !== 204) {
            data = await response.text();
        }

        if (!response.ok) {
            console.error('\n[ERRO NA API]:', data.erro || data.error || data);
        }
        return { ok: response.ok, data };
    } catch (error) {
        console.error('\n[ERRO DE CONEXÃO]: Servidor desligado?');
        return { ok: false };
    }
}

// --- Autenticação ---
async function login() {
    console.log('\n--- 🔐 LOGIN ---');
    const username = await rl.question('Username: ');
    const password = await rl.question('Password: ');
    const res = await fazerRequisicao('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    if (res.ok) {
        AUTH_TOKEN = res.data.token;
        console.log('✅ Logado com sucesso!');
    } else {
        console.log('❌ Falha no login.');
    }
}

// --- Helper: Selecionar Categoria ---
// Esta função lista as categorias e permite criar uma nova na hora
async function escolherCategoria() {
    console.log('\n--- 📂 SELECIONE A CATEGORIA ---');

    // 1. Busca categorias existentes
    const res = await fazerRequisicao('/api/categorias');
    if (!res.ok) {
        console.log('Erro ao listar categorias.');
        return null;
    }

    const categorias = res.data;

    // 2. Exibe lista
    if (categorias.length === 0) {
        console.log('(Nenhuma categoria cadastrada)');
    } else {
        categorias.forEach(c => {
            console.log(`[${c.id_categoria}] ${c.nome_categoria}`);
        });
    }
    console.log('[0] + 🆕 CRIAR NOVA CATEGORIA');
    console.log('--------------------------------');

    const escolha = await rl.question('Digite o ID desejado (ou 0 para criar): ');

    // 3. Lógica de criação
    if (escolha.trim() === '0') {
        const novoNome = await rl.question('Nome da Nova Categoria: ');
        const createRes = await fazerRequisicao('/api/categorias', {
            method: 'POST',
            body: JSON.stringify({ nome_categoria: novoNome })
        });

        if (createRes.ok) {
            console.log(`✅ Categoria "${novoNome}" criada com ID ${createRes.data.id_categoria}`);
            return createRes.data.id_categoria; // Retorna o ID novo
        } else {
            return null;
        }
    }

    // 4. Retorna o ID escolhido
    return escolha.trim();
}

// --- Gestão de Categorias ---
async function gerenciarCategorias() {
    console.log('\n--- 📂 MENU CATEGORIAS ---');
    console.log('1. Listar  2. Criar  3. Atualizar  4. Deletar  0. Voltar');
    const op = await rl.question('Opção: ');

    if (op === '1') {
        const res = await fazerRequisicao('/api/categorias');
        if (res.ok) console.table(res.data);
    }
    if (op === '2') {
        const nome = await rl.question('Nome da Categoria: ');
        await fazerRequisicao('/api/categorias', { method: 'POST', body: JSON.stringify({ nome_categoria: nome }) });
        console.log('✅ Categoria criada.');
    }
    if (op === '3') {
        const id = await rl.question('ID Categoria: ');
        const nome = await rl.question('Novo Nome: ');
        await fazerRequisicao(`/api/categorias/${id}`, { method: 'PUT', body: JSON.stringify({ nome_categoria: nome }) });
        console.log('✅ Atualizado.');
    }
    if (op === '4') {
        const id = await rl.question('ID Categoria: ');
        await fazerRequisicao(`/api/categorias/${id}`, { method: 'DELETE' });
        console.log('✅ Deletado.');
    }
}

// --- Gestão de Usuários ---
async function gerenciarUsuarios() {
    console.log('\n--- 👤 MENU USUÁRIOS (Admin) ---');
    console.log('1. Listar  2. Criar  3. Deletar  0. Voltar');
    const op = await rl.question('Opção: ');

    if (op === '1') {
        const res = await fazerRequisicao('/api/usuarios');
        if (res.ok) console.table(res.data);
    }
    if (op === '2') {
        const nome = await rl.question('Nome: ');
        const user = await rl.question('Username: ');
        const pass = await rl.question('Senha: ');
        await fazerRequisicao('/api/usuarios', { method: 'POST', body: JSON.stringify({ nome, username: user, password: pass }) });
        console.log('✅ Usuário criado.');
    }
    if (op === '3') {
        const id = await rl.question('ID Usuário: ');
        await fazerRequisicao(`/api/usuarios/${id}`, { method: 'DELETE' });
        console.log('✅ Usuário deletado.');
    }
}

// --- Gestão de Produtos ---
async function gerenciarProdutos() {
    console.log('\n--- 📦 MENU PRODUTOS ---');
    console.log('1. Listar  2. Criar  3. Buscar ID  4. Atualizar  5. Deletar  0. Voltar');
    const op = await rl.question('Opção: ');

    if (op === '1') {
        const res = await fazerRequisicao('/api/produto');
        if (res.ok) {
            // Exibe de forma mais bonita
            const formatado = res.data.map(p => ({
                ID: p.cod_produto,
                Nome: p.nome_produto,
                Qtde: p.qtde_produto,
                Categoria: p.Categorium ? p.Categorium.nome_categoria : p.id_categoria
            }));
            console.table(formatado);
        }
    }
    if (op === '2') {
        console.log('\n>> Novo Produto (Aciona Trigger se Qtde <= 3) <<');

        // --- AQUI ESTÁ A MUDANÇA: Chama a função de selecionar categoria ---
        const idCategoria = await escolherCategoria();

        if (!idCategoria) {
            console.log('❌ Operação cancelada ou categoria inválida.');
            return;
        }

        const nome = await rl.question('Nome do Produto: ');
        const qtde = await rl.question('Quantidade: ');

        const res = await fazerRequisicao('/api/produto', {
            method: 'POST',
            body: JSON.stringify({
                nome_produto: nome,
                qtde_produto: Number(qtde),
                id_categoria: Number(idCategoria)
            })
        });

        if (res.ok) console.log('✅ Produto criado com sucesso!');
    }
    if (op === '3') {
        const id = await rl.question('ID: ');
        const res = await fazerRequisicao(`/api/produto/${id}`);
        if (res.ok) console.log(res.data);
    }
    if (op === '4') {
        const id = await rl.question('ID: ');
        const nome = await rl.question('Novo Nome (Enter pula): ');
        const qtde = await rl.question('Nova Qtde (Enter pula): ');
        let body = {};
        if (nome) body.nome_produto = nome;
        if (qtde) body.qtde_produto = Number(qtde);
        await fazerRequisicao(`/api/produto/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        console.log('✅ Atualizado.');
    }
    if (op === '5') {
        const id = await rl.question('ID: ');
        await fazerRequisicao(`/api/produto/${id}`, { method: 'DELETE' });
        console.log('✅ Deletado.');
    }
}

// --- Consultas Específicas ---
async function consultasEspecificas() {
    console.log('\n--- 🔎 CONSULTAS ESPECIAIS ---');
    console.log('1. Produtos por Categoria');
    console.log('2. Pedidos por Quantidade');
    console.log('0. Voltar');
    const op = await rl.question('Opção: ');

    if (op === '1') {
        // Reutiliza o helper para escolher o ID da categoria facilmente
        const id = await escolherCategoria();
        if (id) {
            const res = await fazerRequisicao(`/api/categoria/${id}/produtos`);
            if (res.ok) console.table(res.data);
        }
    }
    if (op === '2') {
        const qtde = await rl.question('Listar pedidos com quantidade MAIOR ou IGUAL a: ');
        const res = await fazerRequisicao(`/api/pedido/quantidade/${qtde}`);
        if (res.ok) {
            const formatado = res.data.map(p => ({
                ID: p.num_pedido,
                Produto: p.Produto ? p.Produto.nome_produto : 'Desconhecido',
                Qtde: p.qtde_pedido,
                Data: p.criado_em
            }));
            console.table(formatado);
        }
    }
}

async function resetarBanco() {
    console.log('\n--- ⚠️  PERIGO: RESET GERAL ---');
    const confirm = await rl.question('Isso apagará TODOS os dados. Digite "RESET" para confirmar: ');
    if (confirm === 'RESET') {
        await fazerRequisicao('/api/admin/reset', { method: 'POST' });
        AUTH_TOKEN = null;
        console.log('🔴 Banco limpo. Você foi deslogado.');
    } else {
        console.log('Operação cancelada.');
    }
}

// --- Menu Principal ---
async function menuPrincipal() {
    let rodando = true;
    while (rodando) {
        console.log('\n========================================');
        console.log(`   SISTEMA N3 - Status: ${AUTH_TOKEN ? 'LOGADO ✅' : 'DESLOGADO ❌'}`);
        console.log('========================================');

        if (!AUTH_TOKEN) {
            console.log('1. Fazer Login');
            console.log('2. Gerenciar Usuários (Criar Conta)');
            console.log('0. Sair');
            console.log('----------------------------------------');
            console.log('99. ☢️  RESETAR BANCO (Limpar Tudo)');

            const escolha = await rl.question('Escolha: ');
            switch (escolha.trim()) {
                case '1': await login(); break;
                case '2': await gerenciarUsuarios(); break;
                case '99': await resetarBanco(); break;
                case '0': rodando = false; break;
                default: console.log('Opção inválida.');
            }
        } else {
            console.log('1. Logout');
            console.log('2. Gerenciar Usuários');
            console.log('3. Gerenciar Categorias');
            console.log('4. Gerenciar Produtos (Aciona Trigger)');
            console.log('5. Listar PEDIDOS (Prova do Trigger)');
            console.log('----------------------------------------');
            console.log('6. Consultas Específicas');
            console.log('0. Sair');
            console.log('----------------------------------------');
            console.log('99. ☢️  RESETAR BANCO (Limpar Tudo)');

            const escolha = await rl.question('Escolha: ');
            switch (escolha.trim()) {
                case '1': AUTH_TOKEN = null; console.log('🚪 Deslogado.'); break;
                case '2': await gerenciarUsuarios(); break;
                case '3': await gerenciarCategorias(); break;
                case '4': await gerenciarProdutos(); break;
                case '5':
                    const res = await fazerRequisicao('/api/pedidos');
                    if (res.ok) {
                        // Formata para mostrar o nome do produto em vez de [Object]
                        const formatado = res.data.map(p => ({
                            ID: p.num_pedido,
                            Produto: p.Produto ? p.Produto.nome_produto : 'Desconhecido', // <--- AQUI ESTÁ A MÁGICA
                            Qtde: p.qtde_pedido,
                            Data: p.criado_em
                        }));
                        console.table(formatado);
                    }
                    break;
                case '6': await consultasEspecificas(); break;
                case '99': await resetarBanco(); break;
                case '0': rodando = false; break;
                default: console.log('Opção inválida.');
            }
        }
    }
    rl.close();
}

menuPrincipal();