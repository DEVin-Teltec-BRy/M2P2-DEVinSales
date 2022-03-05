const { DataTypes, Model } = require("sequelize");

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        suggested_price: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
      },
      { sequelize }
    );
  }
  static associate(models) {
    this.hasMany(models.ProductsSales);
  }
}

module.exports = Product;
