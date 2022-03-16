const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");
const {
  indexProductService,
  storeProductService,
  updateProductService,
  getProductById,
  countSalesByProductId,
} = require("../services/product.service");

module.exports = {
  async index(req, res) {

    try {
      const { name, price_min, price_max } = req.query;

      const products = await indexProductService(name, price_min, price_max);

      if (products.length === 0) return res.status(204).send();

      return res.status(200).send({ products });

    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async store(req, res) {


    try {
      const newProduct = req.body;

      const product = await storeProductService(newProduct);

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


    try {
      const { id } = req.params;

      const countSales = await countSalesByProductId(id)
      if (countSales > 0) {
        throw new Error("Produto não pode ser deletado, produto já vendido.");
      }
      const product = await getProductById(Number(id));
      if (!product) {
        return res.status(404).send({ message: "Produto não encontrado." });
      }
      await product.destroy();

      return res.status(204).send();
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
