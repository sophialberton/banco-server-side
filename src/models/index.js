const sequelize = require('../config/database');

// Importação dos Models
const Categoria = require('./categoria');
const Produto = require('./produto');
const Pedido = require('./pedido');
const Usuario = require('./usuario');

// Definir Associações
Categoria.hasMany(Produto, { foreignKey: 'id_categoria' });
Produto.belongsTo(Categoria, { foreignKey: 'id_categoria' });

Produto.hasMany(Pedido, { foreignKey: 'cod_produto' });
Pedido.belongsTo(Produto, { foreignKey: 'cod_produto' });

// Função auxiliar para criar Triggers (Reutilizável)
const setupTriggers = async () => {
    try {
        await sequelize.query('DROP TRIGGER IF EXISTS trg_pedido_automatico');
        await sequelize.query(`
            CREATE TRIGGER trg_pedido_automatico
            AFTER INSERT ON produto
            FOR EACH ROW
            BEGIN
                IF NEW.qtde_produto <= 3 THEN
                    INSERT INTO pedido (cod_produto, qtde_pedido, criado_em) 
                    VALUES (NEW.cod_produto, 4, NOW());
                ELSEIF NEW.qtde_produto > 3 AND NEW.qtde_produto < 7 THEN
                    INSERT INTO pedido (cod_produto, qtde_pedido, criado_em) 
                    VALUES (NEW.cod_produto, 3, NOW());
                END IF;
            END;
        `);
        console.log('✅ Trigger configurado.');
    } catch (error) {
        console.error('Erro ao configurar trigger:', error);
    }
};

// Sincronizar banco (Mantém dados)
const dbSync = async () => {
    try {
        await sequelize.sync({ alter: false }); 
        console.log('Banco sincronizado.');
        await setupTriggers();
    } catch (error) {
        console.error('Erro ao sincronizar banco:', error);
    }
};

// === NOVA FUNÇÃO: RESETAR BANCO ===
const dbReset = async () => {
    try {
        // force: true APAGA todas as tabelas e recria
        await sequelize.sync({ force: true });
        console.log('⚠️ Banco RESETADO (Dados apagados).');
        
        // Recria Trigger
        await setupTriggers();
        
        // Cria dados iniciais obrigatórios
        await Categoria.create({ nome_categoria: 'Geral' });
        console.log('✅ Dados iniciais recriados (Categoria Geral).');
        
    } catch (error) {
        console.error('Erro ao resetar banco:', error);
        throw error;
    }
};

module.exports = { sequelize, Categoria, Produto, Pedido, Usuario, dbSync, dbReset };