require("dotenv").config();
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const nodeEnv = process.env.NODE_ENV;
const connection = new Sequelize(dbConfig[nodeEnv]);

<<<<<<< HEAD
const User = require("../models/User");
const Permission = require("../models/Permission");
const Role = require("../models/Role");
const Sale = require("../models/Sale");
const State = require("../models/State");
=======
const User = require('../models/User')
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const Sale = require('../models/Sale');
const Deliveries = require('../models/Deliveries');
const Product = require("../models/Product");
const State = require("../models/State");
const ProductsSales = require("../models/ProductsSales");
>>>>>>> TryCatch---Endpoint-POST-Deliveries
const City = require("../models/City");
const Product = require("../models/Product");
const Address = require("../models/Address");
<<<<<<< HEAD
const ProductsSales = require("../models/ProductsSales");

//   inicialização dos models
//   todos os models devem ser iniciados passando a connection

User.init(connection);
Role.init(connection);
Permission.init(connection);
Sale.init(connection);
State.init(connection);
=======

const connection = new Sequelize(dbConfig[nodeEnv]);
/**
 * inicialização dos models
 * todos os models devem ser iniciados passando a connection
 */
User.init(connection)
Role.init(connection)
Permission.init(connection)
Sale.init(connection)
Deliveries.init(connection)
Product.init(connection);
State.init(connection);
ProductsSales.init(connection);
>>>>>>> TryCatch---Endpoint-POST-Deliveries
City.init(connection);
Product.init(connection);
Address.init(connection);
ProductsSales.init(connection);

<<<<<<< HEAD
//   Associação dos models
//   Somente os models com associações devem ser chamados abaixo

User.associate(connection.models);
Role.associate(connection.models);
Permission.associate(connection.models);
=======

/**
 * Associação dos models
 * Somente os models com associações devem ser chamados abaixo
 */
User.associate(connection.models)
Role.associate(connection.models)
Permission.associate(connection.models)
Deliveries.associate(connection.models)
>>>>>>> TryCatch---Endpoint-POST-Deliveries
Sale.associate(connection.models);
Address.associate(connection.models);
// Product.associate(connection.models);
City.associate(connection.models);
ProductsSales.associate(connection.models);

module.exports = connection;
