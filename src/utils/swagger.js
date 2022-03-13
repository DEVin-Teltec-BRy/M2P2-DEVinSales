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
    Permissions: [
      {
        permission_id: 1,
      },
    ],
    AddRole: {
      description: "Financeiro",
    },
    AddPermission: {
      description: "WRITE",
    },
    AddProduct: {
      name: "MacBook Air",
      suggested_price: 7999.99,
    },
    ResProduct: {
      nome: "MacBook Air",
      preço_sugerido: 7999.99,
    },
    ResRole: {
      message: "Cargo criado com sucesso."
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
    PutProduct: {
      name: "Ipad Air",
      suggested_price: 4999.99,
    },
    PatchProduct: {
      suggested_price: 3999.99,
    },
  },
};

const outputFile = "./src/swagger.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc)
