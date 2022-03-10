const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const { Op, DATE } = require("sequelize");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const { validateErrors, stringToDate, checkAge, checkLeapYear } = require("../utils/functions");

module.exports = {
  async create(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint que criar um novo usuário.'
    try {
      const { name, password, email, birth_date, roles } = req.body;

      // Validações para erro (400) Bad Request      

      //validação formato dd/mm/yyyy
      const regex_date = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
      if(!birth_date.match(regex_date) && badRequest == false){
        throw new Error ("data de nascimento informado em padrão incorreto")
      }
      if(['04','06','09','11'].some((x)=> x == birth_date.split('/')[1] ) && birth_date.split('/')[0] == '31' ){
        throw new Error ("data de nascimento informado em padrão incorreto")
      }

      if(birth_date.split('/')[1] == "02" && !checkLeapYear(birth_date.split('/')[2]) && ['29','30','31'].some((x)=> x == birth_date.split('/')[0] )){
        throw new Error ("data de nascimento informado em padrão incorreto")
      }


      // validação da idade mínima 18 anos
      const age = checkAge(birth_date)
      
      if(age <18){
        throw new Error( "idade mínima de 18 anos")
      }
    
      // validação para senha ser pelo menos com 4 caracteres e pelo menos um caracter diferente
      if((password.length <4 || [...new Set(password.split(''))] > 1)){
        throw new Error ("senha muito curta ou sem variação")
      }
      
      
      
      
      // 




      // const user = await User.create({
      //   name,
      //   password,
      //   email,
      //   birth_date,
      // });
      // if (roles && roles.length > 0) {
      //   const resposeRoles = await Role.findAll({
      //     where: {
      //       id: roles.map((role) => role.role_id),
      //     },
      //   });
      //   if (resposeRoles && resposeRoles.length > 0) {
      //     await user.setRoles(resposeRoles);
      //   }
      // }
      // return res.status(201).send(users_email);
      
      // return res.status(201).send(birth_date);

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
  async delete(req, res) {
    try {
      const { user_id } = req.params;
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
        return res.status(404).json({
          error: "Não se encontrou nenhum usuario como o id informado ",
        });

      await User.destroy({
        where: {
          id: {
            [Op.eq]: userId,
          },
        },
      });

      return res.status(200).json({message:"Usuario deletado com sucesso"});
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
