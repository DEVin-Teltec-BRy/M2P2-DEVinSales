const { user } = require('pg/lib/defaults');
const Sale = require('../models/Sale')
const User = require("../models/User");
const ProductsSales = require("../models/ProductsSales");
const Product = require("../models/Product");
const { decode } = require("jsonwebtoken");
const Address = require('../models/Address');
const Delivery = require('../models/Deliveries');
const salesRoutes = require('../routes/v1/sales.routes');
const { validateErrors, daysToDelivery } = require('../utils/functions');
const State = require('../models/State');

module.exports = {
  
    async create(req,res){
         // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint criar uma venda.'
        
        const {user_id} = req.params
        const { buyer_id, dt_sale,} = req.body
        const receivedDate = new Date(dt_sale)
        const dateNow = new Date()
        try {
            const result = await Sale.create({
                 seller_id:user_id,
                 buyer_id:buyer_id,
                dt_sale:(receivedDate.length>0)?receivedDate:dateNow.getTime()
            })
            res.status(201).send({'created':"id-"+result.id})
        } catch (error) {
            if(error.message==`insert or update on table "sales" violates foreign key constraint "Sales_seller_id_fkey"`)return res.status(404).send("user_id inexistente")
            if(error.message==`insert or update on table "sales" violates foreign key constraint "Sales_buyer_id_fkey"`)return res.status(404).send("buyer_id inexistente")
            res.status(404).send(error.message)
        }

    },

    async showSaler(req,res){

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

    async showSalesByBuyer(req, res){
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint pra buscar as vendas do usuario pelo buyer_id.'

       const {user_id} = req.params;

        try{
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
     
        if(salesData.length == 0){
            return res.status(204).json({message: "no content"});
        }

        return res.status(200).json(salesData);

        }catch(error){
            
           return res.status(201).json({message: "erro ao listar dados de vendas"});
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
                }
        } */
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
      // #swagger.auto = false
      // #swagger.tags = ['Vendas']
      // #swagger.description = '<h2>Endpoint for submitting sales</h2>'
      /*  #swagger.parameters[seller_id] = {
                in: 'path',
                description: '<ul><li>It must be a valid seller_id</li></ul>'
        } */
      /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: '<h4>product_id</h4><ul><li>It must be a valid product_id</li></ul><h4>unit_price</h4><ul><li>If no value is sent it will get the default value of product</li><li>The value must be greater than 0</li></ul><h4>amount</h4><ul><li>If no value is sent it will be considered equal to 1</li><li>The value must be greater than 0</li></ul>',
                schema: {
                    $product_id: 'Integer',
                    unit_price: 'Integer',
                    amount: 'Integer'
                }
      } */

      // #swagger.responses[201] = { description: 'Sale submitted successfully.' }
      // #swagger.responses[403] = { description: 'The user logged-in is unauthorized to submit sales.' }
      // #swagger.responses[404] = { description: 'product_id or seller_id were not found in the database.' }
      const { seller_id } = req.params;
      const { product_id } = req.body;
      let { unit_price, amount } = req.body;
      const dt_sale = new Date();
      const buyer = await decode(req.headers.authorization);
      const buyer_id = buyer.userId;
      // verifying if amount was sent
      if (!amount || amount.replace(/\s/g, "") == "") {
        amount = 1;
      }

      // verifying if product_id was sent
      if (
        !product_id ||
        product_id.replace(/\s/g, "") == "" ||
        product_id === "any"
      ) {
        return res.status(400).send({ message: "Invalid Product_id" });
      }

      // verifying if amount or unit_price have values greater than 0
      if (unit_price <= 0 || amount <= 0) {
        return res
          .status(400)
          .send({ message: "unit_price or amount aren't valid" });
      }

      // verifying if product_id exists in database
      const validProductId = await Product.findByPk(product_id);
      if (!validProductId) {
        return res.status(404).send({ message: "product_id does not exist" });
      }

      // verifying if seller_id exists in database
      const validSellerId = await User.findByPk(seller_id);
      if (!validSellerId) {
        return res.status(404).send({ message: "seller_id does not exist" });
      }

      // verifying if unit_price was sent
      if (
        !unit_price ||
        unit_price.replace(/\s/g, "") == "" ||
        unit_price === "any"
      ) {
        unit_price = validProductId.suggested_price;
      }
      //Creating Product_Sale
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
      return res.status(201).send({ message: productSale });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
