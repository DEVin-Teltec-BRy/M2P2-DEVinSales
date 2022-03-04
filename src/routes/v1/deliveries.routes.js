const DeliveriesController = require('../../controllers/DeliveriesController');
const express = require('express');

const deliveriesRoutes = express.Router();



deliveriesRoutes.post('/sales/:sale_id/deliver', DeliveriesController.create);
module.exports = deliveriesRoutes;