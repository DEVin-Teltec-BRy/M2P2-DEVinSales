const State = require("../models/State");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async index(req, res) {
    // #swagger.tags = ['Estado']
    // #swagger.description = 'Endpoint que retorna os estados com base no nome fornecido via query, ou então todos os estados caso nenhuma query seja passada'
    // #swagger.parameters['name'] = {
    //   in: 'query',
    //   description: 'Filtro que identifica o nome integral ou parcial dos estados que serão retornados',
    //   type: 'array',
    //   collectionFormat: 'multi',
    // } 
    try {
      const { name } = req.query;
      if (Object.keys(name).length) {
          return res.status(200).send("Test")
      } 
      else {
        const states = await State.findAll();
        if (states.length === 0) 
            return res.status(204).send("No Content");
        else 
            return res.status(200).send({ states });
      }
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
};
