"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "states",
      [
        {
          name: "Acre",
          initials: "AC",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Alagoas",
          initials: "AL",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Amazonas",
          initials: "AM",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Amapá",
          initials: "AP",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Bahia",
          initials: "BA",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ceará",
          initials: "CE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Distrito Federal",
          initials: "DF",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Espírito Santo",
          initials: "ES",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Goiás",
          initials: "GO",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Maranhão",
          initials: "MA",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Minas Gerais",
          initials: "MG",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Mato Grosso do Sul",
          initials: "MS",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Mato Grosso",
          initials: "MT",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Pará",
          initials: "PA",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Paraíba",
          initials: "PB",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Pernambuco",
          initials: "PE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Piauí",
          initials: "PI",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Paraná",
          initials: "PR",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Rio de Janeiro",
          initials: "RJ",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Rio Grande do Norte",
          initials: "RN",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Rondônia",
          initials: "RO",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Roraima",
          initials: "RR",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Rio Grande do Sul",
          initials: "RS",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Santa Catarina",
          initials: "SC",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Sergipe",
          initials: "SE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "São Paulo",
          initials: "SP",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Tocantins",
          initials: "TO",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("states", null, {});
  },
};
