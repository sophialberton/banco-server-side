# banco-server-side
N3

Nova estrutura 

banco-server-side/
├── sql/                   <-- Seus scripts SQL (Trigger, Views, etc)
├── src/
│   ├── config/            <-- (Opcional, pode ficar em data/db.js)
│   ├── controllers/       <-- Recebe requisição, chama service, devolve JSON
│   ├── data/              <-- Conecta no BD e executa SQL (Substitui os Models)
│   ├── routes/            <-- Rotas do Express
│   ├── service/           <-- Regras de negócio e validações
│   └── app.js             <-- Configuração do Express
├── server.js              <-- Ponto de entrada (Inicia DB e Server)
└── package.json


As tabelas (em negrito) com os respectivos atributos também serão utilizadas na Avaliação Prática N3 da disciplina de Banco de Dados.
 
Desenvolver uma aplicação servidora em que cada 
produto: cod_produto, nome_produto e qtde_produto 
tenha categoria: id_categoria, nome_categoria. 

Condições:
Quando a quantidade do produto for menor ou igual a 3, 
registrar em 

pedido: num_pedido, cod_produto, qtde_pedido, a quantidade de 4. 
Se a quantidade for maior que 3 e menor que 7, registrar 3. 
Do contrário não criar o registro em pedido.

Para a implementação da persistência de dados, utilize a técnica de ORM - Object Relational Mapping. 

Essa aplicação tem que atender as requisições CRUD oriundas de qualquer cliente-server por meio de uma API Rest. 

Como também, permitir consultas de produto por categoria e por quantidade de pedido. 

A tecnologia para a implementação da aplicação é de livre escolha pela dupla. 

Além disso, inserir a utilização de token (JWT) em um dos end-points da API ou se preferir implemente uma funcionalidade de login (usuário e senha) com token.