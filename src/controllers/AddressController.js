const Address = require('../models/Address');
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
const Deliveries = require('../models/Deliveries');

module.exports = {

  async index(req, res) {
    
    // #swagger.tags = ['Endereços']
    // #swagger.description = 'Endpoint que retorna os endereços com base nos dados fornecidos via query, ou então todos os endereços caso nenhuma query seja passada'

    /*
    #swagger.tags = ['Endereços']
    #swagger.description = 'Endpoint que retorna os endereços com base nos dados fornecidos via query, ou então todos os endereços caso nenhuma query seja passada'

    #swagger.parameters['city_id'] = {
             in: 'query',
             description: 'Filtro que identifica o id da cidade desejada',
             type: 'number',
             collectionFormat: 'multi',
    }
    #swagger.parameters['street'] = {
             in: 'query',
             description: 'Filtro que identifica o nome da rua que será retornada',
             type: 'string',
             collectionFormat: 'multi',
    }
    #swagger.parameters['cep'] = {
             in: 'query',
             description: 'Filtro que identifica o cep que será retornada',
             type: 'string',
             collectionFormat: 'multi',
    }*/

    try {
      const { city_id, street, cep } = req.query;

      const query = {};

      if (city_id) {
        query.city_id = {
          [Op.eq]: city_id,
        };
      }
      if (street) {
        query.street = {
          [Op.like]: `%${street}%`,
        };
      }
      if (cep) {
        query.cep = {
          [Op.eq]: cep,
        };
      }

      const address = await Address.findAll({
        where: query,
        attributes: ['id', 'street', 'cep'],
        include: [
          {
            association: 'cities',
            attributes: ['id','name'],
            include: [
              {
                association: 'state',
                attributes: ['id','name', 'initials'],
              },
            ],
          },
        ],
      });

      if (address.length === 0) {
        // #swagger.responses[204] = { description: 'No Content' }
        return res.status(204).send();
      } else {
        // #swagger.responses[200] = { description: 'Success!' }
        return res.status(200).json({ address });
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
         schema: { $ref: "#/definitions/address" }
       }*/

    try {
        const { address_id } = req.params;
        const { street, number, complement, cep } = req.body;

        const address = await Address.findByPk(address_id);

        if(!address) {
            // #swagger.responses[404] = { description: 'Endereço não localizado!' }
            return res.status(404).json({ message: "Endereço não localizado!"});
        }

        if(!street && !number && !complement && !cep) {
            // #swagger.responses[400] = { description: 'É necessário passar pelo menos um dado para alteração!' }
            return res.status(400).json({ message: "É necessário passar pelo menos um dado para alteração!" });
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

        // #swagger.responses[200] = { description: 'Endereço alterado com sucesso!' }
        return res.status(200).json({ message: "Endereço alterado com sucesso!" });

      } catch (error) {
          const message = validateErrors(error);
          // #swagger.responses[403] = { description: 'Você não tem autorização para este recurso!' }
          return res.status(403).send(message);
      }

  },

  async delete(req, res) {
    // #swagger.tags = ['Endereços']
    // #swagger.description = 'Endpoint para deletar endereço cadastrado. O id do endereço deve ser enviado por params.'
    try {
      const { address_id } = req.params;
    
      const address = await Address.findByPk(address_id);

      if (!address) {
        //#swagger.responses[404] = {description: 'Not Found'}
        return res.status(404).send({ message: 'Endreço não encontrado.' });
      }

      const deliveryUsing = await Deliveries.findAll({
        where: {
          address_id: address_id,
        },
      });

      if (deliveryUsing.length > 0) {
        //#swagger.responses[400] = {description: 'Bad Request'}
        return res
          .status(400)
          .send({ message: 'Endereço em uso. Não pode ser deletado.' });
      }

      await address.destroy();
      console.log('DESTROYED');
      //#swagger.response[204] = {description: 'No Content' }
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      const message = validateErrors(error);
      return res.status(400).send({ message: message });
    }
  },
};
