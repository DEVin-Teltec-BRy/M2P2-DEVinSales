const UserController = require("../../controllers/UserController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE, DELETE } = require("../../utils/constants/permissions");
const usersRoutes = express.Router();

usersRoutes.post("/users", onlyCanAccessWith([WRITE]), UserController.create);
usersRoutes.post("/session", UserController.session);
usersRoutes.get("/users", onlyCanAccessWith([READ]), UserController.index);
usersRoutes.delete(
  "/user/:user_id",
  onlyCanAccessWith([DELETE]),
  UserController.delete
);

module.exports = usersRoutes;
