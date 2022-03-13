const { validateErrors } = require("../utils/functions");
const UserServices = require("../services/user.service");

module.exports = {
  async create(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint para criar um novo usuário.'
    try {
      const { name, password, email, birth_date, roles } = req.body;
      const user = await UserServices.createUser(
        name,
        password,
        email,
        birth_date,
        roles
      );

      if (user.error) throw new Error(user.error);

      return res.status(201).send({ response: user.id });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async session(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint para login do usuário, quando email e senha são validos retorna um token.'
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
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint para buscar todos os usuários do banco de dados.'
    try {
      const { name, birth_date_min, birth_date_max } = req.query;
      const date_regex =
        /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

      if (birth_date_min) {
        if (!date_regex.test(birth_date_min)) {
          throw new Error("A data mínima deve ser no formato dd/mm/aaaa.");
        }
      }
      if (birth_date_max) {
        if (!date_regex.test(birth_date_max)) {
          throw new Error("A data máxima deve ser no formato dd/mm/aaaa.");
        }
      }
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
