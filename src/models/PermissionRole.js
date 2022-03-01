const connection = require('../database')
const PermissionRole = connection.define('permissions_roles', {},{})

module.exports = PermissionRole
