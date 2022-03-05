"use strict";
const ROLE = require("../../utils/constants/roles");
const PERMISSIONS = require("../../utils/constants/permissions");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "permissions_roles",
      [
        {
          role_id: ROLE.HELPER_ID,
          permission_id: PERMISSIONS.READ_ID,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: ROLE.HELPER_ID,
          permission_id: PERMISSIONS.DELETE_ID,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: ROLE.OWNER_ID,
          permission_id: PERMISSIONS.READ_ID,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: ROLE.OWNER_ID,
          permission_id: PERMISSIONS.WRITE_ID,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: ROLE.OWNER_ID,
          permission_id: PERMISSIONS.UPDATE_ID,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: ROLE.OWNER_ID,
          permission_id: PERMISSIONS.DELETE_ID,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions_roles", null, {});
  },
};
