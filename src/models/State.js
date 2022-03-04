const { DataTypes, Model } = require('sequelize')

class State extends Model{
  static init(sequelize){
    super.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "O nome deve ser único",
            },
        },
        initials: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "As iniciais devem ser únicas",
            },
            validate: {
                len: {
                    msg: "O campo deve ter apenas duas letras",
                    args: [2],
                  }
            },
        },
    },{
        sequelize,
        modelName: 'State',
    })
  }
  static associate(models){
    this.hasMany(models.City, {
        foreignKey: 'state_id',
        as: 'cities'
    })
  }
}
module.exports = State
