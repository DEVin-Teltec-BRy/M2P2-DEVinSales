const express = require('express');

const AddressController = require('../../controllers/AddressController');
const { onlyCanAccessWith } = require('../../middlewares/auth')
const permission = require('../../utils/constants/permissions');

const addressesRoutes = express.Router();

addressesRoutes.get('/address', onlyCanAccessWith([permission.READ]), AddressController.index);

module.exports = addressesRoutes;