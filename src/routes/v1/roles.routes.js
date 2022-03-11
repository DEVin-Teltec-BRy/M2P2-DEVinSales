const RoleController = require('../../controllers/RoleController');
const express = require('express')
const rolesRoutes = express.Router();

rolesRoutes.post('/roles', RoleController.create);
rolesRoutes.get('/roles', RoleController.index);
rolesRoutes.post('/roles/:role_id', RoleController.addPermissions);

module.exports = rolesRoutes;