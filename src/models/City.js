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
<<<<<<< HEAD
=======
        // hooks: {
        //   beforeFind: (city) => {},
        // },
>>>>>>> SQD2/feature/getCitiesByStateID
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.State, {
      foreignKey: "state_id",
<<<<<<< HEAD
      as: "state",
=======
      as: "states",
>>>>>>> SQD2/feature/getCitiesByStateID
    });

    this.hasMany(models.Address, {
      foreignKey: "city_id",
<<<<<<< HEAD
      as: "address",
=======
      as: "cities",
>>>>>>> SQD2/feature/getCitiesByStateID
    });
  }
}

module.exports = City;
