const { DataTypes, Model } = require('sequelize')
class Role extends Model {
  static init(sequelize) {
    super.init({
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "A descrição deve ser única",
        },
        validate: {
          len: {
            msg: "A descrição do cargo deve ter entre 4 e 10 caracteres.",
            args: [4, 10]
          }
        }
      }
    }, {
      sequelize,
      hooks: {
        beforeCreate: (role) => {
          role.description = role.description.toUpperCase()
        }
      }
    })
  }
  static associate(models) {
    this.belongsToMany(models.Permission, {
      foreignKey: 'role_id',
      through: 'permissions_roles',
      as: 'permissions'
    })
    this.belongsToMany(models.User, {
      foreignKey: 'role_id',
      through: 'users_roles',
      as: 'users'
    })
  }
}

module.exports = Role
