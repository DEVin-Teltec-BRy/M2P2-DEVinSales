'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'adress',
      { 
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        street: {
          type: Datatypes.STRING,
          allowNull: false
      },
      number: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      complement: {
          type: DataTypes.STRING,
          allowNull: false
      },
      cep: {
          type: DataTypes.STRING,
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
    await queryInterface.dropTable('adress')
  }
};
