// Challenges & Stamp Card Manager (Herausforderungen & Stempelkarten)

const STORAGE_KEY = 'mrd:v1:challenges_data';
const PROGRESS_KEY = 'mrd:v1:shell:progress';

export const INITIAL_CHALLENGES = [
  // Dunk Drop
  {
    id: 'dunk_hoops_1',
    gameId: 'dunk-drop',
    category: 'dunk',
    icon: '🏀',
    title: 'Korb-Jäger',
    desc: 'Triff 15 Körbe in Dunk Drop',
    target: 15,
    reward: 25,
    stamps: 1
  },
  {
    id: 'dunk_up_1',
    gameId: 'dunk-drop',
    category: 'dunk',
    icon: '🚀',
    title: 'Himmels-Stürmer',
    desc: 'Triff 5 blaue Körbe von unten',
    target: 5,
    reward: 40,
    stamps: 1
  },
  {
    id: 'dunk_swish',
    gameId: 'dunk-drop',
    category: 'dunk',
    icon: '🎯',
    title: 'Swish-Meister',
    desc: '5 Körbe ohne Randberührung verwandeln',
    target: 5,
    reward: 35,
    stamps: 1
  },
  {
    id: 'dunk_hoops_2',
    gameId: 'dunk-drop',
    category: 'dunk',
    icon: '🔥',
    title: 'Korb-Maschine',
    desc: 'Triff 60 Körbe in Dunk Drop',
    target: 60,
    reward: 70,
    stamps: 1
  },
  {
    id: 'dunk_up_2',
    gameId: 'dunk-drop',
    category: 'dunk',
    icon: '⚡',
    title: 'Gegen die Schwerkraft',
    desc: 'Triff 20 blaue Körbe von unten',
    target: 20,
    reward: 80,
    stamps: 1
  },
  {
    id: 'dunk_score',
    gameId: 'dunk-drop',
    category: 'dunk',
    icon: '🏆',
    title: 'Dunk-Legende',
    desc: 'Erreiche einen Highscore von 20',
    target: 20,
    reward: 60,
    stamps: 1
  },

  // Neue Arcade Quests
  {
    id: 'snake_apples',
    gameId: 'snake',
    category: 'arcade',
    icon: '🐍',
    title: 'Schlangen-Hunger',
    desc: 'Sammle 15 Äpfel in Snake Retro',
    target: 15,
    reward: 40,
    stamps: 1
  },
  {
    id: 'mole_hits',
    gameId: 'maulwurf',
    category: 'arcade',
    icon: '🔨',
    title: 'Flinke Kelle',
    desc: 'Klopfe 25 Maulwürfe auf den Kopf',
    target: 25,
    reward: 45,
    stamps: 1
  },
  {
    id: 'pong_wins',
    gameId: 'pong-duell',
    category: 'arcade',
    icon: '🏓',
    title: 'Tischtennis-Profi',
    desc: 'Gewinne 2 Runden im Pong Duell',
    target: 2,
    reward: 40,
    stamps: 1
  },
  {
    id: 'tierturm_height',
    gameId: 'tierturm',
    category: 'arcade',
    icon: '🦒',
    title: 'Bis zu den Wolken',
    desc: 'Erreiche Turmhöhe 15 im Tierturm',
    target: 15,
    reward: 45,
    stamps: 1
  },
  {
    id: 'sandfall_glasses',
    gameId: 'sandfall',
    category: 'arcade',
    icon: '⏳',
    title: 'Sandmagier',
    desc: 'Fülle 3 Gläser in Sandfall',
    target: 3,
    reward: 40,
    stamps: 1
  },

  // Brett & Würfel
  {
    id: 'kniffel_game',
    gameId: 'kniffel',
    category: 'board',
    icon: '🎲',
    title: 'Würfel-Glück',
    desc: 'Schließe 1 Spiel Kniffel ab (≥120 Pkt)',
    target: 1,
    reward: 55,
    stamps: 1
  },
  {
    id: 'vier_gewinnt_win',
    gameId: 'vier-gewinnt',
    category: 'board',
    icon: '🔴',
    title: 'Stratege',
    desc: 'Gewinne 2 Partien 4 Gewinnt',
    target: 2,
    reward: 50,
    stamps: 1
  },

  // Rätsel & Denksport
  {
    id: 'game_2048_score',
    gameId: '2048',
    category: 'puzzle',
    icon: '🔢',
    title: 'Zahlen-Kombinierer',
    desc: 'Erreiche 512 Punkte in 2048 Neon',
    target: 512,
    reward: 50,
    stamps: 1
  },
  {
    id: 'cross_sum_win',
    gameId: 'cross-sum',
    category: 'puzzle',
    icon: '➕',
    title: 'Rechen-König',
    desc: 'Löse 1 Cross Sum Kreuzsummen-Rätsel',
    target: 1,
    reward: 45,
    stamps: 1
  },
  {
    id: 'memory_win',
    gameId: 'memory',
    category: 'puzzle',
    icon: '🧠',
    title: 'Gedächtnis wie ein Elefant',
    desc: 'Löse 1 Memory-Spiel',
    target: 1,
    reward: 40,
    stamps: 1
  },
  {
    id: 'sudoku_solve',
    gameId: 'sudoku',
    category: 'puzzle',
    icon: '🔢',
    title: 'Zahlen-Genie',
    desc: 'Löse 1 Sudoku-Rätsel',
    target: 1,
    reward: 60,
    stamps: 1
  },
  {
    id: 'wasser_levels',
    gameId: 'wasser-sortieren',
    category: 'puzzle',
    icon: '🧪',
    title: 'Meister-Chemiker',
    desc: 'Löse 3 Level in Wasser sortieren',
    target: 3,
    reward: 45,
    stamps: 1
  },

  // Karten
  {
    id: 'solitaer_win',
    gameId: 'solitaer',
    category: 'cards',
    icon: '🃏',
    title: 'Karten-Meister',
    desc: 'Löse 1 Spiel Solitär oder Spider',
    target: 1,
    reward: 75,
    stamps: 1
  },
  {
    id: 'spades_game',
    gameId: 'spades',
    category: 'cards',
    icon: '♠️',
    title: 'Pik-Ass',
    desc: 'Spiele 1 Runde Spades zu Ende',
    target: 1,
    reward: 55,
    stamps: 1
  }
];

