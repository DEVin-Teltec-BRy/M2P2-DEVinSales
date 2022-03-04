require("dotenv").config();
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const nodeEnv = process.env.NODE_ENV;

const User = require("../models/User");
const Permission = require("../models/Permission");
const Role = require("../models/Role");
const sale = require("../models/sale");
const Product = require("../models/Product");
const ProductsSales = require("../models/ProductsSales");

const connection = new Sequelize(dbConfig[nodeEnv]);
/**
 * inicialização dos models
 * todos os models devem ser iniciados passando a connection
 */
User.init(connection);
Role.init(connection);
Permission.init(connection);
sale.init(connection);
Product.init(connection);
ProductsSales.init(connection);

/**
 * Associação dos models
 * Somente os models com associações devem ser chamados abaixo
 */
User.associate(connection.models);
Role.associate(connection.models);
Permission.associate(connection.models);
sale.associate(connection.models);
ProductsSales.associate(connection.models);

//Product.associate(connection.models)
module.exports = connection;
