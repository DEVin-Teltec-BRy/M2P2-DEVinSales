const StateController = require("../../controllers/StateController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { WRITE, READ } = require("../../utils/constants/permissions");
const statesRoutes = express.Router();

statesRoutes.get("/state", onlyCanAccessWith([READ]), StateController.index);
statesRoutes.get("/state/:state_id", onlyCanAccessWith([READ]), StateController.getStateById);
statesRoutes.get("/state/:state_id/city/", onlyCanAccessWith([READ]), StateController.getCitiesByStateID);
statesRoutes.post("/state/:state_id/city", onlyCanAccessWith([WRITE]), StateController.postStateIdCity);

module.exports = statesRoutes;
