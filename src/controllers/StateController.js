const State = require("../models/State");
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
      const names = [req.query.name]
      const initials = [req.query.initials]

      if (names[0] !== undefined|| initials[0] !== undefined ) {
        const states = await Promise.all(
          initials.flat().map(async (initial) => {
            return await State.findAll({
              where: { initials: {[Op.iLike]: `%${initial}%`} },
            });
          }).concat(
            names.flat().map(async (name) => {
              return await State.findAll({
                where: { name: {[Op.iLike]: `%${name}%`} },
              });
            })
          )
        );

        const filteredStates =  [...new Map(states.flat().map((state) => [state['id'], state])).values()]
        if (filteredStates.length === 0) {
          return res.status(204).send();
        } 
        else {
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
    try {
      const { state_id } = req.params;

      if(isNaN(state_id)) {
        return res.status(400).send({message: "The 'state_id' param must be an integer"})
      }

      const state = await State.findAll({
        where: { id: {[Op.eq]: state_id} },
      });

      if(state.length === 0) {
        return res.status(404).send({message: "Couldn't find any state with the given 'state_id'"})
      } else {
        return res.status(200).send(state[0])
      }

    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  }
};
