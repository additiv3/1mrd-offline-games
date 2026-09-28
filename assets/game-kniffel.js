/* 1 Milliarde Offline Games – Kniffel / Yahtzee
   Offline-Würfelspiel mit Animation, Punktetabelle und Solo/Pass-and-Play/VS-Bot Modi */

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

const CATEGORIES = [
  { id: 'ones', name: '1er', desc: 'Nur Einser zählen', section: 'upper', val: 1 },
  { id: 'twos', name: '2er', desc: 'Nur Zweier zählen', section: 'upper', val: 2 },
  { id: 'threes', name: '3er', desc: 'Nur Dreier zählen', section: 'upper', val: 3 },
  { id: 'fours', name: '4er', desc: 'Nur Vierer zählen', section: 'upper', val: 4 },
  { id: 'fives', name: '5er', desc: 'Nur Fünfer zählen', section: 'upper', val: 5 },
  { id: 'sixes', name: '6er', desc: 'Nur Sechser zählen', section: 'upper', val: 6 },
  { id: 'three_kind', name: 'Dreierpasch', desc: 'Mind. 3 gleiche (Summe aller)', section: 'lower' },
  { id: 'four_kind', name: 'Viererpasch', desc: 'Mind. 4 gleiche (Summe aller)', section: 'lower' },
  { id: 'full_house', name: 'Full House', desc: '3 gleiche + 2 gleiche (25 Pkt)', section: 'lower', fixed: 25 },
  { id: 'small_straight', name: 'Kleine Straße', desc: '4 aufeinanderfolgende (30 Pkt)', section: 'lower', fixed: 30 },
  { id: 'large_straight', name: 'Große Straße', desc: '5 aufeinanderfolgende (40 Pkt)', section: 'lower', fixed: 40 },
  { id: 'kniffel', name: 'Kniffel! 🎲', desc: '5 gleiche Würfel (50 Pkt)', section: 'lower', fixed: 50 },
  { id: 'chance', name: 'Chance', desc: 'Summe aller Würfel', section: 'lower' }
];

