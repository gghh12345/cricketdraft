import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('CRICKET_DRAFT_BACKEND_URL');
    if (saved) return saved;

    // If served from Render directly
    if (window.location.hostname.includes('onrender.com')) {
      return window.location.origin;
    }

    // If deployed on Vercel or any remote domain (not localhost)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://cricket-draft-backend.onrender.com';
    }
  }
  return 'http://localhost:5000';
};

export const socket = io(getBackendUrl(), {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

export function useDraftEngine() {
  const [gamePhase, setGamePhase] = useState('START'); // START, WAITING_FOR_OPPONENT, DRAFTING, RESULT
  const [roomCode, setRoomCode] = useState(null);
  const [myPlayerNum, setMyPlayerNum] = useState(1);
  const [settings, setSettings] = useState({ squadSize: 5, gameMode: 'AUCTION', timerEnabled: false });
  
  const [player1, setPlayer1] = useState({ name: 'Player 1', budget: 20, squad: [] });
  const [player2, setPlayer2] = useState({ name: 'Player 2', budget: 20, squad: [] });
  
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [auctionState, setAuctionState] = useState({
    currentBid: 0,
    highestBidder: null,
    biddingActive: false,
    startingBidder: 1,
    currentTurn: 1,
    firstPassBy: null,
    timeLeft: 0
  });
  const [draftHistory, setDraftHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(socket.connected ? 'connected' : 'connecting');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      console.log('[Socket] Connected with ID:', socket.id);
      setConnectionStatus('connected');
    };

    const handleDisconnect = (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setConnectionStatus('disconnected');
    };

    const handleConnectError = (error) => {
      console.warn('[Socket] Connect error:', error.message);
      // Free Render service may be waking up
      setConnectionStatus('connecting');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    socket.on('gameState', (state) => {
      if (state.gamePhase === 'WAITING') {
        setGamePhase('WAITING_FOR_OPPONENT');
      } else {
        setGamePhase(state.gamePhase);
      }
      if (state.settings) setSettings(state.settings);
      if (state.player1) setPlayer1(state.player1);
      if (state.player2) setPlayer2(state.player2);
      if (state.currentPlayer !== undefined) setCurrentPlayer(state.currentPlayer);
      if (state.auctionState) setAuctionState(state.auctionState);
      if (state.draftHistory) setDraftHistory(state.draftHistory);
      
      if (state.myPlayerNum) {
        setMyPlayerNum(state.myPlayerNum);
      }
    });

    if (socket.connected) {
      setConnectionStatus('connected');
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('gameState');
    };
  }, []);

  const startGame = useCallback((p1Name, p2Name, startingBudget, squadSize, mode, timerEnabled) => {
    setIsCreatingRoom(true);
    const newSettings = { squadSize, gameMode: mode, startingBudget, timerEnabled };

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        setIsCreatingRoom(false);
        alert('Server is waking up from idle sleep (Render free tier can take up to ~30-40 seconds). Please tap again in a moment!');
      }
    }, 15000);

    socket.emit('createRoom', { p1Name: p1Name || 'Player 1', settings: newSettings }, (res) => {
      resolved = true;
      clearTimeout(timeout);
      setIsCreatingRoom(false);

      if (res && res.success) {
        setRoomCode(res.roomCode);
        setMyPlayerNum(1);
        setGamePhase('WAITING_FOR_OPPONENT');
      } else {
        alert(res?.message || 'Failed to create room. Please try again.');
      }
    });
  }, []);

  const joinGame = useCallback((code, p2Name) => {
    setIsJoiningRoom(true);
    const cleanCode = (code || '').toUpperCase().trim();

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        setIsJoiningRoom(false);
        alert('Server took too long to respond. The free server might be spinning up, please try again shortly.');
      }
    }, 15000);

    socket.emit('joinRoom', { roomCode: cleanCode, p2Name: p2Name || 'Player 2' }, (res) => {
      resolved = true;
      clearTimeout(timeout);
      setIsJoiningRoom(false);

      if (res && res.success) {
        setRoomCode(cleanCode);
        setMyPlayerNum(2);
      } else {
        alert(res?.message || 'Could not join room. Check the code and try again.');
      }
    });
  }, []);

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

  const updateBackendUrl = (url) => {
    if (!url) return;
    localStorage.setItem('CRICKET_DRAFT_BACKEND_URL', url.trim());
    window.location.reload();
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
    connectionStatus,
    isCreatingRoom,
    isJoiningRoom,
    backendUrl: getBackendUrl(),
    updateBackendUrl,
    startGame,
    joinGame,
    draftPlayer,
    passPlayer,
    placeBid,
    passAuction,
    restartGame
  };
}
