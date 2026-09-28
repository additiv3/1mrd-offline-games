/* 1 Milliarde Offline Games – Cross Sum (Kakuro & Nonogramm Hybrid)
   Zahlen-Kreuzsummen-Rätsel mit dynamischen Leveln und Notizfunktion */

function playTone(freq, type = 'sine', duration = 0.12, gainLevel = 0.15) {
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

// 4x4 Grid Cross Sum Generator
function generatePuzzle(size = 4, difficulty = 'mittel') {
  // Create solution grid with random numbers 1..9
  const grid = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(Math.floor(Math.random() * 9) + 1);
    }
    grid.push(row);
  }

  // Calculate target row & column sums
  const rowSums = grid.map(row => row.reduce((a, b) => a + b, 0));
  const colSums = [];
  for (let c = 0; c < size; c++) {
    let s = 0;
    for (let r = 0; r < size; r++) s += grid[r][c];
    colSums.push(s);
  }

  // User starting grid: depending on difficulty, give some clues
  const cluesCount = difficulty === 'leicht' ? 6 : difficulty === 'mittel' ? 4 : 2;
  const userGrid = Array.from({ length: size }, () => Array(size).fill(0));
  const given = Array.from({ length: size }, () => Array(size).fill(false));

  const allCoords = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) allCoords.push([r, c]);
  }
  allCoords.sort(() => Math.random() - 0.5);

  for (let i = 0; i < cluesCount; i++) {
    const [r, c] = allCoords[i];
    userGrid[r][c] = grid[r][c];
    given[r][c] = true;
  }

  return { size, grid, userGrid, given, rowSums, colSums };
}

