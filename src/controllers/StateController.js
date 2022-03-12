const State = require("../models/State");
const City = require("../models/City");
const { validateErrors } = require("../utils/functions");
const { Op, where, fn, col } = require("sequelize");

module.exports = {
  async postStateIdCity(req, res) {
    try {
      const { state_id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).send({ message: "É necessário enviar o nome da Cidade" });
      }
      const state = await State.findByPk(state_id);
      
      if (!state) {
        return res.status(404).send({ message: "O Estado não existe no Banco de Dados" });
      }

      const accent = "Á,À,Ã,Â,Ä,á,à,ã,â,ä,É,È,Ê,Ë,é,è,ê,ë,Í,Ì,Î,Ï,í,ì,î,ï,Ó,Ò,Ô,Õ,Ö,ó,ò,ô,õ,ö,Ú,Ù,Û,Ü,ú,ù,û,ü,Ç,ç,Ñ,ñ";

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
              state_id: state.id
        },
      });

      if(city){
        return res.status(400).send({ message: `Já existe uma cidade com nome de ${name} no Estado de ${state.name}`});
      }

      const newCity = await City.create({
        name,
        state_id
    })
    return res.status(201).send({city: newCity.id})

    } catch (error) {
      const message = validateErrors(error);
      return res.status(403).send(message);
    }
  },
};
