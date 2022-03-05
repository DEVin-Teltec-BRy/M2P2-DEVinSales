const SaleController = require('../../controllers/SaleController');
const express = require('express');

const salesRoutes = express.Router();


salesRoutes.get('/sales', SaleController.showSaler);

salesRoutes.post('/user/:user_id/sales', SaleController.create);
module.exports = salesRoutes;