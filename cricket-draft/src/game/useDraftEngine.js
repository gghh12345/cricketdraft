import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const socket = io(BACKEND_URL);

export function useDraftEngine() {
  const [gamePhase, setGamePhase] = useState('START'); // START, WAITING_FOR_OPPONENT, DRAFTING, RESULT
  const [roomCode, setRoomCode] = useState(null);
  const [myPlayerNum, setMyPlayerNum] = useState(1);
  const [settings, setSettings] = useState({ squadSize: 5, gameMode: 'AUCTION' });
  
  const [player1, setPlayer1] = useState({ name: 'Player 1', budget: 20, squad: [] });
  const [player2, setPlayer2] = useState({ name: 'Player 2', budget: 20, squad: [] });
  
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [auctionState, setAuctionState] = useState({
    currentBid: 0,
    highestBidder: null,
    biddingActive: false,
    startingBidder: 1,
    currentTurn: 1,
    firstPassBy: null
  });
  const [draftHistory, setDraftHistory] = useState([]);

  useEffect(() => {
    socket.on('gameState', (state) => {
      if (state.gamePhase === 'WAITING') {
        setGamePhase('WAITING_FOR_OPPONENT');
      } else {
        setGamePhase(state.gamePhase);
      }
      setSettings(state.settings);
      setPlayer1(state.player1);
      setPlayer2(state.player2);
      setCurrentPlayer(state.currentPlayer);
      setAuctionState(state.auctionState);
      setDraftHistory(state.draftHistory);
      
      if (state.myPlayerNum) {
        setMyPlayerNum(state.myPlayerNum);
      }
    });

    return () => {
      socket.off('gameState');
    };
  }, []);

  const startGame = (p1Name, p2Name, startingBudget, squadSize, mode) => {
    const newSettings = { squadSize, gameMode: mode, startingBudget };
    socket.emit('createRoom', { p1Name: p1Name || 'Player 1', settings: newSettings }, (res) => {
      if (res.success) {
        setRoomCode(res.roomCode);
        setMyPlayerNum(1);
      }
    });
  };

  const joinGame = (code, p2Name) => {
    socket.emit('joinRoom', { roomCode: code, p2Name: p2Name || 'Player 2' }, (res) => {
      if (res.success) {
        setRoomCode(code);
        setMyPlayerNum(2);
      } else {
        alert(res.message);
      }
    });
  };

  const draftPlayer = (playerNum, amount) => {
    socket.emit('draftPlayer', { roomCode, playerNum, amount });
  };

  const passPlayer = () => {
    socket.emit('passPlayer', { roomCode });
  };

  const placeBid = (playerNum, amount) => {
    socket.emit('placeBid', { roomCode, playerNum, amount });
  };

  const passAuction = (playerNum) => {
    socket.emit('passAuction', { roomCode, playerNum });
  };

  const restartGame = () => {
    setGamePhase('START');
    setRoomCode(null);
  };

  return {
    gamePhase,
    settings,
    player1,
    player2,
    currentPlayer,
    auctionState,
    draftHistory,
    roomCode,
    myPlayerNum,
    startGame,
    joinGame,
    draftPlayer,
    passPlayer,
    placeBid,
    passAuction,
    restartGame
  };
}