export class CrossSumGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.difficulty = ctx.difficulty || 'mittel';
    this.initGame();
    this.render();
  }

  initGame() {
    this.puzzle = generatePuzzle(4, this.difficulty);
    this.selected = [0, 0];
    this.history = [];
    this.completed = false;
  }

  setNumber(num) {
    if (this.completed) return;
    const [r, c] = this.selected;
    if (this.puzzle.given[r][c]) return;

    this.history.push({ r, c, prev: this.puzzle.userGrid[r][c] });
    this.puzzle.userGrid[r][c] = num;
    playTone(340 + num * 45, 'triangle', 0.1, 0.15);
    this.checkWin();
    this.render();
  }

  erase() {
    if (this.completed) return;
    const [r, c] = this.selected;
    if (this.puzzle.given[r][c]) return;

    this.history.push({ r, c, prev: this.puzzle.userGrid[r][c] });
    this.puzzle.userGrid[r][c] = 0;
    playTone(280, 'sine', 0.08, 0.12);
    this.render();
  }

  undo() {
    if (this.completed || this.history.length === 0) return;
    const last = this.history.pop();
    this.puzzle.userGrid[last.r][last.c] = last.prev;
    this.selected = [last.r, last.c];
    playTone(380, 'sine', 0.08, 0.12);
    this.render();
  }

  checkWin() {
    const { size, userGrid, rowSums, colSums } = this.puzzle;

    // Check all filled
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (userGrid[r][c] === 0) return;
      }
    }

    // Check row sums
    for (let r = 0; r < size; r++) {
      const s = userGrid[r].reduce((a, b) => a + b, 0);
      if (s !== rowSums[r]) return;
    }

    // Check col sums
    for (let c = 0; c < size; c++) {
      let s = 0;
      for (let r = 0; r < size; r++) s += userGrid[r][c];
      if (s !== colSums[c]) return;
    }

    this.completed = true;
    playTone(523, 'triangle', 0.15, 0.2);
    setTimeout(() => playTone(659, 'triangle', 0.18, 0.2), 120);
    setTimeout(() => playTone(783, 'sine', 0.25, 0.25), 260);

    const coinsEarned = this.difficulty === 'schwer' ? 45 : this.difficulty === 'mittel' ? 30 : 20;
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'win',
        score: coinsEarned,
        coinsEarned,
        headline: 'Kreuzsumme gelöst! 🎉'
      });
    }, 1200);
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
    const { size, userGrid, given, rowSums, colSums } = this.puzzle;

    // Calculate current user sums
    const curRowSums = userGrid.map(r => r.reduce((a, b) => a + b, 0));
    const curColSums = [];
    for (let c = 0; c < size; c++) {
      let s = 0;
      for (let r = 0; r < size; r++) s += userGrid[r][c];
      curColSums.push(s);
    }

    let gridHtml = '';
    // Header Col Sums
    gridHtml += '<div class="grid grid-cols-5 gap-1.5 mb-1.5 text-center font-black text-xs">';
    gridHtml += '<div class="p-2 text-ink-muted flex items-center justify-center">∑</div>';
    for (let c = 0; c < size; c++) {
      const match = curColSums[c] === colSums[c];
      const over = curColSums[c] > colSums[c];
      gridHtml += `
        <div class="py-1 px-1 rounded-xl ${match ? 'bg-emerald-500/20 text-emerald-400' : over ? 'bg-red-500/20 text-red-400' : 'bg-surface-raised text-ink-muted'} flex flex-col items-center">
          <span class="text-[10px] opacity-70">↓</span>
          <span>${colSums[c]}</span>
          <span class="text-[9px] font-normal ${match ? 'text-emerald-400 font-bold' : ''}">(${curColSums[c]})</span>
        </div>
      `;
    }
    gridHtml += '</div>';

    // Rows
    for (let r = 0; r < size; r++) {
      const matchRow = curRowSums[r] === rowSums[r];
      const overRow = curRowSums[r] > rowSums[r];

      gridHtml += '<div class="grid grid-cols-5 gap-1.5 mb-1.5 text-center">';
      // Row Sum indicator on left
      gridHtml += `
        <div class="py-2 px-1 rounded-xl ${matchRow ? 'bg-emerald-500/20 text-emerald-400' : overRow ? 'bg-red-500/20 text-red-400' : 'bg-surface-raised text-ink-muted'} font-black text-xs flex flex-col items-center justify-center">
          <span>${rowSums[r]}</span>
          <span class="text-[9px] font-normal ${matchRow ? 'text-emerald-400 font-bold' : ''}">(${curRowSums[r]})</span>
        </div>
      `;

      // Cells
      for (let c = 0; c < size; c++) {
        const isSel = this.selected[0] === r && this.selected[1] === c;
        const isGiv = given[r][c];
        const val = userGrid[r][c];

        gridHtml += `
          <button type="button" data-r="${r}" data-c="${c}" class="cell-btn aspect-square rounded-2xl ${isSel ? 'ring-4 ring-amber-400 bg-surface-raised scale-102 shadow-lg shadow-amber-400/20' : 'bg-surface'} border-2 border-line/80 flex items-center justify-center font-black text-2xl transition active:scale-95 ${isGiv ? 'text-slate-400 bg-white/5 font-extrabold cursor-default' : 'text-cyan-400 cursor-pointer'} shadow-sm">
            ${val !== 0 ? val : ''}
          </button>
        `;
      }
      gridHtml += '</div>';
    }

    // Number Pad
    let numpadHtml = '';
    for (let n = 1; n <= 9; n++) {
      numpadHtml += `
        <button type="button" data-num="${n}" class="num-btn py-3.5 rounded-2xl bg-surface-raised border border-line text-xl font-black text-ink hover:bg-white/10 active:scale-95 transition cursor-pointer shadow-md">
          ${n}
        </button>
      `;
    }

    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none p-4 overflow-y-auto max-w-md mx-auto text-ink font-sans">
        <!-- Top Info -->
        <div class="flex items-center justify-between py-2 border-b border-line mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">➕</span>
            <div>
              <h2 class="text-sm font-black leading-tight">Cross Sum</h2>
              <p class="text-[11px] text-ink-muted">Erreiche die Zeilen- und Spaltensummen</p>
            </div>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-surface-raised text-pop-yellow font-bold uppercase">${this.difficulty}</span>
        </div>

        <!-- Puzzle Grid -->
        <div class="flex-1 flex flex-col justify-center my-2">
          ${gridHtml}
        </div>

        <!-- Controls -->
        <div class="flex gap-2 my-2">
          <button id="undo-btn" type="button" class="flex-1 py-2.5 rounded-xl bg-surface border border-line font-bold text-xs text-ink-muted active:scale-95 transition">↩️ Rückgängig</button>
          <button id="erase-btn" type="button" class="flex-1 py-2.5 rounded-xl bg-surface border border-line font-bold text-xs text-ink-muted active:scale-95 transition">🧹 Löschen</button>
        </div>

        <!-- Keypad -->
        <div class="grid grid-cols-5 gap-2 mt-1">
          ${numpadHtml}
        </div>
      </div>
    `;

    // Bind Listeners
    this.container.querySelectorAll('.cell-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = parseInt(btn.getAttribute('data-r'), 10);
        const c = parseInt(btn.getAttribute('data-c'), 10);
        this.selected = [r, c];
        playTone(450, 'sine', 0.05, 0.1);
        this.render();
      });
    });

    this.container.querySelectorAll('.num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const num = parseInt(btn.getAttribute('data-num'), 10);
        this.setNumber(num);
      });
    });

    const undoBtn = this.container.querySelector('#undo-btn');
    if (undoBtn) undoBtn.addEventListener('click', () => this.undo());

    const eraseBtn = this.container.querySelector('#erase-btn');
    if (eraseBtn) eraseBtn.addEventListener('click', () => this.erase());
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new CrossSumGame(container, ctx);
  }
};

export default gameModule;
