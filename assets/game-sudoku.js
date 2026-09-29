// 🔢 Sudoku – Elegantes Zahlenrätsel für Mobilgeräte & Desktop
import { incrementProgress } from "./challenges-manager.js";

function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'tap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'place') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.15);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + idx * 0.1);
        g.gain.setValueAtTime(0.2, t + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.1 + 0.25);
        o.start(t + idx * 0.1);
        o.stop(t + idx * 0.1 + 0.25);
      });
    }
  } catch {
    // Ignore audio errors
  }
}

// Sudoku generation & solving logic
function generateSudoku(givensCount = 32) {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));

  function isValid(b, row, col, num) {
    for (let c = 0; c < 9; c++) if (b[row][c] === num) return false;
    for (let r = 0; r < 9; r++) if (b[r][col] === num) return false;
    const startR = Math.floor(row / 3) * 3;
    const startC = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (b[startR + r][startC + c] === num) return false;
      }
    }
    return true;
  }

  function fillBoard(b) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isValid(b, r, c, num)) {
              b[r][c] = num;
              if (fillBoard(b)) return true;
              b[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillBoard(board);
  const solution = board.map(row => [...row]);

  // Remove numbers to reach desired givens
  const initial = board.map(row => [...row]);
  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => Math.random() - 0.5);

  let currentGivens = 81;
  for (const [r, c] of positions) {
    if (currentGivens <= givensCount) break;
    initial[r][c] = 0;
    currentGivens--;
  }

  return { initial, solution };
}

class SudokuGame {
  container;
  ctx;
  difficulty;
  initial = [];
  solution = [];
  grid = [];
  notes = [];
  selected = null; // [row, col]
  pencilMode = false;
  history = [];
  mistakes = 0;
  maxMistakes = 3;
  timer = 0;
  timerInterval = null;
  over = false;
  rootEl = null;

  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.difficulty = ctx.difficulty || 'mittel';

