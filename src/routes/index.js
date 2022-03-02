const express = require('express')
const routes = express.Router()
const permissionRoutes = require('./v1/permissions.routes');
const rolesRoutes = require('./v1/roles.routes');
const usersRoutes = require('./v1/users.routes');

routes.use('/api/v1', [
    usersRoutes,
    rolesRoutes,
    permissionRoutes
])

module.exports = routes