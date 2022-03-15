const State = require("../models/State");
const City = require("../models/City");
const { validateErrors } = require("../utils/functions");
const { ACCENT, UNNACENT } = require("../utils/constants/accents");
const { Op, where, fn, col } = require("sequelize");

module.exports = {
  async getCitiesByStateID(req, res) {
    /* 
    #swagger.tags = ['Estado']
    #swagger.description = 'Endpoint para buscar cidade(s) por estado'
    */
    try {
      const { state_id } = req.params;
      const { name } = req.query;

      const state = await State.findOne({
        where: {
          id: state_id,
        },
      });

      if (!state) {
        return res.status(404).json({ message: "Estado não encontrado." });
      }

      const query = {
        state_id,
      };

      if (name) {
        query.name = where(
          fn("translate", fn("lower", col("City.name")), ACCENT, UNNACENT),
          {
            [Op.iLike]: `%${name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}%`,
          }
        );
      }

      const cities = await City.findAll({
        where: query,
        attributes: ["id", "name"],
        include: [
          {
            model: State,
            as: "state",
            attributes: ["id", "name", "initials"],
          },
        ],
      });

      if (!cities.length) {
        return res.status(204).json({});
      }

      return res.status(200).json({ cities });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
