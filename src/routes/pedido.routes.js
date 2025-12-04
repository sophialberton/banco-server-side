const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedido.controller');

// Rota GET para listar todos os pedidos
router.get('/', controller.listar);

module.exports = router;