const ProductController = require('../../controllers/ProductController');
const express = require('express')
const productsRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");

productsRoutes.get("/products", onlyCanAccessWith([READ]), ProductController.index);

module.exports = productsRoutes;