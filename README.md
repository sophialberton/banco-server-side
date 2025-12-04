# N3 - Banco de Dados e Server-Side

Este projeto integra uma API RESTful (Node.js) com um Banco de Dados Relacional (MySQL/MariaDB), utilizando ORM (Sequelize) para persistência de dados.

O objetivo é atender aos requisitos da avaliação N3, demonstrando o uso de Triggers, Views, Procedures, Consultas Complexas e Autenticação JWT.
## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
    Node.js (v18 ou superior)
    MySQL ou MariaDB rodando localmente.
    Um cliente SQL (MySQL Workbench, DBeaver, HeidiSQL) para rodar os scripts manuais.

# 🛠️ Instalação e Configuração
### 1. Clonar o Repositório

- Abra o terminal e rode:
```Bash
git clone https://github.com/sophialberton/banco-server-side.git
cd banco-server-side
```

### 2. Instalar Dependências

- sInstale as bibliotecas necessárias (Express, Sequelize, MySQL2, JWT, etc.):

```bash
npm install
```
### 3. Configurar o Banco de Dados

- Abra o seu cliente SQL (Workbench/DBeaver).

    Crie um banco de dados vazio chamado n3_banco:
    ```SQL
    CREATE DATABASE n3_banco;
    ```

    Verifique o arquivo src/config/database.js no projeto. Ele está configurado por padrão assim:

        User: root
        Pass: (vazio)
        Host: localhost
        Dialect: mysql

    _Se o seu banco tiver senha, altere este arquivo._

## ▶️ Executando o Projeto
### 1. Iniciar o Servidor (O Passo Mágico ✨)

- Rode o comando abaixo. Ele fará várias coisas automaticamente:

    - Conecta ao banco via ORM.

    - Cria as tabelas (usuario, categoria, produto, pedido) se não existirem.

    - Cria/Atualiza o TRIGGER automaticamente (Regra de Negócio N3).
```
npm start
```

Você verá no console:
```bash
"Banco de dados sincronizado (Sequelize)." "Trigger 'trg_pedido_automatico' configurado com sucesso." "Servidor N3 (Sequelize) rodando na porta 3000"
```

### 2. Rodar Scripts Manuais (Obrigatório para N3 📄)

- Embora o sistema funcione 100% via código, a avaliação exige Views e Procedures. O Sequelize não gerencia isso nativamente da mesma forma.

    - Vá até a pasta sql/ do projeto.
    - Abra seu Workbench/DBeaver.
    - Execute o conteúdo de:

        `sql/views.sql` (Cria as Views de relatórios).

        `sql/procedure.sql` (Cria a Procedure de atualização de estoque).

* Isso garante que o banco tenha todos os objetos exigidos pelo professor.
## 🖥️ Usando o Menu Interativo (CLI)

Para facilitar a apresentação e os testes sem precisar usar Postman/Insomnia, criamos um menu no terminal.

Em outro terminal (mantenha o servidor rodando), execute:

```bash
node menu_cli.js
```

### 🚀 Fluxo Recomendado para Apresentação

---

### 1️⃣ Resetar o Ambiente (Panic Button)

Para garantir que o banco está limpo e o Trigger foi recriado corretamente:

- Escolha a **Opção 99** no menu.  
- Confirme digitando **RESET**.  
- **Resultado:** O banco será limpo e a categoria **"Geral"** será criada.

---

### 2️⃣ Autenticação (Requisito: JWT)

O sistema exige login para operações de escrita:

- Escolha a **Opção 1 (Login)**.  
- Como o banco foi resetado, crie um usuário quando solicitado.  
- **Resultado:** Você receberá um **Token JWT** e o status mudará para **LOGADO**.

---

### 3️⃣ Preparar Dados (Requisito: CRUD Simples)

Precisamos de uma categoria para criar produtos:

- Escolha a **Opção 3 (Gerenciar Categorias)**.  
- Escolha **2 (Criar)**.  
- Nome: **Eletrônicos**.

---

### 4️⃣ O Show Principal: Trigger de Pedido (Requisito: Trigger)

Regra de negócio: **"Se quantidade <= 3, criar pedido automático".**

- Escolha a **Opção 4 (Gerenciar Produtos)**.  
- Escolha **2 (Criar)**.  
- Preencha:  
  - Nome: **Mouse Gamer**  
  - Quantidade: **2** (precisa ser `<= 3`)  
  - Categoria: selecione a criada anteriormente  
- Explicação:  
  - O **ORM** insere o produto  
  - O **Trigger do Banco** insere automaticamente o pedido

---

### 5️⃣ Prova Real (Validação)

Vamos confirmar que o banco trabalhou sozinho:

- Volte ao **Menu Principal**  
- Escolha a **Opção 5 (Listar PEDIDOS)**  
- **Resultado:** Aparece um pedido com **quantidade = 4** (regra do trigger) vinculado ao produto.

---

### 6️⃣ Consultas Avançadas (Requisito: Consultas N3)

Para finalizar, mostramos as queries complexas exigidas:

- Escolha a **Opção 6 (Consultas Específicas)**  
- Teste as duas opções:  
  - **Produtos por Categoria** → usa relacionamento  
  - **Pedidos por Quantidade** → usa JOIN entre Pedido e Produto  


## 📂 Estrutura do Projeto
`src/models/`: Definição das tabelas (ORM) e configuração do Trigger (index.js).

`src/controllers/`: Lógica das rotas.

`src/service/`: Regras de negócio.

`src/routes/`: Endpoints da API.

`sql/`: Scripts SQL puros (Trigger, Views, Procedure, Consultas) para documentação e entrega.

`menu_cli.js`: Cliente de terminal para testes rápidos.

✅ Checklist de Entrega (N3)
- [x] ORM: Utilizado Sequelize para persistência.
- [x] Trigger: Implementado (Lógica: Qtde <= 3 gera Pedido de 4 un; Qtde entre 4-6 gera Pedido de 3 un).
- [x] Consultas: Filtragem por Categoria e por Quantidade de Pedido implementadas.
- [x] JWT: Autenticação via Token implementada.
- [x] Views e Procedures: Scripts disponíveis na pasta sql/.