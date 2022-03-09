const { Op } = require("sequelize");
const User = require("../models/User");
const {validateErrors,stringToDate} = require('../utils/functions')
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");


module.exports = {
  async getUsers(name, birth_date_min, birth_date_max) {
   
      try {      
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
        return users
       
      } catch (error) {
          return {error: error.message}
      }
    

  },
  async beginSession(email, password){
    
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
      console.log(match);

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
      return token

    } catch (error) {
      return {error: error.message}
    }
  }

};