export class KniffelGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.mode = ctx.mode || 'solo';
    this.initGame();
    this.render();
  }

  initGame() {
    this.dice = [1, 2, 3, 4, 5];
    this.held = [false, false, false, false, false];
    this.rollsLeft = 3;
    this.isRolling = false;
    this.currentPlayer = 0; // 0: Spieler 1 / Du, 1: Bot oder Spieler 2

    this.scores = [
      {}, // player 0
      {}  // player 1 (if bot or pass-and-play)
    ];

    this.diceAngles = [0, 0, 0, 0, 0];
    this.roundCount = 0;
  }

  calculateScore(catId, dice) {
    const counts = {};
    let sum = 0;
    for (const d of dice) {
      counts[d] = (counts[d] || 0) + 1;
      sum += d;
    }
    const countsArr = Object.values(counts);

    // Upper section
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat?.section === 'upper') {
      return (counts[cat.val] || 0) * cat.val;
    }

    if (catId === 'three_kind') {
      return countsArr.some(c => c >= 3) ? sum : 0;
    }
    if (catId === 'four_kind') {
      return countsArr.some(c => c >= 4) ? sum : 0;
    }
    if (catId === 'full_house') {
      const has3 = countsArr.includes(3);
      const has2 = countsArr.includes(2);
      const has5 = countsArr.includes(5);
      return (has3 && has2) || has5 ? 25 : 0;
    }
    if (catId === 'small_straight') {
      const unique = Array.from(new Set(dice)).sort((a,b) => a-b);
      const str = unique.join('');
      return str.includes('1234') || str.includes('2345') || str.includes('3456') ? 30 : 0;
    }
    if (catId === 'large_straight') {
      const unique = Array.from(new Set(dice)).sort((a,b) => a-b);
      const str = unique.join('');
      return str === '12345' || str === '23456' ? 40 : 0;
    }
    if (catId === 'kniffel') {
      return countsArr.some(c => c === 5) ? 50 : 0;
    }
    if (catId === 'chance') {
      return sum;
    }
    return 0;
  }

  rollDice() {
    if (this.rollsLeft <= 0 || this.isRolling) return;
    this.isRolling = true;
    playTone(320, 'triangle', 0.1, 0.2);

    let frames = 0;
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        if (!this.held[i]) {
          this.dice[i] = Math.floor(Math.random() * 6) + 1;
          this.diceAngles[i] = (Math.random() - 0.5) * 24;
        }
      }
      playTone(200 + Math.random() * 300, 'triangle', 0.04, 0.08);
      this.render();
      frames++;
      if (frames > 8) {
        clearInterval(interval);
        this.isRolling = false;
        this.rollsLeft--;
        this.diceAngles = [0, 0, 0, 0, 0];
        playTone(550, 'sine', 0.15, 0.18);
        this.render();

        if (this.mode === 'vs-bot' && this.currentPlayer === 1) {
          setTimeout(() => this.botTurn(), 800);
        }
      }
    }, 45);
  }

  toggleHold(index) {
    if (this.rollsLeft === 3 || this.isRolling) return;
    if (this.mode === 'vs-bot' && this.currentPlayer === 1) return;
    this.held[index] = !this.held[index];
    playTone(this.held[index] ? 600 : 400, 'sine', 0.08, 0.15);
    this.render();
  }

  selectCategory(catId) {
    if (this.rollsLeft === 3 && this.roundCount === 0) return;
    if (this.scores[this.currentPlayer][catId] !== undefined) return;

    const earned = this.calculateScore(catId, this.dice);
    this.scores[this.currentPlayer][catId] = earned;
    playTone(earned > 0 ? 680 : 300, earned > 0 ? 'triangle' : 'sawtooth', 0.18, 0.2);

    this.checkNextTurn();
  }

  checkNextTurn() {
    const isPlayer0Done = Object.keys(this.scores[0]).length >= CATEGORIES.length;
    const isMulti = this.mode !== 'solo';
    const isPlayer1Done = !isMulti || Object.keys(this.scores[1]).length >= CATEGORIES.length;

    if (isPlayer0Done && isPlayer1Done) {
      this.finishGame();
      return;
    }

    if (isMulti) {
      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    }

    this.rollsLeft = 3;
    this.held = [false, false, false, false, false];
    this.roundCount++;
    this.render();

    if (this.mode === 'vs-bot' && this.currentPlayer === 1) {
      setTimeout(() => this.botTurn(), 600);
    }
  }

  botTurn() {
    if (this.rollsLeft > 0) {
      if (this.rollsLeft === 3) {
        this.rollDice();
        return;
      }

      // Simple smart bot: Keep high matching counts
      const counts = {};
      for (const d of this.dice) counts[d] = (counts[d] || 0) + 1;
      let bestVal = 6;
      let maxCount = 0;
      for (let v = 1; v <= 6; v++) {
        if ((counts[v] || 0) >= maxCount) {
          maxCount = counts[v] || 0;
          bestVal = v;
        }
      }
      for (let i = 0; i < 5; i++) {
        this.held[i] = this.dice[i] === bestVal || counts[this.dice[i]] >= 2;
      }
      if (this.rollsLeft > 1 && maxCount < 4) {
        this.rollDice();
        return;
      }
    }

    // Bot picks best score
    let bestCat = null;
    let highestScore = -1;
    for (const cat of CATEGORIES) {
      if (this.scores[1][cat.id] === undefined) {
        const sc = this.calculateScore(cat.id, this.dice);
        if (sc > highestScore) {
          highestScore = sc;
          bestCat = cat.id;
        }
      }
    }
    if (!bestCat) {
      bestCat = CATEGORIES.find(c => this.scores[1][c.id] === undefined)?.id;
    }
    this.selectCategory(bestCat);
  }

  getTotals(playerIdx) {
    const s = this.scores[playerIdx];
    let upperSum = 0;
    for (const c of CATEGORIES.filter(c => c.section === 'upper')) {
      if (s[c.id] !== undefined) upperSum += s[c.id];
    }
    const bonus = upperSum >= 63 ? 35 : 0;
    let lowerSum = 0;
    for (const c of CATEGORIES.filter(c => c.section === 'lower')) {
      if (s[c.id] !== undefined) lowerSum += s[c.id];
    }
    return {
      upperSum,
      bonus,
      total: upperSum + bonus + lowerSum
    };
  }

  finishGame() {
    const p0 = this.getTotals(0);
    const p1 = this.getTotals(1);

    let outcome = 'win';
    if (this.mode === 'vs-bot') {
      outcome = p0.total > p1.total ? 'win' : p0.total < p1.total ? 'loss' : 'draw';
    } else if (this.mode === 'solo') {
      outcome = 'completed';
    }

    const coinsEarned = Math.max(10, Math.floor(p0.total / 4));
    this.render();

    setTimeout(() => {
      this.ctx.reportResult({
        outcome,
        score: p0.total,
        coinsEarned,
        headline: outcome === 'win' ? `Gewonnen! 🏆 (${p0.total} Pkt)` : `Endstand: ${p0.total} Punkte`
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
    const isBotTurn = this.mode === 'vs-bot' && this.currentPlayer === 1;
    const p0 = this.getTotals(0);
    const p1 = this.getTotals(1);
    const diceDots = {
      1: ['center'],
      2: ['top-right', 'bottom-left'],
      3: ['top-right', 'center', 'bottom-left'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    let diceHtml = this.dice.map((val, idx) => {
      const isHeld = this.held[idx];
      const angle = this.diceAngles[idx];
      const dots = diceDots[val] || [];

      return `
      return `
        <button type="button" data-die="${idx}" class="die-btn relative flex-1 aspect-square max-w-[72px] min-h-[64px] rounded-2xl bg-gradient-to-br ${isHeld ? 'from-amber-300 via-amber-400 to-amber-500 ring-4 ring-amber-200 text-bg shadow-[0_8px_16px_rgba(245,158,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] -translate-y-2' : 'from-white via-slate-50 to-slate-200 text-slate-800 shadow-[0_6px_12px_rgba(0,0,0,0.15),inset_0_4px_6px_rgba(255,255,255,1)] border border-slate-300/50'} flex items-center justify-center p-2 transition-all active:scale-95 cursor-pointer" style="transform: rotate(${angle}deg) ${isHeld ? 'translateY(-10px)' : ''}">
          <div class="w-full h-full relative grid grid-cols-3 grid-rows-3 gap-[2px]">
            ${dots.map(pos => {
              let gridClass = '';
              if (pos === 'top-left') gridClass = 'col-start-1 row-start-1';
              if (pos === 'top-right') gridClass = 'col-start-3 row-start-1';
              if (pos === 'middle-left') gridClass = 'col-start-1 row-start-2';
              if (pos === 'center') gridClass = 'col-start-2 row-start-2';
              if (pos === 'middle-right') gridClass = 'col-start-3 row-start-2';
              if (pos === 'bottom-left') gridClass = 'col-start-1 row-start-3';
              if (pos === 'bottom-right') gridClass = 'col-start-3 row-start-3';
              return `<div class="${gridClass} flex items-center justify-center"><span class="w-[18px] h-[18px] rounded-full ${isHeld ? 'bg-amber-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'bg-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]'}"></span></div>`;
            }).join('')}
          </div>
          ${isHeld ? '<span class="absolute -top-3 rounded-full bg-amber-900 text-amber-100 border-2 border-amber-400 text-[10px] font-black px-2 py-0.5 shadow-lg z-10 tracking-widest">HOLD</span>' : ''}
        </button>
      `;
    }).join('');

    let scoreRowsHtml = CATEGORIES.map(cat => {
      const s0 = this.scores[0][cat.id];
      const s1 = this.scores[1]?.[cat.id];
      const curScore = this.scores[this.currentPlayer][cat.id];
      const preview = curScore === undefined && this.rollsLeft < 3 ? this.calculateScore(cat.id, this.dice) : null;

      return `
        <tr class="border-b border-line/40 hover:bg-white/5 transition">
          <td class="py-2.5 px-3">
            <span class="font-bold text-xs block text-ink">${cat.name}</span>
            <span class="text-[10px] text-ink-muted">${cat.desc}</span>
          </td>
          <td class="py-2 px-2 text-right">
            ${s0 !== undefined ? `<span class="font-bold text-sm text-pop-yellow">${s0}</span>` : 
              (this.currentPlayer === 0 && preview !== null ? 
                `<button type="button" data-cat="${cat.id}" class="cat-btn px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 font-extrabold text-xs hover:bg-amber-400/30 active:scale-95 transition cursor-pointer">+${preview}</button>` : 
                (this.currentPlayer === 0 ? `<button type="button" data-cat="${cat.id}" class="cat-btn px-2 py-1 rounded-xl bg-surface-raised text-ink-muted text-xs active:scale-95 transition">-</button>` : `<span class="text-xs text-ink-muted">-</span>`))}
          </td>
          ${this.mode !== 'solo' ? `
            <td class="py-2 px-2 text-right">
              ${s1 !== undefined ? `<span class="font-bold text-sm text-pop-cyan">${s1}</span>` : 
                (this.currentPlayer === 1 && preview !== null && !isBotTurn ? 
                  `<button type="button" data-cat="${cat.id}" class="cat-btn px-2.5 py-1 rounded-xl bg-cyan-400/20 text-cyan-300 font-extrabold text-xs hover:bg-cyan-400/30 active:scale-95 transition cursor-pointer">+${preview}</button>` : 
                  `<span class="text-xs text-ink-muted">-</span>`)}
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="h-full w-full flex flex-col bg-bg select-none overflow-hidden text-ink font-sans">
        <!-- Status Bar -->
        <div class="flex items-center justify-between px-4 py-2 bg-surface border-b border-line shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-xl">🎲</span>
            <div>
              <span class="text-xs font-black tracking-wide text-pop-yellow">${this.mode === 'vs-bot' ? (this.currentPlayer === 0 ? 'Dein Zug' : 'KI würfelt …') : (this.mode === 'pass-and-play' ? `Spieler ${this.currentPlayer + 1} ist dran` : 'Solo Kniffel')}</span>
              <span class="block text-[11px] text-ink-muted">${this.rollsLeft} ${this.rollsLeft === 1 ? 'Wurf übrig' : 'Würfe übrig'}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[10px] text-ink-muted uppercase font-bold">Punkte</span>
              <span class="block text-base font-black text-amber-400">${p0.total} ${this.mode !== 'solo' ? `vs ${p1.total}` : ''}</span>
            </div>
          </div>
        </div>

        <!-- Dice Arena -->
        <div class="p-4 bg-gradient-to-b from-surface to-bg shrink-0 flex flex-col items-center gap-3 shadow-inner">
          <div class="w-full flex items-center justify-center gap-2 max-w-sm">
            ${diceHtml}
          </div>

          <div class="w-full max-w-sm flex gap-2 mt-1">
            <button id="roll-btn" type="button" class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-bg font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 ${this.rollsLeft <= 0 || isBotTurn ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}">
              <span class="text-lg">🎲</span>
              <span>${this.rollsLeft === 3 ? 'Würfeln' : `Nochmal würfeln (${this.rollsLeft})`}</span>
            </button>
          </div>
        </div>

        <!-- Scorecard Table -->
        <div class="flex-1 overflow-y-auto px-3 py-2">
          <div class="rounded-2xl bg-surface border border-line overflow-hidden shadow-md">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-raised border-b border-line text-[11px] font-black text-ink-muted uppercase">
                  <th class="py-2 px-3">Kategorie</th>
                  <th class="py-2 px-2 text-right">${this.mode === 'vs-bot' ? 'Du' : 'P1'}</th>
                  ${this.mode !== 'solo' ? `<th class="py-2 px-2 text-right">${this.mode === 'vs-bot' ? 'KI' : 'P2'}</th>` : ''}
                </tr>
              </thead>
              <tbody>
                ${scoreRowsHtml}
                <!-- Upper Bonus Row -->
                <tr class="bg-surface-raised/40 font-bold text-xs border-b border-line">
                  <td class="py-2 px-3">Oberer Bonus (≥63 Pkt)</td>
                  <td class="py-2 px-2 text-right text-amber-400">+${p0.bonus}</td>
                  ${this.mode !== 'solo' ? `<td class="py-2 px-2 text-right text-cyan-400">+${p1.bonus}</td>` : ''}
                </tr>
                <!-- Total Row -->
                <tr class="bg-surface-raised font-black text-sm">
                  <td class="py-3 px-3">Gesamt</td>
                  <td class="py-3 px-2 text-right text-amber-400">${p0.total}</td>
                  ${this.mode !== 'solo' ? `<td class="py-3 px-2 text-right text-cyan-400">${p1.total}</td>` : ''}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    this.container.querySelectorAll('.die-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-die'), 10);
        this.toggleHold(idx);
      });
    });

    this.container.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        this.selectCategory(cat);
      });
    });

    const rollBtn = this.container.querySelector('#roll-btn');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => this.rollDice());
    }
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new KniffelGame(container, ctx);
  }
};

export default gameModule;
