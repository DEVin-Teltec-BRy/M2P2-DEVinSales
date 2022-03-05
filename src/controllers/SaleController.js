const Sale = require("../models/Sale");
const User = require("../models/User");
const salesRoutes = require("../routes/v1/sales.routes");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
module.exports = {
  async create(req, res) {
    // #swagger.tags = ['Vendas']
    // #swagger.description = 'Endpoint criar uma venda.'

    const { user_id } = req.params;
    const { buyer_id, dt_sale } = req.body;
    const receivedDate = new Date(dt_sale);
    const dateNow = new Date();
    try {
      const result = await Sale.create({
        seller_id: user_id,
        buyer_id: buyer_id,
        dt_sale: receivedDate.length > 0 ? receivedDate : dateNow.getTime(),
      });
      res.status(201).send({ created: "id-" + result.id });
    } catch (error) {
      if (
        error.message ==
        `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`
      )
        return res.status(404).send("user_id inexistente");
      if (
        error.message ==
        `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`
      )
        return res.status(404).send("buyer_id inexistente");
      res.status(404).send(error.message);
    }
  },

  async showSaler(req, res) {
    // #swagger.tags = ['Busca as Vendas do Usuarios']
    // #swagger.description = 'Endpoint pra busacar as vendas do usuario.'

    // const {user_id} = req.params
    // const { buyer_id, dt_sale,} = req.body

    const FindUser = await User.findAll();
    console.log(FindUser);
    return res.status(201).json(FindUser);

    // const selerUser = await Sale.findAll({
    //     where: {
    //         id: salesRoutes.map((sale) => sale.seller_id),
    //     }
    // })
    // return res.status(201).send({ message: "AChou" })
  },
  async item(req, res) {
    try {
      // #swagger.tags = ['Sales']
      // #swagger.description = 'nao sei o que ele faz.'

      const { seller_id } = req.params;
      const { product_id } = req.body;
      let { unit_price, amount } = req.body;
      if (
          !product_id || 
          product_id.replace(/\s/g, "") == "" || 
          product_id === "any") 
        {
          throw new Error("Product_id invalido")
        }
        
      if(!amount || amount.replace(/\s/g, "") == ""){
        amount = 1
      }
        
        return res.status(200).send({});
    } catch (error) {
      return res.status(400).send({message: error.message});
    }
  },
};
