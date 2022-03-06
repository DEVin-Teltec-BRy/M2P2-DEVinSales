

module.exports = {
    async findDeliveries(req, res){
        // #swagger.tags = ['Deliveries']
        // #swagger.description = 'Endpoint para buscar deliveries conforme critério query params'
        try {
            const { address_id, sale_id } = req.query
           
            return res.status(200).send({message: 'Ola!'})
        } catch (error) {
            const message = validateErrors(error)
            return res.status(400).send(message)
        }
    }
}