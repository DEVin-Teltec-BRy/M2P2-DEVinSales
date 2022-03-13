'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'addresses',
      [
        {
          city_id: 1,
          street: 'Rio Branco',
          number: 23,
          complement: 'Largo do Machado',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city_id: 40,
          street: 'AV. Jaguará',
          number: 25,
          complement: 'Praça da Matriz',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city_id: 2,
          street: 'Rio Branco',
          number: 27,
          complement: 'Praça da Matriz',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city_id: 1,
          street: 'Rio Branco',
          number: 25,
          complement: 'Largo do Machado',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city_id: 1,
          street: 'Rio Branco',
          number: 27,
          complement: 'Largo do Machado',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city_id: 1,
          street: 'Avendia Brasil',
          number: 25,
          complement: 'Largo do Machado',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          city_id: 1,
          street: 'Rio Branco',
          number: 33,
          complement: 'Largo do Machado',
          cep: '70.000.00',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('addresses', null, {});
  },
};
