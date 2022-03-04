const express = require('express');
const addressRoutes  = require('./v1/adress.routes');
const routes = express.Router()
const permissionRoutes = require('./v1/permissions.routes');
const rolesRoutes = require('./v1/roles.routes');
const usersRoutes = require('./v1/users.routes');
const productsRoutes = require('./v1/products.routes');
routes.get('/', (req, res) => {
    // #swagger.ignore = true
    res.redirect('/api/v1/docs')
})
routes.use('/api/v1', [
    usersRoutes,
    rolesRoutes,
    permissionRoutes,
    addressRoutes,
    productsRoutes
])

module.exports = routes