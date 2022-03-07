const Sale = require('../models/Sale')
const User = require("../models/User");
const salesRoutes = require('../routes/v1/sales.routes');
const { validateErrors } = require('../utils/functions')
module.exports = {



    async showSaler(req, res) {

        // #swagger.tags = ['Busca as Vendas do Usuarios']
        // #swagger.description = 'Endpoint pra busacar as vendas do usuario.'


        // const {user_id} = req.params
        // const { buyer_id, dt_sale,} = req.body

        const FindUser = await User.findAll()
        console.log(FindUser)
        return res.status(201).json(FindUser)


        // const selerUser = await Sale.findAll({
        //     where: {
        //         id: salesRoutes.map((sale) => sale.seller_id),
        //     }
        // })
        // return res.status(201).send({ message: "AChou" })
    },
    async createSale(req, res) {
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint para criar uma venda.'
        const { user_id } = req.params
        const { buyer_id, dt_sale } = req.body

        try {
            if (new Date(dt_sale) == 'Invalid Date') {
                const result = await Sale.create({
                    seller_id: user_id,
                    buyer_id: buyer_id,
                    dt_sale: new Date().getTime()
                })
                return res.status(201).send({ 'created': "id-" + result.id })
            }

            const result = await Sale.create({
                seller_id: user_id,
                buyer_id: buyer_id,
                dt_sale: dt_sale
            })
            return res.status(201).send({ 'created': "id-" + result.id })

        } catch (error) {
            if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`) return res.status(404).send("user_id inexistente")
            if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`) return res.status(404).send("buyer_id inexistente")
            res.status(400).send(error.message)
        }
    },
    async createBuy(req, res) {
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint para criar uma venda.'
        const { user_id } = req.params
        const { seller_id, dt_sale } = req.body

        try {
            if (new Date(dt_sale) == 'Invalid Date') {
                const result = await Sale.create({
                    seller_id: (seller_id) ? seller_id : null,
                    buyer_id: user_id,
                    dt_sale: new Date().getTime()
                })
                return res.status(201).send({ 'created': "id-" + result.id })
            }

            const result = await Sale.create({
                seller_id: (seller_id) ? seller_id : null,
                buyer_id: user_id,
                dt_sale: dt_sale
            })
            return res.status(201).send({ 'created': "id-" + result.id })

        } catch (error) {
            if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`) return res.status(404).send("seller_id inexistente")
            if (error.message == `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`) return res.status(404).send("buyer_id inexistente")
            if (error.message == `notNull Violation: Sale.buyer_id cannot be null`) return res.status(404).send("buyer_id inexistente")
            res.status(400).send(error.message)
        }

    }

}
