/* 1 Milliarde Offline Games – 2048 Neon Deluxe
   Suchtmachendes Zahlen-Schiebespiel mit Wisch- und Pfeilsteuerung, Farbanimationen & Undo */

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

const TILE_COLORS = {
  2: { bg: 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600', text: 'text-slate-100 font-extrabold', glow: 'shadow-md' },
  4: { bg: 'bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-700/50', text: 'text-amber-200 font-extrabold', glow: 'shadow-md' },
  8: { bg: 'bg-gradient-to-br from-orange-500 to-amber-600 border border-orange-400', text: 'text-white font-black', glow: 'shadow-orange-500/40 shadow-lg' },
  16: { bg: 'bg-gradient-to-br from-orange-600 to-red-600 border border-orange-400', text: 'text-white font-black', glow: 'shadow-orange-500/50 shadow-lg' },
  32: { bg: 'bg-gradient-to-br from-red-500 to-rose-600 border border-red-400', text: 'text-white font-black', glow: 'shadow-red-500/50 shadow-lg' },
  64: { bg: 'bg-gradient-to-br from-rose-600 to-pink-700 border border-rose-400', text: 'text-white font-black', glow: 'shadow-rose-600/50 shadow-xl' },
  128: { bg: 'bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-yellow-200', text: 'text-slate-950 font-black', glow: 'shadow-yellow-400/60 shadow-xl scale-102' },
  256: { bg: 'bg-gradient-to-br from-amber-300 to-yellow-500 border-2 border-white', text: 'text-slate-950 font-black', glow: 'shadow-yellow-300/70 shadow-xl scale-102' },
  512: { bg: 'bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-cyan-200', text: 'text-white font-black', glow: 'shadow-cyan-400/80 shadow-2xl scale-104' },
  1024: { bg: 'bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-purple-200', text: 'text-white font-black', glow: 'shadow-purple-500/80 shadow-2xl scale-104' },
  2048: { bg: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 border-2 border-yellow-200', text: 'text-white font-black animate-pulse', glow: 'shadow-amber-400 shadow-2xl ring-4 ring-yellow-300/80 scale-106' }
};

export class Game2048 {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.size = 4;
    this.initGame();
    this.render();
    this.bindEvents();
  }

  initGame() {
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.score = 0;
    this.history = [];
    this.isOver = false;
    this.hasWon = false;
    this.bestScore = this.ctx.storage?.get('2048:best', 0) || 0;

    this.spawnTile();
    this.spawnTile();
  }

  spawnTile() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return;
    const choice = empty[Math.floor(Math.random() * empty.length)];
    this.grid[choice.r][choice.c] = Math.random() < 0.9 ? 2 : 4;
  }

  saveState() {
    this.history.push({
      grid: this.grid.map(row => [...row]),
      score: this.score
    });
    if (this.history.length > 10) this.history.shift();
  }

  undo() {
    if (this.history.length === 0 || this.isOver) return;
    const prev = this.history.pop();
    this.grid = prev.grid;
    this.score = prev.score;
    playTone(380, 'sine', 0.08, 0.15);
    this.render();
  }

  move(direction) {
    if (this.isOver) return;

    let moved = false;
    let earned = 0;
    const size = this.size;

    const prevGrid = this.grid.map(r => [...r]);
    const prevScore = this.score;

    const slideAndCombine = (line) => {
      let nonZero = line.filter(v => v !== 0);
      let res = [];
      for (let i = 0; i < nonZero.length; i++) {
        if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
          const val = nonZero[i] * 2;
          res.push(val);
          earned += val;
          if (val === 2048 && !this.hasWon) this.hasWon = true;
          i++; // Skip merged
        } else {
          res.push(nonZero[i]);
        }
      }
      while (res.length < size) res.push(0);
      return res;
    };

    if (direction === 'left') {
      for (let r = 0; r < size; r++) {
        const newLine = slideAndCombine(this.grid[r]);
        if (newLine.some((v, idx) => v !== this.grid[r][idx])) moved = true;
        this.grid[r] = newLine;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < size; r++) {
        const newLine = slideAndCombine(this.grid[r].slice().reverse()).reverse();
        if (newLine.some((v, idx) => v !== this.grid[r][idx])) moved = true;
        this.grid[r] = newLine;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < size; c++) {
        const col = [];
        for (let r = 0; r < size; r++) col.push(this.grid[r][c]);
        const newCol = slideAndCombine(col);
        if (newCol.some((v, idx) => v !== this.grid[idx][c])) moved = true;
        for (let r = 0; r < size; r++) this.grid[r][c] = newCol[r];
      }
    } else if (direction === 'down') {
      for (let c = 0; c < size; c++) {
        const col = [];
        for (let r = 0; r < size; r++) col.push(this.grid[r][c]);
        const newCol = slideAndCombine(col.reverse()).reverse();
        if (newCol.some((v, idx) => v !== this.grid[idx][c])) moved = true;
        for (let r = 0; r < size; r++) this.grid[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.history.push({ grid: prevGrid, score: prevScore });
      this.score += earned;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.ctx.storage?.set('2048:best', this.bestScore);
      }
      this.spawnTile();
      playTone(earned > 0 ? 520 + Math.min(earned, 500) : 320, 'sine', 0.08, 0.12);
      this.checkStatus();
      this.render();
    }
  }

  checkStatus() {
    // Check if any moves possible
    const size = this.size;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this.grid[r][c] === 0) return;
        if (c < size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return;
        if (r < size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return;
      }
    }

    this.isOver = true;
    playTone(220, 'sawtooth', 0.3, 0.2);

    const coinsEarned = Math.max(5, Math.floor(this.score / 60));
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: this.hasWon ? 'win' : 'completed',
        score: this.score,
        coinsEarned,
        headline: this.hasWon ? '2048 gemeistert! 🌟' : `Punkte: ${this.score}`
      });
    }, 1000);
  }

  bindEvents() {
    this.onKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { this.move('up'); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { this.move('down'); e.preventDefault(); }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { this.move('left'); e.preventDefault(); }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { this.move('right'); e.preventDefault(); }
    };
    window.addEventListener('keydown', this.onKeyDown);

    // Touch Swipe
    let touchStartX = 0;
    let touchStartY = 0;
    this.container.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.container.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 30) this.move(dx > 0 ? 'right' : 'left');
      } else {
        if (Math.abs(dy) > 30) this.move(dy > 0 ? 'down' : 'up');
      }
    }, { passive: true });
  }

  reset() {
    this.initGame();
    this.render();
  }

  pause() {}
  resume() {}
  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    this.container.innerHTML = '';
  }

  render() {
    let cellsHtml = '';
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        const style = TILE_COLORS[val] || (val > 2048 ? { bg: 'bg-rose-500', text: 'text-white font-black', glow: 'shadow-lg' } : { bg: 'bg-surface-raised/40', text: 'text-transparent', glow: '' });

        cellsHtml += `
          <div class="aspect-square rounded-2xl ${style.bg} ${style.glow} flex items-center justify-center font-black ${val > 512 ? 'text-2xl' : val > 64 ? 'text-3xl' : 'text-4xl'} ${style.text} transition-all duration-100 shadow-inner select-none">
            ${val !== 0 ? val : ''}
          </div>
        `;
      }
    }

    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none items-center justify-between p-4 font-sans text-ink">
        <!-- Top Stats -->
        <div class="w-full max-w-sm flex items-center justify-between px-4 py-3 bg-surface rounded-2xl border border-line shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🔢</span>
            <div>
              <span class="text-sm font-black text-amber-400 block leading-tight">2048 Neon</span>
              <span class="text-[10px] text-ink-muted">Wische in jede Richtung</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-ink-muted">Punkte</span>
              <span class="block text-base font-black text-amber-400 leading-tight">${this.score}</span>
            </div>
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-ink-muted">Rekord</span>
              <span class="block text-base font-black text-ink-muted leading-tight">${this.bestScore}</span>
            </div>
          </div>
        </div>

        <!-- 2048 Board -->
        <div class="w-full max-w-sm p-3 bg-surface rounded-3xl border-2 border-line shadow-2xl my-auto">
          <div class="grid grid-cols-4 gap-2.5">
            ${cellsHtml}
          </div>
        </div>

        <!-- Controls & D-Pad -->
        <div class="w-full max-w-sm flex flex-col gap-2">
          <div class="flex gap-2">
            <button id="undo-btn" type="button" class="flex-1 py-2.5 rounded-2xl bg-surface border border-line font-bold text-xs text-ink-muted active:scale-95 transition shadow-sm ${this.history.length === 0 ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}">
              ↩️ Schritt zurück
            </button>
            <button id="restart-btn" type="button" class="py-2.5 px-4 rounded-2xl bg-surface border border-line font-bold text-xs text-ink-muted active:scale-95 transition shadow-sm cursor-pointer">
              🔄 Neu
            </button>
          </div>

          <!-- Quick Touch Arrows -->
          <div class="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto w-full pt-1">
            <button id="dir-up" type="button" class="col-start-2 py-2 rounded-xl bg-surface-raised border border-line text-sm font-black active:scale-90 transition">↑</button>
            <button id="dir-left" type="button" class="col-start-1 row-start-2 py-2 rounded-xl bg-surface-raised border border-line text-sm font-black active:scale-90 transition">←</button>
            <button id="dir-down" type="button" class="col-start-2 row-start-2 py-2 rounded-xl bg-surface-raised border border-line text-sm font-black active:scale-90 transition">↓</button>
            <button id="dir-right" type="button" class="col-start-3 row-start-2 py-2 rounded-xl bg-surface-raised border border-line text-sm font-black active:scale-90 transition">→</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#undo-btn')?.addEventListener('click', () => this.undo());
    this.container.querySelector('#restart-btn')?.addEventListener('click', () => this.reset());

    this.container.querySelector('#dir-up')?.addEventListener('click', () => this.move('up'));
    this.container.querySelector('#dir-down')?.addEventListener('click', () => this.move('down'));
    this.container.querySelector('#dir-left')?.addEventListener('click', () => this.move('left'));
    this.container.querySelector('#dir-right')?.addEventListener('click', () => this.move('right'));
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new Game2048(container, ctx);
  }
};

export default gameModule;
