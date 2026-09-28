import { getEquippedSkin } from './shop-manager.js';
import { drawLuxuryCardFront, drawLuxuryCardBack } from './card-graphics.js';

const SUITS = [
  { id: 'spades', symbol: '♠', color: 'black' },
  { id: 'hearts', symbol: '♥', color: 'red' },
  { id: 'diamonds', symbol: '♦', color: 'red' },
  { id: 'clubs', symbol: '♣', color: 'black' }
];

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class SolitaireSFX {
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
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
  place() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }
  win() {
    try {
      this.init();
      if (!this.ctx) return;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.4);
      });
    } catch (e) {}
  }
}

const sfx = new SolitaireSFX();

export class SolitaireGame {
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

  stock = [];
  waste = [];
  foundations = [[], [], [], []]; // 4 suits
  tableau = [[], [], [], [], [], [], []]; // 7 columns

  history = [];
  selected = null; // { from: 'waste' | 'tableau' | 'foundation', colIdx, cardIdx }
  moves = 0;
  startTime = 0;
  elapsed = 0;
  won = false;
  reportTimer;

  // Layout metrics
  cardW = 42;
  cardH = 58;
  margin = 8;
  spacing = 6;
  topY = 55;
  tabY = 135;

  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
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
    this.startTime = performance.now();
    this.elapsed = 0;

