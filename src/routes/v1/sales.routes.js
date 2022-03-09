const SaleController = require('../../controllers/SaleController');
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const express = require('express');
const salesRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");



salesRoutes.get('/user/:id/sales',onlyCanAccessWith([READ]) ,SaleController.showSaler);
salesRoutes.get('/sales', SaleController.showSaler);salesRoutes.get('/user/:user_id/buy',onlyCanAccessWith([READ]), SaleController.showSalesByBuyer);

salesRoutes.post('/user/:user_id/sales', SaleController.create);
module.exports = salesRoutes;