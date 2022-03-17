const { validateErrors } = require("../utils/functions");
const UserServices = require("../services/user.service");


module.exports = {
  async create(req, res) {
    /*
          #swagger.tags = ['Usuário']
          #swagger.description = 'Endpoint que criar um novo usuário.'
          #swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: {
              $ref: '#/definitions/AddUser'
            }
          }
          #swagger.responses[201] = {
            description: 'Created',
            schema: {
              message: 'Usuário salvo com sucesso.'
            }
          }
          #swagger.responses[403] = {
            description: 'Forbidden'
          }
        */
    try {
      const { name, password, email, birth_date, roles } = req.body;
      const user = await UserServices.createUser(
        name,
        password,
        email,
        birth_date,
        roles
      );
      /*
        #swagger.responses[201] = {
          schema: {
            response: 42
          }
        }
      */
      return res.status(201).send({ response: user.id });
    } catch (error) {
      const message = validateErrors(error);
      /*
              #swagger.responses[400] = {
                schema: {
                  $ref: '#/definitions/CreateUserResponses'
                }
              }
            */
      return res.status(400).send(message);
    }
  },
  async session(req, res) {
    /*
         #swagger.tags = ['Usuário']
         #swagger.description = 'Endpoint para login do usuário, quando email e senha são validos retorna um token.'
         #swagger.parameters['obj'] = {
           in: 'body',
           required: true,
           schema: {
             $ref: '#/definitions/UserLogin'
           }
         }
         #swagger.responses[201] = {
           description: 'Token de acesso',
           schema: {
             "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGVzIjpbeyJpZCI6Miwi___RANDOM_TOKEN___JPV05FUiJ9XSwiaWF0IjoxNjQ2ODA0MDkxLCJleHAiOjE2NDY4OTA0OTF9.OwvUy0p3BVfbicuCg9YYAk5tlPQ6UKB_bZrHt8-H_CU"
           }
         }
         #swagger.responses[400] = {
           description: 'Login não efetuado',
           schema: {
             "message": "Email ou senha inválidos"
           }
         }
       */
    try {
      const { email, password } = req.body;
      const token = await UserServices.beginSession(email, password);

      if (token.error) throw new Error(token.error);

      return res.status(201).send({ token: token });
    } catch (error) {
      const message = validateErrors(error);
      return res.status(400).send(message);
    }
  },
  async index(req, res) {
    /*
          #swagger.tags = ['Usuário']
          #swagger.description = 'Endpoint para buscar todos os usuários do banco de dados.'
          #swagger.parameters['name'] = {
            in: 'query',
            type: 'string',
            description: 'Nome de um usuário.',
            default: 'John Doe'
          }
          #swagger.parameters['birth_date_min'] = {
            in: 'query',
            type: 'string',
            description: 'Data limite inferior da consulta.',
            default: 'DD/MM/AAAA'
          }
          #swagger.parameters['birth_date_max'] = {
            in: 'query',
            type: 'string',
            description: 'Data limite superior da consulta.',
            default: 'DD/MM/AAAA'
          }
        */
    try {
      const { name, birth_date_min, birth_date_max } = req.query;

      const users = await UserServices.getUsers(
        name,
        birth_date_min,
        birth_date_max
      );
      if (users.error) {
        throw new Error(users.error);
      }

      if (users.length === 0) {
        return res.status(204).send();
      }
      /*
        #swagger.responses[200] = {
        schema: {
          $ref: '#/definitions/UserInfo'
        }
      }
      */

      return res.status(200).send({ users });
    } catch (error) {
      const message = validateErrors(error);
      /*
       #swagger.responses[400] = {
       schema: {
         message: 'Informe uma data em um formato válido dd/mm/yyyy'
       }
     }
     */

      return res.status(400).send(message);
    }
  },
  async delete(req, res) {
    // #swagger.tags = ['Usuário']
    // #swagger.description = 'Endpoint para deletar um usuário.'
    /*
      #swagger.parameters['user_id'] = {
        in: 'path',
        type: 'integer',
        required: true
      }
      #swagger.responses[200] = {
        schema: {
          message: 'Usuario deletado com sucesso'
        }
      }
      #swagger.responses[400] = {
        schema: {
          error: 'Formato de id invalido!'
        }
      }
      #swagger.responses[403] = {
        schema: {
          message: 'Você não tem autorização para este recurso.'
        }
      }
      #swagger.responses[404] = {
        schema: {
          message: 'Não se encontrou nenhum usuario como o id informado '
        }
      }
    */
    try {
      const { user_id } = req.params;

      const message = await UserServices.deleteUser(user_id);

      if (message.error) {
        throw new Error(message.error);
      }

      return res.status(200).json({ message });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
