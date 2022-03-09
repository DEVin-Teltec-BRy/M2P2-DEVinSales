const UserController = require("../../controllers/UserController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, DELETE } = require("../../utils/constants/permissions");
const usersRoutes = express.Router();

usersRoutes.post("/users", UserController.create);
usersRoutes.post("/session", UserController.session);
usersRoutes.get("/user", onlyCanAccessWith([READ]), UserController.index);
usersRoutes.delete("/user/:user_id",onlyCanAccessWith([DELETE]), UserController.delete);

module.exports = usersRoutes;
