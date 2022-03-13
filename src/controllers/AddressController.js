const Address = require('../models/Address');
const Deliveries = require('../models/Deliveries');
const { Op } = require('sequelize');

module.exports = {
  async index(req, res) {
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

      const addresses = await Address.findAll({
        where: query,
        attributes: ['id', 'city_id', 'street', 'cep'],
      });

      if (addresses.length === 0) {
        // #swagger.responses[204] = { description: 'No Content' }
        return res.status(204).json({ message: 'No Content' });
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
