'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'deliveries',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },       
        address_id: {
          type: Sequelize.INTEGER,
          references: {model: 'addresses', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        sale_id: {
          type: Sequelize.INTEGER,
          references: {model: {
            tableName: 'sales',
          }, key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        delivery_forecast: {
          type: Sequelize.DATE,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('deliveries');
  }
};
