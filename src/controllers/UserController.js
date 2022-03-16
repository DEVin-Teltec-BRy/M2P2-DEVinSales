const { validateErrors } = require("../utils/functions");
const UserServices = require("../services/user.service");


module.exports = {
  async create(req, res) {

    try {
      const { name, password, email, birth_date, roles } = req.body;
      const user = await UserServices.createUser(
        name,
        password,
        email,
        birth_date,
        roles
      );

      await user.setRoles(responseRoles);

      return res.status(201).send({ response: user.id });
    } catch (error) {
      const message = validateErrors(error);

      return res.status(400).send(message);
    }
  },
  async session(req, res) {

    try {
      const { email, password } = req.body;
      const token = await UserServices.beginSession(email, password);

      if (token.error) throw new Error(token.error);

      return res.status(201).send({ token: token });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async index(req, res) {

    try {
      const { name, birth_date_min, birth_date_max } = req.query;

      const users = await UserServices.getUsers(
        name,
        birth_date_min,
        birth_date_max
      );
      if (users.error) {
        throw new Error(users.error);
      }

      if (users.length === 0) {
        return res.status(204).send();
      }

      return res.status(200).send({ users });
    } catch (error) {
      const message = validateErrors(error);

      return res.status(400).send(message);
    }
  },
  async delete(req, res) {

    try {
      const { user_id } = req.params;

      const message = await UserServices.deleteUser(user_id);

      if (message.error) {
        throw new Error(message.error);
      }

      return res.status(200).json({ message });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
