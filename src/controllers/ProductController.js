const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
const { send } = require("express/lib/response");

module.exports = {
<<<<<<< HEAD
  async index(req, res) {
    /* #swagger.tags = ['Produto']
    #swagger.description = 'Endpoint para buscar produtos conforme critério query params. Caso a busca seja feita sem os parâmetros, o endpoint irá retornar todos os produtos cadastrados.'
    #swagger.parameters['name'] = {
      in: 'query',
      description: 'query para buscar produtos pelo nome',
      required: false,
    },
    #swagger.parameters['price_min'] = {
    in: 'query',
    description: 'query para buscar produtos pelo preço mínimo',
    required: false,
    type: 'number',
  },
   #swagger.parameters['price_max'] = {
    in: 'query',
    description: 'query para buscar produtos pelo preço máximo',
    required: false,
    type: 'number',

  } */
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
=======
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
>>>>>>> master

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
    /* #swagger.tags = ['Produto'],
     #swagger.description = 'Endpoint para deletar um produto.',
     #swagger.parameters['id'] = {
      in: 'path',
      description: 'params para buscar usuário pelo id para deleção',
      required: true,
      type: 'number',
    },
    */
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
    //#swagger.tags = ['Produto']
    // #swagger.description = 'Endpoint para criar um novo produto. Fornecer um json no body com um nome no formato string e um preço sugerido no formato number, podendo ser decimal.'

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
        novoProduto: {
          nome: product.name,
          preço_sugerido: product.suggested_price,
        },
      });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
