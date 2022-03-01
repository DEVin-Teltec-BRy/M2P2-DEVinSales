const express = require('express')
const app = express()
const PORT = process.env.PORT || 3333
const routes = require('./routes')
require('./database')

app.use(express.json())
app.use(routes)
app.listen(PORT, () => console.log(`Executando na porta ${PORT}`))