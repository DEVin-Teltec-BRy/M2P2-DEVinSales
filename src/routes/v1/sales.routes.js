const SaleController = require('../../controllers/SaleController');
const express = require('express');
const salesRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");



salesRoutes.get('/user/:id/sales', onlyCanAccessWith([READ]), SaleController.showSaler);
salesRoutes.get('/user/:user_id/buy', onlyCanAccessWith([READ]), SaleController.showSalesByBuyer);
salesRoutes.post('/sales/:seller_id/item',onlyCanAccessWith([WRITE]), SaleController.saleMade);
salesRoutes.post('/sales/:sale_id/deliver', onlyCanAccessWith([WRITE]), SaleController.deliveries);
salesRoutes.post('/sales/:user_id/buy', onlyCanAccessWith([WRITE]), SaleController.createBuy);
salesRoutes.post('/sales/:user_id/sale', onlyCanAccessWith([WRITE]), SaleController.createSale);
salesRoutes.get('/sales/:sale_id', onlyCanAccessWith([READ]), SaleController.showSaleById);

module.exports = salesRoutes;
