const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
const { send } = require("express/lib/response");

module.exports = {
  async index(req, res) {
    // #swagger.tags = ['Produto']
    // #swagger.description = 'Endpoint para buscar produtos conforme critério query params'

    try {
      const { name, price_min, price_max } = req.query;
      const query = {};
      if (name) {
        query.name = { [Op.iLike]: `%${name}%` };
      }
      const priceMin = Number(price_min) ? Number(price_min) : 0;
      const priceMax = Number(price_max)
        ? Number(price_max)
        : Number.MAX_SAFE_INTEGER;

      if (priceMax <= priceMin) {
        return res.status(400).json({
          message: "Price max must be greater than price min",
        });
      }
      query.suggested_price = {
        [Op.between]: [priceMin, priceMax],
      };

      const products = await Product.findAll({
        attributes: ["id", "name", "suggested_price"],
        where: query,
      });

      if (products.length === 0) return res.status(204).send();

      return res.status(200).send({ products });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).send();
      }
      // Como a tabela product_sales ainda não foi criada, a regra de negócio:
      // "Caso exista algum products_sales com o product_id enviado, deve-se retornar o código de erro 400 (Bad Request)"
      // foi ignorada no momento, e adicionada a outro card no trello

      await Product.destroy({
        where: {
          id: id,
        },
      });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).send({
        message: "Error deleting product",
      });
    }
  },
  async store(req, res) {
    // #swagger.tags = ['Produto']
    // #swagger.description = 'Endpoint para criar um novo produto.'
    try {
      const newProduct = req.body;

      const productExist = await Product.findOne({
        where: {
          name: newProduct.name,
        },
      });
      if (productExist) {
        return res
          .status(400)
          .send({ message: "Já existe um produto com esse mesmo nome." });
      }

      if (newProduct.suggested_price <= 0) {
        return res
          .status(400)
          .send({ message: "O preço deve ser maior que zero." });
      }
      const product = await Product.create(newProduct);

      return res.status(200).send({
        message: "Produto criado com sucesso!",
        novoProduto: product,
      });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async update(req, res) {
    // #swagger.tags = ['Produto']
    // #swagger.description = 'Endpoint para criar um novo produto.'

    try {
      const { id } = req.params;
      const { name, suggested_price } = req.body;
      const formatedName = name.trim();
      if (!formatedName && !suggested_price) {
        return res
          .status(400)
          .send({ message: "Não foram enviados dados para atualização." });
      }

      if (formatedName) {
        const name_Db = await Product.findOne({
          where: {
            name: formatedName,
            id: {
              [Op.not]: id,
            },
          },
        });

        if (name_Db) {
          return res.status(400).send({
            message: `Já existe outro produto com o nome ${formatedName}`,
          });
        }
      }

      if (suggested_price <= 0) {
        return res
          .status(400)
          .send({ message: "O preço sugerido deve ser maior que zero." });
      }
      const productExist = await Product.findByPk(id);

      if (!productExist) {
        return res
          .status(404)
          .send({ message: `Não existe produto com o id ${id}` });
      }

      formatedName ? (productExist.name = formatedName) : productExist.name;
      suggested_price
        ? (productExist.suggested_price = suggested_price)
        : productExist.suggested_price;

      await productExist.save();

      return res.status(200).send({ message: formatedName });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
