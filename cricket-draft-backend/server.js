const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const { GameRoom } = require('./gameLogic');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

const players = require('./real_players');

const rooms = {}; // roomCode => GameRoom instance

function broadcastState(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  
  if (room.player1 && room.player1.socketId) {
    io.to(room.player1.socketId).emit('gameState', room.getState(1));
  }
  if (room.player2 && room.player2.socketId) {
    io.to(room.player2.socketId).emit('gameState', room.getState(2));
  }
}

io.on('connection', (socket) => {
  console.log('[Socket] User connected:', socket.id);

  socket.on('createRoom', ({ p1Name, settings }, callback) => {
    try {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const emitUpdate = () => broadcastState(roomCode);
      rooms[roomCode] = new GameRoom(roomCode, players, settings || {}, p1Name, socket.id, emitUpdate);
      socket.join(roomCode);
      console.log(`[Room Created] Code: ${roomCode} by ${p1Name || 'Player 1'} (${socket.id})`);
      
      if (typeof callback === 'function') {
        callback({ success: true, roomCode });
      }
      broadcastState(roomCode);
    } catch (err) {
      console.error('[Error] createRoom:', err);
      if (typeof callback === 'function') {
        callback({ success: false, message: err.message || 'Server error creating room' });
      }
    }
  });

  socket.on('joinRoom', ({ roomCode, p2Name }, callback) => {
    try {
      const formattedCode = (roomCode || '').toUpperCase().trim();
      const room = rooms[formattedCode];
      if (room) {
        const joined = room.join(p2Name, socket.id);
        if (joined) {
          socket.join(formattedCode);
          console.log(`[Room Joined] Code: ${formattedCode} by ${p2Name || 'Player 2'} (${socket.id})`);
          if (typeof callback === 'function') callback({ success: true, roomCode: formattedCode });
          broadcastState(formattedCode);
        } else {
          if (typeof callback === 'function') callback({ success: false, message: 'Room is already full or game has started.' });
        }
      } else {
        if (typeof callback === 'function') callback({ success: false, message: 'Room code not found. Please verify the code.' });
      }
    } catch (err) {
      console.error('[Error] joinRoom:', err);
      if (typeof callback === 'function') callback({ success: false, message: err.message || 'Server error joining room' });
    }
  });

  socket.on('draftPlayer', ({ roomCode, playerNum, amount }) => {
    const room = rooms[roomCode];
    if (room) {
      room.draftPlayer(playerNum, amount);
      broadcastState(roomCode);
    }
  });

  socket.on('passPlayer', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room) {
      room.passPlayer();
      broadcastState(roomCode);
    }
  });

  socket.on('placeBid', ({ roomCode, playerNum, amount }) => {
    const room = rooms[roomCode];
    if (room) {
      room.placeBid(playerNum, amount);
      broadcastState(roomCode);
    }
  });

  socket.on('passAuction', ({ roomCode, playerNum }) => {
    const room = rooms[roomCode];
    if (room) {
      room.passAuction(playerNum);
      broadcastState(roomCode);
    }
  });

  // WebRTC Signaling for Voice Chat
  socket.on('webrtc-offer', ({ roomCode, sdp }) => {
    socket.to(roomCode).emit('webrtc-offer', { sdp });
  });

  socket.on('webrtc-answer', ({ roomCode, sdp }) => {
    socket.to(roomCode).emit('webrtc-answer', { sdp });
  });

  socket.on('webrtc-ice-candidate', ({ roomCode, candidate }) => {
    socket.to(roomCode).emit('webrtc-ice-candidate', { candidate });
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] User disconnected:', socket.id, 'Reason:', reason);
    for (const [code, room] of Object.entries(rooms)) {
      if ((room.player1 && room.player1.socketId === socket.id) || 
          (room.player2 && room.player2.socketId === socket.id)) {
        io.to(code).emit('opponentDisconnected', { socketId: socket.id });
      }
    }
  });
});

// API Routes
app.get('/api/players', (req, res) => {
  res.json(players);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeRooms: Object.keys(rooms).length
  });
});

// Static assets serving (player images)
const localPlayersDir = path.join(__dirname, '../cricket-draft/public/players');
if (fs.existsSync(localPlayersDir)) {
  app.use('/players', express.static(localPlayersDir));
}

// Serve frontend production build if available
const frontendDist = path.join(__dirname, '../cricket-draft/dist');
if (fs.existsSync(frontendDist)) {
  console.log('Serving frontend from', frontendDist);
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      name: 'Cricket Draft Arena API',
      status: 'online',
      instructions: 'Connect using the Cricket Draft web client or open frontend.'
    });
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Arena Backend listening on http://0.0.0.0:${PORT}`);
});
