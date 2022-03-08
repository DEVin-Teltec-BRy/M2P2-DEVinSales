const SaleController = require("../../controllers/SaleController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");
const salesRoutes = express.Router();



salesRoutes.post("/user/:user_id/sales", SaleController.create);
//Squad:TryCatch Tema:2 Endpoint:5
salesRoutes.post("/user/:seller_id/saleMade",onlyCanAccessWith([WRITE]), SaleController.saleMade);
module.exports = salesRoutes;
