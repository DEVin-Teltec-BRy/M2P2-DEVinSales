"use strict";

const ROLE = require("../../utils/constants/roles");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          description: ROLE.HELPER,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: ROLE.OWNER,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
