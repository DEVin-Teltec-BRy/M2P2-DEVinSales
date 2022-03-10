const SaleController = require('../../controllers/SaleController');
const express = require('express');
const salesRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");


salesRoutes.get('/sales', SaleController.showSaler);
salesRoutes.get('/user/:user_id/buy',onlyCanAccessWith([READ]), SaleController.showSalesByBuyer);
salesRoutes.post('/sales/:user_id/sale',onlyCanAccessWith([WRITE]),SaleController.createSale);
salesRoutes.post('/sales/:user_id/buy',onlyCanAccessWith([WRITE]), SaleController.createBuy);

module.exports = salesRoutes;