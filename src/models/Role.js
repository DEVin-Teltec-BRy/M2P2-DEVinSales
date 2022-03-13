const {DataTypes, Model} = require('sequelize')
class Role extends Model{
  static init(sequelize){
    super.init({
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "A descrição deve ser única",
      },
      }
    }, {
      sequelize,
      hooks:{
        beforeCreate: (role)=>{
          role.description = role.description.toUpperCase()
        }
      }
    })
  }
  static associate(models){
    this.belongsToMany(models.Permission, {
      foreignKey: 'role_id',
      through: 'permissions_roles',
      as: 'permissions'
    })
  }
} 

module.exports = Role
