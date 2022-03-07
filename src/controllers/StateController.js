const State = require("../models/State");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async getCitiesByStateID(req, res) {
    try {
      const { state_id } = req.params;
      return res.status(200).json({ message: state_id });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
