delimiter $$

create trigger trg_pedido_automatico
after insert on produto
for each row
begin
  if new.qtde_produto <= 3 then
    insert into pedido(cod_produto, qtde_pedido) values (new.cod_produto, 4);
  elseif new.qtde_produto > 3 and new.qtde_produto < 7 then
    insert into pedido(cod_produto, qtde_pedido) values (new.cod_produto, 3);
  end if;
end $$

delimiter ;
