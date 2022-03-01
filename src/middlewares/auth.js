const { verify } = require('jsonwebtoken')
const Permission = require('../models/Permission')
const PermissionRole = require('../models/PermissionRole')
const Role = require('../models/Role')

async function auth(req){
    const { authorization } = req.headers

    try {
        if(!authorization){
            throw Error
        }

        const user = verify(authorization, process.env.SECRET)
        
        return user

    } catch (error) {
        return { message: "Você não tem autorização para este recurso." }
    }
}

function can(permissions){
    return async (req, res, next) => {
        const user = await auth(req, res)
        if(user.message){
            return res.status(401).send({message: user.message})
        }

        const roles = await Role.findAll({
            where: {
                id: user.roles.map((role)=>role.role_id)
            }, 
            attributes: ['description'],
            include: {
                model: PermissionRole,
                attributes: ['permission_id'],
                include: [{
                    model: Permission
                }]
            }
        })

        const permissionsInRoles = []
        roles.forEach((role)=> {
            role.permissions_roles.forEach((item)=>{
                permissionsInRoles.push({description: item.permission.description})
            })
        })
        
        const existPermission = permissionsInRoles.some(({description}) => 
            permissions.includes(description)
        )
        if(!existPermission){
            return res.status(401).send({message: "Você não tem autorização para este recurso."})
        }
        next()
    }
}

module.exports = {
    can
}