const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API | DevinSales",
    description:
      "Estas é a documentação para as desenvolvedores que utilizaram nossa API.",
  },
  host: "localhost:3333",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "authorization",
      in: "header",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  definitions: {

    address: {
      street: "Rua Paralelepípedo",
      number: 10,
      complement: "Apto 1",
      cep: "12345678",
    },

  },
};

const outputFile = "./src/swagger.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
