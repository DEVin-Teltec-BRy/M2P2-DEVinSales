const connection = require('../database')

const UserRole = connection.define('users_roles', {})

module.exports = UserRole