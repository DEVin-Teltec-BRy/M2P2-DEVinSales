const SaleController = require("../../controllers/SaleController");
const express = require("express");

const salesRoutes = express.Router();

salesRoutes.get("/sales", SaleController.showSaler);

salesRoutes.post("/user/:user_id/sales", SaleController.create);
//Squad:TryCatch Tema:2 Endpoint:5
salesRoutes.post("/user/:seller_id/item", SaleController.item);
module.exports = salesRoutes;
