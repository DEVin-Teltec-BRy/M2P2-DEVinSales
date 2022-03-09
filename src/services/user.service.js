const { Op } = require("sequelize");
const User = require("../models/User");
const {stringToDate} = require('../utils/functions')

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
};
