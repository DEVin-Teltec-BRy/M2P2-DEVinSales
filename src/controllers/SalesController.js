const Sale = require("../models/Sale");
const { Op } = require("sequelize");

module.exports = {
  async updateOne(req, res) {
    // #swagger.tags = ['Sales']
    // #swagger.description = 'Endpoint que criar um novo usuário.'
    try {
      const { name, password, email, birth_date, roles } = req.body;
      
      return res.status(201).send({ message: "Venda atualizada com sucesso." });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
