/* 1 Milliarde Offline Games – Snake Retro Deluxe
   Klassisches Snake mit Neon-Apfel-Animationen, Highscore, Speed-Stufen und Touch-Gesten */

function playTone(freq, type = 'sine', duration = 0.08, gainLevel = 0.15) {
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
  } catch {
    // ignore
  }
}

export class SnakeGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.gridSize = 20;
    this.difficulty = ctx.difficulty || 'mittel';
    this.speed = this.difficulty === 'leicht' ? 140 : this.difficulty === 'schwer' ? 80 : 110;

    this.initCanvas();
    this.initGame();
    this.bindEvents();
    this.startLoop();
  }

  initCanvas() {
    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none items-center justify-between p-3 font-sans text-ink">
        <div class="w-full max-w-sm flex items-center justify-between px-3 py-2 bg-surface rounded-2xl border border-line">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🐍</span>
            <div>
              <span class="text-xs font-black text-pop-lime block">Snake Retro</span>
              <span class="text-[10px] text-ink-muted">Wische oder nutze die Pfeile</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-ink-muted">Punkte</span>
              <span id="snake-score" class="block text-lg font-black text-pop-lime leading-tight">0</span>
            </div>
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-ink-muted">Rekord</span>
              <span id="snake-best" class="block text-lg font-black text-ink-muted leading-tight">0</span>
            </div>
          </div>
        </div>

        <div class="relative flex-1 w-full max-w-sm flex items-center justify-center p-2">
          <canvas id="snake-canvas" class="rounded-2xl border-2 border-line bg-surface shadow-2xl w-full aspect-square max-h-[360px]"></canvas>
        </div>

        <!-- Touch Controls -->
        <div class="w-full max-w-xs grid grid-cols-3 gap-2 pb-2">
          <div class="col-start-2">
            <button id="s-up" type="button" class="w-full py-3 rounded-2xl bg-surface-raised border border-line text-xl font-black active:scale-90 transition shadow">↑</button>
          </div>
          <div class="col-start-1 row-start-2">
            <button id="s-left" type="button" class="w-full py-3 rounded-2xl bg-surface-raised border border-line text-xl font-black active:scale-90 transition shadow">←</button>
          </div>
          <div class="col-start-2 row-start-2">
            <button id="s-down" type="button" class="w-full py-3 rounded-2xl bg-surface-raised border border-line text-xl font-black active:scale-90 transition shadow">↓</button>
          </div>
          <div class="col-start-3 row-start-2">
            <button id="s-right" type="button" class="w-full py-3 rounded-2xl bg-surface-raised border border-line text-xl font-black active:scale-90 transition shadow">→</button>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#snake-canvas');
    this.scoreEl = this.container.querySelector('#snake-score');
    this.bestEl = this.container.querySelector('#snake-best');
    this.g = this.canvas.getContext('2d');

    // Highscore from storage
    this.bestScore = this.ctx.storage?.get('snake:best', 0) || 0;
    this.bestEl.innerText = this.bestScore;
  }

  initGame() {
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.tile = this.canvas.width / this.gridSize;

    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };
    this.moveQueue = [];
    this.score = 0;
    this.scoreEl.innerText = '0';
    this.isOver = false;
    this.spawnFood();
  }

  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
      valid = !this.snake.some(seg => seg.x === this.food.x && seg.y === this.food.y);
    }
  }

  setDirection(dx, dy) {
    const lastMove = this.moveQueue.length > 0 ? this.moveQueue[this.moveQueue.length - 1] : this.dir;
    if (lastMove.x + dx === 0 && lastMove.y + dy === 0) return; // Prevent 180 reverse
    this.moveQueue.push({ x: dx, y: dy });
  }

  bindEvents() {
    this.onKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { this.setDirection(0, -1); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { this.setDirection(0, 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { this.setDirection(-1, 0); e.preventDefault(); }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { this.setDirection(1, 0); e.preventDefault(); }
    };
    window.addEventListener('keydown', this.onKeyDown);

    // Touch D-Pad
    this.container.querySelector('#s-up')?.addEventListener('click', () => this.setDirection(0, -1));
    this.container.querySelector('#s-down')?.addEventListener('click', () => this.setDirection(0, 1));
    this.container.querySelector('#s-left')?.addEventListener('click', () => this.setDirection(-1, 0));
    this.container.querySelector('#s-right')?.addEventListener('click', () => this.setDirection(1, 0));

    // Touch Swipe on Canvas
    let touchStartX = 0;
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: false });

    this.canvas.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 20) this.setDirection(dx > 0 ? 1 : -1, 0);
      } else {
        if (Math.abs(dy) > 20) this.setDirection(0, dy > 0 ? 1 : -1);
      }
    }, { passive: false });
  }

  startLoop() {
    this.timer = setInterval(() => this.tick(), this.speed);
  }

  tick() {
    if (this.isOver) return;

    if (this.moveQueue.length > 0) {
      this.dir = this.moveQueue.shift();
    }
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.gameOver();
      return;
    }

    // Self collision
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // Eat Food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.scoreEl.innerText = this.score;
      playTone(650, 'triangle', 0.1, 0.2);
      this.spawnFood();

      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.bestEl.innerText = this.bestScore;
        this.ctx.storage?.set('snake:best', this.bestScore);
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  draw() {
    const { g, canvas, tile, snake, food, gridSize } = this;
    g.clearRect(0, 0, canvas.width, canvas.height);

    // Grid pattern
    g.strokeStyle = 'rgba(255,255,255,0.03)';
    g.lineWidth = 1;
    for (let i = 0; i < gridSize; i++) {
      g.beginPath();
      g.moveTo(i * tile, 0); g.lineTo(i * tile, canvas.height);
      g.moveTo(0, i * tile); g.lineTo(canvas.width, i * tile);
      g.stroke();
    }

    // Food (Neon Apple)
    const fx = food.x * tile + tile / 2;
    const fy = food.y * tile + tile / 2;
    const grad = g.createRadialGradient(fx, fy, 2, fx, fy, tile / 2);
    grad.addColorStop(0, '#ff4081');
    grad.addColorStop(1, '#c2185b');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(fx, fy, tile * 0.42, 0, Math.PI * 2);
    g.fill();

    // Food glow
    g.strokeStyle = 'rgba(255, 64, 129, 0.4)';
    g.lineWidth = 3;
    g.stroke();

    // Snake Body & Head
    snake.forEach((seg, i) => {
      const sx = seg.x * tile;
      const sy = seg.y * tile;
      const isHead = i === 0;

      if (isHead) {
        g.fillStyle = '#10b981'; // Emerald Head
        g.beginPath();
        g.roundRect(sx + 1, sy + 1, tile - 2, tile - 2, 6);
        g.fill();

        // Eyes
        g.fillStyle = '#0f172a';
        const ex1 = sx + (this.dir.x === 0 ? 5 : this.dir.x > 0 ? 12 : 4);
        const ey1 = sy + (this.dir.y === 0 ? 5 : this.dir.y > 0 ? 12 : 4);
        g.fillRect(ex1, ey1, 3, 3);
      } else {
        const alpha = Math.max(0.4, 1 - (i / snake.length) * 0.6);
        g.fillStyle = `rgba(52, 211, 153, ${alpha})`;
        g.beginPath();
        g.roundRect(sx + 2, sy + 2, tile - 4, tile - 4, 4);
        g.fill();
      }
    });
  }

  gameOver() {
    this.isOver = true;
    clearInterval(this.timer);
    playTone(180, 'sawtooth', 0.35, 0.25);

    const coinsEarned = Math.max(2, Math.floor(this.score * 1.5));
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'completed',
        score: this.score,
        coinsEarned,
        headline: this.score > 10 ? 'Starke Schlange! 🐍' : 'Game Over'
      });
    }, 800);
  }

  reset() {
    clearInterval(this.timer);
    this.initGame();
    this.startLoop();
  }

  pause() {
    clearInterval(this.timer);
  }

  resume() {
    if (!this.isOver) {
      clearInterval(this.timer);
      this.startLoop();
    }
  }

  dispose() {
    clearInterval(this.timer);
    window.removeEventListener('keydown', this.onKeyDown);
    this.container.innerHTML = '';
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new SnakeGame(container, ctx);
  }
};

export default gameModule;
