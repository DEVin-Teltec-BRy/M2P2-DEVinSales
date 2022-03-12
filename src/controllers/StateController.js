const State = require("../models/State");
const City = require("../models/City");
const { validateErrors } = require("../utils/functions");
const Sequelize = require("Sequelize");
const { Op } = require("Sequelize");

module.exports = {
  async index(req, res) {
    // #swagger.tags = ['Estado']
    // #swagger.description = 'Endpoint que retorna os estados com base no nome fornecido via query, ou então todos os estados caso nenhuma query seja passada'
    // #swagger.parameters['name'] = {
    //   in: 'query',
    //   description: 'Filtro que identifica o nome integral ou parcial dos estados que serão retornados',
    //   type: 'array',
    //   collectionFormat: 'multi',
    // }
    // #swagger.parameters['initials'] = {
    //   in: 'query',
    //   description: 'Filtro que identifica as iniciais integral ou parcial dos estados que serão retornados',
    //   type: 'array',
    //   collectionFormat: 'multi',
    // }

    try {
      const names = [req.query.name];
      const initials = [req.query.initials];

      if (names[0] !== undefined || initials[0] !== undefined) {
        const states = await Promise.all(
          initials
            .flat()
            .map(async (initial) => {
              return await State.findAll({
                where: { initials: { [Op.iLike]: `%${initial}%` } },
              });
            })
            .concat(
              names.flat().map(async (name) => {
                return await State.findAll({
                  where: { name: { [Op.iLike]: `%${name}%` } },
                });
              })
            )
        );

        const filteredStates = [
          ...new Map(
            states.flat().map((state) => [state["id"], state])
          ).values(),
        ];
        if (filteredStates.length === 0) {
          return res.status(204).send();
        } else {
          return res.status(200).send(filteredStates);
        }
      }

      // No query params
      else {
        const states = await State.findAll();
        // Blank DB
        if (states.length === 0) {
          return res.status(204).send();
        }
        // DB with content
        else {
          return res.status(200).send({ states });
        }
      }
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },

  async getStateById(req, res) {
    // #swagger.tags = ['Estado']
    // #swagger.description = 'Endpoint que retorna um estado de acordo com o state_id fornecido'
    // #swagger.parameters['state_id'] = {
    //   description: 'ID do estado que será buscado',
    //   type: 'number',
    //   required: 'true',
    // }

    try {
      const { state_id } = req.params;

      if (isNaN(state_id)) {
        return res
          .status(400)
          .send({ message: "The 'state_id' param must be an integer" });
      }

      const state = await State.findAll({
        where: { id: { [Op.eq]: state_id } },
      });

      if (state.length === 0) {
        return res.status(404).send({
          message: "Couldn't find any state with the given 'state_id'",
        });
      } else {
        return res.status(200).send(state[0]);
      }
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },

  async getCitiesByStateID(req, res) {
    /* 
    #swagger.tags = ['State']
    #swagger.description = 'Endpoint para buscar cidade(s) por estado'
    */
    try {
      const { state_id } = req.params;
      const { name } = req.query;

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
        query.name = where(
          fn("translate", fn("lower", col("City.name")), accent, unaccent),
          {
            [Op.iLike]: `%${name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}%`,
          }
        );
      }

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

      if (!cities.length) {
        return res.status(204).json({ message: "Not Content." });
      }

      return res.status(200).json({ cities });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },

  async getCitiesByID(req, res) {
    /* 
    #swagger.tags = ['Estado']
    #swagger.description = 'Endpoint para buscar cidade por ID'
    */
    try {
      const { state_id, city_id } = req.params;

      const state = await State.findOne({
        where: {
          id: state_id,
        },
      });

      if (!state) {
        return res.status(404).json({ message: "Estado não encontrado." });
      }

      const city = await City.findOne({
        where: {
          id: city_id,
        },
      });

      if (!city) {
        return res.status(404).json({ message: "Cidade não encontrada." });
      }

      if (state.id !== city.state_id) {
        return res
          .status(400)
          .json({ message: "Cidade não pertence ao estado." });
      }

      const result = {
        city_id: city.id,
        city: city.name,
        state_id: city.state_id,
        state: state.name,
        initials: state.initials,
      };

      return res.status(200).json({ result });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
