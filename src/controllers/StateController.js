const State = require('../models/State');
const City = require('../models/City')
const { validateErrors } = require('../utils/functions');
const { Op } = require('sequelize')

module.exports = {
    async store(req,res) {

        try {
        const { state_id } = req.params
        const state = await State.findByPk(state_id)
        
        if(!state){
            return res.status(404).send({message: "Nenhum Estado foi encontrado"})
        }

        const { name } = req.body
        const city = await City.findOne({
            where: {
                name
            }
        })

        if(city.name === name ){
            return res.status(400).send({message: "Esta cidade já existe."})
        }

        

        // //Cria a cidade
        // const cidade = await State.create({
        //     city_id,
        //     city,
        //     state
        // })
        // return res.status(201).send({message: 'Cidade criada com sucesso!'})
    
        } 
        catch (error) {
        const message = validateErrors(error);
        return res.status(403).send(message);
        }
    
    }

}
