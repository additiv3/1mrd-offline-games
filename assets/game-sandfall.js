/* 1 Milliarde Offline Games – Sandtrix (Tetris + Sand Physics) */

const SHAPES = [
  // I
  [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
  // J
  [[1,0,0], [1,1,1], [0,0,0]],
  // L
  [[0,0,1], [1,1,1], [0,0,0]],
  // O
  [[1,1], [1,1]],
  // S
  [[0,1,1], [1,1,0], [0,0,0]],
  // T
  [[0,1,0], [1,1,1], [0,0,0]],
  // Z
  [[1,1,0], [0,1,1], [0,0,0]]
];

const COLORS = [
  '#fdfdfd', // placeholder
  '#00e5ff', // cyan (I)
  '#3b82f6', // blue (J)
  '#f59e0b', // orange (L)
  '#eab308', // yellow (O)
  '#10b981', // green (S)
  '#a855f7', // purple (T)
  '#ef4444'  // red (Z)
];

function playTone(freq, type = 'sine', duration = 0.1, gainLevel = 0.1) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export class SandtrixGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);
    
    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas nicht unterstützt');
    this.g = g;
    
    // Board resolution (Tetris is 10x20 blocks)
    // We make each block 4x4 sand pixels -> 40x80 sand pixels
    this.cols = 40;
    this.rows = 80;
    this.blockSize = 4; // 1 Tetris block = 4x4 sand pixels
    
    this.grid = new Uint8Array(this.cols * this.rows);
    this.width = 360;
    this.height = 640;
    this.scale = 1;
    this.raf = 0;
    
    this.last = 0;
    this.fallTimer = 0;
    this.fallInterval = 0.5; // Seconds per block drop
    
    this.score = 0;
    this.gameOver = false;
    this.paused = false;
    
    this.activePiece = null;
    
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();
    
    // Controls
    window.addEventListener('keydown', this.onKey);
    
    // Touch controls
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.lastTouchX = 0;
    this.canvas.addEventListener('touchstart', this.onTouchStart, {passive: false});
    this.canvas.addEventListener('touchmove', this.onTouchMove, {passive: false});
    this.canvas.addEventListener('touchend', this.onTouchEnd, {passive: false});
    
    this.reset();
  }
  
  reset() {
    this.grid.fill(0);
    this.score = 0;
    this.gameOver = false;
    this.fallInterval = 0.5;
    this.spawnPiece();
    this.start();
  }
  
  spawnPiece() {
    const type = Math.floor(Math.random() * 7);
    const shape = SHAPES[type];
    
    this.activePiece = {
      shape: shape.map(row => [...row]),
      color: type + 1,
      x: Math.floor((10 - shape[0].length) / 2) * this.blockSize,
      y: 0
    };
    
    if (this.checkCollision(this.activePiece.x, this.activePiece.y, this.activePiece.shape)) {
      this.finishGame();
    }
  }
  
  // Checks collision in sand pixels
  checkCollision(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          // Check the 4x4 block
          for (let br = 0; br < this.blockSize; br++) {
            for (let bc = 0; bc < this.blockSize; bc++) {
              const px = x + c * this.blockSize + bc;
              const py = y + r * this.blockSize + br;
              
              if (px < 0 || px >= this.cols || py >= this.rows) return true;
              if (py >= 0 && this.grid[py * this.cols + px] > 0) return true;
            }
          }
        }
      }
    }
    return false;
  }
  
  shatterPiece() {
    playTone(200, 'sawtooth', 0.1, 0.05);
    const p = this.activePiece;
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c]) {
          for (let br = 0; br < this.blockSize; br++) {
            for (let bc = 0; bc < this.blockSize; bc++) {
              const px = p.x + c * this.blockSize + bc;
              const py = p.y + r * this.blockSize + br;
              if (py >= 0 && py < this.rows && px >= 0 && px < this.cols) {
                this.grid[py * this.cols + px] = p.color;
              }
            }
          }
        }
      }
    }
    this.spawnPiece();
  }
  
  rotatePiece() {
    if (!this.activePiece) return;
    const p = this.activePiece;
    const newShape = [];
    for (let c = 0; c < p.shape[0].length; c++) {
      const newRow = [];
      for (let r = p.shape.length - 1; r >= 0; r--) {
        newRow.push(p.shape[r][c]);
      }
      newShape.push(newRow);
    }
    
    // Wall kick simple
    let kickedX = p.x;
    if (this.checkCollision(kickedX, p.y, newShape)) kickedX -= this.blockSize;
    if (this.checkCollision(kickedX, p.y, newShape)) kickedX += this.blockSize * 2;
    if (this.checkCollision(kickedX, p.y, newShape)) return; // failed
    
    p.shape = newShape;
    p.x = kickedX;
    playTone(600, 'sine', 0.05, 0.05);
  }
  
  onKey = (e) => {
    if (this.gameOver || this.paused || !this.activePiece) return;
    
    if (e.code === 'ArrowLeft') {
      if (!this.checkCollision(this.activePiece.x - this.blockSize, this.activePiece.y, this.activePiece.shape)) {
        this.activePiece.x -= this.blockSize;
      }
    } else if (e.code === 'ArrowRight') {
      if (!this.checkCollision(this.activePiece.x + this.blockSize, this.activePiece.y, this.activePiece.shape)) {
        this.activePiece.x += this.blockSize;
      }
    } else if (e.code === 'ArrowUp') {
      this.rotatePiece();
    } else if (e.code === 'ArrowDown') {
      this.fallTimer = this.fallInterval; // Force drop step
    }
  };
  
  onTouchStart = (e) => {
    e.preventDefault();
    if (this.gameOver) {
      this.reset();
      return;
    }
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.lastTouchX = this.touchStartX;
  };
  
  onTouchMove = (e) => {
    e.preventDefault();
    if (this.gameOver || this.paused || !this.activePiece) return;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    
    // Threshold for moving left/right (scale with screen)
    const threshold = (this.width / 10) * this.scale;
    
    if (x - this.lastTouchX > threshold) {
      if (!this.checkCollision(this.activePiece.x + this.blockSize, this.activePiece.y, this.activePiece.shape)) {
        this.activePiece.x += this.blockSize;
        this.lastTouchX = x;
      }
    } else if (this.lastTouchX - x > threshold) {
      if (!this.checkCollision(this.activePiece.x - this.blockSize, this.activePiece.y, this.activePiece.shape)) {
        this.activePiece.x -= this.blockSize;
        this.lastTouchX = x;
      }
    }
    
    // Fast drop
    if (y - this.touchStartY > threshold * 1.5) {
      this.fallTimer = this.fallInterval;
      this.touchStartY = y;
    }
  };
  
  onTouchEnd = (e) => {
    e.preventDefault();
    if (this.gameOver || this.paused || !this.activePiece) return;
    // Tap to rotate if barely moved
    const dx = Math.abs(e.changedTouches[0].clientX - this.touchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - this.touchStartY);
    if (dx < 15 && dy < 15) {
      this.rotatePiece();
    }
  };
  
  update(dt) {
    if (this.gameOver || this.paused) return;
    
    // Block Falling
    if (this.activePiece) {
      this.fallTimer += dt;
      if (this.fallTimer >= this.fallInterval) {
        this.fallTimer = 0;
        if (!this.checkCollision(this.activePiece.x, this.activePiece.y + 1, this.activePiece.shape)) {
          this.activePiece.y += 1; // Falls 1 pixel at a time for smoothness
        } else {
          this.shatterPiece();
        }
      }
    }
    
    // Sand Physics (Cellular Automata)
    // Run multiple steps per frame to make sand fall fast
    const steps = 3;
    for (let s = 0; s < steps; s++) {
      for (let r = this.rows - 2; r >= 0; r--) {
        const leftToRight = Math.random() < 0.5;
        const startC = leftToRight ? 0 : this.cols - 1;
        const endC = leftToRight ? this.cols : -1;
        const stepC = leftToRight ? 1 : -1;
        
        for (let c = startC; c !== endC; c += stepC) {
          const val = this.grid[r * this.cols + c];
          if (val > 0) {
            const down = this.grid[(r + 1) * this.cols + c];
            if (down === 0) {
              this.grid[(r + 1) * this.cols + c] = val;
              this.grid[r * this.cols + c] = 0;
            } else {
              const dir = Math.random() < 0.5 ? 1 : -1;
              const d1Empty = c + dir >= 0 && c + dir < this.cols && this.grid[(r + 1) * this.cols + c + dir] === 0;
              const d2Empty = c - dir >= 0 && c - dir < this.cols && this.grid[(r + 1) * this.cols + c - dir] === 0;
              
              if (d1Empty) {
                this.grid[(r + 1) * this.cols + c + dir] = val;
                this.grid[r * this.cols + c] = 0;
              } else if (d2Empty) {
                this.grid[(r + 1) * this.cols + c - dir] = val;
                this.grid[r * this.cols + c] = 0;
              }
            }
          }
        }
      }
    }
    
    // Line Clearing (Horizontal line full of sand)
    let linesCleared = 0;
    for (let r = this.rows - 1; r >= 0; r--) {
      let full = true;
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r * this.cols + c] === 0) {
          full = false;
          break;
        }
      }
      
      if (full) {
        linesCleared++;
        // Shift everything above down
        for (let yr = r; yr > 0; yr--) {
          for (let c = 0; c < this.cols; c++) {
            this.grid[yr * this.cols + c] = this.grid[(yr - 1) * this.cols + c];
          }
        }
        // Top row empty
        for (let c = 0; c < this.cols; c++) {
          this.grid[c] = 0;
        }
        r++; // Recheck this row index
      }
    }
    
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] || 1000;
      this.score += points;
      this.fallInterval = Math.max(0.1, 0.5 - (this.score / 10000));
      playTone(523 + linesCleared * 100, 'sine', 0.3, 0.2);
    }
  }
  
  finishGame() {
    this.gameOver = true;
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'completed',
        score: this.score,
        headline: `Game Over! ${this.score} Pkt`
      });
    }, 1000);
  }
  
  draw() {
    const { g, width, height } = this;
    g.save();
    g.scale(this.scale, this.scale);
    
    // Background
    g.fillStyle = '#0f172a';
    g.fillRect(0, 0, width, height);
    
    // Grid Lines (subtle)
    g.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    g.lineWidth = 1;
    
    // Calculate rendering cell sizes
    // We want the 40x80 grid to fit in an area, say 240x480 (centered)
    const renderW = 320;
    const renderH = 640;
    const cellW = renderW / this.cols;
    const cellH = renderH / this.rows;
    const offX = (width - renderW) / 2;
    const offY = height - renderH;
    
    // Draw play area background
    g.fillStyle = '#000000';
    g.fillRect(offX, offY, renderW, renderH);
    g.strokeRect(offX, offY, renderW, renderH);
    
    // Draw Sand
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const val = this.grid[r * this.cols + c];
        if (val > 0) {
          g.fillStyle = COLORS[val];
          g.fillRect(offX + c * cellW, offY + r * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    }
    
    // Draw Active Piece
    if (this.activePiece) {
      g.fillStyle = COLORS[this.activePiece.color];
      const p = this.activePiece;
      for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
          if (p.shape[r][c]) {
            g.fillRect(
              offX + (p.x + c * this.blockSize) * cellW,
              offY + (p.y + r * this.blockSize) * cellH,
              this.blockSize * cellW,
              this.blockSize * cellH
            );
            // Block border to make it look solid
            g.strokeStyle = 'rgba(255,255,255,0.4)';
            g.strokeRect(
              offX + (p.x + c * this.blockSize) * cellW,
              offY + (p.y + r * this.blockSize) * cellH,
              this.blockSize * cellW,
              this.blockSize * cellH
            );
          }
        }
      }
    }
    
    // UI
    g.fillStyle = '#ffffff';
    g.font = '900 24px system-ui';
    g.textAlign = 'left';
    g.fillText(`Score: ${this.score}`, 20, 30);
    
    if (this.gameOver) {
      g.fillStyle = 'rgba(0,0,0,0.7)';
      g.fillRect(0, 0, width, height);
      g.fillStyle = '#ff2d75';
      g.textAlign = 'center';
      g.font = '900 42px system-ui';
      g.fillText('GAME OVER', width / 2, height / 2);
      g.fillStyle = '#ffffff';
      g.font = 'bold 20px system-ui';
      g.fillText('Tippe für Neustart', width / 2, height / 2 + 40);
    }
    
    g.restore();
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
    const dt = Math.min(0.05, Math.max(0, (time - this.last) / 1000));
    this.last = time;
    this.update(dt);
    this.draw();
  };
  
  pause() { this.paused = true; }
  resume() { this.paused = false; this.last = performance.now(); }
  dispose() {
    this.stop();
    this.observer.disconnect();
    window.removeEventListener('keydown', this.onKey);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchmove', this.onTouchMove);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
    this.canvas.remove();
  }
}

export default {
  async initialize(container, ctx) {
    return new SandtrixGame(container, ctx);
  }
};