    // Build 52-card deck
    const deck = [];
    for (let s of SUITS) {
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

    // Shuffle (Fisher-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal into tableau (1 to 7)
    this.tableau = [[], [], [], [], [], [], []];
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck.pop();
        card.faceUp = (row === col);
        this.tableau[col].push(card);
      }
    }

    this.foundations = [[], [], [], []];
    this.waste = [];
    this.stock = deck; // remaining 24 cards
  }

  saveState() {
    const cloneCard = c => ({ ...c });
    this.history.push({
      stock: this.stock.map(cloneCard),
      waste: this.waste.map(cloneCard),
      foundations: this.foundations.map(col => col.map(cloneCard)),
      tableau: this.tableau.map(col => col.map(cloneCard)),
      moves: this.moves
    });
    if (this.history.length > 30) this.history.shift();
  }

  undo() {
    if (this.history.length === 0 || this.won) return;
    const prev = this.history.pop();
    this.stock = prev.stock;
    this.waste = prev.waste;
    this.foundations = prev.foundations;
    this.tableau = prev.tableau;
    this.moves = prev.moves;
    this.selected = null;
    sfx.flip();
  }

  onPointerDown = (e) => {
    sfx.init();
    const rect = this.canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) / this.scale;
    const py = (e.clientY - rect.top) / this.scale;

    // Check top bar buttons: Undo & Auto-Finish & Restart
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
      // Check Auto-complete if eligible
      if (this.canAutoComplete() && px > this.width / 2 - 50 && px < this.width / 2 + 50) {
        this.autoComplete();
        return;
      }
    }

    // Check Stock pile
    const stockX = this.margin;
    if (px >= stockX && px <= stockX + this.cardW && py >= this.topY && py <= this.topY + this.cardH) {
      this.saveState();
      if (this.stock.length > 0) {
        const card = this.stock.pop();
        card.faceUp = true;
        this.waste.push(card);
        this.moves++;
        sfx.flip();
      } else if (this.waste.length > 0) {
        // Recycle waste to stock
        while (this.waste.length > 0) {
          const card = this.waste.pop();
          card.faceUp = false;
          this.stock.push(card);
        }
        sfx.flip();
      }
      this.selected = null;
      return;
    }

    // Check Waste pile
    const wasteX = this.margin + this.cardW + this.spacing;
    if (px >= wasteX && px <= wasteX + this.cardW && py >= this.topY && py <= this.topY + this.cardH) {
      if (this.waste.length > 0) {
        const topWaste = this.waste[this.waste.length - 1];
        // Quick auto-move to foundations first
        if (this.tryMoveToFoundation(topWaste, 'waste')) return;
        // Or toggle select
        this.selected = { from: 'waste', card: topWaste };
        sfx.place();
      }
      return;
    }

    // Check Foundations (top right 4 piles)
    for (let f = 0; f < 4; f++) {
      const fx = this.width - this.margin - (4 - f) * (this.cardW + this.spacing);
      if (px >= fx && px <= fx + this.cardW && py >= this.topY && py <= this.topY + this.cardH) {
        if (this.selected) {
          // Attempt to move selected card to this foundation
          const card = this.selected.card;
          if (this.canPlaceOnFoundation(card, f)) {
            this.executeMoveToFoundation(f);
            return;
          }
        }
        this.selected = null;
        return;
      }
    }

    // Check Tableau (7 columns)
    const tabSpacing = (this.width - 2 * this.margin - 7 * this.cardW) / 6;
    for (let col = 0; col < 7; col++) {
      const cx = this.margin + col * (this.cardW + tabSpacing);
      const column = this.tableau[col];

      if (px >= cx && px <= cx + this.cardW) {
        // If column is empty, check if we have a King selected to place here
        if (column.length === 0) {
          if (py >= this.tabY && py <= this.tabY + this.cardH) {
            if (this.selected && this.selected.card.value === 12) {
              this.executeMoveToTableau(col);
              return;
            }
          }
        } else {
          // Find which card was clicked from bottom up
          for (let row = column.length - 1; row >= 0; row--) {
            const cy = this.tabY + row * 18;
            const h = (row === column.length - 1) ? this.cardH : 18;
            if (py >= cy && py <= cy + h) {
              const card = column[row];
              if (!card.faceUp) {
                // If it's the top face-down card and uncovered, flip it!
                if (row === column.length - 1) {
                  this.saveState();
                  card.faceUp = true;
                  sfx.flip();
                }
                return;
              }

              // Clicked on face-up card:
              if (this.selected) {
                // Try moving selected card/stack onto this card
                const topTarget = column[column.length - 1];
                if (this.canPlaceOnTableau(this.selected.card, topTarget)) {
                  this.executeMoveToTableau(col);
                  return;
                }
              }

              // Try Quick-move to foundation if top card
              if (row === column.length - 1 && this.tryMoveToFoundation(card, 'tableau', col)) {
                return;
              }

              // Or select this card/sequence
              this.selected = { from: 'tableau', colIdx: col, cardIdx: row, card };
              sfx.place();
              return;
            }
          }
        }
      }
    }

    this.selected = null;
  };

  canPlaceOnFoundation(card, fIdx) {
    const fPile = this.foundations[fIdx];
    if (fPile.length === 0) {
      return card.value === 0; // Ace
    }
    const top = fPile[fPile.length - 1];
    return top.suit === card.suit && top.value + 1 === card.value;
  }

  canPlaceOnTableau(movingCard, targetCard) {
    if (!targetCard) return movingCard.value === 12; // King on empty
    return targetCard.color !== movingCard.color && targetCard.value === movingCard.value + 1;
  }

  tryMoveToFoundation(card, from, colIdx) {
    for (let f = 0; f < 4; f++) {
      if (this.canPlaceOnFoundation(card, f)) {
        this.saveState();
        if (from === 'waste') {
          this.foundations[f].push(this.waste.pop());
        } else if (from === 'tableau') {
          this.foundations[f].push(this.tableau[colIdx].pop());
          // Flip uncovered card below
          const col = this.tableau[colIdx];
          if (col.length > 0 && !col[col.length - 1].faceUp) {
            col[col.length - 1].faceUp = true;
          }
        }
        this.moves++;
        sfx.place();
        this.selected = null;
        this.checkWin();
        return true;
      }
    }
    return false;
  }

  executeMoveToFoundation(fIdx) {
    if (!this.selected) return;
    this.saveState();
    if (this.selected.from === 'waste') {
      this.foundations[fIdx].push(this.waste.pop());
    } else if (this.selected.from === 'tableau') {
      const col = this.tableau[this.selected.colIdx];
      this.foundations[fIdx].push(col.pop());
      if (col.length > 0 && !col[col.length - 1].faceUp) {
        col[col.length - 1].faceUp = true;
      }
    }
    this.moves++;
    sfx.place();
    this.selected = null;
    this.checkWin();
  }

  executeMoveToTableau(targetColIdx) {
    if (!this.selected) return;
    this.saveState();
    const targetCol = this.tableau[targetColIdx];

    if (this.selected.from === 'waste') {
      targetCol.push(this.waste.pop());
    } else if (this.selected.from === 'tableau') {
      const sourceCol = this.tableau[this.selected.colIdx];
      const movingStack = sourceCol.splice(this.selected.cardIdx);
      targetCol.push(...movingStack);
      if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }
    }
    this.moves++;
    sfx.place();
    this.selected = null;
  }

  canAutoComplete() {
    if (this.stock.length > 0 || this.waste.length > 0) return false;
    for (let col of this.tableau) {
      for (let c of col) {
        if (!c.faceUp) return false;
      }
    }
    return true;
  }

  autoComplete() {
    let moved = false;
    for (let col = 0; col < 7; col++) {
      const column = this.tableau[col];
      if (column.length > 0) {
        const top = column[column.length - 1];
        for (let f = 0; f < 4; f++) {
          if (this.canPlaceOnFoundation(top, f)) {
            this.foundations[f].push(column.pop());
            moved = true;
            sfx.place();
            break;
          }
        }
      }
    }
    if (moved) {
      this.checkWin();
      if (!this.won) {
        setTimeout(() => this.autoComplete(), 100);
      }
    }
  }

  checkWin() {
    const totalFound = this.foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalFound === 52 && !this.won) {
      this.won = true;
      sfx.win();
      this.reportTimer = setTimeout(() => {
        this.ctx.reportResult({
          outcome: 'win',
          score: Math.max(10, 1000 - this.moves * 10 - Math.round(this.elapsed)),
          coinsEarned: 45,
          headline: 'Solitär gemeistert! 🃏🎉'
        });
      }, 1200);
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / 640;
    this.width = this.canvas.width / this.scale;

    // Card metrics adapt to width
    const availW = this.width - 2 * this.margin;
    this.cardW = Math.min(46, Math.floor(availW / 7.6));
    this.cardH = Math.round(this.cardW * 1.38);
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
    const dt = Math.min(0.1, Math.max(0, (time - this.last) / 1000));
    this.last = time;
    if (!this.paused && !this.won) {
      this.elapsed += dt;
    }
    this.draw();
  };

  drawCardBack(x, y, w, h) {
    drawLuxuryCardBack(this.g, x, y, w, h);
  }

  drawCardFront(card, x, y, w, h, isSelected = false) {
    drawLuxuryCardFront(this.g, card, x, y, w, h, isSelected);
  }

  draw() {
    const { g, width } = this;
    g.save();
    g.scale(this.scale, this.scale);

    // Green Felt / Dark Table Background
    const bg = g.createRadialGradient(width / 2, 320, 20, width / 2, 320, 450);
    bg.addColorStop(0, '#0f3823');
    bg.addColorStop(1, '#06170d');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, 640);

    // Top Header & Controls
    g.fillStyle = '#ffffff';
    g.font = 'bold 13px system-ui, sans-serif';
    g.textAlign = 'left';
    g.fillText(`↶ Rückgängig`, 14, 28);

    g.textAlign = 'center';
    g.font = 'bold 14px system-ui, sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.85)';
    const mins = Math.floor(this.elapsed / 60);
    const secs = String(Math.floor(this.elapsed % 60)).padStart(2, '0');
    g.fillText(`Züge: ${this.moves} · ${mins}:${secs}`, width / 2, 28);

    g.textAlign = 'right';
    g.fillStyle = '#00e5ff';
    g.fillText(`Neu ↺`, width - 14, 28);

    // Auto-complete button if ready
    if (this.canAutoComplete()) {
      g.fillStyle = '#ffd700';
      g.font = 'bold 12px system-ui';
      g.textAlign = 'center';
      g.fillText('✨ Auto-Lösen ✨', width / 2, 46);
    }

    // Top Row: Stock & Waste
    const stockX = this.margin;
    if (this.stock.length > 0) {
      this.drawCardBack(stockX, this.topY, this.cardW, this.cardH);
    } else {
      // Empty stock placeholder
      g.strokeStyle = 'rgba(255,255,255,0.2)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.roundRect(stockX, this.topY, this.cardW, this.cardH, 6);
      g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.3)';
      g.font = '16px system-ui';
      g.textAlign = 'center';
      g.fillText('↺', stockX + this.cardW / 2, this.topY + this.cardH / 2 + 6);
    }

    const wasteX = stockX + this.cardW + this.spacing;
    if (this.waste.length > 0) {
      const topWaste = this.waste[this.waste.length - 1];
      const isSel = this.selected && this.selected.from === 'waste';
      this.drawCardFront(topWaste, wasteX, this.topY, this.cardW, this.cardH, isSel);
    } else {
      g.strokeStyle = 'rgba(255,255,255,0.15)';
      g.lineWidth = 1;
      g.beginPath();
      g.roundRect(wasteX, this.topY, this.cardW, this.cardH, 6);
      g.stroke();
    }

    // Top Row: Foundations (4 piles right)
    for (let f = 0; f < 4; f++) {
      const fx = width - this.margin - (4 - f) * (this.cardW + this.spacing);
      const fPile = this.foundations[f];
      if (fPile.length > 0) {
        this.drawCardFront(fPile[fPile.length - 1], fx, this.topY, this.cardW, this.cardH);
      } else {
        g.strokeStyle = 'rgba(255,255,255,0.25)';
        g.lineWidth = 1.5;
        g.beginPath();
        g.roundRect(fx, this.topY, this.cardW, this.cardH, 6);
        g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.2)';
        g.font = '18px system-ui';
        g.textAlign = 'center';
        g.fillText(SUITS[f].symbol, fx + this.cardW / 2, this.topY + this.cardH / 2 + 6);
      }
    }

    // Tableau (7 columns)
    const tabSpacing = (width - 2 * this.margin - 7 * this.cardW) / 6;
    for (let col = 0; col < 7; col++) {
      const cx = this.margin + col * (this.cardW + tabSpacing);
      const column = this.tableau[col];

      if (column.length === 0) {
        g.strokeStyle = 'rgba(255,255,255,0.15)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(cx, this.tabY, this.cardW, this.cardH, 6);
        g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.1)';
        g.font = '14px system-ui';
        g.textAlign = 'center';
        g.fillText('K', cx + this.cardW / 2, this.tabY + this.cardH / 2 + 5);
      } else {
        for (let row = 0; row < column.length; row++) {
          const cy = this.tabY + row * 18;
          const card = column[row];
          const isSel = this.selected && this.selected.from === 'tableau' && this.selected.colIdx === col && row >= this.selected.cardIdx;
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
    return new SolitaireGame(container, ctx);
  }
};
