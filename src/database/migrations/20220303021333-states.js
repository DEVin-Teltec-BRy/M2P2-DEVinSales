'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'states',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        initials: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
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
    await queryInterface.dropTable('states');
  }
};
