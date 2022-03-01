const connection = require('../database')
const {DataTypes} = require('sequelize')
const Permission = require('./Permission')
const PermissionRole = require('./PermissionRole')

const Role = connection.define('roles', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)

Role.belongsToMany(Permission, {
  through: {
    model: PermissionRole
  },
  foreignKey: 'role_id',
  constraint: true
})

Permission.belongsToMany(Role, {
  through: {
    model: PermissionRole
  },
  foreignKey: 'permission_id',
  constraint: true
})

Role.hasMany(PermissionRole, {foreignKey: 'role_id'})
Permission.hasMany(PermissionRole, {foreignKey: 'permission_id'})
PermissionRole.belongsTo(Permission, {foreignKey: 'permission_id'})
PermissionRole.belongsTo(Role, {foreignKey: 'role_id'})

module.exports = Role
