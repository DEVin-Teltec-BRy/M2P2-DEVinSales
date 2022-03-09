const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const { validateErrors, stringToDate } = require("../utils/functions");

module.exports = {
  async create(req, res) {
    /*
      #swagger.tags = ['Usuário']
      #swagger.description = 'Endpoint que criar um novo usuário.'
      #swagger.parameters['obj'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/AddUser'
        }
      }
      #swagger.responses[201] = {
        description: 'Created',
        schema: {
          message: 'Usuário salvo com sucesso.'
        }

      }
      #swagger.responses[403] = {
        description: 'Forbidden'
      }
    */
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
    /*
      #swagger.tags = ['Usuário']
      #swagger.description = 'Endpoint para login do usuário, quando email e senha são validos retorna um token.'
      #swagger.parameters['obj'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/UserLogin'
        }
      }
      #swagger.responses[201] = {
        description: 'Token de acesso',
        schema: {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGVzIjpbeyJpZCI6Miwi___RANDOM_TOKEN___JPV05FUiJ9XSwiaWF0IjoxNjQ2ODA0MDkxLCJleHAiOjE2NDY4OTA0OTF9.OwvUy0p3BVfbicuCg9YYAk5tlPQ6UKB_bZrHt8-H_CU"
        }
      }
      #swagger.responses[400] = {
        description: 'Login não efetuado',
        schema: {
          "message": "Email ou senha inválidos"
        }
      }
    */
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
    /*
      #swagger.tags = ['Usuário']
      #swagger.description = 'Endpoint para buscar todos os usuários do banco de dados.'
      #swagger.parameters['name'] = {
        in: 'query',
        type: 'string',
        description: 'Nome de um usuário. Exemplo: John Doe'
      }
      #swagger.parameters['birth_date_min'] = {
        in: 'query',
        type: 'string',
        description: 'Data limite inferior da consulta. Formato: DD/MM/AAAA'
      }
      #swagger.parameters['birth_date_max'] = {
        in: 'query',
        type: 'string',
        description: 'Data limite superior da consulta. Formato: DD/MM/AAAA'
      }
    */
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
