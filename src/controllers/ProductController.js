const Product = require("../models/Product");
const { validateErrors } = require("../utils/functions");

module.exports = {
    async index(req, res) {
        // #swagger.tags = ['Produto']
        // #swagger.description = 'Endpoint para buscar produtos conforme critério query params'

        try {
            const { name, price_min, price_max } = req.query
            const priceMin = Number(price_min) ? price_min : 0
            const priceMax = Number(price_max) ? price_max : Number.MAX_SAFE_INTEGER
            console.log(priceMin, priceMax)
            return res.status(200).send({ message: 'ok' });
        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message)
        }
    }

}