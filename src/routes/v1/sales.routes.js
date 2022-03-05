const SaleController = require('../../controllers/SaleController');
const express = require('express')
const salesRoutes = express.Router();

salesRoutes.post('/sales/:user_id/sale',  SaleController.createSale);
salesRoutes.post('/sales/:user_id/buy', SaleController.createBuy);

module.exports = salesRoutes;