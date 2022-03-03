'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'product_sales',
      {
        id: { 
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        unit_price: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('product_sales'); 
  }
};
