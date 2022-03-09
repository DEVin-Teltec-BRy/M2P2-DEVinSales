const SaleController = require('../../controllers/SaleController');
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const express = require('express');

const salesRoutes = express.Router();


salesRoutes.get('/user/:id/sales',onlyCanAccessWith([READ]) ,SaleController.showSaler);

salesRoutes.post('/user/:user_id/sales', SaleController.create);
module.exports = salesRoutes;