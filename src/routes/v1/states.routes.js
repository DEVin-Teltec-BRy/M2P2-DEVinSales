const StateController = require("../../controllers/StateController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE } = require("../../utils/constants/permissions");
const statesRoutes = express.Router();

// statesRoutes.get("/state", onlyCanAccessWith([READ]), StateController.index);
statesRoutes.get("/state", StateController.index);
// statesRoutes.post("/state/:state_id/city/:city_id/address", onlyCanAccessWith([WRITE]), StateController.insertNewAddress);
statesRoutes.post("/state/:state_id/city/:city_id/address", StateController.insertNewAddress);

module.exports = statesRoutes;
