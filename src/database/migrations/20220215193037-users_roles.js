'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users_roles', 
      {
        user_id: {
          type: Sequelize.INTEGER,
          references: {model: 'users', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete:'CASCADE',
          allowNull: false
        },
        role_id: {
          type: Sequelize.INTEGER,
          references: {model: 'roles', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users_roles');
  }
};
