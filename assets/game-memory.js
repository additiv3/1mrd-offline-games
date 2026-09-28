/* 1 Milliarde Offline Games – Memory Master (Paare finden)
   Farbenfrohes Merkspiel mit Emoji-Karten, Zugzähler und Schwierigkeitsstufen */

function playTone(freq, type = 'sine', duration = 0.1, gainLevel = 0.15) {
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

const EMOJI_POOL = ['🦁', '🐼', '🦊', '🐸', '🦄', '🐬', '🐙', '🐝', '🦉', '🐨', '🦖', '🦋', '🍓', '🥑', '🚀', '⭐'];

export class MemoryGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.difficulty = ctx.difficulty || 'leicht';
    this.pairsCount = this.difficulty === 'schwer' ? 12 : this.difficulty === 'mittel' ? 8 : 6;

    this.initGame();
    this.render();
  }

  initGame() {
    this.moves = 0;
    this.matchedPairs = 0;
    this.flipped = [];
    this.isLocked = false;

    // Pick random unique emojis
    const pool = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, this.pairsCount);
    const cards = [...pool, ...pool].map((emoji, id) => ({
      id,
      emoji,
      revealed: false,
      matched: false
    }));
    cards.sort(() => Math.random() - 0.5);
    this.cards = cards;
  }

  flipCard(idx) {
    if (this.isLocked) return;
    const card = this.cards[idx];
    if (card.revealed || card.matched) return;

    card.revealed = true;
    this.flipped.push(idx);
    playTone(440 + this.flipped.length * 60, 'sine', 0.08, 0.15);
    this.render();

    if (this.flipped.length === 2) {
      this.moves++;
      this.isLocked = true;
      const [i1, i2] = this.flipped;
      const c1 = this.cards[i1];
      const c2 = this.cards[i2];

      if (c1.emoji === c2.emoji) {
        // Match!
        c1.matched = true;
        c2.matched = true;
        this.matchedPairs++;
        this.flipped = [];
        this.isLocked = false;
        playTone(660, 'triangle', 0.15, 0.2);
        setTimeout(() => playTone(880, 'sine', 0.2, 0.2), 100);
        this.render();

        if (this.matchedPairs === this.pairsCount) {
          this.winGame();
        }
      } else {
        // No match: turn back after delay
        setTimeout(() => {
          c1.revealed = false;
          c2.revealed = false;
          this.flipped = [];
          this.isLocked = false;
          playTone(280, 'sine', 0.08, 0.12);
          this.render();
        }, 850);
      }
    }
  }

  winGame() {
    playTone(523, 'triangle', 0.15, 0.2);
    setTimeout(() => playTone(659, 'triangle', 0.18, 0.2), 120);
    setTimeout(() => playTone(783, 'sine', 0.25, 0.25), 260);

    const coinsEarned = Math.max(10, Math.round(50 - this.moves * 1.5));
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'win',
        score: this.moves,
        coinsEarned,
        headline: `In ${this.moves} Zügen geschafft! 🧠`
      });
    }, 1000);
  }

  reset() {
    this.initGame();
    this.render();
  }

  pause() {}
  resume() {}
  dispose() {
    this.container.innerHTML = '';
  }

  render() {
    const is16 = this.cards.length <= 16;
    const gridCols = is16 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-6';

    let cardsHtml = this.cards.map((c, i) => {
      const isVisible = c.revealed || c.matched;
      return `
        <button type="button" data-card="${i}" class="aspect-square rounded-2xl ${isVisible ? (c.matched ? 'bg-emerald-500/20 border-2 border-emerald-400 text-4xl shadow-emerald-500/20 shadow-lg' : 'bg-surface-raised border-2 border-amber-400 text-4xl shadow-amber-400/20 shadow-lg scale-102') : 'bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 border-2 border-indigo-400/40 shadow-md hover:border-indigo-300'} flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-black/40">
          ${isVisible ? `<span class="animate-pop-in drop-shadow-md select-none">${c.emoji}</span>` : '<span class="text-2xl opacity-40 text-indigo-200 select-none">✨</span>'}
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none items-center justify-between p-4 font-sans text-ink">
        <!-- Top Info -->
        <div class="w-full max-w-sm flex items-center justify-between px-4 py-3 bg-surface rounded-2xl border border-line shadow-sm">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🧠</span>
            <div>
              <span class="text-sm font-black text-pop-yellow block leading-tight">Memory Paare</span>
              <span class="text-[10px] text-ink-muted">${this.matchedPairs} von ${this.pairsCount} Paaren gefunden</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[9px] uppercase font-bold text-ink-muted">Züge</span>
            <span class="block text-base font-black text-amber-400 leading-tight">${this.moves}</span>
          </div>
        </div>

        <!-- Cards Field -->
        <div class="w-full max-w-sm p-3 bg-surface rounded-3xl border-2 border-line shadow-2xl my-auto">
          <div class="grid ${gridCols} gap-2">
            ${cardsHtml}
          </div>
        </div>

        <!-- Footer Restart -->
        <div class="w-full max-w-sm pb-2">
          <button id="restart-mem-btn" type="button" class="w-full py-2.5 rounded-2xl bg-surface border border-line font-bold text-xs text-ink-muted active:scale-95 transition cursor-pointer">
            🔄 Neu mischen
          </button>
        </div>
      </div>
    `;

    this.container.querySelectorAll('[data-card]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-card'), 10);
        this.flipCard(idx);
      });
    });

    this.container.querySelector('#restart-mem-btn')?.addEventListener('click', () => this.reset());
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new MemoryGame(container, ctx);
  }
};

export default gameModule;
