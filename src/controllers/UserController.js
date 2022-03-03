const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async create(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint que criar um novo usuários.'
    try {
      const { name, password, email, birth_date, roles } = req.body;
      const user = await User.create({
        name,
        password,
        email,
        birth_date,
      });
      if (roles && roles.length > 0) {
        const resposeRoles = await Role.findAll({
          where: {
            id: roles.map((role) => role.role_id),
          },
        });
        if (resposeRoles && resposeRoles.length > 0) {
          await user.setRoles(resposeRoles);
        }
      }
      return res.status(201).send({ message: "Usuário salvo com sucesso." });
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

      const user = await User.findOne({
        attributes: ["id", "email", "password"],
        where: {
          email: {
            [Op.eq]: email,
          },
        },
        include: [
          {
            association: 'roles',
            attributes: ['id', 'description'],
            through: {
              attributes: []
            }
          }
        ]
      });
      const existPassword = user ? user.password : "";
      const match = await bcrypt.compareSync(password, existPassword);
      
      if (!match) {
        const message = validateErrors({
          message: "Email ou senha inválidos",
        });
        return res.status(400).send(message);
      }
      const token = sign(
        { userId: user.id, roles: user.roles },
        process.env.SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(201).send({ token: token });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
