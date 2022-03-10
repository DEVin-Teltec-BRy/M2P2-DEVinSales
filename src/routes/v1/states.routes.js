const StateController = require("../../controllers/StateController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const statesRoutes = express.Router();

//stateRoutes.get('/state', StateController.index);
statesRoutes.get("/states", onlyCanAccessWith([READ]), StateController.index);

statesRoutes.get(
  "/state/:state_id/city/:city_id" /* onlyCanAccessWith(READ), */,
  StateController.getCitiesByID
);

module.exports = statesRoutes;
