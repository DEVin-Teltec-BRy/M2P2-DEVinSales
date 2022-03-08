const express = require('express');

const AddressController = require('../../controllers/AddressController');

const addressRoutes = express.Router();

addressRoutes.get();

module.exports = addressRoutes;