const Sale = require('../models/Sale')
const User = require("../models/User");
const ProductsSales  = require('../models/ProductsSales')
const salesRoutes = require('../routes/v1/sales.routes');
const { validateErrors } = require('../utils/functions')

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
            const id = req.params.id

            if (!id) {
                return res.status(400).send({ message: 'É necessário passar o ID de vendas' })
            }

            const sale = await Sale.findByPk(id)
            if (!sale) {
                return res.status(404).send({ message: 'Não existe venda para este ID' })
            }

            return res.status(200).json(sale)

        } catch (error) {
            return res.status(500).json(error.message)
        }

    },

    async saleMade(req, res) {
        const { seller_id } = req.params;
           // const { authorization } = req.headers;
            const  {sales_id, product_id, unit_price, amount } = req.body;
        try {
            console.log('slslsl')
            //criando o registro product_sale
            const product_sale = await ProductsSales.create({
                sales_id :sales_id,
                product_id :product_id,
                unit_price :unit_price,
                amount :amount,
            });
          console.log(product_sale)
            res.status(201).send({ 'created': "id-" + product_sale.id });
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }
}


