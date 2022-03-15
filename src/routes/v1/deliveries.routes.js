const express = require('express')
const deliveryRoutes = express.Router()
const DeliveryController = require('../../controllers/DeliveryController');
const { onlyCanAccessWith } = require('../../middlewares/auth');
const { READ } = require('../../utils/constants/permissions');


deliveryRoutes.get("/deliveries", onlyCanAccessWith([READ]), DeliveryController.findDeliveries);

module.exports = deliveryRoutes