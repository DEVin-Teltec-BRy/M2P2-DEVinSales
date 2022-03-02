'use strict';
const PERMISSIONS = require('../../utils/constants/permissions')
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('permissions', 
    [
      {
        id: PERMISSIONS.READ_ID,
        description: PERMISSIONS.READ,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: PERMISSIONS.WRITE_ID,
        description: PERMISSIONS.WRITE,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: PERMISSIONS.UPDATE_ID,
        description: PERMISSIONS.UPDATE,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: PERMISSIONS.DELETE_ID,
        description: PERMISSIONS.DELETE,
        created_at: new Date(),
        updated_at: new Date(),
      },


    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permissions", null, {});
  }
};
