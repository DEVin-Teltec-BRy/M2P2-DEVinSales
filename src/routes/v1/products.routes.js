const ProductController = require("../../controllers/ProductController");
const express = require("express");
const productsRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
const {
  READ,
  UPDATE,
  DELETE,
  WRITE,
} = require("../../utils/constants/permissions");

productsRoutes.get(
  "/products",
  onlyCanAccessWith([READ]),
  ProductController.index
);
productsRoutes.put(
  "/products/:product_id",
  onlyCanAccessWith([UPDATE]),
  ProductController.putUpdate
);

productsRoutes.post(
  "/products",
  onlyCanAccessWith([WRITE]),
  ProductController.store
);

productsRoutes.delete(
  "/products/:id",
  onlyCanAccessWith([DELETE]),
  ProductController.delete
);

productsRoutes.patch(
  "/products/:id",
  onlyCanAccessWith([UPDATE]),
  ProductController.update
);

module.exports = productsRoutes;
