const connection = require('../database')
const { DataTypes } = require('sequelize')
const Role = require('./Role')
const UserRole = require('./UserRole')

const User = connection.define('users',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
      }
  }
)


User.belongsToMany(Role, {
  through: {
    model: UserRole
  },
  foreignKey: 'user_id',
  constraint: true
})

Role.belongsToMany(User, {
  through: {
    model: UserRole
  },
  foreignKey: 'role_id',
  constraint: true
})

User.hasMany(UserRole, { foreignKey: 'user_id' })
Role.hasMany(UserRole, { foreignKey: 'role_id' })
UserRole.belongsTo(User, { foreignKey: 'user_id' })
UserRole.belongsTo(Role, { foreignKey: 'role_id' })

module.exports = User
