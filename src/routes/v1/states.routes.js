const StateController = require('../../controllers/StateController');
const { accessWith, onlyCanAccessWith } = require('../../middlewares/auth');
const { READ, WRITE } = require('../../utils/constants/permissions');
const express = require('express');
const stateRoutes = express.Router();

//stateRoutes.get('/state', StateController.index);

stateRoutes.post('/state/:state_id/city', StateController.store)


module.exports = stateRoutes;
