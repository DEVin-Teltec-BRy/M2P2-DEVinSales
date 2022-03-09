const UserController = require("../../controllers/UserController");
const express = require("express");
const { onlyCanAccessWith } = require("../../middlewares/auth");
const { READ, WRITE } = require("../../utils/constants/permissions");
const usersRoutes = express.Router();

usersRoutes.post("/users", onlyCanAccessWith([WRITE]), UserController.create);
usersRoutes.post("/session", UserController.session);
usersRoutes.get("/users", onlyCanAccessWith([READ]), UserController.index);

module.exports = usersRoutes;
