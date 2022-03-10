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



// async create(req, res) {
        
//   const { user_id } = req.params
//   const { buyer_id, dt_sale, } = req.body
//   const receivedDate = new Date(dt_sale)
//   const dateNow = new Date()
//   try {
//       const result = await Sale.create({
//           seller_id: user_id,
//           buyer_id: buyer_id,
//           dt_sale: (receivedDate.length > 0) ? receivedDate : dateNow.getTime()
//       })
//       res.status(201).send({ 'created': "id-" + result.id })
//   } catch (error) {
//       if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`) return res.status(404).send("user_id inexistente")
//       if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`) return res.status(404).send("buyer_id inexistente")
//       res.status(404).send(error.message)
//   }


