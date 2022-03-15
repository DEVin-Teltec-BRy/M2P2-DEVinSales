const { user } = require('pg/lib/defaults');
const Sale = require('../models/Sale')
const User = require("../models/User");
const Product = require("../models/Product");
const ProductsSales = require("../models/ProductsSales");
const salesRoutes = require("../routes/v1/sales.routes");
const { verify } = require("jsonwebtoken");
const { Op } = require("sequelize");
const Address = require('../models/Address');
const Delivery = require('../models/Deliveries');
const { validateErrors, daysToDelivery } = require('../utils/functions');
const State = require('../models/State');


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

        const { user_id } = req.params;
        try {
            const salesData = await User.findAll({
                attributes: ['id','name','email'],
                include: [
                    {
                        association: "buyer_sales",
                        attributes: ['seller_id','buyer_id','dt_sale'],
                        where: {
                            buyer_id: user_id,
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
            const findUser = await User.findByPk(id);

            const findSaler = await User.findAll({
                attributes:['name','email'],
                 include: 
                    { 
                        association: 'sales_user',
                        attributes: [ 'seller_id', 'dt_sale' ],
                        where: {seller_id: id },
                    }
        });
           
         if(!findUser){
             return res.status(400).send({message: "Este usuario não existe!"});
         }

           if(findSaler.length === 0){
                return res.status(400).send({message: "Este usuario não possui vendas!"});
            }
            
            
            return res.status(200).json( findSaler)
        } catch (error) {
            
            return res.status(400).send({message: "Erro deconhecido!"})
        }
   
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
  

    async deliveries(req,res){
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint pra buscar as entregas.'
        /*  #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    address_id: 'integer',
                    delivery_forecast: '2022-03-12T11:13:24.848Z'
       */
    try{
       const {sale_id} = req.params;
       const {address_id, delivery_forecast} = req.body;

       // verifica se foi passado a address_id
       if(address_id.length == 0){
        return res.status(400).json({message: "Bad Request"});
       }

       // Verifica se existe o id_sales na tabela sales
       const sale = await Sale.findAll({
           where: {
               id: sale_id,
           }
       });

       if(sale.length==0){
        return res.status(404).json({message: "id_sale not found"});
       }

       // verifica se existe o id_address na tabela addresses      
       const address = await Address.findAll({
           where: {
               id: address_id,
           }
       });
  
       if(address.length==0){
        return res.status(404).json({message: "address_id not found"});
       }

       // delivery_forecast verifica se a data e hora inserida é menor que a atual 
       const dateNow = new Date();
       const dataParsed = Date.parse(dateNow);
       const dataForecastParsed = Date.parse(delivery_forecast);
      
       if(dataForecastParsed < dataParsed){
        return res.status(400).json({message: "Bad request"});
       }

       // adiciona 7 dias à data para entrega
       const deliverydate = daysToDelivery(7);

       //verificar se já existe agendamento p essa sale
       const deliveryBooked = await Delivery.findAll({
           where: {
               sale_id: sale_id,
           }
       });

       if(deliveryBooked.length>=1){
          return res.status(400).json({message: "Já existe um agendamento de entrega para esta venda"});
       }

       // criação do objeto data_entrega na tabela entregas
       const deliveryDateResult = await Delivery.create({
        address_id:address_id,
        sale_id:sale_id,
        delivery_forecast: deliverydate
       })

       return res.status(200).json({message: "Entrega agendada com sucesso"});
    }catch(error){
        return res.status(400).json({message: "Bad request"});
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
}};
