const StateController = require("../../controllers/StateController");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE } = require("../../utils/constants/permissions");
const express = require("express");
const stateRoutes = express.Router();

statesRoutes.get("/state", onlyCanAccessWith([READ]), StateController.index);
statesRoutes.get("/state/:state_id", onlyCanAccessWith([READ]), StateController.getStateById);
statesRoutes.get("/state/:state_id/city/", onlyCanAccessWith([READ]), StateController.getCitiesByStateID);
stateRoutes.post("/state/:state_id/city", onlyCanAccessWith([WRITE]), StateController.postStateIdCity);

module.exports = statesRoutes;