export function getChallengesState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.progress) parsed.progress = {};
      if (!parsed.claimed) parsed.claimed = {};
      for (const ch of INITIAL_CHALLENGES) {
        if (parsed.progress[ch.id] === undefined) parsed.progress[ch.id] = 0;
        if (parsed.claimed[ch.id] === undefined) parsed.claimed[ch.id] = false;
      }
      if (typeof parsed.stamps !== 'number') parsed.stamps = 0;
      if (typeof parsed.cardsCompleted !== 'number') parsed.cardsCompleted = 0;
      return parsed;
    }
  } catch {
    // fallback
  }

  const initial = {
    stamps: 0,
    cardsCompleted: 0,
    progress: {},
    claimed: {}
  };
  for (const ch of INITIAL_CHALLENGES) {
    initial.progress[ch.id] = 0;
    initial.claimed[ch.id] = false;
  }
  return initial;
}

export function saveChallengesState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('challenges-updated', { detail: state }));
  } catch {
    // ignore
  }
}

// Add coins directly to the shell's progress state
export function addCoinsToWallet(amount) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const prog = JSON.parse(raw);
      prog.coins = (prog.coins || 0) + amount;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
      window.dispatchEvent(new CustomEvent('coins-updated', { detail: prog.coins }));
    }
  } catch (e) {
    console.warn('Could not add coins to wallet', e);
  }
}

// Sound effects for challenges & stamps
function playTone(freq, type = 'sine', duration = 0.15) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

export function playStampSound() {
  playTone(523.25, 'triangle', 0.12);
  setTimeout(() => playTone(659.25, 'triangle', 0.14), 100);
  setTimeout(() => playTone(783.99, 'sine', 0.22), 220);
}

