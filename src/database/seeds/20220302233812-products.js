'use strict';
const PRODUCTS = require('../../utils/constants/products')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', 
    [
      PRODUCTS.Product1,
      PRODUCTS.Product2,
      PRODUCTS.Product3,
      PRODUCTS.Product4,
      PRODUCTS.Product5,
      PRODUCTS.Product6,
      PRODUCTS.Product7,
      PRODUCTS.Product8,
      PRODUCTS.Product9,
      PRODUCTS.Product10

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
