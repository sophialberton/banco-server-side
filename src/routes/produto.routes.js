const express = require('express');
const router = express.Router();
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