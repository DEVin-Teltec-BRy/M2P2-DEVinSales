const StateController = require("../../controllers/StateController");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE } = require("../../utils/constants/permissions");
const express = require("express");
const stateRoutes = express.Router();

//stateRoutes.get('/state', StateController.index);

stateRoutes.post(
  "/state/:state_id/city",
  onlyCanAccessWith([WRITE]),
  StateController.postStateIdCity
);

stateRoutes.get(
  "/state/:state_id/city/:city_id",
  onlyCanAccessWith([READ]),
  StateController.getCitiesByID
);

module.exports = stateRoutes;
