const SaleController = require('../../controllers/SaleController');
const express = require('express')
const salesRoutes = express.Router();
const { WRITE} = require('../../utils/constants/permissions')
const {onlyCanAccessWith} = require('../../middlewares/auth')
salesRoutes.post('/sales/:user_id/sale',SaleController.createSale);
salesRoutes.post('/sales/:user_id/buy', SaleController.createBuy);
salesRoutes.get('/sales', SaleController.showSaler);


module.exports = salesRoutes;

