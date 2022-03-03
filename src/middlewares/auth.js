const { verify } = require('jsonwebtoken')
const Role = require('../models/Role')

async function auth(req){
    const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw Error;
    }
    const user = verify(authorization, process.env.SECRET);
    return user;
  } catch (error) {
    return { message: "Você não tem autorização para este recurso." };
  }
}

function onlyCanAccessWith(permissionsCanAccess) {
  return async (req, res, next) => {
    const user = await auth(req, res);
    if (user.message) {
      return res.status(401).send({ message: user.message });
    }
    const roles = await Role.findAll({
      where: {
        id: user.roles.map((role) => role.id),
      },
      include: [{ 
          association: "permissions",
          required: false,
          attributes: ['description'],
          through: {
              attributes: []
          }
        }],
    });
    const permissionsUser = roles.filter(role => {
        return role.permissions.length > 0
    })
    console.log(permissionsUser[0].description)
    let existPermission = false
    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
          if(!existPermission) {
              existPermission =  permissionsCanAccess.includes(permission.description)
          }
      });
    });
    if (!existPermission) {
      return res
        .status(401)
        .send({ message: "Você não tem autorização para este recurso." });
    }
    next();
  };
}

module.exports = {
    onlyCanAccessWith,
};
