const express = require('express');

const AddressController = require('../../controllers/AddressController');
const { onlyCanAccessWith } = require('../../middlewares/auth')
const { READ, UPDATE, DELETE } = require('../../utils/constants/permissions');

const addressesRoutes = express.Router();

addressesRoutes.get('/address', onlyCanAccessWith([READ]), AddressController.index);
addressesRoutes.patch('/address/:address_id', onlyCanAccessWith([UPDATE]), AddressController.update);
addressesRoutes.delete('/address/:address_id', onlyCanAccessWith([DELETE]), AddressController.delete);

module.exports = addressesRoutes;
