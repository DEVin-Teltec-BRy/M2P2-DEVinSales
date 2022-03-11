<<<<<<< HEAD
const StateController = require("../../controllers/StateController");
const { onlyCanAccessWith } = require("./../../middlewares/auth");
const { READ } = require("./../../utils/constants/permissions");
const express = require("express");
const stateRoutes = express.Router();

stateRoutes.get(
  "/state/:state_id/city",
  onlyCanAccessWith([READ]),
  StateController.getCitiesByStateID
);
=======
const StateController = require('../../controllers/StatesController');
const { accessWith } = require('../../middlewares/auth');
const { READ } = require('../../utils/constants/permissions');
const express = require('express');
const stateRoutes = express.Router();

//stateRoutes.get('/state', StateController.index);
>>>>>>> master

module.exports = stateRoutes;
