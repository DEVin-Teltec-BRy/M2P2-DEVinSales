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

  async insertNewAddress(req, res) {
    try {
      const {state_id, city_id} = req.params;
      const addressData = req.body;

      // Verifica se os params são inteiros válidos, caso negativo retorna 400
      if(isNaN(state_id) || isNaN(city_id)) {
        return isNaN(state_id) ? 
        (
          isNaN(city_id) ? res.status(400).send({message: "The 'state_id' and 'city_id' params must be integers"}) 
          : 
          res.status(400).send({message: "The 'state_id' param must be an integer"})
        ) 
        : 
        res.status(400).send({message: "The 'city_id' param must be an integer"});
      }
      
      // Busca o estado com base no state_id fornecido, se não encontrar retorna 404
      const state = await State.findAll({
        where: { id: {[Op.eq]: state_id} },
      });

      if(state.length === 0) {
        return res.status(404).send({message: "Couldn't find any state with the given 'state_id'"})
      }
      
      // Busca a cidade com base no city_id fornecido, se não encontrar retorna 404
      const city = await City.findAll({
        where: { id: {[Op.eq]: city_id} },
      });

      if(city.length === 0) {
        return res.status(404).send({message: "Couldn't find any city with the given 'city_id'"})
      }

      // Verifica se a relação entre a cidade e o estado é válida, caso negativo, retorna 400
      if(city[0].state_id !== state[0].id) {
        return res.status(400).send({message: "The 'city_id' returned a city that doesn't match with the given 'state_id'"})
      }

      // *************** TESTE ***************
      
      return res.status(200).send({ state, city, addressData });

    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  }
};
