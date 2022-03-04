const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");

module.exports = {
    async index(req, res) {
        // #swagger.tags = ['Produto']
        // #swagger.description = 'Endpoint para buscar produtos conforme critério query params'

        try {
            const filter = req.query
            console.log(filter)
            console.log('aaaa')
            return res.status(200).send({ message: filter });
        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message)
        }
    }

}