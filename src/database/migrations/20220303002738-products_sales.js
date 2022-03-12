"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products_sales", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sale_id: {
        type: Sequelize.INTEGER,
        references: { model: "sales", key: "id" },
        onUpdate: "CASCADE",
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products_sales");
  },
};
