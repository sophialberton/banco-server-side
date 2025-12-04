-- view 1: produtos por categoria
create view vw_produtos_categoria as
select p.nome_produto, c.nome_categoria, p.qtde_produto
from produto p
join categoria c on p.id_categoria = c.id_categoria;

-- view 2: pedidos com produto e categoria
create view vw_pedidos_produto as
select ped.num_pedido, p.nome_produto, c.nome_categoria, ped.qtde_pedido
from pedido ped
join produto p on ped.cod_produto = p.cod_produto
join categoria c on p.id_categoria = c.id_categoria;

