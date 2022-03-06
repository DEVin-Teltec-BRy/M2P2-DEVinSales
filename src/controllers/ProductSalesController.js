const Sale = require("../models/Sale");
const Product = require('../models/Product') 
const ProductsSales = require('../models/ProductsSales')
const { Op } = require("sequelize");
const { validateErrors } = require("../utils/functions");


module.exports = {
    async create(req,res){
        // #swagger.tags = ['Produtos_Vendas']
       // #swagger.description = 'Endpoint criar uma venda.'
       

   },
    async updateOne(req, res) {
    // #swagger.tags = ['Produtos_Vendas']
    // #swagger.description = 'Endpoint que atualiza a quantidade de produtos de uma venda.'
    try {
      const { sale_id, product_id, amount } = req.params;
      const saleResult = await Sale.findByPk(sale_id)
      const productResult = await Product.findByPk(product_id)
      const productSaleResult = await ProductsSales.findAll({
        attributes: ['id', 'unit_price', 'amount', 'sales_id', 'product_id' ],
        where: {
          sales_id :{
            [Op.eq]:sale_id
          }
        }
      })
      console.log(productSaleResult)
        if(!saleResult || !productResult){
        return res.status(404).send({ message: "id de Produto ou de Venda não existem" });

      }else{
        return res.status(201).send({ message: "Venda atualizada com sucesso." });

      }
      

    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
