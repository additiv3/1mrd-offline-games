import { getEquippedSkin } from './shop-manager.js';
import { drawLuxuryCardFront, drawLuxuryCardBack } from './card-graphics.js';

const SUITS = [
  { id: 'spades', symbol: '♠', color: 'black', rank: 3 },
  { id: 'hearts', symbol: '♥', color: 'red', rank: 2 },
  { id: 'diamonds', symbol: '♦', color: 'red', rank: 1 },
  { id: 'clubs', symbol: '♣', color: 'black', rank: 0 }
];

const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class SpadesSFX {
  ctx = null;
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
  card() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
  trickWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }
}

const sfx = new SpadesSFX();

export class SpadesGame {
  container;
  ctx;
  canvas = document.createElement('canvas');
  g;
  observer;
  width = 360;
  height = 640;
  scale = 1;
  raf = 0;
  last = 0;
  paused = false;

  // Players: 0 = South (You), 1 = West, 2 = North (Partner), 3 = East
  playerHands = [[], [], [], []];
  bids = [null, null, null, null];
  tricksWon = [0, 0, 0, 0];

  phase = 'bidding'; // 'bidding' or 'playing' or 'round-over'
  turn = 0; // 0..3
  leadPlayer = 0;
  currentTrick = []; // [{ player: 0..3, card }]
  spadesBroken = false;
  selectedBid = 3;

  scoreUs = 0;
  scoreThem = 0;
  round = 1;
  won = false;
  reportTimer;

  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas 2D nicht unterstützt');
    this.g = g;

