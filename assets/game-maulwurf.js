/* 1 Milliarde Offline Games – Whack-A-Mole (Maulwurf Klopfen)
   Arcade-Reaktionsspiel mit Combo-Multiplikator, goldenen Maulwürfen und Touch-Effekten */

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

export class WhackAMoleGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.difficulty = ctx.difficulty || 'mittel';
    this.gameDuration = 35; // 35 seconds per match
    this.holesCount = 9;

    this.initGame();
    this.render();
  }

  initGame() {
    this.score = 0;
    this.combo = 0;
    this.timeLeft = this.gameDuration;
    this.isOver = false;
    this.started = false;

    // 9 holes: state of each: null or { type: 'normal'|'gold'|'bomb', timer: number }
    this.holes = Array(this.holesCount).fill(null);
    this.bestScore = this.ctx.storage?.get('mole:best', 0) || 0;
  }

  startGame() {
    if (this.started) return;
    this.started = true;
    playTone(523, 'triangle', 0.15, 0.2);

    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.finishGame();
      } else {
        this.updateHeader();
      }
    }, 1000);

    this.spawnLoop();
  }

  spawnLoop() {
    if (this.isOver || !this.started) return;

    // Pick empty hole
    const emptyIndices = this.holes
      .map((h, i) => (h === null ? i : null))
      .filter(i => i !== null);

    if (emptyIndices.length > 0) {
      const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const rand = Math.random();
      const type = rand < 0.15 ? 'gold' : rand < 0.3 ? 'bomb' : 'normal';
      const stayTime = this.difficulty === 'schwer' ? 850 : this.difficulty === 'leicht' ? 1400 : 1100;

      this.holes[idx] = { type, active: true };
      this.renderHole(idx);

      setTimeout(() => {
        if (this.holes[idx] && this.holes[idx].active) {
          this.holes[idx] = null;
          this.combo = 0;
          this.renderHole(idx);
          this.updateHeader();
        }
      }, stayTime);
    }

    const nextDelay = Math.max(350, 750 - (35 - this.timeLeft) * 10);
    this.spawnTimeout = setTimeout(() => this.spawnLoop(), nextDelay);
  }

  whack(idx) {
    if (!this.started) {
      this.startGame();
      return;
    }
    if (this.isOver) return;

    const mole = this.holes[idx];
    if (!mole || !mole.active) return;

    mole.active = false;
    this.holes[idx] = null;

    if (mole.type === 'bomb') {
      this.combo = 0;
      this.score = Math.max(0, this.score - 5);
      playTone(140, 'sawtooth', 0.25, 0.25);
      this.renderHole(idx, '💥');
    } else if (mole.type === 'gold') {
      this.combo++;
      const pts = 3 + Math.floor(this.combo / 3);
      this.score += pts;
      playTone(880, 'triangle', 0.15, 0.2);
      this.renderHole(idx, `🌟 +${pts}`);
    } else {
      this.combo++;
      const pts = 1 + Math.floor(this.combo / 4);
      this.score += pts;
      playTone(520 + Math.min(this.combo * 40, 400), 'sine', 0.1, 0.18);
      this.renderHole(idx, `🐹 +${pts}`);
    }

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.ctx.storage?.set('mole:best', this.bestScore);
    }

    this.updateHeader();
  }

  finishGame() {
    this.isOver = true;
    clearInterval(this.gameTimer);
    clearTimeout(this.spawnTimeout);
    playTone(330, 'square', 0.3, 0.2);

    const coinsEarned = Math.max(5, Math.floor(this.score * 1.2));
    this.render();

    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'completed',
        score: this.score,
        coinsEarned,
        headline: this.score >= 25 ? 'Reaktions-Meister! 🐹' : 'Runde beendet'
      });
    }, 1000);
  }

  reset() {
    clearInterval(this.gameTimer);
    clearTimeout(this.spawnTimeout);
    this.initGame();
    this.render();
  }

  pause() {
    clearInterval(this.gameTimer);
    clearTimeout(this.spawnTimeout);
  }

  resume() {
    if (this.started && !this.isOver) {
      this.startGame();
    }
  }

  dispose() {
    clearInterval(this.gameTimer);
    clearTimeout(this.spawnTimeout);
    this.container.innerHTML = '';
  }

  updateHeader() {
    const scoreEl = this.container.querySelector('#mole-score');
    const timeEl = this.container.querySelector('#mole-time');
    const comboEl = this.container.querySelector('#mole-combo');
    if (scoreEl) scoreEl.innerText = this.score;
    if (timeEl) timeEl.innerText = `${this.timeLeft}s`;
    if (comboEl) {
      comboEl.innerText = this.combo > 1 ? `Combo ×${this.combo}!` : '';
      comboEl.className = this.combo > 3 ? 'text-xs font-black text-amber-400 animate-bounce' : 'text-xs font-bold text-pop-yellow';
    }
  }

  renderHole(idx, hitText = null) {
    const holeEl = this.container.querySelector(`[data-hole="${idx}"]`);
    if (!holeEl) return;

    const mole = this.holes[idx];
    if (hitText) {
      holeEl.innerHTML = `
        <span class="text-xl font-black text-pop-yellow animate-pop-in drop-shadow">${hitText}</span>
      `;
      setTimeout(() => this.renderHole(idx), 350);
      return;
    }

    if (!mole || !mole.active) {
      holeEl.innerHTML = `
        <div class="w-20 h-6 rounded-full bg-slate-950/80 border-2 border-amber-950/60 shadow-inner flex items-center justify-center">
          <div class="w-16 h-3 rounded-full bg-black/60"></div>
        </div>
      `;
    } else if (mole.type === 'bomb') {
      holeEl.innerHTML = `
        <div class="relative flex flex-col items-center animate-bounce">
          <span class="text-5xl drop-shadow-xl select-none">💣</span>
          <span class="text-[10px] font-black text-red-200 bg-red-700/80 px-2 py-0.5 rounded-full mt-1 border border-red-400">NICHT TIPPEN</span>
        </div>
      `;
    } else if (mole.type === 'gold') {
      holeEl.innerHTML = `
        <div class="relative flex flex-col items-center animate-bounce">
          <span class="text-5xl drop-shadow-2xl filter brightness-125 select-none animate-pulse">⭐</span>
          <span class="text-[10px] font-black text-amber-200 bg-amber-700/90 px-2 py-0.5 rounded-full mt-1 border border-amber-300">GOLD +3</span>
        </div>
      `;
    } else {
      holeEl.innerHTML = `
        <div class="relative flex flex-col items-center animate-bounce">
          <span class="text-5xl drop-shadow-xl select-none">🐹</span>
        </div>
      `;
    }
  }

  render() {
    let holesGrid = '';
    for (let i = 0; i < this.holesCount; i++) {
      holesGrid += `
        <button type="button" data-hole="${i}" class="aspect-square rounded-3xl bg-gradient-to-b from-emerald-800 to-emerald-950 border-2 border-emerald-700/60 shadow-xl flex items-center justify-center p-2 relative overflow-hidden transition active:scale-95 cursor-pointer shadow-black/40">
          <div class="w-16 h-4 rounded-full bg-slate-950/70 border border-amber-900/40 shadow-inner"></div>
        </button>
      `;
    }

    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none items-center justify-between p-4 font-sans text-ink">
        <!-- Top Stats -->
        <div class="w-full max-w-sm flex items-center justify-between px-4 py-3 bg-surface rounded-2xl border border-line shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🔨</span>
            <div>
              <span class="text-sm font-black text-pop-yellow block leading-tight">Maulwurf Klopfen</span>
              <span id="mole-combo" class="text-xs font-bold text-pop-yellow"></span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-ink-muted">Zeit</span>
              <span id="mole-time" class="block text-base font-black text-pop-cyan leading-tight">${this.timeLeft}s</span>
            </div>
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-ink-muted">Punkte</span>
              <span id="mole-score" class="block text-base font-black text-pop-yellow leading-tight">${this.score}</span>
            </div>
          </div>
        </div>

        <!-- 3x3 Mole Holes Grid -->
        <div class="w-full max-w-sm p-4 bg-emerald-900/40 rounded-3xl border-2 border-emerald-700/50 shadow-2xl my-auto">
          <div class="grid grid-cols-3 gap-3">
            ${holesGrid}
          </div>
        </div>

        <!-- Start Overlay or Restart -->
        <div class="w-full max-w-sm flex justify-center pb-2">
          ${!this.started ? `
            <button id="start-mole-btn" type="button" class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-bg font-black text-base shadow-xl shadow-amber-500/20 active:scale-95 transition cursor-pointer">
              Tippen zum Starten! 🔨
            </button>
          ` : `
            <p class="text-xs text-ink-muted text-center">Tippe auf Maulwürfe 🐹 & Sterne ⭐. Vorsicht vor Bomben 💣!</p>
          `}
        </div>
      </div>
    `;

    this.container.querySelectorAll('[data-hole]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-hole'), 10);
        this.whack(idx);
      });
    });

    const startBtn = this.container.querySelector('#start-mole-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startGame();
        this.render();
      });
    }
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new WhackAMoleGame(container, ctx);
  }
};

export default gameModule;
