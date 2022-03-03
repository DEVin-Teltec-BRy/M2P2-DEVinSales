const Role = require("../models/Role");
const Permission = require("../models/Permission");
const { validateErrors } = require("../utils/functions");

module.exports = {
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
};
