'use strict';
const User = require('./User')
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
      Sale.belongsToMany(models.User,{
        foreignKey:'id',
        through:'user'
      
      })
    }
  }
  Sale.init({
    seller_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    dt_sale: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};