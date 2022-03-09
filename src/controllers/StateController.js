const State = require("../models/State");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async getCitiesByID(req, res) {
    /* 
    #swagger.tags = ['State']
    #swagger.description = 'Endpoint para buscar cidade por ID'
    */
    try {
      const { state_id, city_id } = req.params;
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