    const givens = this.difficulty === 'leicht' ? 38 : this.difficulty === 'schwer' ? 24 : 30;
    const { initial, solution } = generateSudoku(givens);
    this.initial = initial;
    this.solution = solution;
    this.grid = initial.map(row => [...row]);
    this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));

    this.render();
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (!this.over) {
        this.timer++;
        const el = this.rootEl?.querySelector('#sudoku-timer');
        if (el) el.textContent = this.formatTime(this.timer);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  pause() {
    this.stopTimer();
  }

  resume() {
    this.startTimer();
  }

  reset() {
    this.stopTimer();
    this.mistakes = 0;
    this.timer = 0;
    this.over = false;
    this.selected = null;
    this.history = [];

    const givens = this.difficulty === 'leicht' ? 38 : this.difficulty === 'schwer' ? 24 : 30;
    const { initial, solution } = generateSudoku(givens);
    this.initial = initial;
    this.solution = solution;
    this.grid = initial.map(row => [...row]);
    this.notes = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()));

    this.render();
    this.startTimer();
  }

  dispose() {
    this.stopTimer();
    if (this.rootEl) {
      this.rootEl.remove();
      this.rootEl = null;
    }
  }

  selectCell(r, c) {
    if (this.over) return;
    this.selected = [r, c];
    playSound('tap');
    this.updateGridUI();
  }

  enterNumber(num) {
    if (this.over || !this.selected) return;
    const [r, c] = this.selected;
    if (this.initial[r][c] !== 0) return; // Initial cell cannot be changed

    // Pencil / Notes mode
    if (this.pencilMode) {
      const cellNotes = this.notes[r][c];
      if (cellNotes.has(num)) {
        cellNotes.delete(num);
      } else {
        cellNotes.add(num);
      }
      playSound('tap');
      this.updateGridUI();
      return;
    }

    // Normal placement mode
    const prev = this.grid[r][c];
    if (prev === num) return;

    this.history.push({
      r,
      c,
      prevVal: prev,
      prevNotes: new Set(this.notes[r][c])
    });

    this.grid[r][c] = num;
    this.notes[r][c].clear();

    if (num !== this.solution[r][c]) {
      this.mistakes++;
      playSound('error');
      if (this.mistakes >= this.maxMistakes) {
        this.over = true;
        this.stopTimer();
        this.showGameOver(false);
      }
    } else {
      playSound('place');
      // Auto clear notes in same row, col, box
      this.clearRelatedNotes(r, c, num);
      if (this.checkWin()) {
        this.handleWin();
      }
    }

    this.updateGridUI();
  }

  eraseCell() {
    if (this.over || !this.selected) return;
    const [r, c] = this.selected;
    if (this.initial[r][c] !== 0) return;

    this.history.push({
      r,
      c,
      prevVal: this.grid[r][c],
      prevNotes: new Set(this.notes[r][c])
    });

    this.grid[r][c] = 0;
    this.notes[r][c].clear();
    playSound('tap');
    this.updateGridUI();
  }

  undo() {
    if (this.over || this.history.length === 0) return;
    const last = this.history.pop();
    this.grid[last.r][last.c] = last.prevVal;
    this.notes[last.r][last.c] = last.prevNotes;
    this.selected = [last.r, last.c];
    playSound('tap');
    this.updateGridUI();
  }

  giveHint() {
    if (this.over || !this.selected) return;
    const [r, c] = this.selected;
    if (this.initial[r][c] !== 0 || this.grid[r][c] === this.solution[r][c]) return;

    this.grid[r][c] = this.solution[r][c];
    this.notes[r][c].clear();
    this.clearRelatedNotes(r, c, this.solution[r][c]);
    playSound('place');

    if (this.checkWin()) {
      this.handleWin();
    }
    this.updateGridUI();
  }

  clearRelatedNotes(row, col, num) {
    for (let c = 0; c < 9; c++) this.notes[row][c].delete(num);
    for (let r = 0; r < 9; r++) this.notes[r][col].delete(num);
    const startR = Math.floor(row / 3) * 3;
    const startC = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        this.notes[startR + r][startC + c].delete(num);
      }
    }
  }

  checkWin() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.grid[r][c] !== this.solution[r][c]) return false;
      }
    }
    return true;
  }

  handleWin() {
    this.over = true;
    this.stopTimer();
    playSound('win');

    // Trigger challenge progress
    incrementProgress('sudoku_solve', 1);

    const coinsEarned = this.difficulty === 'schwer' ? 70 : this.difficulty === 'mittel' ? 50 : 35;
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'win',
        score: Math.max(10, 1000 - this.timer * 2 - this.mistakes * 100),
        coinsEarned,
        headline: 'Sudoku Gelöst! 🎉'
      });
    }, 800);
  }

  showGameOver(won) {
    if (!won) {
      setTimeout(() => {
        this.ctx.reportResult({
          outcome: 'loss',
          headline: '3 Fehler – Game Over 😅'
        });
      }, 700);
    }
  }

  render() {
    if (this.rootEl) this.rootEl.remove();

    this.rootEl = document.createElement('div');
    this.rootEl.className = 'flex flex-col h-full w-full max-w-md mx-auto p-2 text-ink select-none overflow-hidden';

    // Header info bar
    const infoBar = document.createElement('div');
    infoBar.className = 'flex items-center justify-between px-2 py-2 text-xs font-bold text-ink-muted flex-none';
    infoBar.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-full bg-surface-raised uppercase tracking-wider text-[11px] text-ink font-black">${this.difficulty}</span>
        <span id="sudoku-mistakes" class="px-2.5 py-1 rounded-full bg-surface-raised font-mono ${this.mistakes > 0 ? 'text-red-400' : ''}">Fehler: ${this.mistakes}/${this.maxMistakes}</span>
      </div>
      <div class="flex items-center gap-1 font-mono text-sm text-ink font-bold">
        <span>⏱️</span>
        <span id="sudoku-timer">${this.formatTime(this.timer)}</span>
      </div>
    `;

    // 9x9 Board container wrapper to allow proper scaling/shrinking
    const boardWrapper = document.createElement('div');
    boardWrapper.className = 'flex-1 min-h-0 flex flex-col items-center justify-center w-full px-1';

    const boardContainer = document.createElement('div');
    boardContainer.style.display = 'grid';
    boardContainer.style.gridTemplateColumns = 'repeat(9, 1fr)';
    boardContainer.style.gridTemplateRows = 'repeat(9, 1fr)';
    boardContainer.style.width = 'min(94vw, 380px, calc(100dvh - 250px))';
    boardContainer.style.height = 'min(94vw, 380px, calc(100dvh - 250px))';
    boardContainer.className = 'rounded-xl bg-surface-raised border-[3px] border-white/50 shadow-2xl p-0 gap-0 overflow-hidden shrink-0';
    boardContainer.id = 'sudoku-board';

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.id = `cell-${r}-${c}`;
        cell.setAttribute('data-r', String(r));
        cell.setAttribute('data-c', String(c));

        // Subgrid border styling - thick borders for 3x3 boxes
        const borderRight = (c === 2 || c === 5) ? 'border-r-[3px] border-r-white/50' : (c === 8 ? '' : 'border-r border-r-white/10');
        const borderBottom = (r === 2 || r === 5) ? 'border-b-[3px] border-b-white/50' : (r === 8 ? '' : 'border-b border-b-white/10');

        cell.className = `relative w-full h-full flex items-center justify-center font-bold text-lg sm:text-xl transition-colors duration-100 ${borderRight} ${borderBottom} cursor-pointer`;
        cell.addEventListener('click', () => this.selectCell(r, c));
        boardContainer.appendChild(cell);
      }
    }

    boardWrapper.appendChild(boardContainer);

    // Tools & Action Bar
    const toolBar = document.createElement('div');
    toolBar.className = 'grid grid-cols-4 gap-2 py-2 flex-none';
    toolBar.innerHTML = `
      <button id="btn-undo" type="button" class="py-2 rounded-xl bg-surface-raised text-[10px] font-bold text-ink-muted active:scale-95 transition flex flex-col items-center gap-1">
        <span class="text-lg leading-none">↩️</span>
        <span>Rückgängig</span>
      </button>
      <button id="btn-erase" type="button" class="py-2 rounded-xl bg-surface-raised text-[10px] font-bold text-ink-muted active:scale-95 transition flex flex-col items-center gap-1">
        <span class="text-lg leading-none">🧹</span>
        <span>Löschen</span>
      </button>
      <button id="btn-pencil" type="button" class="py-2 rounded-xl text-[10px] font-bold active:scale-95 transition flex flex-col items-center gap-1 ${this.pencilMode ? 'bg-pop-yellow text-bg font-black shadow-md' : 'bg-surface-raised text-ink-muted'}">
        <span class="text-lg leading-none">✏️</span>
        <span>Notizen ${this.pencilMode ? 'AN' : 'AUS'}</span>
      </button>
      <button id="btn-hint" type="button" class="py-2 rounded-xl bg-surface-raised text-[10px] font-bold text-ink-muted active:scale-95 transition flex flex-col items-center gap-1">
        <span class="text-lg leading-none">💡</span>
        <span>Tipp</span>
      </button>
    `;

    const numPad = document.createElement('div');
    numPad.className = 'grid grid-cols-9 gap-1 pb-4 pt-1 flex-none';
    for (let n = 1; n <= 9; n++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'h-11 rounded-xl bg-surface-raised font-black text-xl text-ink shadow-sm active:scale-90 active:bg-pop-yellow active:text-bg transition flex items-center justify-center border border-line hover:border-amber-400/40 cursor-pointer';
      btn.textContent = String(n);
      btn.addEventListener('click', () => this.enterNumber(n));
      numPad.appendChild(btn);
    }

    this.rootEl.appendChild(infoBar);
    this.rootEl.appendChild(boardWrapper);
    this.rootEl.appendChild(toolBar);
    this.rootEl.appendChild(numPad);

    this.container.innerHTML = '';
    this.container.appendChild(this.rootEl);

    // Bind action buttons
    this.rootEl.querySelector('#btn-undo')?.addEventListener('click', () => this.undo());
    this.rootEl.querySelector('#btn-erase')?.addEventListener('click', () => this.eraseCell());
    this.rootEl.querySelector('#btn-pencil')?.addEventListener('click', e => {
      this.pencilMode = !this.pencilMode;
      const btn = e.currentTarget;
      btn.className = `py-2 rounded-xl text-[10px] font-bold active:scale-95 transition flex flex-col items-center gap-1 ${this.pencilMode ? 'bg-pop-yellow text-bg font-black shadow-md' : 'bg-surface-raised text-ink-muted'}`;
      btn.querySelector('span:last-child').textContent = `Notizen ${this.pencilMode ? 'AN' : 'AUS'}`;
    });
    this.rootEl.querySelector('#btn-hint')?.addEventListener('click', () => this.giveHint());

    this.updateGridUI();
  }

  updateGridUI() {
    const selR = this.selected ? this.selected[0] : -1;
    const selC = this.selected ? this.selected[1] : -1;
    const selVal = this.selected ? this.grid[selR][selC] : 0;
    const selBoxR = Math.floor(selR / 3);
    const selBoxC = Math.floor(selC / 3);

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = this.rootEl?.querySelector(`#cell-${r}-${c}`);
        if (!cell) continue;

        const val = this.grid[r][c];
        const isInitial = this.initial[r][c] !== 0;
        const isSelected = r === selR && c === selC;
        const inSameRow = r === selR;
        const inSameCol = c === selC;
        const inSameBox = Math.floor(r / 3) === selBoxR && Math.floor(c / 3) === selBoxC;
        const isSameNum = val !== 0 && val === selVal;
        const isError = !isInitial && val !== 0 && val !== this.solution[r][c];

        // Background styling
        if (isSelected) {
          cell.style.backgroundColor = '#fbbf24'; // Amber highlight
          cell.style.color = '#000000';
        } else if (isSameNum) {
          cell.style.backgroundColor = 'rgba(251, 191, 36, 0.4)'; // Amber transparent
          cell.style.color = '#ffffff';
        } else if (inSameRow || inSameCol || inSameBox) {
          cell.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          cell.style.color = '#ffffff';
        } else {
          cell.style.backgroundColor = 'transparent';
          cell.style.color = '#ffffff';
        }

        if (isError) {
          cell.style.backgroundColor = '#ef4444'; // Red background
          cell.style.color = '#ffffff';
        } else if (isInitial && !isSelected) {
          cell.style.color = '#ffffff'; // Given numbers
          cell.style.fontWeight = '900';
        } else if (!isInitial && !isSelected && !isError) {
          cell.style.color = '#93c5fd'; // User entered: Light blue
          cell.style.fontWeight = '500';
        }

        // Cell content
        if (val !== 0) {
          cell.innerHTML = `<span>${val}</span>`;
        } else {
          const notesSet = this.notes[r][c];
          if (notesSet && notesSet.size > 0) {
            let notesGrid = '<div class="grid grid-cols-3 w-full h-full text-[9px] font-bold leading-none p-0.5 pointer-events-none text-ink-muted/80">';
            for (let n = 1; n <= 9; n++) {
              notesGrid += `<span class="flex items-center justify-center">${notesSet.has(n) ? n : ''}</span>`;
            }
            notesGrid += '</div>';
            cell.innerHTML = notesGrid;
          } else {
            cell.innerHTML = '';
          }
        }
      }
    }

    const mistakesEl = this.rootEl?.querySelector('#sudoku-mistakes');
    if (mistakesEl) {
      mistakesEl.textContent = `Fehler: ${this.mistakes}/${this.maxMistakes}`;
      mistakesEl.className = `px-2.5 py-1 rounded-full bg-surface-raised font-mono ${this.mistakes > 0 ? 'text-red-400 font-bold' : ''}`;
    }
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new SudokuGame(container, ctx);
  }
};

export { gameModule as default };
