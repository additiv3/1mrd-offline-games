import { getEquippedSkin } from './shop-manager.js';
import { drawLuxuryCardFront, drawLuxuryCardBack } from './card-graphics.js';

const SUIT_DEFS = {
  spades: { id: 'spades', symbol: '♠', color: 'black' },
  hearts: { id: 'hearts', symbol: '♥', color: 'red' },
  diamonds: { id: 'diamonds', symbol: '♦', color: 'red' },
  clubs: { id: 'clubs', symbol: '♣', color: 'black' }
};

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class SpiderSFX {
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
  flip() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
  deal() {
    try {
      this.init();
      if (!this.ctx) return;
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + i * 30, this.ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.04 + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.04);
        osc.stop(this.ctx.currentTime + i * 0.04 + 0.04);
      }
    } catch (e) {}
  }
  clearSuit() {
    try {
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.3);
      });
    } catch (e) {}
  }
}

const sfx = new SpiderSFX();

export class SpiderSolitaireGame {
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

  difficulty = 'leicht'; // 'leicht' (1 Farbe), 'mittel' (2 Farben), 'schwer' (4 Farben)
  tableau = []; // 10 columns
  stock = []; // remaining cards (5 deals of 10)
  completedPiles = 0; // goal: 8 completed suits (K to A)

  history = [];
  selected = null; // { colIdx, cardIdx, card }
  moves = 0;
  startTime = 0;
  elapsed = 0;
  won = false;
  reportTimer;

  // Layout metrics
  cardW = 32;
  cardH = 46;
  margin = 6;
  spacing = 4;
  topY = 50;
  tabY = 110;

  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.difficulty = ctx.difficulty || 'leicht';
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas 2D nicht unterstützt');
    this.g = g;

