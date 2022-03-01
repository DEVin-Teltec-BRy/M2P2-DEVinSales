const Permission = require('../models/Permission');
const { validateErrors } = require('../utils/functions')

module.exports = {
    async create(req, res){
        try {
            const { description } = req.body
            await Permission.create({description})

            return res.status(200).send({message: 'Permissão criado com sucesso.'})
        } catch (error) {
            const message = validateErrors(error)
            return res.status(400).send(message)
        }
    }
}