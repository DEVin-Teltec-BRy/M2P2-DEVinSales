'use strict';
const PERMISSIONS = require('../../utils/constants/permissions')
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('permissions', 
    [
      {
        description: PERMISSIONS.READ,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: PERMISSIONS.WRITE,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        description: PERMISSIONS.UPDATE,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
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
