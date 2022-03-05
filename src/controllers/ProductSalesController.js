const Sale = require("../models/Sale");
const { Op } = require("sequelize");

module.exports = {
    async create(req,res){
        // #swagger.tags = ['Produtos_Vendas']
       // #swagger.description = 'Endpoint criar uma venda.'
       

   },
    async updateOne(req, res) {
    // #swagger.tags = ['Produtos_Vendas']
    // #swagger.description = 'Endpoint que atualiza a quantidade de produtos de uma venda.'
    try {
      const { name, password, email, birth_date, roles } = req.body;
      
      return res.status(201).send({ message: "Venda atualizada com sucesso." });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
