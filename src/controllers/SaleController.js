const Sale = require("../models/Sale");
const User = require("../models/User");
const Product = require("../models/Product");
const ProductsSales = require("../models/ProductsSales");
const salesRoutes = require("../routes/v1/sales.routes");
const { verify } = require("jsonwebtoken");
const { validateErrors } = require("../utils/functions");
const { Op } = require("sequelize");

module.exports = {
    async createSale(req, res) {
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint para criar uma venda.'
        const { user_id } = req.params;
        const { buyer_id, dt_sale } = req.body;

        try {
            if (new Date(dt_sale) == "Invalid Date") {
                const result = await Sale.create({
                    seller_id: user_id,
                    buyer_id: buyer_id,
                    dt_sale: new Date().getTime(),
                });
                return res.status(201).send({ created: "id-" + result.id });
            }

            const result = await Sale.create({
                seller_id: user_id,
                buyer_id: buyer_id,
                dt_sale: dt_sale,
            });
            return res.status(201).send({ created: "id-" + result.id });
        } catch (error) {
            if (
                error.message ==
                `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`
            )
                return res.status(404).send("user_id inexistente");
            if (
                error.message ==
                `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`
            )
                return res.status(404).send("buyer_id inexistente");
            res.status(400).send(error.message);
        }
    },
    async createBuy(req, res) {
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint para criar uma venda.'
        const { user_id } = req.params;
        const { seller_id, dt_sale } = req.body;

        try {
            if (new Date(dt_sale) == "Invalid Date") {
                const result = await Sale.create({
                    seller_id: seller_id ? seller_id : null,
                    buyer_id: user_id,
                    dt_sale: new Date().getTime(),
                });
                return res.status(201).send({ created: "id-" + result.id });
            }

            const result = await Sale.create({
                seller_id: seller_id ? seller_id : null,
                buyer_id: user_id,
                dt_sale: dt_sale,
            });
            return res.status(201).send({ created: "id-" + result.id });
        } catch (error) {
            if (
                error.message ==
                `insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`
            )
                return res.status(404).send("seller_id inexistente");
            if (
                error.message ==
                `insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`
            )
                return res.status(404).send("buyer_id inexistente");
            if (error.message == `notNull Violation: Sale.buyer_id cannot be null`)
                return res.status(404).send("buyer_id inexistente");
            res.status(400).send(error.message);
        }
    },

    async showSalesByBuyer(req, res) {
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint pra buscar as vendas do usuario pelo buyer_id.'


        // const {user_id} = req.params
        // const { buyer_id, dt_sale,} = req.body
        const { user_id } = req.params;

        try {
            const salesData = await User.findAll({
                include: [
                    {
                        association: "buyer_sales",
                        where: {
                            buyer_id: user_id
                        }
                    }
                ]
            });

            if (salesData.length == 0) {
                return res.status(204).json({ message: "no content" });
            }

            return res.status(200).json(salesData);

        } catch (error) {
            return res.status(201).json({ message: "erro ao listar dados de vendas" });
        }
    },

    async showSaler(req, res) {
        
         // #swagger.tags = [' Vendas ']
        // #swagger.description = 'Endpoint pra buscar as vendas do usuario.'


         const {id} = req.params;
         
        try {
            const Finduser = await User.findAll({
                include: [
                    {
                        association: 'sales_user',
                        where: {
                            seller_id: id
                        }
                    }
                ]
            });
            if(Finduser.length === 0){
                return res.status(400).send({message: "Este usuario não possui vendas!"});
            }
            
            return res.status(200).send({message: Finduser})
        } catch (error) {
            console.log(error)
            return res.status(400).send({message: "Este usuario não existe!"})
        }
         

        

        // const selerUser = await Sale.findAll({
        //     where: {
        //         id: salesRoutes.map((sale) => sale.seller_id),
        //     }
        // })
        // return res.status(201).send({ message: "AChou" })
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
};
