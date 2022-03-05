const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");

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
        }
    },

    async update(req, res){
        // #swagger.tags = ['Produto']
        // #swagger.description = 'Endpoint para atualizar um produto, neste Enpoint o usuario logado deve ter permissão de UPDATE.'
        try {
            const { product_id } = req.params
            const {name, suggested_price} = req.body

            if(!name) {
                return res.status(400).send({message: 'O campo name, não foi enviado.'});
            }
            if(!suggested_price){
                return res.status(400).send({message: 'O campo suggested_price, não foi enviado.'});
            }
            if(Number(suggested_price) <= 0) {
                return res.status(400).send({message: 'O campo suggested_price, deve ser maior que 0.'});
            }
            const product = await Product.findByPk(product_id)
            if(!product) {
                return res.status(404).send({message: 'Product not found.'});
            }
            product.name = name || product.name
            product.suggested_price = suggested_price || product.suggested_price
            await product.save()
            return res.status(204).send();
        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message)
        }
    }

}