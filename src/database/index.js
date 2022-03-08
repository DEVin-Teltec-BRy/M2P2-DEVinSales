require('dotenv').config();
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const nodeEnv = process.env.NODE_ENV;
const connection = new Sequelize(dbConfig[nodeEnv])

const User = require('../models/User');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Address = require('../models/Address');



//   inicialização dos models
//   todos os models devem ser iniciados passando a connection


User.init(connection)
Role.init(connection)
Permission.init(connection)
Sale.init(connection)
Product.init(connection)
Address.init(connection)

//   Associação dos models
//   Somente os models com associações devem ser chamados abaixo

User.associate(connection.models)
Role.associate(connection.models)
Permission.associate(connection.models)
Sale.associate(connection.models)
// Address.associate(connection.models)


module.exports = connection
