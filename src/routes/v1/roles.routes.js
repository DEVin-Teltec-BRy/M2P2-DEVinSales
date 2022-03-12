const RoleController = require('../../controllers/RoleController');
const express = require('express');
const { isOwner, onlyCanAccessWith } = require('../../middlewares/auth');
const { WRITE } = require('../../utils/constants/permissions');
const rolesRoutes = express.Router();


rolesRoutes.post('/roles', isOwner, RoleController.create);
rolesRoutes.get('/roles', onlyCanAccessWith([WRITE]), RoleController.index);
rolesRoutes.post('/roles/:role_id', isOwner, RoleController.addPermission);



module.exports = rolesRoutes;