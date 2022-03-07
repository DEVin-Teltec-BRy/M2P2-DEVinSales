const StateController = require("../../controllers/StateController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const statesRoutes = express.Router();

statesRoutes.get("/states", onlyCanAccessWith([READ]), StateController.index);

module.exports = statesRoutes;
