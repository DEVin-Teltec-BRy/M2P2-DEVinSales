const Deliveries = require('../models/Deliveries')
const { validateErrors } = require('../utils/functions')

module.exports={

    async create(req,res){
         // #swagger.tags = ['Deliveries']
        // #swagger.description = 'Endpoint criar uma entrega.'
        
        const {sale_id} = req.params
        const { address_id, delivery_forecast} = req.body
        const receivedForecast = delivery_forecast;
        const standardForecast = new Date();
        try { 
            const result = await Deliveries.create({
                 sale_id:sale_id,
                 address_id: address_id,
                 delivery_forecast:standardForecast,
            }) 
            res.status(201).send({message: sale_id })
        } catch (error) {
            res.status(404).send(error.message)
        }

    }

}
