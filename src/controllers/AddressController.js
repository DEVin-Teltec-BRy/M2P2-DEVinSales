const Address = require('../models/Address');
const Deliveries = require('../models/Deliveries');
const City = require('../models/City')
const State = require('../models/State')
const { validateErrors } = require('../utils/functions')
const { Op } = require("sequelize");

module.exports = {

  async index(req, res) {

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
            attributes: ['id', 'name'],
            include: [
              {
                association: 'state',
                attributes: ['id', 'name', 'initials'],
              },
            ],
          },
        ],
      });

      if (address.length === 0) {
        return res.status(204).send();
      } else {
        return res.status(200).json({ address });
      }
    } catch (error) {
      const message = validateErrors(error);
      return res.status(403).send(message);
    }
  },

  async update(req, res) {



    try {
      const { address_id } = req.params;
      const { street, number, complement, cep } = req.body;

      const address = await Address.findByPk(address_id);

      if (!address) {
        return res.status(404).json({ message: "Endereço não localizado!" });
      }

      if (!street && !number && !complement && !cep) {
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

      return res.status(200).json({ message: "Endereço alterado com sucesso!" });

    } catch (error) {
      const message = validateErrors(error);
      return res.status(403).send(message);
    }

  },

  async delete(req, res) {

    try {
      const { address_id } = req.params;

      const address = await Address.findByPk(address_id);

      if (!address) {
        return res.status(404).send({ message: 'Endreço não encontrado.' });
      }

      const deliveryUsing = await Deliveries.findAll({
        where: {
          address_id: address_id,
        },
      });

      if (deliveryUsing.length > 0) {
        return res
          .status(400)
          .send({ message: 'Endereço em uso. Não pode ser deletado.' });
      }

      await address.destroy();
      console.log('DESTROYED');
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      const message = validateErrors(error);
      return res.status(400).send({ message: message });
    }
  },

  async insertNewAddress(req, res) {

    try {
      const { state_id, city_id } = req.params;
      const addressData = req.body;

      if (isNaN(state_id) || isNaN(city_id)) {
        return isNaN(state_id) ?
          (
            isNaN(city_id) ? res.status(400).send({ message: "The 'state_id' and 'city_id' params must be integers" })
              :
              res.status(400).send({ message: "The 'state_id' param must be an integer" })
          )
          :
          res.status(400).send({ message: "The 'city_id' param must be an integer" });
      }

      const state = await State.findAll({
        where: { id: { [Op.eq]: state_id } },
      });

      if (state.length === 0) {
        return res.status(404).send({ message: "Couldn't find any state with the given 'state_id'" })
      }

      const city = await City.findAll({
        where: { id: { [Op.eq]: city_id } },
      });

      if (city.length === 0) {
        return res.status(404).send({ message: "Couldn't find any city with the given 'city_id'" })
      }

      if (city[0].state_id !== state[0].id) {
        return res.status(400).send({ message: "The 'city_id' returned a city that doesn't match with the given 'state_id'" })
      }

      const addressObjKeys = ['street', 'number', 'cep']
      if (addressObjKeys.every(key => key in addressData)) {
        if (typeof addressData.street !== 'string') {
          return res.status(400).send({ message: "The 'street' param must be a string" })
        } else if (addressData.street.length === 0) {
          return res.status(400).send({ message: "The 'street' param cannot be empty" })
        }
        if (isNaN(addressData.number)) {
          return res.status(400).send({ message: "The 'number' param must be a number" })
        }
        if (typeof addressData.cep !== 'string') {
          return res.status(400).send({ message: "The 'street' param must be a string" })
        }
        else if (addressData.cep.length < 8 || addressData.cep.length > 9) {
          return res.status(400).send({ message: "The 'cep' param is invalid" })
        }
        else if (addressData.cep.length === 9) {
          if (addressData.cep[5] !== '-') {
            return res.status(400).send({ message: "The 'cep' param format is invalid" })
          }
        }
      }
      else {
        return res.status(400).send({ message: "The 'street', 'number' and 'cep' params are required in the req body" })
      }

      const checkDuplicate = await Address.findAll({
        where: {
          [Op.and]: [{
            street: {
              [Op.iLike]: `${addressData.street}`
            },
            number: {
              [Op.eq]: addressData.number
            },
            cep: {
              [Op.iLike]: `${addressData.cep}`
            },
            city_id: {
              [Op.eq]: `${city[0].id}`
            },
          }]
        }
      });

      if (checkDuplicate.length) {
        return res.status(200).send({ message: "Endereço já existente! Não foi possível adicionar o endereço.", address_id: checkDuplicate[0].id });
      }

      const newAddress = addressData.hasOwnProperty('complement') ?
        {
          city_id: city[0].id,
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement,
          cep: addressData.cep
        } : {
          city_id: city[0].id,
          street: addressData.street,
          number: addressData.number,
          complement: "",
          cep: addressData.cep

        };

      const address = await Address.create(newAddress)
      return res.status(201).send({ address_id: address.id });

    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
