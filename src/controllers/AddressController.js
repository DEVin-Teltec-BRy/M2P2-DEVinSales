const Address = require('../models/Address');
const City = require('../models/City')
const { Op } = require("sequelize");

module.exports={

    async index(req,res){

        try {
            const {
                city_id,
                street,
                cep
            } = req.query

            const query = {};
            
            if(city_id) {
                query.city_id = {
                    [Op.eq]: city_id
                };
            }
            if(street) {
                query.street = {
                    [Op.like]: `%${street}%`,
                };
            }
            if(cep) {
                query.cep = {
                    [Op.eq]: cep,
                };
            }

            const addresses = await Address.findAll({
                where: query,
                attributes: ["id", "city_id", "street", "cep"],
            });
      
            if (addresses.length === 0) {
                return res.status(204).json({ message: "No Content" });
            } else {
                return res.status(200).json({ addresses });
            }

          } catch (error) {
              const message = validateErrors(error);
              return res.status(400).send(message);
          }

}

};
