const { DataTypes, Model } = require("sequelize");

class ProductsSales extends Model {
  static init(sequelize) {
    super.init(
      {
        unit_price: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      { sequelize }
    );
  }
  static associate(models){
    this.belongsTo(
        models.Sale, {
            foreignKey: 'sales_id',
            as: 'sale'
        }
    )
    this.belongsTo(
        models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        }
    )
}
}

module.exports = ProductsSales;
