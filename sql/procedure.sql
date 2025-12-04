delimiter $$

create procedure sp_atualizar_produto(
  in p_cod_produto int,
  in p_qtde int
)
begin
  update produto set qtde_produto = p_qtde where cod_produto = p_cod_produto;

  -- verifica a qtde e cria pedido
  if p_qtde <= 3 then
    insert into pedido(cod_produto, qtde_pedido) values (p_cod_produto, 4);
  elseif p_qtde > 3 and p_qtde < 7 then
    insert into pedido(cod_produto, qtde_pedido) values (p_cod_produto, 3);
  end if;
end $$

delimiter ;
