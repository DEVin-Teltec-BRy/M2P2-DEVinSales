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

    }

}
