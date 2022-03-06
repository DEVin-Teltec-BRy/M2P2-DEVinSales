const express = require('express')
const routes = express.Router()
const permissionRoutes = require('./v1/permissions.routes');
const rolesRoutes = require('./v1/roles.routes');
const usersRoutes = require('./v1/users.routes');
const salesRoutes = require('./v1/sales.routes');
const productsRoutes = require('./v1/products.routes');
const productsalesRoutes = require ('./v1/productsales.routes')

routes.get('/', (req, res) => {
    // #swagger.ignore = true
    res.redirect('/api/v1/docs')
})
routes.use('/api/v1', [
    usersRoutes,
    rolesRoutes,
    permissionRoutes,
    salesRoutes,
    productsRoutes, 
    productsalesRoutes
])

module.exports = routes