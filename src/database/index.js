require('dotenv').config();
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const nodeEnv = process.env.NODE_ENV

const User = require('../models/User')

const connection = new Sequelize(dbConfig[nodeEnv])
/**
 * inicialização dos models
 * todos os models devem ser iniciados passando a connection
 */
User.init(connection)
Role.init(connection)
Permission.init(connection)

/**
 * Associação dos models
 * Somente os models com associações devem ser chamados abaixo
 */
User.associate(connection.models)
Role.associate(connection.models)
Permission.associate(connection.models)

module.exports = connection
