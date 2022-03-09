const { DataTypes, Model } = require('sequelize')


class Deliveries extends Model{
  static init(sequelize){
    super.init({
        delivery_forecast: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },{
      sequelize,
    })
  }
  static associate(models) {
    this.belongsTo(models.Address, {
        foreignKey: "address_id",
        as: "adress",
    })
    this.belongsTo(models.Sale, {
      foreignKey: "sale_id",
      as: "sale",
  });
}
}
module.exports = Deliveries
