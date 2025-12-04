-- consulta 1: produtos com categoria e pedidos (3 tabelas)
select p.nome_produto, c.nome_categoria, ped.qtde_pedido
from produto p
join categoria c on p.id_categoria = c.id_categoria
left join pedido ped on p.cod_produto = ped.cod_produto;

-- consulta 2: produtos com quantidade <=3
select p.nome_produto, c.nome_categoria, p.qtde_produto
from produto p
join categoria c on p.id_categoria = c.id_categoria
where p.qtde_produto <= 3;

-- consulta 3: pedidos com qtde maior ou igual a 3
select ped.num_pedido, p.nome_produto, ped.qtde_pedido
from pedido ped
join produto p on ped.cod_produto = p.cod_produto
where ped.qtde_pedido >= 3;
