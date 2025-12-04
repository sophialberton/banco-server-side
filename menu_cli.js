// menu_cli.js
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const API_BASE_URL = 'http://localhost:3000';
let AUTH_TOKEN = null;

const rl = readline.createInterface({ input, output });

async function fazerRequisicao(endpoint, config = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`\n=> [REQ] ${config.method || 'GET'} ${url}`);

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

        console.log(`[STATUS] ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            console.error('[ERRO NA API]:', data.erro || data.error || data);
        } else {
            if (response.status === 204) console.log('[SUCESSO] Operação realizada.');
            else {
                console.log('[RESPOSTA]:');
                console.dir(data, { depth: null, colors: true });
            }
        }
        return { ok: response.ok, data };
    } catch (error) {
        console.error('\n[ERRO DE CONEXÃO]: Servidor desligado?');
        return { ok: false };
    }
}

// --- Funções Auxiliares de Menu ---

async function login() {
    console.log('\n--- 🔐 LOGIN ---');
    const username = await rl.question('Username: ');
    const password = await rl.question('Password: ');
    const res = await fazerRequisicao('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    if (res.ok) { AUTH_TOKEN = res.data.token; console.log('✅ Logado!'); }
}

async function gerenciarCategorias() {
    console.log('\n--- 📂 CATEGORIAS ---');
    console.log('1. Listar  2. Criar  3. Atualizar  4. Deletar  0. Voltar');
    const op = await rl.question('Opção: ');
    
    if (op === '1') await fazerRequisicao('/api/categorias');
    if (op === '2') {
        const nome = await rl.question('Nome da Categoria: ');
        await fazerRequisicao('/api/categorias', { method: 'POST', body: JSON.stringify({ nome_categoria: nome }) });
    }
    if (op === '3') {
        const id = await rl.question('ID Categoria: ');
        const nome = await rl.question('Novo Nome: ');
        await fazerRequisicao(`/api/categorias/${id}`, { method: 'PUT', body: JSON.stringify({ nome_categoria: nome }) });
    }
    if (op === '4') {
        const id = await rl.question('ID Categoria: ');
        await fazerRequisicao(`/api/categorias/${id}`, { method: 'DELETE' });
    }
}

async function gerenciarUsuarios() {
    console.log('\n--- 👤 USUÁRIOS (Admin) ---');
    console.log('1. Listar  2. Criar  3. Deletar  0. Voltar');
    const op = await rl.question('Opção: ');

    if (op === '1') await fazerRequisicao('/api/usuarios');
    if (op === '2') {
        const nome = await rl.question('Nome: ');
        const user = await rl.question('Username: ');
        const pass = await rl.question('Senha: ');
        await fazerRequisicao('/api/usuarios', { method: 'POST', body: JSON.stringify({ nome, username: user, password: pass }) });
    }
    if (op === '3') {
        const id = await rl.question('ID Usuário: ');
        await fazerRequisicao(`/api/usuarios/${id}`, { method: 'DELETE' });
    }
}

async function gerenciarProdutos() {
    console.log('\n--- 📦 PRODUTOS ---');
    console.log('1. Listar  2. Criar  3. Buscar ID  4. Atualizar  5. Deletar  0. Voltar');
    const op = await rl.question('Opção: ');

    if (op === '1') await fazerRequisicao('/api/produto');
    if (op === '2') {
        const nome = await rl.question('Nome: ');
        const qtde = await rl.question('Qtde: ');
        const cat = await rl.question('ID Categoria: ');
        await fazerRequisicao('/api/produto', { 
            method: 'POST', 
            body: JSON.stringify({ nome_produto: nome, qtde_produto: Number(qtde), id_categoria: Number(cat) }) 
        });
    }
    if (op === '3') {
        const id = await rl.question('ID: ');
        await fazerRequisicao(`/api/produto/${id}`);
    }
    if (op === '4') {
        const id = await rl.question('ID: ');
        const nome = await rl.question('Novo Nome (Enter pula): ');
        const qtde = await rl.question('Nova Qtde (Enter pula): ');
        let body = {};
        if(nome) body.nome_produto = nome;
        if(qtde) body.qtde_produto = Number(qtde);
        await fazerRequisicao(`/api/produto/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    }
    if (op === '5') {
        const id = await rl.question('ID: ');
        await fazerRequisicao(`/api/produto/${id}`, { method: 'DELETE' });
    }
}

async function menuPrincipal() {
    let rodando = true;
    while (rodando) {
        console.log('\n========================================');
        console.log(`   MENU N3 - Status: ${AUTH_TOKEN ? 'LOGADO ✅' : 'DESLOGADO ❌'}`);
        console.log('========================================');
        console.log('1. Auth (Login)');
        console.log('2. Gerenciar Categorias');
        console.log('3. Gerenciar Produtos');
        console.log('4. Gerenciar Usuários');
        console.log('0. Sair');

        const escolha = await rl.question('Escolha: ');
        
        switch (escolha.trim()) {
            case '1': await login(); break;
            case '2': await gerenciarCategorias(); break;
            case '3': await gerenciarProdutos(); break;
            case '4': await gerenciarUsuarios(); break;
            case '0': rodando = false; break;
            default: console.log('Inválido.');
        }
    }
    rl.close();
}

menuPrincipal();