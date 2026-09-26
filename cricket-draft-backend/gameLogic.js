function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

class GameRoom {
  constructor(roomCode, playersData, settings, p1Name, p1SocketId) {
    this.roomCode = roomCode;
    this.playersData = playersData;
    this.settings = settings;
    
    this.player1 = { name: p1Name || 'Player 1', budget: settings.startingBudget, squad: [], socketId: p1SocketId };
    this.player2 = { name: 'Player 2', budget: settings.startingBudget, squad: [], socketId: null };
    
    this.gamePhase = 'WAITING';
    this.availablePlayers = [];
    this.currentPlayer = null;
    this.auctionState = { currentBid: 0, highestBidder: null, biddingActive: false, startingBidder: 1, currentTurn: 1, firstPassBy: null };
    this.draftHistory = [];
  }

  join(p2Name, p2SocketId) {
    if (this.gamePhase !== 'WAITING') return false;
    this.player2.name = p2Name || 'Player 2';
    this.player2.socketId = p2SocketId;
    this.startGame();
    return true;
  }

  startGame() {
    const shuffled = shuffle([...this.playersData]);
    this.availablePlayers = shuffled.slice(1);
    this.currentPlayer = shuffled[0];
    this.gamePhase = 'DRAFTING';
    this.draftHistory = [];
    this.auctionState = { currentBid: 0, highestBidder: null, biddingActive: false, startingBidder: 1, currentTurn: 1, firstPassBy: null };
  }

  checkEndCondition() {
    const p1Full = this.player1.squad.length >= this.settings.squadSize;
    const p2Full = this.player2.squad.length >= this.settings.squadSize;
    if (p1Full && p2Full) {
      this.gamePhase = 'RESULT';
      return true;
    }
    if (this.availablePlayers.length === 0 && !this.currentPlayer) {
      this.gamePhase = 'RESULT';
      return true;
    }
    
    const minPrice = this.availablePlayers.length > 0 ? Math.min(...this.availablePlayers.map(p => p.price)) : Infinity;
    const currentPrice = this.currentPlayer ? this.currentPlayer.price : Infinity;
    const actualMin = Math.min(minPrice, currentPrice);
    
    if (this.player1.budget < actualMin && this.player2.budget < actualMin) {
      this.gamePhase = 'RESULT';
      return true;
    }
    return false;
  }

  nextPlayer() {
    if (this.availablePlayers.length === 0) {
      this.currentPlayer = null;
      this.checkEndCondition();
      return;
    }
    const next = this.availablePlayers[0];
    this.availablePlayers = this.availablePlayers.slice(1);
    this.currentPlayer = next;
    
    const nextStarting = this.auctionState.startingBidder === 1 ? 2 : 1;
    this.auctionState = {
      currentBid: 0,
      highestBidder: null,
      biddingActive: false,
      startingBidder: nextStarting,
      currentTurn: nextStarting,
      firstPassBy: null
    };
    this.checkEndCondition();
  }

  draftPlayer(playerNum, amount) {
    if (!this.currentPlayer) return;
    
    const p = playerNum === 1 ? this.player1 : this.player2;
    if (p.budget < amount || p.squad.length >= this.settings.squadSize) return;
    
    p.budget -= amount;
    p.squad.push(this.currentPlayer);

    this.draftHistory.push({
      round: this.draftHistory.length + 1,
      playerName: this.currentPlayer.name,
      draftedBy: p.name,
      amount
    });

    this.nextPlayer();
  }

  passPlayer() {
    this.nextPlayer();
  }

  placeBid(playerNum, amount) {
    if (!this.currentPlayer || this.auctionState.currentTurn !== playerNum) return;
    const p = playerNum === 1 ? this.player1 : this.player2;
    
    if (p.squad.length >= this.settings.squadSize) return;
    if (amount < 0) return; 
    if (this.auctionState.biddingActive && amount <= this.auctionState.currentBid) return;
    if (p.budget < amount) return;

    this.auctionState = {
      ...this.auctionState,
      currentBid: amount,
      highestBidder: playerNum,
      biddingActive: true,
      currentTurn: playerNum === 1 ? 2 : 1
    };
  }

  passAuction(playerNum) {
    if (!this.currentPlayer || this.auctionState.currentTurn !== playerNum) return;

    if (!this.auctionState.biddingActive) {
      if (this.auctionState.firstPassBy) {
        this.nextPlayer();
      } else {
        this.auctionState.firstPassBy = playerNum;
        this.auctionState.currentTurn = playerNum === 1 ? 2 : 1;
      }
      return;
    }

    if (this.auctionState.highestBidder) {
      this.draftPlayer(this.auctionState.highestBidder, this.auctionState.currentBid);
    }
  }

  getState(playerNum) {
    return {
      roomCode: this.roomCode,
      gamePhase: this.gamePhase,
      settings: this.settings,
      player1: { name: this.player1.name, budget: this.player1.budget, squad: this.player1.squad },
      player2: { name: this.player2.name, budget: this.player2.budget, squad: this.player2.squad },
      currentPlayer: this.currentPlayer,
      auctionState: this.auctionState,
      draftHistory: this.draftHistory,
      myPlayerNum: playerNum
    };
  }
}

module.exports = { GameRoom };
