const express = require('express');
const routes = express.Router();
const permissionRoutes = require('./v1/permissions.routes');
const rolesRoutes = require('./v1/roles.routes');
const usersRoutes = require('./v1/users.routes');
const salesRoutes = require('./v1/sales.routes');
const productsRoutes = require('./v1/products.routes');
const addressesRoutes = require('./v1/addresses.routes');
const stateRoutes = require('./v1/states.routes');

routes.get('/', (req, res) => {
  // #swagger.ignore = true
  res.redirect('/api/v1/docs');
});
routes.use('/api/v1', [
  usersRoutes,
  rolesRoutes,
  permissionRoutes,
  salesRoutes,
  productsRoutes,
  addressesRoutes,
  stateRoutes
]);

module.exports = routes;
