const express = require('express')
const app = express()
const PORT = process.env.PORT || 3333
const routes = require('./routes')
require('./database')
const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')

app.use(express.json())
app.use(routes)
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile))
console.log(
  "token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGVzIjpbeyJpZCI6MiwiZGVzY3JpcHRpb24iOiJPV05FUiJ9XSwiaWF0IjoxNjQ2Nzc4MTc5LCJleHAiOjE2NTUzMzE3Nzl9.JQpNfgM7gQ_9gRWgLLxXkqnW99yU-me0QfjWeDibUI4"
);

app.listen(PORT, () => console.log(`Executando na porta ${PORT}`))