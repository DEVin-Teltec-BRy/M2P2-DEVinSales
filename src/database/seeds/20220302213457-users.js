"use strict";
const USERS = require('../../utils/constants/users')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      USERS.User1,
      USERS.User2,
      USERS.User3,
      USERS.User4,
      USERS.User5,
    ], {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});
  
  },
};