export function playJackpotSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 'square', 0.25), i * 110);
  });
}

// Progress incrementers
export function incrementProgress(challengeId, amount = 1) {
  const state = getChallengesState();
  const current = state.progress[challengeId] || 0;
  state.progress[challengeId] = current + amount;
  saveChallengesState(state);
}

export function setMaxProgress(challengeId, value) {
  const state = getChallengesState();
  const current = state.progress[challengeId] || 0;
  if (value > current) {
    state.progress[challengeId] = value;
    saveChallengesState(state);
  }
}

// Dunk Drop specific hooks
export function onDunkScore(points, isSwish, isUp) {
  incrementProgress('dunk_hoops_1', 1);
  incrementProgress('dunk_hoops_2', 1);
  if (isUp) {
    incrementProgress('dunk_up_1', 1);
    incrementProgress('dunk_up_2', 1);
  }
  if (isSwish) {
    incrementProgress('dunk_swish', 1);
  }
}

export function onDunkGameOver(score) {
  setMaxProgress('dunk_score', score);
}

// Claim a challenge reward
export function claimChallengeReward(challengeId) {
  const state = getChallengesState();
  const ch = INITIAL_CHALLENGES.find(c => c.id === challengeId);
  if (!ch) return false;

  const current = state.progress[challengeId] || 0;
  if (current < ch.target || state.claimed[challengeId]) return false;

  state.claimed[challengeId] = true;
  state.stamps = Math.min(6, (state.stamps || 0) + (ch.stamps || 1));
  saveChallengesState(state);

  addCoinsToWallet(ch.reward);
  playStampSound();
  return true;
}

// Claim the completed stamp card (6 stamps)
export function claimStampCardJackpot() {
  const state = getChallengesState();
  if ((state.stamps || 0) < 6) return false;

  state.stamps = 0;
  state.cardsCompleted = (state.cardsCompleted || 0) + 1;
  saveChallengesState(state);

  // Jackpot reward: 250 coins!
  addCoinsToWallet(250);
  playJackpotSound();
  return true;
}

// Check how many challenges have claimable rewards
export function getClaimableCount() {
  const state = getChallengesState();
  let count = 0;
  if ((state.stamps || 0) >= 6) count++;
  for (const ch of INITIAL_CHALLENGES) {
    const prog = state.progress[ch.id] || 0;
    if (prog >= ch.target && !state.claimed[ch.id]) {
      count++;
    }
  }
  return count;
}

