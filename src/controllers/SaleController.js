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
            const sale_id = req.params.sale_id

            if (!sale_id) {
                return res.status(400).send({ message: 'É necessário passar o ID de vendas' })
            }

            const sale = await Sale.findByPk(sale_id)
            if (!sale) {
                return res.status(404).send({ message: 'Não existe venda para este ID' })
            }

            return res.status(200).json(sale)

        } catch (error) {
            return res.status(500).json(error.message)
        }

    },

    async saleMade(req, res) {
        try {
            // #swagger.tags = ['Sales']
            // #swagger.description = 'nao sei o que ele faz.'
            const { seller_id } = req.params;
            const { product_id } = req.body;
            const { authorization } = req.headers;
            let { unit_price, amount } = req.body;
            const dt_sale = new Date();
            const buyer = await verify(authorization, process.env.SECRET);
            const buyer_id = buyer.userId;
            // se o amount vir vazio bota o valor de 1
            if (!amount || amount.replace(/\s/g, "") == "") {
                amount = 1;
            }

            //verificando se o product_id foi enviado
            if (
                !product_id ||
                product_id.replace(/\s/g, "") == "" ||
                product_id === "any"
            ) {
                return res.status(400).send({ message: "Product_id invalido" });
            }

            //verificando se o amount ou o unit price estao com valores menores que 0
            if (unit_price <= 0 || amount <= 0) {
                return res
                    .status(400)
                    .send({ message: "unit_price ou amount com valores invalidos" });
            }

            //verificando se o product id existe para
            const validProductId = await Product.findByPk(product_id);
            if (!validProductId) {
                return res.status(404).send({ message: "product_id inexistente" });
            }

            //verificando se o seller_id existe na tabela user_id
            const validSellerId = await User.findByPk(seller_id);
            if (!validSellerId) {
                return res.status(404).send({ message: "seller_id inexistente" });
            }

            //verificando se o unit_price foi enviado
            if (
                !unit_price ||
                unit_price.replace(/\s/g, "") == "" ||
                unit_price === "any"
            ) {
                unit_price = validProductId.suggested_price;
            }
            //Criando o registro sale
            const sale = await Sale.create({
                seller_id,
                buyer_id,
                dt_sale,
            });
            const sales_id = sale.dataValues.id;

            //criando o registro product_sale
            const product_sale = await ProductsSales.create({
                sales_id,
                product_id,
                unit_price,
                amount,
            });
            const product_sale_id = product_sale.dataValues.id;

            return res.status(201).send(`product_sale id: ${product_sale_id}`);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    },
}


