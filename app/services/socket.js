var ioGlobal

const listenSocket = (io) => io.on('connection', (socket) => {
    ioGlobal = io;
    socket.join('global');
    console.log('Join');


})

const pushSocket = (data) => {
    try {
        ioGlobal.to('global').emit('data', data);
    } catch (e) {
        return null
    }
}

module.exports = { listenSocket, pushSocket }