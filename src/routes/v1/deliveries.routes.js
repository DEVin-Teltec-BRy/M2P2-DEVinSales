const express = require('express')
const deliveryRoutes = express.Router()
const DeliveryController = require('../../controllers/DeliveryController')

deliveryRoutes.get('/deliveries', DeliveryController.findDeliveries);

module.exports = deliveryRoutes