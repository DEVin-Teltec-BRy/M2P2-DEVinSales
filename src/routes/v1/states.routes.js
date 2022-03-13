const StateController = require('../../controllers/StatesController');
const { accessWith } = require('../../middlewares/auth');
const { READ } = require('../../utils/constants/permissions');
const express = require('express');
const stateRoutes = express.Router();

//stateRoutes.get('/state', StateController.index);

module.exports = stateRoutes;
