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

module.exports = stateRoutes;
