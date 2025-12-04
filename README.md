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