const Sale = require('../models/Sale')
const User = require("../models/User");
const ProductsSales = require("../models/ProductsSales");
const Product = require("../models/Product");
const { decode } = require("jsonwebtoken");
const salesRoutes = require('../routes/v1/sales.routes');
const { validateErrors } = require('../utils/functions');
const { literal } = require('sequelize');



module.exports = {

  async create(req, res) {

    const { user_id } = req.params
    const { buyer_id, dt_sale, } = req.body
    const receivedDate = new Date(dt_sale)
    const dateNow = new Date()
    try {
      const result = await Sale.create({
        seller_id: user_id,
        buyer_id: buyer_id,
        dt_sale: (receivedDate.length > 0) ? receivedDate : dateNow.getTime()
      })
      res.status(201).send({ 'created': "id-" + result.id })
    } catch (error) {
      if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`) return res.status(404).send("user_id inexistente")
      if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`) return res.status(404).send("buyer_id inexistente")
      res.status(404).send(error.message)
    }

  },

  async showSaler(req, res) {

    const FindUser = await Sale.findAll()
    console.log(FindUser)
    return res.status(201).json(FindUser)

  },

  async showSaleById(req, res) {

    try {
      const sale_id = req.params.sale_id

      if (!sale_id) {
        return res.status(400).send({ message: 'É necessário passar o ID de vendas' })
      }

      const sale = await Sale.findByPk(sale_id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],

        },
        include: [
          {
            association: "products",
            attributes: [
              'product_id',
              'amount',
              'unit_price',
              [literal('unit_price * amount'), 'total'],
            ],
          },
          {
            association: "buyer",
            attributes: [
              'name',
            ]
          },
          {
            association: "seller",
            attributes: [
              'name',
            ]
          },
        ],
      });


      if (!sale) {
        return res.status(404).send({ message: 'Não existe venda para este ID' })
      }
      const productIdList = sale.products.map(p => p.product_id)
      const productNames = await Product.findAll({
        attributes: ['id', 'name'],
        where: {
          id: productIdList,
        }
      })

      const productsWithName = sale.products.map(p => {
        const { dataValues: product } = p;
        return {
          name: productNames.find(e => e.id === product.product_id).name,
          amount: product.amount,
          unit_price: product.unit_price,
          total: product.total,
        }
      })


      const response = {
        id_sale: sale.id,
        seller_name: sale.seller.name,
        buyer_name: sale.buyer.name,
        dt_sale: sale.dt_sale,
        products: productsWithName
      }

      return res.status(200).json(response)

    } catch (error) {
      return res.status(500).json(error.message)
    }
  },
  async showSaler(req, res) {

    const { id } = req.params;


    try {
      const findUser = await User.findByPk(id);

      const findSaler = await User.findAll({
        attributes: ['name', 'email'],
        include:
        {
          association: 'sales_user',
          attributes: ['seller_id', 'dt_sale'],
          where: { seller_id: id },
        }
      });

      if (!findUser) {
        return res.status(400).send({ message: "Este usuario não existe!" });
      }

      if (findSaler.length === 0) {
        return res.status(400).send({ message: "Este usuario não possui vendas!" });
      }


      return res.status(200).json(findSaler)
    } catch (error) {

      return res.status(400).send({ message: "Erro deconhecido!" })
    }

  },

  async saleMade(req, res) {
    try {

      const { seller_id } = req.params;
      const { product_id } = req.body;
      let { unit_price, amount } = req.body;
      const dt_sale = new Date();
      const buyer = await decode(req.headers.authorization);
      const buyer_id = buyer.userId;
      if (!amount || amount.replace(/\s/g, "") == "") {
        amount = 1;
      }
      if (
        !product_id ||
        product_id.replace(/\s/g, "") == "" ||
        product_id === "any"
      ) {
        return res.status(400).send({ message: "Invalid Product_id" });
      }
      if (unit_price <= 0 || amount <= 0) {
        return res
          .status(400)
          .send({ message: "unit_price or amount aren't valid" });
      }
      const validProductId = await Product.findByPk(product_id);
      if (!validProductId) {
        return res.status(404).send({ message: "product_id does not exist" });
      }

      const validSellerId = await User.findByPk(seller_id);
      if (!validSellerId) {
        return res.status(404).send({ message: "seller_id does not exist" });
      }
      if (
        !unit_price ||
        unit_price.replace(/\s/g, "") == "" ||
        unit_price === "any"
      ) {
        unit_price = validProductId.suggested_price;
      }
      const sale = await Sale.create({
        seller_id,
        buyer_id,
        dt_sale,
      });
      let sale_id = await sale.id;
      await sale.addProduct(product_id, { through: { unit_price, amount } });
      productSale = await ProductsSales.findOne({
        attributes: ["id"],
        where: {
          sale_id: sale_id,
          product_id: product_id,
          unit_price: unit_price,
          amount: amount,
        },
      });
      return res.status(201).send({ 'created': "id-" + productSale.id });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
