const Address = require('../models/Address');
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");

module.exports={

    async index(req,res){
        
        // #swagger.tags = ['Endereços']
        // #swagger.description = 'Endpoint que retorna os endereços com base nos dados fornecidos via query, ou então todos os endereços caso nenhuma query seja passada'

        /* #swagger.parameters['city_id'] = {
             in: 'query',
             description: 'Filtro que identifica o id da cidade desejada',
             type: 'number',
             collectionFormat: 'multi',
        }*/
        /* #swagger.parameters['street'] = {
             in: 'query',
             description: 'Filtro que identifica o nome da rua que será retornada',
             type: 'string',
             collectionFormat: 'multi',
           }*/
        /* #swagger.parameters['cep'] = {
             in: 'query',
             description: 'Filtro que identifica o cep que será retornada',
             type: 'string',
             collectionFormat: 'multi',
           }*/

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

    async update(req,res){

        // #swagger.tags = ['Endereços']
        // #swagger.description = 'Endpoint que faz a alteração de um endereço com base nos dados passados pelo body'

        /* #swagger.parameters['address_id'] = {
             in: 'path',
             description: 'ID do endereço a ser alterado',
             type: 'number',
             required: true,
        }*/
        /* #swagger.parameters['address'] = {
             in: 'body',
             description: 'Dados para alteração do endereço',
             type: 'object',
             schema: { $ref: "#/definitions/updateAddress" }
           }*/

        try {
            const { address_id } = req.params;
            const { street, number, complement, cep } = req.body;

            const address = await Address.findByPk(address_id);

            if(!address) {
                // #swagger.responses[404] = { description: 'Not Found' }
                return res.status(404).json({ message: "Endereço não localizado!"});
            }

            if(!street && !number && !complement && !cep) {
                // #swagger.responses[400] = { description: 'Bad request' }
                return res.status(400).json({ message: "É necessário passar pelo menos um parâmetro!" });
            }

            Address.update(
                {
                    street: street ? street : address.street,
                    number: number ? number : address.number,
                    complement: complement ? complement : address.complement,
                    cep: cep ? cep : address.cep,
                },
                {
                    where: {
                        id: address_id,
                    }
                }
            )

            // #swagger.responses[200] = { description: 'Success' }
            return res.status(200).json({ message: "Endereço alterado com sucesso!" });

          } catch (error) {
              const message = validateErrors(error);
              // #swagger.responses[403] = { description: 'Forbidden' }
              return res.status(403).send(message);
          }

}

};
