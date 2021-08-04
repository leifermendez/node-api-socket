require('dotenv').config()
const epxress = require('express')
const cors = require('cors')
const app = epxress()
const server = require('http').Server(app)
const { dbConnect } = require('./config/mongo')
const { listenSocket } = require('./app/services/socket')
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://192.168.1.138:4200', 'http://localhost:4200', 'https://priceless-minsky-3d4147.netlify.app']
    }
})

listenSocket(io)
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(epxress.json())

app.use('/api/1.0', require('./app/routes'))

dbConnect()
server.listen(PORT, () => {
    console.log('API lista por el puerto ', PORT)
})