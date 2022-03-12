const State = require("../models/State");
const City = require("../models/City");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async getCitiesByID(req, res) {
    /* 
    #swagger.tags = ['Estado']
    #swagger.description = 'Endpoint para buscar cidade por ID'
    */
    try {
      const { state_id, city_id } = req.params;

      const state = await State.findOne({
        where: {
          id: state_id,
        },
      });

      if (!state) {
        return res.status(404).json({ message: "Estado não encontrado." });
      }

      const city = await City.findOne({
        where: {
          id: city_id,
        },
      });

      if (!city) {
        return res.status(404).json({ message: "Cidade não encontrada." });
      }

      if (state.id !== city.state_id) {
        return res
          .status(400)
          .json({ message: "Cidade não pertence ao estado." });
      }

      const result = {
        city_id: city.id,
        city: city.name,
        state_id: city.state_id,
        state: state.name,
        initials: state.initials,
      };

      return res.status(200).json({ result });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
