const ProductSalesController = require("../../controllers/ProductSalesController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const product_salesRoutes = express.Router();

product_salesRoutes.post("/users", ProductSalesController.create);
product_salesRoutes.patch("/sales/:sale_id/product/:product_id/amount/:amount", ProductSalesController.updateOne);
//salesRoutes.get("/users", onlyCanAccessWith([READ]), UserController.index);

module.exports = product_salesRoutes;
