const ProductController = require("../../controllers/ProductController");
const express = require("express");
const productsRoutes = express.Router();
const { onlyCanAccessWith } = require("../../middlewares/auth");
<<<<<<< HEAD
const { READ, DELETE, UPDATE } = require("../../utils/constants/permissions");

productsRoutes.delete("/products/:id", onlyCanAccessWith([DELETE]), ProductController.delete);
//productsRoutes.put("/product/:product_id", onlyCanAccessWith([UPDATE]), ProductController.update);
=======
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
  "/product/:product_id",
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
>>>>>>> TryCatch---Endpoint-POST-Deliveries

productsRoutes.patch(
  "/products/:id",
  onlyCanAccessWith([UPDATE]),
  ProductController.update
);

module.exports = productsRoutes;
