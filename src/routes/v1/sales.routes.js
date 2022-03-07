const SaleController = require('../../controllers/SaleController');
const express = require('express')
const salesRoutes = express.Router();
const { WRITE} = require('../../utils/constants/permissions')
const {onlyCanAccessWith} = require('../../middlewares/auth')
salesRoutes.post('/sales/:user_id/sale',onlyCanAccessWith([WRITE]),SaleController.createSale);
salesRoutes.post('/sales/:user_id/buy',onlyCanAccessWith([WRITE]), SaleController.createBuy);

module.exports = salesRoutes;