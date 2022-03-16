"use strict";
const { Model, DataTypes } = require("sequelize");
class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        seller_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        buyer_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        dt_sale: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );
  }
  static associate(models) {
    Sale.belongsToMany(models.User, {
      foreignKey: "id",
      through: "user",
      constraints: true,
    });
    Sale.belongsToMany(models.Product, { through: models.ProductsSales });

    this.hasMany(models.ProductsSales, {
      foreignKey: 'sale_id',
      as: 'products'
    });
    this.belongsTo(models.User, {
      foreignKey: 'buyer_id',
      as: 'buyer'
    });
    this.belongsTo(models.User, {
      foreignKey: 'seller_id',
      as: 'seller'
    });

  }
}
module.exports = Sale;