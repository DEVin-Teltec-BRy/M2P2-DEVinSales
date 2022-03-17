const { Op } = require("sequelize");
const User = require("../models/User");
const Sale = require("../models/Sale");
const {
  validateErrors,
  stringToDate,
  verifyDate,
  verifyAge,
} = require("../utils/functions");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const { READ, WRITE } = require("../utils/constants/permissions");

module.exports = {
  async getUsers(name, birth_date_min, birth_date_max) {
    try {
      const query = {};
      if (name) {
        query.name = { [Op.iLike]: `%${name}%` };
      }

      if (birth_date_min) {
        const vefifyDateBirthMin = verifyDate(birth_date_min);

        if (!vefifyDateBirthMin)
          throw new Error("Informe uma data em um formato válido dd/mm/yyyy");

        const dateMin = stringToDate(birth_date_min);
        query.birth_date = {
          [Op.gt]: dateMin,
        };
      }
      if (birth_date_max) {
        const vefifyDateBirthMax = verifyDate(birth_date_max);
        if (!vefifyDateBirthMax)
          throw new Error("Informe uma data em um formato válido dd/mm/yyyy");
        const dateMax = stringToDate(birth_date_max);
        query.birth_date = { ...query?.birth_date, [Op.lt]: dateMax };
      }

      const users = await User.findAll({
        attributes: ["id", "name", "email", "birth_date"],
        where: query,
      });
      return users;
    } catch (error) {
      return { error: error.message };
    }
  },
  async createUser(name, password, email, birth_date, roles) {
    try {
      const dateValidation = verifyDate(birth_date);
      if (!dateValidation) {
        throw new Error(
          "É necessário que a data informada exista e  seja do tipo dd/mm/yyyy"
        );
      }

      const ageValidation = verifyAge(stringToDate(birth_date));

      if (!ageValidation) {
        throw new Error("É necessário que o usuário seja maior de idade");
      }

      if (!roles || roles.length === 0) {
        throw new Error("Precisa ser enviado pelo menos um rol");
      }

      const responseRoles = await Role.findAll({
        where: {
          id: roles.map((role) => role.role_id),
        },
        include: {
          association: "permissions",
          through: { attributes: [] },
          attributes: ["description"],
        },
      });

      if (
        responseRoles.length === 0 ||
        !(responseRoles.length === roles.length)
      ) {
        throw new Error(`É necessario que rol(es) existan`);
      }

      const response = responseRoles.filter((role) => {
        const permissions = role.permissions.filter((permission) => {
          return (
            permission.dataValues.description === READ ||
            permission.dataValues.description === WRITE
          );
        });
        return permissions;
      });

      if (response.length === 0) {
        throw new Error(
          "O novo usuário necessita ter um cargo de WRITE e READ"
        );
      }

      const user = await User.create({
        name,
        password,
        email,
        birth_date: stringToDate(birth_date),
      });

      await user.setRoles(responseRoles);

      return { id: user.id };
    } catch (error) {
      return { error: error.message };
    }
  },
  async beginSession(email, password) {
    try {
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
        throw new Error(message.message);
      }
      const token = sign(
        { userId: user.id, roles: user.roles },
        process.env.SECRET,
        {
          expiresIn: "1d",
        }
      );
      return token;
    } catch (error) {
      return { error: error.message };
    }
  },
  async deleteUser(user_id) {
    try {
      const userId = Number(user_id);

      if (!userId) throw new Error("Formato de id invalido!");

      const findUserById = await User.findOne({
        where: {
          id: {
            [Op.eq]: userId,
          },
        },
      });

      if (!findUserById)
        throw new Error("Não se encontrou nenhum usuario como o id informado ");

      const findSale = await Sale.findAll({
        where: {
          [Op.or]: [{ buyer_id: userId }, { seller_id: userId }],
        },
      });

      if (findSale.length > 0)
        throw new Error(
          "Não é possivel deletar usuario, por que tem compras ou vendas registradas"
        );

      await User.destroy({
        where: {
          id: {
            [Op.eq]: userId,
          },
        },
      });

      return "Usuario deletado com sucesso";
    } catch (error) {
      return { error: error.message };
    }
  },
};
