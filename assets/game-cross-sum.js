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

    let gridHtml = '<div class="grid grid-cols-5 bg-line gap-px p-px mx-auto w-full max-w-[360px] aspect-square rounded shadow-sm">';

    // Row 0 (Top headers)
    gridHtml += `
      <div class="relative bg-surface-raised overflow-hidden">
        <svg class="absolute inset-0 w-full h-full text-line opacity-60" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" stroke-width="1"></line></svg>
      </div>
    `;
    for (let c = 0; c < size; c++) {
      const match = curColSums[c] === colSums[c];
      const over = curColSums[c] > colSums[c];
      const ringClass = match ? 'ring-2 ring-inset ring-emerald-500 z-10' : over ? 'ring-2 ring-inset ring-red-500 z-10' : '';
      const textColor = match ? 'text-emerald-500' : over ? 'text-red-500' : 'text-ink-muted';
      
      gridHtml += `
        <div class="relative bg-surface-raised overflow-hidden ${ringClass}">
          <svg class="absolute inset-0 w-full h-full text-line opacity-60" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" stroke-width="1"></line></svg>
          <span class="absolute top-1 right-1.5 text-xs md:text-sm font-black ${textColor}">${colSums[c]}</span>
        </div>
      `;
    }

    // Rows 1-4
    for (let r = 0; r < size; r++) {
      const matchRow = curRowSums[r] === rowSums[r];
      const overRow = curRowSums[r] > rowSums[r];
      const ringClassRow = matchRow ? 'ring-2 ring-inset ring-emerald-500 z-10' : overRow ? 'ring-2 ring-inset ring-red-500 z-10' : '';
      const textColorRow = matchRow ? 'text-emerald-500' : overRow ? 'text-red-500' : 'text-ink-muted';

      gridHtml += `
        <div class="relative bg-surface-raised overflow-hidden ${ringClassRow}">
          <svg class="absolute inset-0 w-full h-full text-line opacity-60" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" stroke-width="1"></line></svg>
          <span class="absolute bottom-1 left-1.5 text-xs md:text-sm font-black ${textColorRow}">${rowSums[r]}</span>
        </div>
      `;

      // Cells
      for (let c = 0; c < size; c++) {
        const isSel = this.selected[0] === r && this.selected[1] === c;
        const isGiv = given[r][c];
        const val = userGrid[r][c];
        const isFilled = val !== 0;

        gridHtml += `
          <button type="button" data-r="${r}" data-c="${c}" class="cell-btn relative bg-white dark:bg-[#1e293b] flex items-center justify-center font-black text-2xl sm:text-3xl transition-colors ${isSel ? 'bg-amber-100 dark:bg-amber-900/40 ring-2 ring-inset ring-amber-400 z-10' : ''} ${isGiv ? 'text-slate-400 dark:text-slate-500 font-extrabold cursor-default' : 'text-cyan-600 dark:text-cyan-400 cursor-pointer'} hover:bg-slate-50 dark:hover:bg-slate-800">
            ${isFilled ? val : ''}
          </button>
        `;
      }
    }
    gridHtml += '</div>';

    // Number Pad
    let numpadHtml = '<div class="flex justify-between gap-1 w-full max-w-[400px] mx-auto">';
    for (let n = 1; n <= 9; n++) {
      numpadHtml += `
        <button type="button" data-num="${n}" class="num-btn flex-1 aspect-[3/4] min-w-[32px] min-h-[44px] rounded-lg bg-surface-raised border border-line text-xl font-black text-ink hover:bg-white/10 active:scale-95 transition-transform cursor-pointer shadow-sm flex items-center justify-center">
          ${n}
        </button>
      `;
    }
    numpadHtml += '</div>';

    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none overflow-hidden text-ink font-sans p-2 pb-safe">
        <!-- Top Info -->
        <div class="flex items-center justify-between py-2 px-4 mx-auto w-full max-w-[400px] bg-surface-raised rounded-2xl border border-line mb-3 shrink-0 shadow-sm mt-1">
          <div class="flex items-center gap-3">
            <span class="text-2xl drop-shadow-sm">➕</span>
            <div class="flex flex-col justify-center">
              <h2 class="text-sm font-black leading-tight tracking-wide">Cross Sum</h2>
              <span class="text-[10px] text-ink-muted uppercase tracking-wider font-bold">${this.difficulty}</span>
            </div>
          </div>
          <div class="flex flex-col items-end">
             <span class="text-[10px] text-ink-muted uppercase tracking-wider font-bold">Score</span>
             <span class="font-black text-ink text-sm leading-tight">${this.difficulty === 'schwer' ? 45 : this.difficulty === 'mittel' ? 30 : 20}</span>
          </div>
        </div>

        <!-- Puzzle Grid -->
        <div class="flex-1 flex flex-col items-center justify-center min-h-0 w-full mb-3 px-1">
          ${gridHtml}
        </div>

        <!-- Controls -->
        <div class="flex gap-3 justify-center w-full max-w-[400px] mx-auto mb-3 shrink-0 px-1">
          <button id="undo-btn" type="button" class="flex-1 py-3.5 rounded-xl bg-surface-raised border border-line font-bold text-sm text-ink hover:bg-white/5 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2">
            <svg class="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
            Undo
          </button>
          <button id="erase-btn" type="button" class="flex-1 py-3.5 rounded-xl bg-surface-raised border border-line font-bold text-sm text-ink hover:bg-white/5 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2">
            <svg class="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Erase
          </button>
        </div>

        <!-- Keypad -->
        <div class="shrink-0 mb-1 px-1">
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
