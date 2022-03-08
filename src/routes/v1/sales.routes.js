const SaleController = require('../../controllers/SaleController');
const express = require('express');

const salesRoutes = express.Router();


salesRoutes.get('/sales', SaleController.showSaler);

salesRoutes.post('/user/:user_id/sales', SaleController.create);

salesRoutes.post('/user/:user_id/sales', SaleController.create);

salesRoutes.get('/sales/:sales_id', SaleController.showSaleById);

module.exports = salesRoutes;