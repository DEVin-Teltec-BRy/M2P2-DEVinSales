const ProductSalesController = require("../../controllers/ProductSalesController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const productsalesRoutes = express.Router();

productsalesRoutes.post("/users", ProductSalesController.create);
productsalesRoutes.patch("/sales/:sale_id/product/:product_id/amount/:amount", ProductSalesController.updateOne);
//salesRoutes.get("/users", onlyCanAccessWith([READ]), UserController.index);

module.exports = productsalesRoutes;
