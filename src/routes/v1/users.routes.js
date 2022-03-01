const UserController = require('../../controllers/UserController');
const express = require('express')
const usersRoutes = express.Router();

usersRoutes.post('/users', UserController.create);
usersRoutes.post('/session', UserController.session);

module.exports = usersRoutes;