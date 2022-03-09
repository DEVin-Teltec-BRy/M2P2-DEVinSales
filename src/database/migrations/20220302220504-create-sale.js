'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users', 
          },
          key: 'id'
        },
      
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
      },
      dt_sale: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales');
  }
};