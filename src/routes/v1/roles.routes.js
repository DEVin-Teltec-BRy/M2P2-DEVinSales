const RoleController = require('../../controllers/RoleController');
const express = require('express')
const rolesRoutes = express.Router();

rolesRoutes.post('/roles', RoleController.create);

module.exports = rolesRoutes;