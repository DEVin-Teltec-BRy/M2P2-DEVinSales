const User = require('../models/User')
const { sign } = require('jsonwebtoken')
const { Op } = require('sequelize')
const UserRole = require('../models/UserRole')
const bcrypt = require('bcrypt')
const Role = require('../models/Role')
const { validateErrors } = require('../utils/functions')

module.exports = {
  async create(req, res) {
    try {
      const { name, password, email, roles } = req.body;
      await User.create({
        name,
        password,
        email,
        users_roles: roles
      }, {
        include: {
          model: UserRole,
          attributes: ['role_id'],
          include: [{
            model: Role
          }]
        }
      })

      return res.status(201).send({ message: 'Usuário salvo com sucesso.' })

    } catch (error) {
      const message = validateErrors(error)

      return res.status(400).send(message)
    }
  },

  async session(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        attributes: ['id', 'email', 'password'],
        where: {
          email: {
            [Op.eq]: email
          }
        },
        include: {
          model: UserRole,
          attributes: ['role_id'],
          include: [{
            attributes: ['description', 'id'],
            model: Role
          }]
        }
      })

      const existPassword = user ? user.password : ''
      const match = await bcrypt.compareSync(password, existPassword)
      
      // if (!match) {
      //   const message = validateErrors({ message: 'Email ou senha inválidos' })
      //   return res.status(400).send(message)
      // }
      const token = sign({ userId: user.id, roles: user.users_roles }, process.env.SECRET, {
        expiresIn: '1d'
      })

      return res.status(201).send({ token: token })

    } catch (error) {
      const message = validateErrors(error)
      return res.status(400).send(message)
    }
  }
}
