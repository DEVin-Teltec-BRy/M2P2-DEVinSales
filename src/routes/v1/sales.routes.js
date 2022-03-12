const SaleController = require("../../controllers/SaleController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, UPDATE, DELETE } = require("../../utils/constants/permissions");
const salesRoutes = express.Router();


salesRoutes.get('/user/:id/sales',onlyCanAccessWith([READ]) ,SaleController.showSaler);
salesRoutes.get('/user/:user_id/buy',onlyCanAccessWith([READ]), SaleController.showSalesByBuyer);
salesRoutes.post("/user/:user_id/sales", SaleController.createSale);
salesRoutes.post("/user/:seller_id/item",onlyCanAccessWith([WRITE]), SaleController.saleMade);
salesRoutes.post('/sales/:sale_id/deliver',onlyCanAccessWith([WRITE]), SaleController.deliveries);
salesRoutes.get('/sales/:sale_id',onlyCanAccessWith([READ]), SaleController.showSaleById);


module.exports = salesRoutes;
