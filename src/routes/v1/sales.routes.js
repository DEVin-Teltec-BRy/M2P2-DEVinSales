const SaleController = require('../../controllers/SaleController');
const express = require('express');

const salesRoutes = express.Router();
salesRoutes.post('/sales/:user_id', SaleController.create);
module.exports = salesRoutes;