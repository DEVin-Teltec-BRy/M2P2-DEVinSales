require('dotenv').config();
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const nodeEnv = process.env.NODE_ENV

const connection = new Sequelize(dbConfig[nodeEnv])

module.exports = connection
