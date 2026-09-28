/* 1 Milliarde Offline Games – Sandfall (Arcade & Sand-Physik) */

class SoundFX {
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
  tick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }
  goal() {
    try {
      this.init();
      if (!this.ctx) return;
      const chords = [523.25, 659.25, 783.99, 1046.5];
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFX();

const SAND_COLORS = [
  { id: 1, name: 'Gold', hex: '#ffd700', rgb: [255, 215, 0] },
  { id: 2, name: 'Cyan', hex: '#00e5ff', rgb: [0, 229, 255] },
  { id: 3, name: 'Pink', hex: '#ff2d75', rgb: [255, 45, 117] },
  { id: 4, name: 'Lime', hex: '#10b981', rgb: [16, 185, 129] }
];

export class SandfallGame {
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

  // Grid simulation
  cols = 90;
  rows = 150;
  grid; // Uint8Array: 0 = empty, 1..4 = sand colors, 255 = solid wall
  cellW = 4;
  cellH = 4;

  // Gameplay
  mode = 'arcade'; // 'arcade' or 'zen'
  score = 0;
  timer = 60;
  bins = []; // targets at the bottom
  spouts = []; // emitters at the top
  ramps = []; // player-drawn or rotatable barriers
  activeRamp = null;
  selectedColor = 1;
  isPointerDown = false;
  pointerPos = { x: 0, y: 0 };
  particles = [];
  reportTimer;
  gameFinished = false;

  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas 2D nicht unterstützt');
    this.g = g;

    this.grid = new Uint8Array(this.cols * this.rows);
    this.initLevel();

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    this.start();
  }

  initLevel() {
    this.grid.fill(0);
    this.score = 0;
    this.timer = 50;
    this.gameFinished = false;
    this.particles = [];

    // Setup 3 bins at bottom: cols 8..30 (color 1), 35..55 (color 2), 60..82 (color 3)
    const binDefs = [
      { colorId: 1, cStart: 8, cEnd: 30, filled: 0, target: 120 },
      { colorId: 2, cStart: 35, cEnd: 55, filled: 0, target: 120 },
      { colorId: 3, cStart: 60, cEnd: 82, filled: 0, target: 120 }
    ];
    this.bins = binDefs;

    // Draw container walls in grid
    for (let b of this.bins) {
      for (let r = this.rows - 32; r < this.rows - 5; r++) {
        this.setGrid(b.cStart - 1, r, 255);
        this.setGrid(b.cEnd + 1, r, 255);
      }
      for (let c = b.cStart - 1; c <= b.cEnd + 1; c++) {
        this.setGrid(c, this.rows - 5, 255);
      }
    }

    // Spouts at top
    this.spouts = [
      { c: 22, colorId: 1, rate: 0.8 },
      { c: 45, colorId: 2, rate: 0.8 },
      { c: 68, colorId: 3, rate: 0.8 }
    ];

    // Pre-placed obstacles
    this.ramps = [
      { x1: 15, y1: 45, x2: 38, y2: 60, rotatable: true },
      { x1: 75, y1: 45, x2: 52, y2: 60, rotatable: true },
      { x1: 30, y1: 85, x2: 60, y2: 95, rotatable: true }
    ];
    this.bakeRamps();
  }

  bakeRamps() {
    // Clear old ramps (except bins)
    for (let r = 0; r < this.rows - 35; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.getGrid(c, r) === 255) {
          this.setGrid(c, r, 0);
        }
      }
    }

    // Draw lines for ramps
    for (let ramp of this.ramps) {
      this.drawLineGrid(ramp.x1, ramp.y1, ramp.x2, ramp.y2, 255);
    }
  }

  drawLineGrid(x0, y0, x1, y1, val) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let cx = x0;
    let cy = y0;

    while (true) {
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          this.setGrid(cx + ox, cy + oy, val);
        }
      }
      if (cx === x1 && cy === y1) break;
      let e2 = 2 * err;
      if (e2 > -dy) { err -= dy; cx += sx; }
      if (e2 < dx) { err += dx; cy += sy; }
    }
  }

  getGrid(c, r) {
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return 255;
    return this.grid[r * this.cols + c];
  }

  setGrid(c, r, val) {
    if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
      this.grid[r * this.cols + c] = val;
    }
  }

  onPointerDown = (e) => {
    this.isPointerDown = true;
    sfx.init();
    this.updatePointer(e);

    // Check if clicked near a ramp to rotate or flip it
    const gx = Math.round(this.pointerPos.x / this.cellW);
    const gy = Math.round(this.pointerPos.y / this.cellH);

    // Check if clicked on interactive ramp
    for (let ramp of this.ramps) {
      const mx = (ramp.x1 + ramp.x2) / 2;
      const my = (ramp.y1 + ramp.y2) / 2;
      if (Math.hypot(gx - mx, gy - my) < 14) {
        // Flip ramp angle!
        const dx = ramp.x2 - ramp.x1;
        const dy = ramp.y2 - ramp.y1;
        ramp.x1 = Math.round(mx - dy * 0.7);
        ramp.y1 = Math.round(my + dx * 0.7);
        ramp.x2 = Math.round(mx + dy * 0.7);
        ramp.y2 = Math.round(my - dx * 0.7);
        this.bakeRamps();
        sfx.tick();
        return;
      }
    }

    // Check if clicked bottom color picker or zen mode
    if (this.pointerPos.y < 50 && this.pointerPos.x > this.width - 90) {
      this.initLevel();
      return;
    }
  };

  onPointerMove = (e) => {
    if (this.isPointerDown) {
      this.updatePointer(e);
      // Spawn sand under finger!
      const gx = Math.round(this.pointerPos.x / this.cellW);
      const gy = Math.round(this.pointerPos.y / this.cellH);
      for (let ox = -2; ox <= 2; ox++) {
        for (let oy = -2; oy <= 2; oy++) {
          if (Math.random() < 0.4 && this.getGrid(gx + ox, gy + oy) === 0) {
            this.setGrid(gx + ox, gy + oy, this.selectedColor);
          }
        }
      }
    }
  };

  onPointerUp = () => {
    this.isPointerDown = false;
  };

  updatePointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerPos.x = (e.clientX - rect.left) / this.scale;
    this.pointerPos.y = (e.clientY - rect.top) / this.scale;
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / 640;
    this.width = this.canvas.width / this.scale;
    this.cellW = this.width / this.cols;
    this.cellH = 640 / this.rows;
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
    const dt = Math.min(0.05, (time - this.last) / 1000);
    this.last = time;

    if (!this.paused && !this.gameFinished) {
      this.update(dt);
    }
    this.draw();
  };

  update(dt) {
    this.timer = Math.max(0, this.timer - dt);

    // Spouts emit sand
    for (let spout of this.spouts) {
      if (Math.random() < spout.rate) {
        const spread = Math.floor((Math.random() - 0.5) * 4);
        const c = spout.c + spread;
        if (this.getGrid(c, 8) === 0) {
          this.setGrid(c, 8, spout.colorId);
        }
      }
    }

    // Step cellular automaton simulation bottom-to-top
    for (let r = this.rows - 6; r >= 0; r--) {
      // Alternate scan order left/right to prevent bias
      const leftToRight = Math.random() < 0.5;
      const startC = leftToRight ? 0 : this.cols - 1;
      const endC = leftToRight ? this.cols : -1;
      const stepC = leftToRight ? 1 : -1;

      for (let c = startC; c !== endC; c += stepC) {
        const cell = this.getGrid(c, r);
        if (cell > 0 && cell < 255) {
          // Check down
          const down = this.getGrid(c, r + 1);
          if (down === 0) {
            this.setGrid(c, r + 1, cell);
            this.setGrid(c, r, 0);
          } else {
            // Check diagonals
            const dir = Math.random() < 0.5 ? 1 : -1;
            const d1 = this.getGrid(c + dir, r + 1);
            const d2 = this.getGrid(c - dir, r + 1);
            if (d1 === 0) {
              this.setGrid(c + dir, r + 1, cell);
              this.setGrid(c, r, 0);
            } else if (d2 === 0) {
              this.setGrid(c - dir, r + 1, cell);
              this.setGrid(c, r, 0);
            }
          }
        }
      }
    }

    // Check bins filling
    let allBinsFull = true;
    for (let b of this.bins) {
      let count = 0;
      for (let r = this.rows - 30; r < this.rows - 6; r++) {
        for (let c = b.cStart; c <= b.cEnd; c++) {
          const val = this.getGrid(c, r);
          if (val === b.colorId) count++;
          else if (val > 0 && val < 255) count -= 0.5; // wrong color penalty
        }
      }
      b.filled = Math.max(0, count);
      if (b.filled < b.target) allBinsFull = false;
    }

    this.score = Math.round(this.bins.reduce((acc, b) => acc + Math.min(b.target, b.filled), 0) * 1.5);

    if (allBinsFull && !this.gameFinished) {
      this.gameFinished = true;
      sfx.goal();
      const coinsEarned = 35 + Math.round(this.timer * 0.5);
      this.reportTimer = setTimeout(() => {
        this.ctx.reportResult({
          outcome: 'win',
          score: this.score,
          coinsEarned,
          headline: 'Alle Gläser gefüllt! 🏆'
        });
      }, 1000);
    } else if (this.timer <= 0 && !this.gameFinished) {
      this.gameFinished = true;
      const coinsEarned = Math.max(5, Math.round(this.score / 15));
      this.reportTimer = setTimeout(() => {
        this.ctx.reportResult({
          outcome: 'completed',
          score: this.score,
          coinsEarned,
          headline: this.score > 200 ? 'Klasse Runde!' : 'Zeit abgelaufen'
        });
      }, 1000);
    }
  }

  draw() {
    const { g, width } = this;
    g.save();
    g.scale(this.scale, this.scale);

    // Background gradient
    const bg = g.createLinearGradient(0, 0, 0, 640);
    bg.addColorStop(0, '#0a0718');
    bg.addColorStop(1, '#1b1338');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, 640);

    // Draw grid pixels
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const val = this.getGrid(c, r);
        if (val > 0) {
          if (val === 255) {
            g.fillStyle = '#4a3f78';
            g.fillRect(c * this.cellW, r * this.cellH, this.cellW + 0.5, this.cellH + 0.5);
          } else {
            const sc = SAND_COLORS[val - 1];
            g.fillStyle = sc ? sc.hex : '#fff';
            g.fillRect(c * this.cellW, r * this.cellH, this.cellW, this.cellH);
          }
        }
      }
    }

    // Draw Bins labels & progress
    for (let b of this.bins) {
      const sc = SAND_COLORS[b.colorId - 1];
      const bx = b.cStart * this.cellW;
      const bw = (b.cEnd - b.cStart) * this.cellW;
      const pct = Math.min(1, b.filled / b.target);

      // Glass highlight
      g.strokeStyle = sc.hex;
      g.lineWidth = 2;
      g.strokeRect(bx, (this.rows - 32) * this.cellH, bw, 26 * this.cellH);

      // Label below
      g.fillStyle = '#fff';
      g.font = 'bold 12px system-ui, sans-serif';
      g.textAlign = 'center';
      g.fillText(`${Math.round(pct * 100)}%`, bx + bw / 2, 630);
    }

    // Interactive ramps indicators
    g.fillStyle = '#00e5ff';
    for (let ramp of this.ramps) {
      const mx = ((ramp.x1 + ramp.x2) / 2) * this.cellW;
      const my = ((ramp.y1 + ramp.y2) / 2) * this.cellH;
      g.beginPath();
      g.arc(mx, my, 8, 0, Math.PI * 2);
      g.fillStyle = 'rgba(0, 229, 255, 0.4)';
      g.fill();
      g.strokeStyle = '#00e5ff';
      g.lineWidth = 1.5;
      g.stroke();
      g.fillStyle = '#fff';
      g.font = 'bold 9px system-ui';
      g.textAlign = 'center';
      g.fillText('↻', mx, my + 3);
    }

    // Top HUD
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.font = '900 24px system-ui, sans-serif';
    g.textAlign = 'left';
    g.fillText(`${this.score} Pkt`, 16, 32);

    g.textAlign = 'right';
    g.font = 'bold 16px system-ui, sans-serif';
    g.fillStyle = this.timer < 10 ? '#ff2d75' : '#00e5ff';
    g.fillText(`⏱️ ${Math.ceil(this.timer)} s`, width - 16, 30);

    // Tip
    g.font = '11px system-ui';
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.textAlign = 'center';
    g.fillText('Tippe auf ↻ zum Drehen · Ziehe den Finger für extra Sand', width / 2, 50);

    g.restore();
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  reset() {
    clearTimeout(this.reportTimer);
    this.initLevel();
  }
  dispose() {
    this.stop();
    clearTimeout(this.reportTimer);
    this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.remove();
  }
}

export default {
  async initialize(container, ctx) {
    return new SandfallGame(container, ctx);
  }
};
