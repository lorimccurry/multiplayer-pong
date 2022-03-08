let readyPlayerCount = 0;

function listen(io) {
  const pongNamespace = io.of('/pong');
  pongNamespace.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    let room;

    socket.on('ready', () => {
      room = 'room' + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log('Player ready', socket.id, room);
      readyPlayerCount++;

      // 2nd player will always be the referee
      // we emit that to all players
      if (readyPlayerCount % 2 === 0) {
        pongNamespace.in(room).emit('startGame', socket.id);
      }
    });

    socket.on('paddleMove', (paddleData) => {
      pongNamespace.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
      pongNamespace.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client with ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
