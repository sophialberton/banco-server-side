const sequelize = require('../config/database');

// Importação dos Models
const Categoria = require('./categoria');
const Produto = require('./produto');
const Pedido = require('./pedido');
const Usuario = require('./usuario');

// Definir Associações (Relacionamentos)
// Categoria tem muitos Produtos
Categoria.hasMany(Produto, { foreignKey: 'id_categoria' });
Produto.belongsTo(Categoria, { foreignKey: 'id_categoria' });

// Produto pode ter muitos Pedidos
Produto.hasMany(Pedido, { foreignKey: 'cod_produto' });
Pedido.belongsTo(Produto, { foreignKey: 'cod_produto' });

// Sincronizar banco de dados
const dbSync = async () => {
    try {
        // Cria as tabelas
        await sequelize.sync({ alter: false }); 
        console.log('Banco de dados sincronizado (Sequelize).');

        // ============================================================
        // CRIAÇÃO DO TRIGGER AUTOMÁTICA
        // ============================================================
        // O Sequelize não cria triggers nativamente, então executamos SQL puro.
        
        // 1. Remove o trigger antigo se existir (para garantir a atualização)
        await sequelize.query('DROP TRIGGER IF EXISTS trg_pedido_automatico');

        // 2. Cria o Trigger com a lógica do PDF
        // Nota: Adicionamos 'criado_em' no INSERT porque o Model Pedido espera esse campo timestamp
        await sequelize.query(`
            CREATE TRIGGER trg_pedido_automatico
            AFTER INSERT ON produto
            FOR EACH ROW
            BEGIN
                -- Condição 1: Se qtde <= 3, gera pedido de 4
                IF NEW.qtde_produto <= 3 THEN
                    INSERT INTO pedido (cod_produto, qtde_pedido, criado_em) 
                    VALUES (NEW.cod_produto, 4, NOW());
                
                -- Condição 2: Se qtde > 3 e < 7, gera pedido de 3
                ELSEIF NEW.qtde_produto > 3 AND NEW.qtde_produto < 7 THEN
                    INSERT INTO pedido (cod_produto, qtde_pedido, criado_em) 
                    VALUES (NEW.cod_produto, 3, NOW());
                END IF;
            END;
        `);
        
        console.log('Trigger "trg_pedido_automatico" configurado com sucesso.');

    } catch (error) {
        console.error('Erro ao sincronizar banco ou criar trigger:', error);
    }
};

module.exports = { sequelize, Categoria, Produto, Pedido, Usuario, dbSync };