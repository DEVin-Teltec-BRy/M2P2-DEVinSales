'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products_sales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  products_sales.init({
    sale_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products_sales',
  });
  return products_sales;
};