'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.hasMany(User,{
        foreignKey:'id',
        constraints:true
      })
    }
  }
  Sale.init({
    buyer_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    dt_sale: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'sale',
  });
  return Sale;
};

