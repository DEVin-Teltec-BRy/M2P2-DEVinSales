const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
const { send } = require("express/lib/response");

module.exports = {
    async index(req, res) {
        // #swagger.tags = ['Produto']
        // #swagger.description = 'Endpoint para buscar produtos conforme critério query params'

        try {
            const { name, price_min, price_max } = req.query
            const query = {};
            if (name) {
                query.name = { [Op.iLike]: `%${name}%` };
            }
            const priceMin = Number(price_min) ? Number(price_min) : 0
            const priceMax = Number(price_max) ? Number(price_max) : Number.MAX_SAFE_INTEGER

            if (priceMax <= priceMin) {
                return res.status(400).json({
                    message: "Price max must be greater than price min"
                })
            }
            query.suggested_price = {
                [Op.between]: [priceMin, priceMax]
            };

            const products = await Product.findAll({
                attributes: ["id", "name", "suggested_price"],
                where: query,
            });

            if (products.length === 0) return res.status(204).send();

            return res.status(200).send({ products });

        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message)
        }
    },

    async putUpdate(req, res){
        // #swagger.tags = ['Produto']
        // #swagger.description = 'Endpoint para atualizar um produto, neste Endpoint o usuário logado deve ter permissão de UPDATE.'
        try {
            const { product_id } = req.params
            const {name, suggested_price} = req.body
            const nameData = name.trim()

            if(!nameData) {
                return res.status(400).send({message: 'O campo name, não foi enviado.'});
            }
            if(!suggested_price){
                return res.status(400).send({message: 'O campo suggested_price, não foi enviado.'});
            }
            if(Number(suggested_price) <= 0) {
                return res.status(400).send({message: 'O campo suggested_price, deve ser maior que 0.'});
            }
            const hasProductWithSameName = await Product.count({
                where: {
                    name : nameData,
                    id: {
                     [Op.not]: product_id
                    }
                }})
            if(hasProductWithSameName){
                return res.status(400).send({message: 'Já existe outro produto com o mesmo nome.'});
            }
            const product = await Product.findByPk(product_id)
            if(!product) {
                return res.status(404).send({message: 'Product not found.'});
            }
            product.name = nameData
            product.suggested_price = suggested_price

            await product.save()
            
            return res.status(204).send();
        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message)
        }
  },
  async delete(req, res) {
    // #swagger.tags = ['Produto']
        // #swagger.description = 'Endpoint para deletar um produto, neste Endpoint o usuário logado deve ter permissão de DELETE, e não pode ser um produto vendido.'
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id,{
        include: [
          {
            required: false,
            association: 'sales'
          }
        ]
      });
      if (!product) {
        return res.status(404).send({message: 'Produto não encontrado.'});
      }
      if(product.sales.length > 0) {
        return res.status(400).send({message: 'Produto não pode ser deletado, produto já vendido.'});
      }
      await product.destroy()

      return res.status(204).send();
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
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
};
