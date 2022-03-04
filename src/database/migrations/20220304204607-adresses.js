'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'adresses',
      { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        street: {
          type: Sequelize.STRING,
          allowNull: false
        },
        number: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        complement: {
          type: Sequelize.STRING,
          allowNull: false
        },
        cep: {
          type: Sequelize.STRING,
          allowNull: false
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('adresses')
  }
};
