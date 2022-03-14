const SaleController = require('../../controllers/SaleController');
const express = require('express');
const salesRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");



salesRoutes.get('/user/:id/sales', onlyCanAccessWith([READ]), SaleController.showSaler);

salesRoutes.get('/user/:user_id/buy',onlyCanAccessWith([READ]), SaleController.showSalesByBuyer);
salesRoutes.post('/sales/:seller_id/saleMade',onlyCanAccessWith([WRITE]),SaleController.saleMade);
salesRoutes.post('/user/:user_id/sales', SaleController.create);
salesRoutes.post('/sales/:sale_id/deliver',onlyCanAccessWith([WRITE]), SaleController.deliveries);
module.exports = salesRoutes;