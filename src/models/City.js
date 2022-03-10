const { DataTypes, Model } = require("sequelize");

class City extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "City",
        // hooks: {
        //   beforeFind: (city) => {},
        // },
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.State, {
      foreignKey: "state_id",
      as: "states",
    });

    this.hasMany(models.Address, {
      foreignKey: "city_id",
      as: "cities",
    });
  }
}

module.exports = City;
