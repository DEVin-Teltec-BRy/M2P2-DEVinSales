const Sale = require("../models/Sale");
const Product = require('../models/Product')
const ProductsSales = require('../models/ProductsSales')
const { Op } = require("sequelize");
const { validateErrors } = require("../utils/functions");


module.exports = {

  async updateOnePrice(req, res) {


    try {
      const { sale_id, product_id, price } = req.params;
      const saleResult = await Sale.findByPk(sale_id)
      const productResult = await Product.findByPk(product_id)
      const productSaleResult = await ProductsSales.findAll({
        attributes: ['id', 'unit_price', 'amount', 'sales_id', 'product_id'],
        where: {
          sales_id: {
            [Op.eq]: sale_id
          }
        }
      })
      if (!saleResult || !productResult) {
        return res.status(404).send({ message: "id de Produto ou de Venda não existem" });

      } else {

        if (productSaleResult[0].dataValues.product_id !== Number(product_id)) {
          return res.status(400).send({ message: "Id do produto enviado não é compatível ao cadastrado na venda." });
        } else {
          if (price <= 0 || isNaN(price)) {
            return res.status(400).send({ message: "Preço deve ser um número superior à zero" });
          }
          const id = Number(productSaleResult[0].dataValues.id)

          const result = await ProductsSales.update(
            { unit_price: Number(price) },
            { where: { id: id } }
          )
          return res.status(204).send();

        }
      }


    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
