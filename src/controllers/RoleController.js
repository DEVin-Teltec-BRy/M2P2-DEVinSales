const Role = require('../models/Role');
const PermissionRole = require('../models/PermissionRole');
const Permission = require('../models/Permission');
const { validateErrors } = require('../utils/functions');

module.exports = {
    async create(req, res){
        try {
            const { description, permissions } = req.body
            await Role.create({
                description,
                permissions_roles: permissions
              }, {
                include: {
                  model: PermissionRole,
                  include: [{
                    model: Permission
                  }]
                }
              })

            return res.status(200).send({message: 'Cargo criado com sucesso.'})
        } catch (error) {
            const message = validateErrors(error)
            return res.status(400).send(message)
        }
    }
}