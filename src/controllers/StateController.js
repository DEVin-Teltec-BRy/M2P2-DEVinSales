const State = require("../models/State");
const City = require("../models/City");
const { validateErrors } = require("../utils/functions");
const { Op, where, fn, col } = require("sequelize");

module.exports = {
  async postStateIdCity(req, res) {
    // #swagger.tags = ['Estado']
    // #swagger.description = 'O Endpoint verifica se o Estado já existe e se existe alguma outra cidade criada no Estado com o mesmo nome. Caso não exista, cria-se uma nova Cidade. Nesse endpoint o usuário deve ter permissão WRITE.'
    /*#swagger.parameters['state_id'] = {
      in: 'query',
      description: 'Id do Estado' ,
      type: 'number'
    }*/ 
        /*#swagger.parameters['name'] = {
      in: 'body',
      description: 'name da city' ,
      type: 'string'
    }*/ 
    /* #swagger.responses[403] = {
        description: 'O usuário não tem permissão(Forbidden)'
} */
    /* #swagger.responses[404] = {
        description: 'O Estado não existe no Banco de Dados(No found)'
} */
    /* #swagger.responses[400] = {
        description: 'Já existe uma cidade com este nome para o Estado(Bad Request)'
} */
    /* #swagger.responses[403] = {
        description: 'city_id(Created)'
} */

    try {
      const { state_id } = req.params;
      const { name } = req.body;

      const state = await State.findByPk(state_id);

      if (!state) {
        return res
          .status(404)
          .send({ message: "O Estado não existe no Banco de Dados" });
      }

      const accent ="Á,À,Ã,Â,Ä,á,à,ã,â,ä,É,È,Ê,Ë,é,è,ê,ë,Í,Ì,Î,Ï,í,ì,î,ï,Ó,Ò,Ô,Õ,Ö,ó,ò,ô,õ,ö,Ú,Ù,Û,Ü,ú,ù,û,ü,Ç,ç,Ñ,ñ";

      const unaccent ="A,A,A,A,A,a,a,a,a,a,E,E,E,E,e,e,e,e,I,I,I,I,i,i,i,i,O,O,O,O,O,o,o,o,o,o,U,U,U,U,u,u,u,u,C,c,N,n";

      const city = await City.findOne({
        where: {
          name: where(
            fn("translate", fn("lower", col("City.name")), accent, unaccent),
            {
              [Op.iLike]: `%${name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%`,
            }
          ),
          state_id: state.id,
        },
      });

      if (city) {
        return res
          .status(400)
          .send({
            message: `Já existe uma cidade com nome de ${name} no Estado de ${state.name}`,
          });
      }

      const newCity = await City.create({
        name,
        state_id,
      });
      return res.status(201).send({ city: newCity.id });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(403).send(message);
    }
  },
};
