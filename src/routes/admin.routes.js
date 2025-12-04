const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');

router.post('/reset', controller.resetarBanco);

module.exports = router;