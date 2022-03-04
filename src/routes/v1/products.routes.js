const ProductController = require('../../controllers/ProductController');
const express = require('express')
const productsRoutes = express.Router();

productsRoutes.get('/products', ProductController.index);

module.exports = productsRoutes;