require("dotenv").config();
const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const nodeEnv = process.env.NODE_ENV;

const User = require("../models/User");
const Permission = require("../models/Permission");
const Role = require("../models/Role");
const Sale = require("../models/Sale");
const Deliveries = require("../models/Deliveries");
const Product = require("../models/Product");
const State = require("../models/State");
const ProductsSales = require("../models/ProductsSales");
const City = require("../models/City");
const Address = require("../models/Address");

const connection = new Sequelize(dbConfig[nodeEnv]);

User.init(connection);
Role.init(connection);
Permission.init(connection);
Sale.init(connection);
Deliveries.init(connection);
Product.init(connection);
State.init(connection);
ProductsSales.init(connection);
City.init(connection);
Address.init(connection);


User.associate(connection.models);
Role.associate(connection.models);
Permission.associate(connection.models);
Deliveries.associate(connection.models);
Sale.associate(connection.models);
Product.associate(connection.models);
City.associate(connection.models);
Address.associate(connection.models);
ProductsSales.associate(connection.models);

module.exports = connection;
