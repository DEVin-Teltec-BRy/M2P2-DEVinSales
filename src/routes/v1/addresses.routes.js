const express = require('express');

const AddressController = require('../../controllers/AddressController');
const { onlyCanAccessWith } = require('../../middlewares/auth')
const permission = require('../../utils/constants/permissions');

const addressesRoutes = express.Router();

addressesRoutes.get('/address', onlyCanAccessWith([permission.READ]), AddressController.index);
addressesRoutes.post("/state/:state_id/city/:city_id/address", AddressController.insertNewAddress);

module.exports = addressesRoutes;