    this.initRound();

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.start();
  }

  initRound() {
    this.phase = 'bidding';
    this.spadesBroken = false;
    this.currentTrick = [];
    this.tricksWon = [0, 0, 0, 0];
    this.bids = [null, null, null, null];
    this.selectedBid = 3;

    // Deck of 52
    const deck = [];
    for (let s of SUITS) {
      for (let v = 0; v < 13; v++) {
        deck.push({
          suit: s.id,
          symbol: s.symbol,
          color: s.color,
          value: v, // 0 = '2' ... 12 = 'A'
          label: VALUES[v],
          suitRank: s.rank
        });
      }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal 13 to each
    this.playerHands = [
      deck.slice(0, 13),
      deck.slice(13, 26),
      deck.slice(26, 39),
      deck.slice(39, 52)
    ];

    // Sort South hand by suit and value
    this.sortHand(this.playerHands[0]);

    // Bot bids
    for (let p = 1; p <= 3; p++) {
      this.bids[p] = this.estimateBotBid(this.playerHands[p]);
    }

    this.turn = 0; // South bids first
  }

  sortHand(hand) {
    hand.sort((a, b) => {
      if (a.suitRank !== b.suitRank) return b.suitRank - a.suitRank;
      return a.value - b.value;
    });
  }

  estimateBotBid(hand) {
    let bid = 0;
    const suitCounts = { spades: 0, hearts: 0, diamonds: 0, clubs: 0 };
    for (let c of hand) suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    
    for (let c of hand) {
      if (c.value === 12) bid += 1; // Ace
      else if (c.value === 11 && suitCounts[c.suit] >= 4) bid += 0.5; // King in long suit
      
      if (c.suit === 'spades' && c.value >= 9) bid += 0.5; // Spade above 10
    }
    return Math.max(1, Math.round(bid));
  }

  onPointerDown = (e) => {
    sfx.init();
    const rect = this.canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) / this.scale;
    const py = (e.clientY - rect.top) / this.scale;

    // Bidding phase UI
    if (this.phase === 'bidding' && this.bids[0] === null) {
      // Plus / Minus buttons
      if (py >= 360 && py <= 410) {
        if (px >= this.width / 2 - 80 && px <= this.width / 2 - 30) {
          this.selectedBid = Math.max(0, this.selectedBid - 1);
          sfx.card();
          return;
        }
        if (px >= this.width / 2 + 30 && px <= this.width / 2 + 80) {
          this.selectedBid = Math.min(13, this.selectedBid + 1);
          sfx.card();
          return;
        }
      }
      // Confirm Bid Button
      if (py >= 420 && py <= 470 && px >= this.width / 2 - 80 && px <= this.width / 2 + 80) {
        this.bids[0] = this.selectedBid;
        this.phase = 'playing';
        this.leadPlayer = 0;
        this.turn = 0;
        sfx.card();
        return;
      }
      return;
    }

    // Playing phase
    if (this.phase === 'playing' && this.turn === 0 && this.currentTrick.length < 4) {
      // Check which card in South's hand was clicked
      const hand = this.playerHands[0];
      const cardW = 42;
      const cardH = 62;
      const spacing = Math.min(22, (this.width - 24 - cardW) / Math.max(1, hand.length - 1));
      const startX = (this.width - (cardW + (hand.length - 1) * spacing)) / 2;
      const cardY = 540;

      for (let i = hand.length - 1; i >= 0; i--) {
        const cx = startX + i * spacing;
        if (px >= cx && px <= cx + (i === hand.length - 1 ? cardW : spacing) && py >= cardY && py <= cardY + cardH) {
          const card = hand[i];
          if (this.isLegalPlay(card, hand)) {
            // Play card!
            hand.splice(i, 1);
            this.playCard(0, card);
            return;
          }
        }
      }
    }
  };

  isLegalPlay(card, hand) {
    if (this.currentTrick.length === 0) {
      // Leading trick
      if (card.suit === 'spades' && !this.spadesBroken) {
        // Can only lead spades if only spades left
        return hand.every(c => c.suit === 'spades');
      }
      return true;
    }

    // Following suit
    const leadSuit = this.currentTrick[0].card.suit;
    const hasLeadSuit = hand.some(c => c.suit === leadSuit);
    if (hasLeadSuit) {
      return card.suit === leadSuit;
    }
    return true; // Can play anything (including Spades to trump)
  }

  playCard(player, card) {
    if (card.suit === 'spades') this.spadesBroken = true;
    this.currentTrick.push({ player, card });
    sfx.card();

    if (this.currentTrick.length === 4) {
      // Trick finished! Resolve after brief pause
      setTimeout(() => this.resolveTrick(), 850);
    } else {
      this.turn = (this.turn + 1) % 4;
      if (this.turn !== 0) {
        setTimeout(() => this.playBotTurn(), 600);
      }
    }
  }

  playBotTurn() {
    if (this.phase !== 'playing' || this.turn === 0) return;
    const botHand = this.playerHands[this.turn];
    if (botHand.length === 0) return;

    let legalCards = botHand.filter(c => this.isLegalPlay(c, botHand));
    if (legalCards.length === 0) legalCards = [botHand[0]];
    
    let chosen = legalCards[0];

    if (this.currentTrick.length === 0) {
      let nonSpades = legalCards.filter(c => c.suit !== 'spades');
      let pool = nonSpades.length > 0 ? nonSpades : legalCards;
      pool.sort((a, b) => b.value - a.value);
      chosen = pool.length > 1 ? pool[Math.floor(pool.length / 2)] : pool[0];
    } else {
      const leadSuit = this.currentTrick[0].card.suit;
      let winningIndex = 0;
      let highestSpade = -1;
      let highestLead = -1;
      
      for (let i = 0; i < this.currentTrick.length; i++) {
        const c = this.currentTrick[i].card;
        if (c.suit === 'spades') {
          if (c.value > highestSpade) { highestSpade = c.value; winningIndex = i; }
        } else if (highestSpade === -1 && c.suit === leadSuit) {
          if (c.value > highestLead) { highestLead = c.value; winningIndex = i; }
        }
      }
      
      const winningPlayer = this.currentTrick[winningIndex].player;
      const partner = (this.turn + 2) % 4;
      const partnerWinning = (winningPlayer === partner);
      
      legalCards.sort((a, b) => a.value - b.value);
      
      if (partnerWinning) {
        chosen = legalCards[0];
      } else {
        let winningCards = legalCards.filter(c => {
          if (c.suit === 'spades') return c.value > highestSpade;
          if (highestSpade === -1 && c.suit === leadSuit) return c.value > highestLead;
          return false;
        });
        if (winningCards.length > 0) {
          chosen = winningCards[0]; // win cheaply
        } else {
          chosen = legalCards[0]; // play lowest
        }
      }
    }

    const idx = botHand.indexOf(chosen);
    botHand.splice(idx, 1);
    this.playCard(this.turn, chosen);
  }

  resolveTrick() {
    const leadSuit = this.currentTrick[0].card.suit;
    let winningIndex = 0;
    let highestSpade = -1;
    let highestLead = -1;

    for (let i = 0; i < 4; i++) {
      const c = this.currentTrick[i].card;
      if (c.suit === 'spades') {
        if (c.value > highestSpade) {
          highestSpade = c.value;
          winningIndex = i;
        }
      } else if (highestSpade === -1 && c.suit === leadSuit) {
        if (c.value > highestLead) {
          highestLead = c.value;
          winningIndex = i;
        }
      }
    }

    const winnerPlayer = this.currentTrick[winningIndex].player;
    this.tricksWon[winnerPlayer]++;
    sfx.trickWin();

    this.currentTrick = [];
    this.turn = winnerPlayer;
    this.leadPlayer = winnerPlayer;

    // Check if round is over (13 tricks played)
    if (this.playerHands[0].length === 0) {
      this.finishRound();
    } else if (this.turn !== 0) {
      setTimeout(() => this.playBotTurn(), 500);
    }
  }

  finishRound() {
    this.phase = 'round-over';
    const teamUsTricks = this.tricksWon[0] + this.tricksWon[2];
    const teamUsBid = (this.bids[0] || 0) + (this.bids[2] || 0);

    const teamThemTricks = this.tricksWon[1] + this.tricksWon[3];
    const teamThemBid = (this.bids[1] || 0) + (this.bids[3] || 0);

    // Scoring Us
    if (teamUsTricks >= teamUsBid) {
      this.scoreUs += teamUsBid * 10 + (teamUsTricks - teamUsBid);
    } else {
      this.scoreUs -= teamUsBid * 10;
    }

    // Scoring Them
    if (teamThemTricks >= teamThemBid) {
      this.scoreThem += teamThemBid * 10 + (teamThemTricks - teamThemBid);
    } else {
      this.scoreThem -= teamThemBid * 10;
    }

    const isWin = this.scoreUs >= this.scoreThem && this.scoreUs > 0;
    this.won = isWin;

    this.reportTimer = setTimeout(() => {
      this.ctx.reportResult({
        outcome: isWin ? 'win' : 'loss',
        score: Math.max(0, this.scoreUs),
        coinsEarned: isWin ? 50 : 15,
        headline: isWin ? 'Spades Stich-Sieg! ♠️🏆' : 'Gute Runde!'
      });
    }, 1400);
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / 640;
    this.width = this.canvas.width / this.scale;
  }

  start() {
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  frame = (time) => {
    this.raf = requestAnimationFrame(this.frame);
    this.last = time;
    this.draw();
  };

  drawCard(card, x, y, w, h) {
    drawLuxuryCardFront(this.g, card, x, y, w, h);
  }

  draw() {
    const { g, width } = this;
    g.save();
    g.scale(this.scale, this.scale);

    // Dark Casino felt
    const bg = g.createRadialGradient(width / 2, 320, 20, width / 2, 320, 420);
    bg.addColorStop(0, '#192b21');
    bg.addColorStop(1, '#09120d');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, 640);

    // Scoreboard Top
    g.fillStyle = 'rgba(0,0,0,0.4)';
    g.beginPath();
    g.roundRect(14, 12, width - 28, 48, 16);
    g.fill();

    g.font = 'bold 13px system-ui, sans-serif';
    g.fillStyle = '#00e5ff';
    g.textAlign = 'left';
    g.fillText(`Wir: ${this.scoreUs} Pkt (${this.tricksWon[0] + this.tricksWon[2]}/${(this.bids[0] || 0) + (this.bids[2] || 0)})`, 26, 40);

    g.fillStyle = '#ff2d75';
    g.textAlign = 'right';
    g.fillText(`Gegner: ${this.scoreThem} Pkt (${this.tricksWon[1] + this.tricksWon[3]}/${(this.bids[1] || 0) + (this.bids[3] || 0)})`, width - 26, 40);

    // Partner (North) at top
    g.fillStyle = 'rgba(255,255,255,0.7)';
    g.font = 'bold 12px system-ui';
    g.textAlign = 'center';
    g.fillText(`Partner (Nord): ${this.bids[2] !== null ? this.bids[2] + ' Gebot' : '…'}`, width / 2, 85);

    // Opponents Left (West) and Right (East)
    g.textAlign = 'left';
    g.fillText(`West: ${this.bids[1] !== null ? this.bids[1] : '…'}`, 14, 250);
    g.textAlign = 'right';
    g.fillText(`Ost: ${this.bids[3] !== null ? this.bids[3] : '…'}`, width - 14, 250);

    // Center Trick Area
    g.strokeStyle = 'rgba(255,255,255,0.1)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(width / 2, 280, 85, 0, Math.PI * 2);
    g.stroke();

    // Trick cards
    const cardW = 38;
    const cardH = 55;
    const trickOffsets = [
      { x: width / 2 - cardW / 2, y: 300 }, // South
      { x: width / 2 - cardW - 20, y: 260 }, // West
      { x: width / 2 - cardW / 2, y: 215 }, // North
      { x: width / 2 + 20, y: 260 }          // East
    ];

    for (let played of this.currentTrick) {
      const pos = trickOffsets[played.player];
      this.drawCard(played.card, pos.x, pos.y, cardW, cardH);
    }

    // Bidding Modal UI if waiting for player bid
    if (this.phase === 'bidding' && this.bids[0] === null) {
      g.fillStyle = 'rgba(0,0,0,0.65)';
      g.fillRect(0, 310, width, 220);

      g.fillStyle = '#ffffff';
      g.font = 'bold 17px system-ui';
      g.textAlign = 'center';
      g.fillText('Wie viele Stiche machst du?', width / 2, 345);

      // Minus button
      g.fillStyle = '#262040';
      g.beginPath();
      g.roundRect(width / 2 - 80, 365, 45, 45, 12);
      g.fill();
      g.fillStyle = '#fff';
      g.font = 'bold 22px system-ui';
      g.fillText('-', width / 2 - 58, 395);

      // Bid count
      g.font = '900 32px system-ui';
      g.fillStyle = '#ffd700';
      g.fillText(String(this.selectedBid), width / 2, 400);

      // Plus button
      g.fillStyle = '#262040';
      g.beginPath();
      g.roundRect(width / 2 + 35, 365, 45, 45, 12);
      g.fill();
      g.fillStyle = '#fff';
      g.font = 'bold 22px system-ui';
      g.fillText('+', width / 2 + 57, 395);

      // Confirm button
      g.fillStyle = '#7c4dff';
      g.beginPath();
      g.roundRect(width / 2 - 80, 425, 160, 45, 14);
      g.fill();
      g.fillStyle = '#ffffff';
      g.font = 'bold 15px system-ui';
      g.fillText('Ansage bestätigen', width / 2, 453);
    }

    // South Hand (Bottom)
    const hand = this.playerHands[0];
    const sCardW = 42;
    const sCardH = 62;
    const spacing = Math.min(22, (width - 24 - sCardW) / Math.max(1, hand.length - 1));
    const startX = (width - (sCardW + (hand.length - 1) * spacing)) / 2;
    const cardY = 540;

    for (let i = 0; i < hand.length; i++) {
      const cx = startX + i * spacing;
      this.drawCard(hand[i], cx, cardY, sCardW, sCardH);
    }

    g.restore();
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  reset() {
    clearTimeout(this.reportTimer);
    this.initRound();
  }
  dispose() {
    this.stop();
    clearTimeout(this.reportTimer);
    this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.remove();
  }
}

export default {
  async initialize(container, ctx) {
    return new SpadesGame(container, ctx);
  }
};
