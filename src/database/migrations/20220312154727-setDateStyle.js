'use strict';
const dbconfig = require('../../config/database');
const sequelize = require('../');

module.exports = {
  async up(queryInterface, Sequelize) {
    await sequelize.query(
      `ALTER DATABASE ${
        dbconfig[process.env.NODE_ENV].database
      } SET datestyle TO "ISO, DMY"`
    );
  },

  async down(queryInterface, Sequelize) {
    await sequelize.query(
      `ALTER DATABASE ${
        dbconfig[process.env.NODE_ENV].database
      } SET datestyle TO "ISO, MDY"`
    );
  },
};
