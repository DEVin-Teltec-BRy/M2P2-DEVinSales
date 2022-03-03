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
  //confirmar nomes e keys, de acordo com tabela Addresses
  static associate(models) {
    this.belongsTo(models.Addresses, {
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
