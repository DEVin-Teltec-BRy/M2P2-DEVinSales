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

        // console.log(city.name)

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
// 6 - Endpoint: POST /state/{state_id}/city
// Entrada:
// ● state_id: integer (Path parameter)
// ● Body:
// {
// name: string
// }
// Regras de negócio:
// ● O usuário logado deve possuir a autorização de WRITE para o endpoint
// de Cidade. Caso não possua, deve-se retornar o Status de Erro 403
// (Forbidden) okay
// ● Caso não exista nenhum registro de Estado com o state_id enviado,
// deve ser retornado o Status de Erro 404 (Not Found) okay
// ● Caso exista alguma outra cidade criada nesse estado com o mesmo
// nome enviado, deve ser retornado o Status de Erro 400 (Bad Request)
// ● Caso todas as validações passem, deve ser criada uma cidade com
// nome e estado especificados, retornando o Id da cidade criada, com o
// Status 201 (Created)