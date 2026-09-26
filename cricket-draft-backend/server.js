const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { GameRoom } = require('./gameLogic');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const players = [
  {
    "id": 1,
    "name": "Rohit Sharma",
    "role": "Batter",
    "country": "IND",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg/500px-Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 2,
    "name": "Virat Kohli",
    "role": "Batter",
    "country": "IND",
    "price": 8,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg/500px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 3,
    "name": "Jasprit Bumrah",
    "role": "Bowler",
    "country": "IND",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Jasprit_Bumrah_in_PMO_New_Delhi.jpg/500px-Jasprit_Bumrah_in_PMO_New_Delhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 4,
    "name": "Rishabh Pant",
    "role": "Wicket Keeper",
    "country": "IND",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Rishabh_Pant.jpg/500px-Rishabh_Pant.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 5,
    "name": "KL Rahul",
    "role": "Batter",
    "country": "IND",
    "price": 5,
    "image": "https://upload.wikimedia.org/wikipedia/commons/6/69/KL_Rahul_at_Femina_Miss_India_2018_Grand_Finale_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    "id": 6,
    "name": "Hardik Pandya",
    "role": "All Rounder",
    "country": "IND",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Hardik_Pandya_in_PMO_New_Delhi.jpg/500px-Hardik_Pandya_in_PMO_New_Delhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 7,
    "name": "Ravindra Jadeja",
    "role": "All Rounder",
    "country": "IND",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/PM_Shri_Narendra_Modi_with_Ravindra_Jadeja_%28Cropped%29.jpg/500px-PM_Shri_Narendra_Modi_with_Ravindra_Jadeja_%28Cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 8,
    "name": "Kuldeep Yadav",
    "role": "Bowler",
    "country": "IND",
    "price": 4,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Kuldeep_Yadav_in_PMO_New_Delhi.jpg/500px-Kuldeep_Yadav_in_PMO_New_Delhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 9,
    "name": "Mohammed Siraj",
    "role": "Bowler",
    "country": "IND",
    "price": 4,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Mohammad_Siraj_%28cropped%29.jpg/500px-Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Mohammad_Siraj_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 10,
    "name": "Shubman Gill",
    "role": "Batter",
    "country": "IND",
    "price": 6,
    "image": "https://upload.wikimedia.org/wikipedia/commons/3/34/Shubman_Gill_2023_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    "id": 11,
    "name": "Pat Cummins",
    "role": "Bowler",
    "country": "AUS",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Pat_Cummins_fielding_Ashes_2021_%28cropped%29.jpg/500px-Pat_Cummins_fielding_Ashes_2021_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 12,
    "name": "Mitchell Starc",
    "role": "Bowler",
    "country": "AUS",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Mitchell_Starc_2023.jpg/500px-Mitchell_Starc_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 13,
    "name": "Steve Smith",
    "role": "Batter",
    "country": "AUS",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/STEVE_SMITH_%2811705303043%29.jpg/500px-STEVE_SMITH_%2811705303043%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 14,
    "name": "David Warner",
    "role": "Batter",
    "country": "AUS",
    "price": 5,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/DAVID_WARNER_%2811704782453%29.jpg/500px-DAVID_WARNER_%2811704782453%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 15,
    "name": "Glenn Maxwell",
    "role": "All Rounder",
    "country": "AUS",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Glen_Maxwell_2026_%28cropped%29.jpg/500px-Glen_Maxwell_2026_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 16,
    "name": "Kane Williamson",
    "role": "Batter",
    "country": "NZ",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Kane_Williamson_in_2019.jpg/500px-Kane_Williamson_in_2019.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 17,
    "name": "Trent Boult",
    "role": "Bowler",
    "country": "NZ",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2018.02.03.22.23.14-AUSvNZL_T20_AUS_innings%2C_SCG_%2839533156665%29.jpg/500px-2018.02.03.22.23.14-AUSvNZL_T20_AUS_innings%2C_SCG_%2839533156665%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 18,
    "name": "Rachin Ravindra",
    "role": "All Rounder",
    "country": "NZ",
    "price": 5,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Rachin_Ravindra.jpg/500px-Rachin_Ravindra.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 19,
    "name": "Ben Stokes",
    "role": "All Rounder",
    "country": "ENG",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/3_14_Captain_Ben_%28cropped%29_%28cropped%29.jpg/500px-3_14_Captain_Ben_%28cropped%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 20,
    "name": "Jos Buttler",
    "role": "Wicket Keeper",
    "country": "ENG",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Jos_Buttler_in_2023.jpg/500px-Jos_Buttler_in_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 21,
    "name": "Joe Root",
    "role": "Batter",
    "country": "ENG",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/2_05_Root_hundred.jpg/500px-2_05_Root_hundred.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 22,
    "name": "Jofra Archer",
    "role": "Bowler",
    "country": "ENG",
    "price": 6,
    "image": "https://upload.wikimedia.org/wikipedia/commons/d/de/Jofra_Archer_%283%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    "id": 23,
    "name": "Babar Azam",
    "role": "Batter",
    "country": "PAK",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Babar_azam_2023.jpg/500px-Babar_azam_2023.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 24,
    "name": "Shaheen Afridi",
    "role": "Bowler",
    "country": "PAK",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Shaheen_Afridi_jogging_Sri_Lanka_vs_Pakistan_-_2nd_TEST_Match_-_SSC%2C_Colombo_%28cropped%29.jpg/500px-Shaheen_Afridi_jogging_Sri_Lanka_vs_Pakistan_-_2nd_TEST_Match_-_SSC%2C_Colombo_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 25,
    "name": "Mohammad Rizwan",
    "role": "Wicket Keeper",
    "country": "PAK",
    "price": 5,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/M_Rizwan.jpg/500px-M_Rizwan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 26,
    "name": "Rashid Khan",
    "role": "Bowler",
    "country": "AFG",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Rashid_Khan.jpg/500px-Rashid_Khan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 27,
    "name": "Kagiso Rabada",
    "role": "Bowler",
    "country": "SA",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Kingdom_Kome_co-founders_Kagiso_Rabada_and_Cameron_Scott_at_the_first_private_screening_of_The_Ring_of_Beasts_%28cropped%29.jpg/500px-Kingdom_Kome_co-founders_Kagiso_Rabada_and_Cameron_Scott_at_the_first_private_screening_of_The_Ring_of_Beasts_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 28,
    "name": "Quinton de Kock",
    "role": "Wicket Keeper",
    "country": "SA",
    "price": 6,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/QUINTON_DE_KOCK_%2815681398316%29.jpg/500px-QUINTON_DE_KOCK_%2815681398316%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 29,
    "name": "Heinrich Klaasen",
    "role": "Wicket Keeper",
    "country": "SA",
    "price": 5,
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  },
  {
    "id": 30,
    "name": "Suryakumar Yadav",
    "role": "Batter",
    "country": "IND",
    "price": 7,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Suryakumar_Yadav_in_PMO_New_Delhi.jpg/500px-Suryakumar_Yadav_in_PMO_New_Delhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 31,
    "name": "Marco Jansen",
    "role": "All Rounder",
    "country": "SA",
    "price": 5,
    "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Marco_Jansen_2022.jpg/500px-Marco_Jansen_2022.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    "id": 32,
    "name": "Nicholas Pooran",
    "role": "Wicket Keeper",
    "country": "WI",
    "price": 6,
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  }
];

const rooms = {}; // roomCode => GameRoom instance

function broadcastState(roomCode) {
  const room = rooms[roomCode];
  if (!room) return;
  
  if (room.player1.socketId) {
    io.to(room.player1.socketId).emit('gameState', room.getState(1));
  }
  if (room.player2.socketId) {
    io.to(room.player2.socketId).emit('gameState', room.getState(2));
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', ({ p1Name, settings }, callback) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomCode] = new GameRoom(roomCode, players, settings, p1Name, socket.id);
    socket.join(roomCode);
    callback({ success: true, roomCode });
    broadcastState(roomCode);
  });

  socket.on('joinRoom', ({ roomCode, p2Name }, callback) => {
    const room = rooms[roomCode];
    if (room) {
      const joined = room.join(p2Name, socket.id);
      if (joined) {
        socket.join(roomCode);
        callback({ success: true });
        broadcastState(roomCode);
      } else {
        callback({ success: false, message: 'Room is already full or game has started.' });
      }
    } else {
      callback({ success: false, message: 'Room not found.' });
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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Handle disconnection if necessary (e.g., notify opponent)
  });
});

app.get('/api/players', (req, res) => {
  res.json(players);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server with Socket.io running on port ${PORT}`);
});
