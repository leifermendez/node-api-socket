var ioGlobal

const listenSocket = (io) => io.on('connection', (socket) => {
    ioGlobal = io;
    socket.join('global');
    console.log('Join');


})

const pushSocket = (data) => {
    ioGlobal.to('global').emit('data', data);
}

module.exports = { listenSocket, pushSocket }