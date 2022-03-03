'use strict';
const USERS = require('../../utils/constants/users')
const ROLES = require('../../utils/constants/roles')

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('users_roles', [
      {
        user_id: USERS.User1.id,
        role_id: ROLES.HELPER_ID,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: USERS.User2.id,
        role_id: ROLES.HELPER_ID,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: USERS.User3.id,
        role_id: ROLES.HELPER_ID,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: USERS.User4.id,
        role_id: ROLES.OWNER_ID,
        created_at: new Date(),
        updated_at: new Date()
      }
    
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_roles', null, {});
  }
};
