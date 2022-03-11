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
    AddProduct: {
      name: "MacBook Air",
      suggested_price: 7999.99,
    },
    ResProduct: {
      nome: "MacBook Air",
      preço_sugerido: 7999.99,
    },
    GetProduct: {
      Products: [
        {
          id: 2,
          name: "MacBook Pro",
          suggested_price: 10999.99,
        },
      ],
    },
  },
};

const outputFile = "./src/swagger.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
