const State = require("../models/State");
const City = require("./../models/City");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");

module.exports = {
  async getCitiesByStateID(req, res) {
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

      const cities = await City.findAll({
        where: {
          state_id: {
            [Op.eq]: state_id,
          },
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
      });

      return res.status(200).json({ message: cities });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
