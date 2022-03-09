const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const {
  validateErrors,
  stringToDate,
  PostUserPasswordValidation,
  validateEmailType,
  verifyAge,
} = require("../utils/functions");

module.exports = {
  async create(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint que criar um novo usuário.'
    try {
      const { name, password, email, birth_date, roles } = req.body;
      const user = await User.create({
        name,
        password,
        email,
        birth_date,
      });
      if (roles && roles.length > 0) {
        const responseRoles = await Role.findAll({
          where: {
            id: roles.map((role) => role.role_id),
          },
        });
        if (responseRoles && responseRoles.length > 0) {
          await user.setRoles(responseRoles);
        }
      }

      const emailTypeValidation = validateEmailType(email);
      if (emailTypeValidation === false) {
        const message = validateErrors({
          message: "E-mail no formato incorreto",
        });
        return res.status(400).send(message);
      }

      const emailExists = await User.findOne({ where: { email: email } });
      if (emailExists) {
        const message = validateErrors({
          message: "O E-mail informado já existe",
        });
        return res.status(400).send(message);
      }

      const passwordValidation = PostUserPasswordValidation(password);
      if (passwordValidation === false) {
        const message = validateErrors({
          message:
            "A senha deve possuir no mínimo 4 caracteres e deve-se ter pelo menos um caractere diferente dos demais.",
        });
        return res.status(400).send(message);
      }

      const ageValidation = verifyAge(stringToDate(birth_date));
      if (ageValidation === false) {
        const message = validateErrors({
          message: "O usuário não é maior de idade",
        });
        return res.status(400).send(message);
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
            association: "roles",
            attributes: ["id", "description"],
            through: {
              attributes: [],
            },
          },
        ],
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

  async index(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint para buscar todos os usuários do banco de dados.'
    try {
      const { name, birth_date_min, birth_date_max } = req.query;

      const query = {};
      if (name) {
        query.name = { [Op.iLike]: `%${name}%` };
      }
      if (birth_date_min) {
        const dateMin = stringToDate(birth_date_min);
        query.birth_date = {
          [Op.gt]: dateMin,
        };
      }
      if (birth_date_max) {
        const dateMax = stringToDate(birth_date_max);
        query.birth_date = { ...query?.birth_date, [Op.lt]: dateMax };
      }

      const users = await User.findAll({
        attributes: ["id", "name", "email", "birth_date"],
        where: query,
      });

      if (users.length === 0) {
        return res.status(204).send();
      }
      return res.status(200).send({ users });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
