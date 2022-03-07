const SaleController = require("../../controllers/SaleController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");
const salesRoutes = express.Router();



salesRoutes.get("/sales", SaleController.showSaler);

salesRoutes.post("/user/:user_id/sales", SaleController.createSale);
//Squad:TryCatch Tema:2 Endpoint:5
salesRoutes.post("/user/:seller_id/item",onlyCanAccessWith([WRITE]), SaleController.saleMade);

salesRoutes.get('/user/:user_id/buy',onlyCanAccessWith([READ]), SaleController.showSalesByBuyer);

//salesRoutes.post('/user/:user_id/sales', SaleController.create);
module.exports = salesRoutes;
