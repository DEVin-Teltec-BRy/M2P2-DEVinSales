const express = require('express')
const routes = express.Router()
const permissionRoutes = require('./v1/permissions.routes');
const rolesRoutes = require('./v1/roles.routes');
const usersRoutes = require('./v1/users.routes');
<<<<<<< HEAD
const salesRoutes = require('./v1/sales.routes');

routes.get('/', (req, res)=>{
=======
const productsRoutes = require('./v1/products.routes');
routes.get('/', (req, res) => {
>>>>>>> d0d59483945d75d7a872d072394060573692c240
    // #swagger.ignore = true
    res.redirect('/api/v1/docs')
})
routes.use('/api/v1', [
    usersRoutes,
    rolesRoutes,
    permissionRoutes,
<<<<<<< HEAD
    salesRoutes
=======
    productsRoutes
>>>>>>> d0d59483945d75d7a872d072394060573692c240
])

module.exports = routes