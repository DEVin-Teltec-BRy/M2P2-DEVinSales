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
        /* #swagger.parameters['obj'] = {
                in:'body',
                schema:{
                'buyer_id':1,
                'dt_sale':'1980/05/19'
                }
            }
            #swagger.parameters[user_id] = {
                in:'path'
            }
        */
        const { user_id } = req.params
        const { buyer_id, dt_sale } = req.body
        
        try {
            if(dt_sale.length<10) throw new Error('Formato de data inválido')
            if(!buyer_id)throw new Error("Precisa existir um comprador")
            if (new Date(dt_sale) == 'Invalid Date') throw new Error('Formato de data inválido')
              
            const result = await Sale.create({
                seller_id: user_id,
                buyer_id: buyer_id,
                dt_sale: dt_sale
            })
            return res.status(201).send({ 'created': "id-" + result.id })

        } catch (error) {

            if (error.message.includes('sales_seller_id_fkey')) return res.status(404).send({message:"seller_id inexistente"})
            if (error.message.includes('sales_buyer_id_fkey')) return res.status(404).send({message:"buyer_id inexistente"})
            if(error.message.includes('invalid input syntax')) return res.status(400).send({message:"User_id em formato inválido"})

            res.status(400).send({message:error.message})
        }
    },
    async createBuy(req, res) {
        // #swagger.tags = ['Vendas']
        // #swagger.description = 'Endpoint para criar uma venda.'
        /* #swagger.parameters['obj'] = {
                in:'body',
                schema:{
                'seller_id':1,
                'dt_sale':'1980/05/19'
                }
            }
            #swagger.parameters[user_id] = {
                in:'path'
            }
        */
        const { user_id } = req.params
        const { seller_id, dt_sale } = req.body

        try {
            if(!Number(seller_id))throw new Error('Seller_id deve ser um número')
            if(!user_id)throw new Error('Precisa enviar o user_id')
            if(dt_sale.length<10) throw new Error('Formato de data inválido')
            if (new Date(dt_sale) == 'Invalid Date') throw new Error('Formato de data inválido')

            const result = await Sale.create({
                seller_id: (seller_id) ? seller_id : null,
                buyer_id: user_id,
                dt_sale: dt_sale
            })
            return res.status(201).send({ 'created': "id-" + result.id })

        } catch (error) {
            if (error.message.includes('sales_seller_id_fkey')) return res.status(404).send({message:"seller_id inexistente"})
            if (error.message.includes('sales_buyer_id_fkey')) return res.status(404).send({message:"buyer_id inexistente"})
            if(error.message.includes('invalid input syntax')) return res.status(400).send({message:"User_id em formato inválido"})
            
            res.status(400).send({message:error.message})
        }

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