    this.initGame();

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.start();
  }

  initGame() {
    this.won = false;
    this.moves = 0;
    this.selected = null;
    this.history = [];
    this.completedPiles = 0;
    this.startTime = performance.now();
    this.elapsed = 0;

    // Pick suits based on difficulty
    let suitsToUse = [];
    if (this.difficulty === 'schwer') {
      suitsToUse = ['spades', 'hearts', 'diamonds', 'clubs', 'spades', 'hearts', 'diamonds', 'clubs'];
    } else if (this.difficulty === 'mittel') {
      suitsToUse = ['spades', 'hearts', 'spades', 'hearts', 'spades', 'hearts', 'spades', 'hearts'];
    } else {
      // 1 Suit (All Spades) - 8 decks of spades
      suitsToUse = Array(8).fill('spades');
    }

    const deck = [];
    for (let sName of suitsToUse) {
      const s = SUIT_DEFS[sName];
      for (let v = 0; v < 13; v++) {
        deck.push({
          suit: s.id,
          symbol: s.symbol,
          color: s.color,
          value: v, // 0 = A, 12 = K
          label: VALUES[v],
          faceUp: false
        });
      }
    }

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal 10 columns: first 4 get 6 cards, next 6 get 5 cards = 54 cards total
    this.tableau = Array.from({ length: 10 }, () => []);
    for (let col = 0; col < 10; col++) {
      const count = col < 4 ? 6 : 5;
      for (let row = 0; row < count; row++) {
        const card = deck.pop();
        card.faceUp = (row === count - 1);
        this.tableau[col].push(card);
      }
    }

    this.stock = deck; // 50 cards remaining = 5 deals of 10
  }

  saveState() {
    const cloneCard = c => ({ ...c });
    this.history.push({
      tableau: this.tableau.map(col => col.map(cloneCard)),
      stock: this.stock.map(cloneCard),
      completedPiles: this.completedPiles,
      moves: this.moves
    });
    if (this.history.length > 25) this.history.shift();
  }

  undo() {
    if (this.history.length === 0 || this.won) return;
    const prev = this.history.pop();
    this.tableau = prev.tableau;
    this.stock = prev.stock;
    this.completedPiles = prev.completedPiles;
    this.moves = prev.moves;
    this.selected = null;
    sfx.flip();
  }

  dealFromStock() {
    if (this.stock.length < 10 || this.won) return;
    this.saveState();
    for (let col = 0; col < 10; col++) {
      const card = this.stock.pop();
      card.faceUp = true;
      this.tableau[col].push(card);
    }
    this.moves++;
    sfx.deal();
    this.checkCompleteSequences();
  }

  onPointerDown = (e) => {
    sfx.init();
    const rect = this.canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) / this.scale;
    const py = (e.clientY - rect.top) / this.scale;

    // Header buttons (Undo & Restart)
    if (py < 45) {
      if (px < 90) {
        this.undo();
        return;
      }
      if (px > this.width - 90) {
        this.initGame();
        sfx.flip();
        return;
      }
    }

    // Stock pile at bottom or top right
    const stockX = this.margin;
    if (px >= stockX && px <= stockX + this.cardW + 20 && py >= this.topY && py <= this.topY + this.cardH) {
      if (this.stock.length > 0) {
        this.dealFromStock();
      }
      return;
    }

    // Check Tableau (10 columns)
    const colW = (this.width - 2 * this.margin) / 10;
    for (let col = 0; col < 10; col++) {
      const cx = this.margin + col * colW;
      const column = this.tableau[col];

      if (px >= cx && px <= cx + colW) {
        if (column.length === 0) {
          // Empty column: if we have cards selected, move them here!
          if (this.selected) {
            this.executeMove(col);
            return;
          }
        } else {
          // Check cards in column from bottom up
          for (let row = column.length - 1; row >= 0; row--) {
            const cy = this.tabY + row * 16;
            const h = (row === column.length - 1) ? this.cardH : 16;
            if (py >= cy && py <= cy + h) {
              const card = column[row];
              if (!card.faceUp) {
                // If it's the top face-down card, flip it!
                if (row === column.length - 1) {
                  this.saveState();
                  card.faceUp = true;
                  sfx.flip();
                }
                return;
              }

              // Check if we are dropping onto this column
              if (this.selected && this.selected.colIdx !== col) {
                const targetCard = column[column.length - 1];
                if (targetCard.value === this.selected.card.value + 1) {
                  this.executeMove(col);
                  return;
                }
              }

              // Check if clicked card is part of a movable sequence
              if (this.isValidMovableSequence(column, row)) {
                this.selected = { colIdx: col, cardIdx: row, card };
                sfx.flip();
                return;
              }
            }
          }
        }
      }
    }

    this.selected = null;
  };

  isValidMovableSequence(column, startIndex) {
    for (let i = startIndex; i < column.length - 1; i++) {
      const curr = column[i];
      const next = column[i + 1];
      if (!curr.faceUp || !next.faceUp) return false;
      if (curr.suit !== next.suit) return false;
      if (curr.value !== next.value + 1) return false;
    }
    return true;
  }

  executeMove(targetColIdx) {
    if (!this.selected) return;
    this.saveState();
    const sourceCol = this.tableau[this.selected.colIdx];
    const targetCol = this.tableau[targetColIdx];

    const movingCards = sourceCol.splice(this.selected.cardIdx);
    targetCol.push(...movingCards);

    // Uncover hidden card in source column
    if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
      sourceCol[sourceCol.length - 1].faceUp = true;
    }

    this.moves++;
    sfx.flip();
    this.selected = null;
    this.checkCompleteSequences();
  }

  checkCompleteSequences() {
    for (let col = 0; col < 10; col++) {
      const column = this.tableau[col];
      if (column.length >= 13) {
        // Check if last 13 cards form K to A in same suit
        let isFullSequence = true;
        const lastCard = column[column.length - 1];
        if (lastCard.value !== 0) continue; // must end in Ace

        const suit = lastCard.suit;
        for (let i = 0; i < 13; i++) {
          const card = column[column.length - 1 - i];
          if (!card.faceUp || card.suit !== suit || card.value !== i) {
            isFullSequence = false;
            break;
          }
        }

        if (isFullSequence) {
          // Remove 13 cards
          column.splice(column.length - 13, 13);
          this.completedPiles++;
          sfx.clearSuit();

          // Flip next card
          if (column.length > 0 && !column[column.length - 1].faceUp) {
            column[column.length - 1].faceUp = true;
          }

          if (this.completedPiles === 8) {
            this.won = true;
            this.reportTimer = setTimeout(() => {
              this.ctx.reportResult({
                outcome: 'win',
                score: Math.max(10, 1200 - this.moves * 10),
                coinsEarned: this.difficulty === 'schwer' ? 75 : this.difficulty === 'mittel' ? 55 : 40,
                headline: 'Spider Solitär gewonnen! 🕷️🎉'
              });
            }, 1200);
          }
          return;
        }
      }
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / 640;
    this.width = this.canvas.width / this.scale;

    const colW = (this.width - 2 * this.margin) / 10;
    this.cardW = Math.min(32, Math.floor(colW - 2));
    this.cardH = Math.round(this.cardW * 1.4);
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
    const dt = Math.min(0.1, (time - this.last) / 1000);
    this.last = time;
    if (!this.paused && !this.won) {
      this.elapsed += dt;
    }
    this.draw();
  };

  drawCardBack(x, y, w, h) {
    drawLuxuryCardBack(this.g, x, y, w, h);
  }

  drawCardFront(card, x, y, w, h, isSel = false) {
    drawLuxuryCardFront(this.g, card, x, y, w, h, isSel);
  }

  draw() {
    const { g, width } = this;
    g.save();
    g.scale(this.scale, this.scale);

    // Deep Table felt
    const bg = g.createRadialGradient(width / 2, 320, 20, width / 2, 320, 450);
    bg.addColorStop(0, '#1c1b38');
    bg.addColorStop(1, '#0e0b1f');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, 640);

    // Header
    g.fillStyle = '#ffffff';
    g.font = 'bold 13px system-ui, sans-serif';
    g.textAlign = 'left';
    g.fillText(`↶ Rückgängig`, 14, 28);

    g.textAlign = 'center';
    g.font = 'bold 13px system-ui, sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.fillText(`Züge: ${this.moves} · 🕷️ ${this.completedPiles}/8`, width / 2, 28);

    g.textAlign = 'right';
    g.fillStyle = '#00e5ff';
    g.fillText(`Neu ↺`, width - 14, 28);

    // Stock & Completed slots row
    const stockX = this.margin;
    const dealsLeft = Math.floor(this.stock.length / 10);
    if (dealsLeft > 0) {
      this.drawCardBack(stockX, this.topY, this.cardW, this.cardH);
      g.fillStyle = '#ffd700';
      g.font = 'bold 11px system-ui';
      g.textAlign = 'center';
      g.fillText(`+10 (${dealsLeft})`, stockX + this.cardW / 2, this.topY + this.cardH + 14);
    } else {
      g.strokeStyle = 'rgba(255,255,255,0.2)';
      g.strokeRect(stockX, this.topY, this.cardW, this.cardH);
    }

    // Completed suits display on right
    for (let s = 0; s < 8; s++) {
      const sx = width - this.margin - (8 - s) * (this.cardW * 0.7 + 2);
      if (s < this.completedPiles) {
        this.drawCardFront({ label: 'K', symbol: '♠', color: 'black' }, sx, this.topY, this.cardW * 0.7, this.cardH * 0.7);
      } else {
        g.strokeStyle = 'rgba(255,255,255,0.15)';
        g.lineWidth = 1;
        g.strokeRect(sx, this.topY, this.cardW * 0.7, this.cardH * 0.7);
      }
    }

    // 10 Tableau Columns
    const colW = (width - 2 * this.margin) / 10;
    for (let col = 0; col < 10; col++) {
      const cx = this.margin + col * colW;
      const column = this.tableau[col];

      if (column.length === 0) {
        g.strokeStyle = 'rgba(255,255,255,0.15)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(cx, this.tabY, this.cardW, this.cardH, 4);
        g.stroke();
      } else {
        for (let row = 0; row < column.length; row++) {
          const cy = this.tabY + row * 16;
          const card = column[row];
          const isSel = this.selected && this.selected.colIdx === col && row >= this.selected.cardIdx;
          if (card.faceUp) {
            this.drawCardFront(card, cx, cy, this.cardW, this.cardH, isSel);
          } else {
            this.drawCardBack(cx, cy, this.cardW, this.cardH);
          }
        }
      }
    }

    g.restore();
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  reset() {
    clearTimeout(this.reportTimer);
    this.initGame();
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
    return new SpiderSolitaireGame(container, ctx);
  }
};
