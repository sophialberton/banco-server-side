const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoria.controller');

// Rotas públicas para facilitar o teste
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

module.exports = router;