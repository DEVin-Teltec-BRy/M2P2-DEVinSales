const Role = require("../models/Role");
const Permission = require("../models/Permission");
const { validateErrors } = require("../utils/functions");

module.exports = {
    async index(req, res) {
        try {
            const roles = await Role.findAll({
                attributes: ['id', 'description'],
                include: [
                    {
                        association: 'users',
                        attributes: ['id', 'name', 'email', 'birth_date'],
                        through: {
                            attributes:[]
                        }
                    },
                    {
                        association: 'permissions',
                        attributes: ['id', 'description'],
                        through: {
                            attributes:[]
                        }
                    }
                ]
            });
            return res.status(200).send({ roles});

        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message);
        }
    },
    async create(req, res) {
        try {
            const { description, permissions } = req.body;
            const role = await Role.create({ description });
            if (permissions && permissions.lengh > 0) {
                const permissionsEntity = await Permission.findAll({
                    where: {
                        id: permissions,
                    },
                });
                if (permissionsEntity.lengh > 0) {
                    await role.setPermission(permissionsEntity);
                }
            }
            return res
                .status(200)
                .send({ message: "Cargo criado com sucesso." });
        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message);
        }
    },
    async addPermissions(req, res){
        try {
            const { role_id } = req.params
            const { permissions } = req.body

            if(!permissions || permissions.lengh === 0) throw new Error("Permission não enviadas") 

            const role = await Role.findByPk(role_id, {
                attributes: ['id', 'description'],
                include:{
                    association: 'permissions',
                    attributes: ['id', 'description'],
                    through: {attributes:[]}
                }
            })
            
            if(!role) throw new Error("Este cargo não existe.")

            const permissionsData = await Permission.findAll({
                attributes:['id', 'description'],
                where: {
                    id: permissions.map(permission => permission.permission_id)
                }
            })
            
            if(permissionsData.length === 0 ) throw new Error("Permission enviadas não cadastradas.")

            await role.addPermissions(permissionsData)

            return res.status(200).send({ message: "Permissões vinculadas com sucesso."});
        } catch (error) {
            const message = validateErrors(error);
            return res.status(400).send(message);
        }
    }
};
