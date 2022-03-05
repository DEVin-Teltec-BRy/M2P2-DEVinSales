const ProductController = require('../../controllers/ProductController');
const express = require('express')
const productsRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, DELETE, UPDATE } = require("../../utils/constants/permissions");

productsRoutes.get("/products", onlyCanAccessWith([READ]), ProductController.index);
productsRoutes.delete("/products/:id", onlyCanAccessWith([DELETE]), ProductController.delete);
productsRoutes.put("/product/:product_id", onlyCanAccessWith([UPDATE]), ProductController.update);

module.exports = productsRoutes;