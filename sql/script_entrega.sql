USE n3_banco;

-- ==========================================================
-- 1. TRIGGER (Para automação do Pedido - Requisito PDF + Lógica)
-- ==========================================================
DELIMITER $$
CREATE TRIGGER trg_pedido_automatico
AFTER INSERT ON produto
FOR EACH ROW
BEGIN
    -- Se qtde <= 3, pedido de 4 itens
    IF NEW.qtde_produto <= 3 THEN
        INSERT INTO pedido(cod_produto, qtde_pedido, criado_em, updated_at) 
        VALUES (NEW.cod_produto, 4, NOW(), NOW());
    
    -- Se qtde > 3 e < 7, pedido de 3 itens
    ELSEIF NEW.qtde_produto > 3 AND NEW.qtde_produto < 7 THEN
        INSERT INTO pedido(cod_produto, qtde_pedido, criado_em, updated_at) 
        VALUES (NEW.cod_produto, 3, NOW(), NOW());
    END IF;
END $$
DELIMITER ;

-- ==========================================================
-- 2. VIEWS (Requisito PDF)
-- ==========================================================

-- View 1: Resumo de Produtos e Categorias
CREATE OR REPLACE VIEW vw_produtos_detalhes AS
SELECT p.cod_produto, p.nome_produto, c.nome_categoria, p.qtde_produto
FROM produto p
INNER JOIN categoria c ON p.id_categoria = c.id_categoria;

-- View 2: Relatório de Pedidos Automáticos
CREATE OR REPLACE VIEW vw_relatorio_pedidos AS
SELECT ped.num_pedido, prod.nome_produto, ped.qtde_pedido, ped.criado_em
FROM pedido ped
JOIN produto prod ON ped.cod_produto = prod.cod_produto;

-- ==========================================================
-- 3. PROCEDURE (Requisito PDF)
-- ==========================================================

-- Procedure para atualizar estoque e verificar se precisa de novo pedido manualmente
DELIMITER $$
CREATE PROCEDURE sp_atualizar_estoque(IN p_id INT, IN p_nova_qtde INT)
BEGIN
    UPDATE produto SET qtde_produto = p_nova_qtde WHERE cod_produto = p_id;
    
    -- Lógica simples de verificação (opcional, já que o Trigger cobre inserts)
    IF p_nova_qtde <= 3 THEN
        SELECT 'Estoque crítico! Verifique se pedidos foram gerados.' AS Aviso;
    END IF;
END $$
DELIMITER ;

-- ==========================================================
-- 4. CONSULTAS COMPLEXAS (Requisito PDF)
-- ==========================================================

-- Consulta 1 (3 tabelas): Quem pediu o quê e de qual categoria
SELECT ped.num_pedido, p.nome_produto, c.nome_categoria
FROM pedido ped
JOIN produto p ON ped.cod_produto = p.cod_produto
JOIN categoria c ON p.id_categoria = c.id_categoria;

-- Consulta 2 (2 tabelas): Produtos com estoque baixo
SELECT p.nome_produto, c.nome_categoria
FROM produto p
JOIN categoria c ON p.id_categoria = c.id_categoria
WHERE p.qtde_produto <= 3;

-- Consulta 3 (2 tabelas): Contagem de produtos por categoria
SELECT c.nome_categoria, COUNT(p.cod_produto) as total_produtos
FROM categoria c
LEFT JOIN produto p ON c.id_categoria = p.id_categoria
GROUP BY c.nome_categoria;