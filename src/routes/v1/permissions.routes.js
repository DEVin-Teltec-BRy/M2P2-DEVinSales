const PermissionController = require('../../controllers/PermissionController');
const express = require('express')
const permissionRoutes = express.Router()

permissionRoutes.post('/permissions', PermissionController.create);

module.exports = permissionRoutes