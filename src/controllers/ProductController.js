const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
const {
  indexProductService,
  storeProductService,
  updateProductService,
  getProductById,
} = require("../services/product.service");

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
          const priceMax = Number(price_max) ? Number(price_max) : Number.MAX_SAFE_INTEGER;

          if (priceMax <= priceMin) {
            return res.status(400).json({
              message: "Preço máximo deve ser maior que o preço minimo",
            });
          }
          query.suggested_price = {
            [Op.between]: [priceMin, priceMax],
          };

          const products = await Product.findAll({
            attributes: ["id", "name", "suggested_price"],
            where: query,
          });

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
                    id: id
                }
            });
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send({
                message: "Error deleting product"
            });
          if (products.length === 0) return res.status(204).send();

          return res.status(200).send({ products });
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
    
  
   /* #swagger.parameters['price_max'] = {
    in: 'query',
    description: 'query para buscar produtos pelo preço máximo',
    required: false,
    type: 'number',

  } 
    try {
      const { name, price_min, price_max } = req.query;

      const products = await indexProductService(name, price_min, price_max);

      if (products.length === 0) return res.status(204).send();

      return res.status(200).send({ products });

      /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/GetProduct" },
               description: "Produtos:" 
        } 
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    } */
  
  async store(req, res) {
    /*#swagger.tags = ['Produto']
    #swagger.description = 'Endpoint para criar um novo produto. Nesse endpoint o usuário deve ter permissão WRITE.'
    #swagger.parameters['obj'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/AddProduct'
        }
      }*/

    try {
      const newProduct = req.body;

      const product = await storeProductService(newProduct);

      /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/ResProduct" },
               description: "Produto criado com sucesso!" 
        } */
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
  async putUpdate(req, res) {
    /*#swagger.tags = ['Produto']
    #swagger.description = 'Endpoint para atualizar todos as propriedades de um produto. Neste endpoint o usuário logado deve ter permissão de UPDATE.'
    #swagger.parameters['product_id'] = {
      in: 'path',
      description: 'parâmetro id para buscar um produto para atualização',
      required: true,
      type: 'number',
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/PutProduct'
        }
      }*/

    try {
      const { product_id } = req.params;
      const { name, suggested_price } = req.body;

      if (!name) {
        throw new Error("O campo name, não foi enviado.");
      }
      if (!suggested_price) {
        throw new Error("O campo suggested_price, não foi enviado.");
      }
      if (Number(suggested_price) <= 0) {
        throw new Error("O campo suggested_price, deve ser maior que 0.");
      }

      const product = await updateProductService(
        product_id,
        name,
        suggested_price
      );

      if (!product) {
        return res.status(404).send({ message: "Produto não encontrado." });
      }

      return res.status(204).send();
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async update(req, res) {
    /* #swagger.tags = ['Produto']
    #swagger.description = 'Endpoint para alterar apenas uma propriedade de um produto, name ou suggested_price. Neste endpoint o usuário logado deve ter permissão de UPDATE.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'parâmetro id para buscar um produto para atualização',
      required: true,
      type: 'number',
    } 
    #swagger.parameters['obj'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/definitions/PatchProduct'
      }
    }*/

    try {
      const { id } = req.params;
      const { name, suggested_price } = req.body;

      const updatedProduct = await updateProductService(
        id,
        name,
        suggested_price
      );

      if (!updatedProduct) {
        return res
          .status(404)
          .send({ message: `Não existe produto com o id ${id}` });
      }

      return res.status(204).send();
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async delete(req, res) {
    /*#swagger.tags = ['Produto']
    #swagger.description = 'Endpoint para deletar um produto, neste endpoint o usuário logado deve ter permissão de DELETE e não pode ser um produto vendido.'
      #swagger.parameters['id'] = {
      in: 'path',
      description: 'parâmetro id para buscar um produto para deleção',
      required: true,
      type: 'number',
    } */

    try {
      const { id } = req.params;

      const product = await getProductById(Number(id));

      if (!product) {
        return res.status(404).send({ message: "Produto não encontrado." });
      }
      if (product.sales.length > 0) {
        throw new Error("Produto não pode ser deletado, produto já vendido.");
      }
      await product.destroy();

      return res.status(204).send();
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
