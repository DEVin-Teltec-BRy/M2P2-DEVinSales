const ProductSalesController = require("../../controllers/ProductSalesController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { UPDATE } = require("../../utils/constants/permissions");
const productsalesRoutes = express.Router();

productsalesRoutes.patch("/sales/:sale_id/product/:product_id/amount/:amount", onlyCanAccessWith([UPDATE]),ProductSalesController.updateOne);

productsalesRoutes.patch("/sales/:sale_id/product/:product_id/price/:price", onlyCanAccessWith([UPDATE]), ProductSalesController.updateOnePrice);


module.exports = productsalesRoutes;
