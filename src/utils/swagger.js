const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API | DevinSales',
        description: 'Estas é a documentação para as desenvolvedores que utilizaram nossa API.',
    },
    host: 'localhost:3333',
    schemes: ['http'],
};

const outputFile = './src/swagger.json';
const endpointsFiles = ['./src/routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);