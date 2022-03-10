const State = require("../models/State");
const City = require("../models/City");
const { validateErrors } = require("../utils/functions");
const { Op, where, fn, col, literal } = require("sequelize");
//const { Sequelize } = require("sequelize");

/*
const db = require("./../database");

const sequelize = new Sequelize(
  db.config.database,
  db.config.username,
  db.config.password,
  {
    host: db.config.host,
    dialect: db.options.dialect,
  }
);
*/

module.exports = {
  async getCitiesByStateID(req, res) {
    /* 
    #swagger.tags = ['State']
    #swagger.description = 'Endpoint para buscar cidade(s) por estado'
    */
    try {
      const { state_id } = req.params;
      const { name } = req.query;

      let result = "";
      const accent =
        "Á,À,Ã,Â,Ä,á,à,ã,â,ä,É,È,Ê,Ë,é,è,ê,ë,Í,Ì,Î,Ï,í,ì,î,ï,Ó,Ò,Ô,Õ,Ö,ó,ò,ô,õ,ö,Ú,Ù,Û,Ü,ú,ù,û,ü,Ç,ç,Ñ,ñ";
      const unaccent =
        "A,A,A,A,A,a,a,a,a,a,E,E,E,E,e,e,e,e,I,I,I,I,i,i,i,i,O,O,O,O,O,o,o,o,o,o,U,U,U,U,u,u,u,u,C,c,N,n";

      const state = await State.findOne({
        where: {
          id: state_id,
        },
      });

      if (!state) {
        return res.status(404).json({ message: "Not Found." });
      }

      const query = {
        state_id,
      };

      if (name) {
        query.name = {
          [Op.iLike]: `%${name}%`,
          // where(fn("translate", "name", accent, unaccent)),
        };
      }

      // const lowerCase = fn("lower", name);
      // const replacedSpaces = fn("replace", name, "a", "b");
      // fn("lower", col("name"))
      // $and: where(),

      // fn('regexp_replace', accent, "E'[^\\w -]'", '', 'g')
      // fn("lower", col("name")),
      // fn("replace", lowerCase, accent, unaccent)
      // fn("translate", name, accent, unaccent)

      //fn("translate", name , accent, unaccent)),

      const cities = await City.findAll({
        where: query,
        attributes: ["id", "name"],
        include: [
          {
            model: State,
            as: "states",
            attributes: ["id", "name", "initials"],
          },
        ],
      });

      if (cities.length < 1) {
        return res.status(404).json({ message: "Not Found." });
      }

      /*
      if (name) {
        result = await sequelize.query(
          `SELECT c.id, c.name as city, c.state_id, s.name as state, s.initials FROM cities c INNER JOIN states s ON c.state_id = s.id WHERE c.state_id = ${state_id} and LOWER(TRANSLATE(c.name, '${accent}', '${unaccent}')) = LOWER(TRANSLATE('${name}', '${accent}', '${unaccent}'))`
        );
      } else {
        result = await sequelize.query(
          `SELECT c.id, c.name as city, c.state_id, s.name as state, s.initials FROM cities c INNER JOIN states s ON c.state_id = s.id WHERE c.state_id = ${state_id}`
        );
      }

      if (!result[0].length) {
        return res.status(204).json({ message: "No Content." });
      }

      return res.status(200).json({ result: result[0] });
      */

      return res.status(200).json({ cities });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
