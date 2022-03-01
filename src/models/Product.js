const connection = require('../database')
const { DataTypes } = require('sequelize')

const Product = connection.define('products',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    suggested_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }
)

module.exports = Product
