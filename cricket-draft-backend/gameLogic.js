const supabase = require('./supabaseClient');

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
  constructor(roomCode, playersData, settings, p1Name, p1SocketId, emitUpdate) {
    this.roomCode = roomCode;
    this.playersData = playersData;
    this.settings = settings;
    this.emitUpdate = emitUpdate;
    
    this.player1 = { name: p1Name || 'Player 1', budget: settings.startingBudget, squad: [], socketId: p1SocketId };
    this.player2 = { name: 'Player 2', budget: settings.startingBudget, squad: [], socketId: null };
    
    this.gamePhase = 'WAITING';
    this.availablePlayers = [];
    this.currentPlayer = null;
    this.auctionState = { currentBid: 0, highestBidder: null, biddingActive: false, startingBidder: 1, currentTurn: 1, firstPassBy: null, timeLeft: 0 };
    this.draftHistory = [];
    this.auctionTimer = null;
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
    this.auctionState = { currentBid: 0, highestBidder: null, biddingActive: false, startingBidder: 1, currentTurn: 1, firstPassBy: null, timeLeft: this.settings.timerEnabled ? 20 : 0 };
    if (this.settings.timerEnabled) {
       this.startTimer();
    }
  }

  async saveMatchToDatabase() {
    if (this.matchSaved) return;
    this.matchSaved = true;
    if (supabase) {
      try {
        await supabase.from('matches').insert([{
          room_code: this.roomCode,
          player1_name: this.player1.name,
          player2_name: this.player2.name,
          player1_squad: JSON.stringify(this.player1.squad),
          player2_squad: JSON.stringify(this.player2.squad),
          created_at: new Date()
        }]);
        console.log('Match saved to Supabase successfully!');
      } catch (e) {
        console.error('Failed to save match to Supabase:', e.message);
      }
    } else {
      console.log("Supabase not configured, skipping match save.");
    }
  }

  checkEndCondition() {
    const p1Full = this.player1.squad.length >= this.settings.squadSize;
    const p2Full = this.player2.squad.length >= this.settings.squadSize;
    if (p1Full && p2Full) {
      this.clearTimer();
      this.gamePhase = 'RESULT';
      this.saveMatchToDatabase();
      return true;
    }
    if (this.availablePlayers.length === 0 && !this.currentPlayer) {
      this.clearTimer();
      this.gamePhase = 'RESULT';
      this.saveMatchToDatabase();
      return true;
    }
    
    const minPrice = this.availablePlayers.length > 0 ? Math.min(...this.availablePlayers.map(p => p.price || 0)) : Infinity;
    const currentPrice = this.currentPlayer ? (this.currentPlayer.price || 0) : Infinity;
    const actualMin = Math.min(minPrice, currentPrice);
    
    if (this.player1.budget <= 0 && this.player2.budget <= 0) {
      this.clearTimer();
      this.gamePhase = 'RESULT';
      this.saveMatchToDatabase();
      return true;
    }
    if (actualMin > 0 && this.player1.budget < actualMin && this.player2.budget < actualMin) {
      this.clearTimer();
      this.gamePhase = 'RESULT';
      this.saveMatchToDatabase();
      return true;
    }
    return false;
  }

  startTimer() {
    this.clearTimer();
    this.auctionState.timeLeft = 20;
    this.auctionTimer = setInterval(() => {
      this.auctionState.timeLeft -= 1;
      if (this.auctionState.timeLeft <= 0) {
        this.clearTimer();
        this.handleAuctionEnd();
      }
      if (this.emitUpdate) this.emitUpdate();
    }, 1000);
  }

  clearTimer() {
    if (this.auctionTimer) {
      clearInterval(this.auctionTimer);
      this.auctionTimer = null;
    }
  }

  handleAuctionEnd() {
    if (this.auctionState.highestBidder) {
      this.draftPlayer(this.auctionState.highestBidder, this.auctionState.currentBid);
    } else {
      this.nextPlayer();
      if (this.emitUpdate) this.emitUpdate();
    }
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
      firstPassBy: null,
      timeLeft: this.settings.timerEnabled ? 20 : 0
    };
    if (this.checkEndCondition()) return;
    if (this.settings.timerEnabled) {
      this.startTimer();
    }
  }

  draftPlayer(playerNum, amount) {
    if (!this.currentPlayer) return;
    
    const p = playerNum === 1 ? this.player1 : this.player2;
    if (p.budget < amount || p.squad.length >= this.settings.squadSize) return;
    
    p.budget -= amount;
    // Store the purchase price on the player so the frontend can display it
    const draftedPlayer = { ...this.currentPlayer, purchasePrice: amount };
    p.squad.push(draftedPlayer);

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
    if (!this.currentPlayer) return;
    
    // In QUICK mode, turn-based logic applies. In AUCTION mode, it's turn-based too.
    if (this.auctionState.currentTurn !== playerNum) return;
    
    const p = playerNum === 1 ? this.player1 : this.player2;
    
    if (p.squad.length >= this.settings.squadSize) return;
    if (amount < 0) return;
    
    // Must beat current bid if active; else opening bid can be 0 (base price)
    const minRequired = this.auctionState.biddingActive 
      ? this.auctionState.currentBid + 1 
      : 0;
    
    if (amount < minRequired) return;
    if (p.budget < amount) return;

    this.auctionState = {
      ...this.auctionState,
      currentBid: amount,
      highestBidder: playerNum,
      biddingActive: true,
      currentTurn: playerNum === 1 ? 2 : 1
    };

    if (this.settings.timerEnabled) {
      this.startTimer(); // reset timer to 20s
    } else {
      if (this.emitUpdate) this.emitUpdate();
    }
  }

  passAuction(playerNum) {
    if (!this.currentPlayer) return;

    if (this.auctionState.currentTurn !== playerNum) return;

    if (!this.auctionState.biddingActive) {
      if (this.auctionState.firstPassBy) {
        this.clearTimer();
        this.nextPlayer();
        if (this.emitUpdate) this.emitUpdate();
      } else {
        this.auctionState.firstPassBy = playerNum;
        this.auctionState.currentTurn = playerNum === 1 ? 2 : 1;
        // Reset timer for the next player's turn
        if (this.settings.timerEnabled) {
          this.startTimer();
        } else {
          if (this.emitUpdate) this.emitUpdate();
        }
      }
      return;
    }

    if (this.auctionState.highestBidder) {
      this.clearTimer();
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
