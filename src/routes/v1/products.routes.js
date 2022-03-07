const ProductController = require('../../controllers/ProductController');
const express = require('express')
const productsRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, UPDATE } = require("../../utils/constants/permissions");

productsRoutes.get("/products", onlyCanAccessWith([READ]), ProductController.index);
productsRoutes.put("/product/:product_id", onlyCanAccessWith([UPDATE]), ProductController.putUpdate);

module.exports = productsRoutes;