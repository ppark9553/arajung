var io = require('socket.io').listen(9000)
var pg = require ('pg')

var con_string = 'tcp://arajung:realtimegogo!@108.160.128.83/arajung'

var pg_client = new pg.Client(con_string)
pg_client.connect()
var query = pg_client.query('LISTEN addedrecord')

io.sockets.on('connection', function (socket) {
    socket.emit('connected', { connected: true })

    socket.on('ready for data', function (data) {
        pg_client.on('notification', function(title) {
            socket.emit('update', { message: title })
        })
    })
})
