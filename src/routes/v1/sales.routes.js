const SaleController = require('../../controllers/SaleController');
const express = require('express');

const salesRoutes = express.Router();



salesRoutes.post('/user/:user_id/sales', SaleController.create);
module.exports = salesRoutes;