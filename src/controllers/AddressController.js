const Address = require('../models/Address');
const City = require('../models/City')
const State = require('../models/State')
const { validateErrors } = require('../utils/functions')
const { Op } = require("sequelize");

module.exports={

    async index(req,res){
        
        // #swagger.tags = ['Endereços']
        // #swagger.description = 'Endpoint que retorna os endereços com base nos dados fornecidos via query, ou então todos os endereços caso nenhuma query seja passada'

        // #swagger.parameters['city_id'] = {
        //   in: 'query',
        //   description: 'Filtro que identifica o id da cidade desejada',
        //   type: 'number',
        //   collectionFormat: 'multi',
        // }
        // #swagger.parameters['street'] = {
        //   in: 'query',
        //   description: 'Filtro que identifica o nome da rua que será retornada',
        //   type: 'string',
        //   collectionFormat: 'multi',
        // }
        // #swagger.parameters['cep'] = {
        //   in: 'query',
        //   description: 'Filtro que identifica o cep que será retornada',
        //   type: 'string',
        //   collectionFormat: 'multi',
        // }

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
                // #swagger.responses[204] = { description: 'No Content' }
                return res.status(204).json({ message: "No Content" });
            } else {
                // #swagger.responses[200] = { description: 'Success!' }
                return res.status(200).json({ addresses });
            }

          } catch (error) {
              const message = validateErrors(error);
              // #swagger.responses[403] = { description: 'Forbidden' }
              return res.status(403).send(message);
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
          
          //Valida as chaves de endereço
          const validKeys = ['street', 'number', 'complement', 'cep']
          const addressObjKeys = Object.keys(addressData);
          


          return res.status(200).send({ state, city, addressData, addressDataKeys });
    
        } catch (error) {
          const message = validateErrors(error);
          return res.status(400).send(message);
        }
    },

};
