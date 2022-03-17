const { DataTypes, Model } = require("sequelize");
const Product = require("./Product");
const Sale = require("./Sale");

class ProductsSales extends Model {
  static init(sequelize) {
    super.init(
      {
        sale_id: {
          type: DataTypes.INTEGER,
          references: {
            model: Sale,
            key: "id",
          },
        },
        product_id: {
          type: DataTypes.INTEGER,
          references: {
            model: Product,
            key: "id",
          },
        },
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
  static associate(models) {
    this.belongsTo(
      models.Sale, {
      foreignKey: 'sale_id',
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
