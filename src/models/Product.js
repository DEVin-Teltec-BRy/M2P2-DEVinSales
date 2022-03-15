const { DataTypes, Model } = require("sequelize");

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            len: {
              args: [3, 50],
              msg: "O nome do produto deve conter entre 3 e 50 caractéres.",
            },
          }
        },
        suggested_price: {
          type: DataTypes.DECIMAL(7, 2),
          allowNull: false,
          validate: {
            isNumeric: { msg: "O preço sugerido deve ser um número." },
          },
        },
      },
      { sequelize }
    );
  }
  static associate(models) {
    Product.belongsToMany(models.Sale, { through: models.ProductsSales });
  
  }
}

module.exports = Product;