// Modal UI for Stamp Card & Challenges
export function openChallengesModal() {
  const existing = document.getElementById('challenges-modal-root');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'challenges-modal-root';
  backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in select-none';

  function renderContent(activeTab = 'stamps', activeCat = 'all') {
    const state = getChallengesState();
    const stamps = state.stamps || 0;
    const cardsCompleted = state.cardsCompleted || 0;
    const canClaimJackpot = stamps >= 6;

    let claimableMissions = 0;
    for (const c of INITIAL_CHALLENGES) {
      if ((state.progress[c.id] || 0) >= c.target && !state.claimed[c.id]) claimableMissions++;
    }

    const modal = document.createElement('div');
    modal.className = 'flex flex-col w-full max-w-lg max-h-[92vh] bg-surface rounded-3xl border border-line shadow-2xl overflow-hidden animate-pop-in';

    // Header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between p-4 border-b border-line bg-surface-raised';
    header.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-2xl">🎫</span>
        <div>
          <h2 class="font-extrabold text-base leading-tight">Herausforderungen & Stempel</h2>
          <p class="text-xs text-ink-muted">Sammle Stempel für die 250 🪙 Belohnung</p>
        </div>
      </div>
      <button id="close-challenges-btn" type="button" class="w-8 h-8 rounded-full bg-surface grid place-items-center text-ink-muted font-bold active:scale-95 transition cursor-pointer">✕</button>
    `;

    // Tabs
    const tabNav = document.createElement('div');
    tabNav.className = 'flex p-2 bg-surface border-b border-line gap-2';
    tabNav.innerHTML = `
      <button id="tab-stamps" type="button" class="flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'stamps' ? 'bg-pop-yellow text-bg shadow-md' : 'bg-surface-raised text-ink-muted active:scale-98 cursor-pointer'}">
        <span>🎫 Stempelkarte</span>
        ${canClaimJackpot ? '<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>' : ''}
      </button>
      <button id="tab-missions" type="button" class="flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${activeTab === 'missions' ? 'bg-pop-yellow text-bg shadow-md' : 'bg-surface-raised text-ink-muted active:scale-98 cursor-pointer'}">
        <span>🎯 Missionen</span>
        ${claimableMissions > 0 ? `<span class="bg-red-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-black">${claimableMissions}</span>` : ''}
      </button>
    `;

    // Body
    const body = document.createElement('div');
    body.className = 'flex-1 overflow-y-auto p-4 space-y-4';

    if (activeTab === 'stamps') {
      // Stamp Card View
      const cardContainer = document.createElement('div');
      cardContainer.className = 'relative p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-surface-raised to-surface border-2 border-amber-500/30 shadow-xl text-center space-y-4';

      let slotsHtml = '';
      for (let i = 1; i <= 6; i++) {
        const isStamped = i <= stamps;
        slotsHtml += `
          <div class="aspect-square rounded-2xl ${isStamped ? 'bg-amber-400 text-bg shadow-lg shadow-amber-400/30 scale-102 border-2 border-yellow-200' : 'bg-surface/80 border-2 border-dashed border-white/20 text-white/30'} flex flex-col items-center justify-center transition-all duration-300">
            ${isStamped 
              ? '<span class="text-3xl animate-pop-in">⭐</span><span class="text-[10px] font-black tracking-tight mt-0.5">STEMPEL ' + i + '</span>' 
              : '<span class="text-lg opacity-40">#' + i + '</span>'}
          </div>
        `;
      }

      cardContainer.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs uppercase tracking-widest font-black text-amber-400">Offizielle Stempelkarte</span>
          <span class="text-xs font-bold text-ink-muted">${cardsCompleted}× vollendet</span>
        </div>
        <div class="grid grid-cols-3 gap-3 my-2">
          ${slotsHtml}
        </div>
        <div class="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
          <div class="text-left">
            <span class="text-xs font-bold text-ink">Stempel: ${stamps} / 6</span>
            <p class="text-[11px] text-ink-muted">Erfülle Missionen, um Stempel zu erhalten</p>
          </div>
          <span class="text-sm font-black text-amber-300">+250 🪙</span>
        </div>
        <button id="claim-jackpot-btn" type="button" class="w-full py-3.5 px-4 rounded-2xl font-black text-sm transition shadow-lg ${canClaimJackpot ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-bg active:scale-95 animate-pulse cursor-pointer' : 'bg-surface-raised text-ink-muted opacity-60 cursor-not-allowed'}">
          ${canClaimJackpot ? '🎉 250 🪙 JACKPOT ABHOLEN!' : `Noch ${6 - stamps} Stempel benötigt`}
        </button>
      `;

      body.appendChild(cardContainer);

      // Info box
      const tipBox = document.createElement('div');
      tipBox.className = 'p-3 rounded-2xl bg-surface-raised/50 border border-line text-xs text-ink-muted flex items-start gap-2.5';
      tipBox.innerHTML = `
        <span class="text-lg">💡</span>
        <p>Jede abgeschlossene Mission stempelt deine Karte ab. Wenn alle 6 Felder gestempelt sind, gewinnst du 250 Münzen und startest eine frische Karte!</p>
      `;
      body.appendChild(tipBox);

    } else {
      // Missions / Challenges View
      // Filter chips
      const chips = document.createElement('div');
      chips.className = 'flex gap-2 overflow-x-auto pb-1 text-xs [scrollbar-width:none]';
      const categories = [
        { id: 'all', label: 'Alle' },
        { id: 'dunk', label: '🏀 Dunk Drop' },
        { id: 'arcade', label: '🕹️ Arcade' },
        { id: 'board', label: '🎲 Brett' },
        { id: 'puzzle', label: '🧩 Rätsel' },
        { id: 'cards', label: '🃏 Karten' }
      ];

      chips.innerHTML = categories.map(cat => `
        <button type="button" data-cat="${cat.id}" class="cat-filter-btn shrink-0 py-1.5 px-3 rounded-full font-bold transition cursor-pointer ${activeCat === cat.id ? 'bg-ink text-bg' : 'bg-surface-raised text-ink-muted active:scale-95'}">
          ${cat.label}
        </button>
      `).join('');
      body.appendChild(chips);

      const list = document.createElement('div');
      list.className = 'space-y-2.5';

      const filtered = INITIAL_CHALLENGES.filter(c => activeCat === 'all' || c.category === activeCat);

      for (const ch of filtered) {
        const prog = Math.min(ch.target, state.progress[ch.id] || 0);
        const isDone = prog >= ch.target;
        const isClaimed = state.claimed[ch.id];
        const pct = Math.min(100, Math.round((prog / ch.target) * 100));

        const item = document.createElement('div');
        item.className = `p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${isClaimed ? 'bg-surface-raised/30 border-line/50 opacity-60' : isDone ? 'bg-surface-raised border-amber-500/50 shadow-md' : 'bg-surface-raised border-line'}`;

        item.innerHTML = `
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span class="text-3xl shrink-0 p-1.5 rounded-xl bg-surface border border-line">${ch.icon}</span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="font-extrabold text-sm text-ink truncate">${ch.title}</span>
                <span class="text-[11px] font-black text-amber-400 shrink-0">+${ch.reward} 🪙</span>
              </div>
              <p class="text-xs text-ink-muted leading-tight mt-0.5">${ch.desc}</p>
              <div class="mt-2 flex items-center gap-2">
                <div class="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>
                <span class="text-[10px] font-bold text-ink-muted shrink-0">${prog}/${ch.target}</span>
              </div>
            </div>
          </div>
          <div class="shrink-0">
            ${isClaimed 
              ? '<span class="text-xs font-bold text-ink-muted px-2 py-1 bg-surface rounded-xl">Fertig ✓</span>' 
              : isDone 
                ? `<button type="button" data-claim="${ch.id}" class="claim-btn py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-bg text-xs font-black shadow-md active:scale-95 transition flex items-center gap-1 cursor-pointer">Abholen ⭐</button>` 
                : `<span class="text-[11px] font-bold text-ink-muted/80 px-2 py-1 bg-surface rounded-xl">${pct}%</span>`}
          </div>
        `;
        list.appendChild(item);
      }
      body.appendChild(list);
    }

    modal.appendChild(header);
    modal.appendChild(tabNav);
    modal.appendChild(body);

    backdrop.innerHTML = '';
    backdrop.appendChild(modal);

    // Event listeners
    backdrop.querySelector('#close-challenges-btn')?.addEventListener('click', () => {
      backdrop.remove();
    });

    backdrop.querySelector('#tab-stamps')?.addEventListener('click', () => {
      renderContent('stamps', activeCat);
    });

    backdrop.querySelector('#tab-missions')?.addEventListener('click', () => {
      renderContent('missions', activeCat);
    });

    backdrop.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const cat = e.currentTarget.getAttribute('data-cat');
        renderContent('missions', cat);
      });
    });

    backdrop.querySelectorAll('.claim-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.getAttribute('data-claim');
        if (claimChallengeReward(id)) {
          renderContent(activeTab, activeCat);
        }
      });
    });

    backdrop.querySelector('#claim-jackpot-btn')?.addEventListener('click', () => {
      if (claimStampCardJackpot()) {
        renderContent('stamps', activeCat);
      }
    });
  }

  renderContent();
  document.body.appendChild(backdrop);
}
