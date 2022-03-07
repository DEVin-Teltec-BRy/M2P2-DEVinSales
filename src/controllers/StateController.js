const State = require("../models/State");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async getCitiesByStateID(req, res) {
    try {
      const { state_id } = req.params;
      const state = await State.findOne({
        where: {
          id: state_id,
        },
      });

      if (!state) {
        return res.status(404).json({ message: "Estado não encontrado." });
      }

      return res.status(200).json({ message: state });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
