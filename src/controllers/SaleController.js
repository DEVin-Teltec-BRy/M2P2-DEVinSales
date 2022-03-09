const Sale = require('../models/Sale')
const User = require("../models/User");
const salesRoutes = require('../routes/v1/sales.routes');
const { validateErrors } = require('../utils/functions')

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
            include: [
                {
                    association: "buyer_sales",
                    where: {
                        buyer_id: user_id
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
    }

}
