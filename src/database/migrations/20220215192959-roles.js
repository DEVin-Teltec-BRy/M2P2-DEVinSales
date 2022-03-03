'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'roles',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
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
    await queryInterface.dropTable('roles');
  }
};
