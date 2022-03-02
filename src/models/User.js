const { DataTypes, Model } = require('sequelize')
const { hashPassword } = require('../hooks/userHooks')

class User extends Model{
  static init(sequelize){
    super.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "E-mail deve ser único",
      },
      },
      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
        }
    },{
      sequelize,
      hooks: {
        beforeCreate: async (user)=>{
          user.password = await hashPassword(user.password)
        }
      }
    })
  }
  static associate(models){
    this.belongsToMany(models.Role, {
      foreignKey: 'user_id',
      through: 'users_roles',
      as: 'roles'
    })

  }
}
module.exports = User
