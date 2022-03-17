const Role = require("../models/Role");
const Permission = require("../models/Permission");
const { validateErrors } = require("../utils/functions");

module.exports = {
  async index(req, res) {
    /*
        #swagger.tags = ['Cargos e Permissões']
        #swagger.description = 'Endpoint para criar um novo Cargo. Nesse endpoint o usuário deve ter cargo de OWNER.'
    */
    try {
      const roles = await Role.findAll({
        attributes: ["id", "description"],
        include: [
          {
            association: "users",
            attributes: ["id", "name", "email", "birth_date"],
            through: {
              attributes: [],
            },
          },
          {
            association: "permissions",
            attributes: ["id", "description"],
            through: {
              attributes: [],
            },
          },
        ],
      });
      return res.status(200).send({ roles });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async create(req, res) {
    /*
      #swagger.tags = ['Cargos e Permissões']
      #swagger.description = 'Endpoint para criar um novo Cargo. Nesse endpoint o usuário deve ter cargo de OWNER.'
      #swagger.parameters['obj'] = { 
          in: 'body', 
          "required":"true",
          'description':'A lista de permissões pode ser omitido na criação de um novo cargo.',
          '@schema': {
              "properties": { 
                  "description": { 
                      "type": "string",
                      "example": "financeiro" 
                  },
                  "permissions": {
                      $ref: '#/definitions/Permissions'
                  },
              } 
          } 
      } */
    try {
      const { description, permissions } = req.body;
      if (!isNaN(parseInt(description))) {
        throw new Error("A descrição não pode ser somente numeros.")
      }
      const role = await Role.create({ description });

      if (permissions && permissions.length > 0) {
        const permissionsEntity = await Permission.findAll({
          where: {
            id: permissions.map(({ permission_id }) => permission_id),
          },
        });

        if (permissionsEntity.length > 0) {
          await role.addPermissions(permissionsEntity);
        }
      }
         /* #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/ResRole" }
        } */
      return res.status(200).send({ message: "Cargo criado com sucesso." });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async addPermission(req, res) {
    /*
        #swagger.tags = ['Cargos e Permissões']
        #swagger.description = 'Endpoint para adicionar permissões um novo Cargo. Nesse endpoint o usuário deve ter cargo de OWNER.'
        #swagger.parameters['obj'] = { 
            in: 'body', 
            "required":"true",
            'description':'A lista de permissões é obrigatória e deve conter ids de permissões cadastradas previamente no sistema.<br>Caso seja enviado um uma permissão que o cargo já tenha, ela será desconsiderada, evitando duplicidade.',
            schema: {
                "permissions": {
                    $ref: '#/definitions/Permissions'
                },
            }
        } 
     */
    try {
      const { role_id } = req.params;
      const { permissions } = req.body;

      if (!permissions || permissions.lengh === 0)
        throw new Error("Permission não enviadas");

      const role = await Role.findByPk(role_id, {
        attributes: ["id", "description"],
        include: {
          association: "permissions",
          attributes: ["id", "description"],
          through: { attributes: [] },
        },
      });

      if (!role) throw new Error("Este cargo não existe.");

      const permissionsData = await Permission.findAll({
        attributes: ["id", "description"],
        where: {
          id: permissions.map((permission) => permission.permission_id),
        },
      });

      if (permissionsData.length === 0)
        throw new Error("Permission enviadas não cadastradas.");

      await role.addPermissions(permissionsData);

      /* #swagger.responses[200] = { 
                  schema: {"message": "Permissões vinculadas com sucesso."}
              } */

      return res
        .status(200)
        .send({ message: "Permissões vinculadas com sucesso." });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  }
};
