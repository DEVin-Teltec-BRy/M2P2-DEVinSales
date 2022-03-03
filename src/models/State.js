const { DataTypes, Model } = require('sequelize')

class State extends Model{
  static init(sequelize){
    super.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        initials: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    },{
        sequelize,
        modelName: 'State',
    })
  }
}
module.exports = State
