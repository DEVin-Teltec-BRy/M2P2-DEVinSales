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
    AddUser: {
      name: 'John Doe',
      password: '12345',
      email: 'john.doe@email.com',
      birth_date: '01/01/1990',
      roles: [{role_id: 1}]
    },
    UserLogin: {
      name: "JohnDoe",
      password: "12345"
    },
    UserInfo: {
      user: [{
        id: 42,
        name: "John Doe",
        email: "john.doe@email.com",
        birth_date: "01/01/1990"
      }]
    }
  }
};

const outputFile = "./src/swagger.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc)
