const { DataTypes, Model } = require("sequelize");

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        street: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        number: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        complement: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cep: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              msg: "O cep deve ter 8 dígitos",
              args: [8],
            },
          },
        },
      },
      { sequelize }
    );
  }
  static associate(models) {
    this.belongsTo(models.City, {
      foreignKey: "city_id",
      as: "cities",
    });

  }
}

module.exports = Address;
