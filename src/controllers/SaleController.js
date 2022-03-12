const Sale = require('../models/Sale')
const User = require("../models/User");
const Address = require('../models/Address');
const Delivery = require('../models/Deliveries');
const salesRoutes = require('../routes/v1/sales.routes');
const { validateErrors, daysToDelivery } = require('../utils/functions');
const State = require('../models/State');

module.exports={

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

    }

}
