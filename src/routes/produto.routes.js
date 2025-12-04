const express = require('express');
const router = express.Router(); // <--- Correção: "R" maiúsculo
// Correção do caminho: saia da pasta 'routes' (..) e entre em 'controllers'
const controller = require('../controllers/produtoController'); 

router.post('/produto', controller.criar);
router.get('/produto', controller.listar);
router.get('/produto/:id', controller.buscar);
router.put('/produto/:id', controller.atualizar);
router.delete('/produto/:id', controller.deletar);

// Consultas específicas
router.get('/categoria/:id/produtos', controller.porCategoria);
router.get('/pedido/quantidade/:qtde', controller.porPedidos);

module.exports = router;