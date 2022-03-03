const UserController = require("../../controllers/UserController");
const express = require("express");
const { can } = require("../../middlewares/auth");
const { READ } = require("../../utils/constants/permissions");
const usersRoutes = express.Router();

usersRoutes.post("/users", UserController.create);
usersRoutes.post("/session", UserController.session);
usersRoutes.get("/users", UserController.index);

module.exports = usersRoutes;
