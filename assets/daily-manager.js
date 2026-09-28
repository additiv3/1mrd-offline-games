/* 1 Milliarde Offline Games – Täglicher Bonus & Glücksrad System */

const STORAGE_KEY_DAILY = 'mrd:v1:daily:data';
const STORAGE_KEY_PROGRESS = 'mrd:v1:shell:progress';

export function getDailyState() {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAILY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.lastDate !== todayStr) {
        // New day! Check streak
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streak = parsed.lastDate === yesterday ? (parsed.streak || 0) + 1 : 1;
        return {
          lastDate: null,
          todayStr,
          streak,
          canClaim: true,
          spunToday: false
        };
      }
      return {
        ...parsed,
        todayStr,
        canClaim: false
      };
    }
  } catch {
    // fallback
  }

  return {
    lastDate: null,
    todayStr,
    streak: 1,
    canClaim: true,
    spunToday: false
  };
}

export function saveDailyState(state) {
  try {
    localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('daily-updated', { detail: state }));
  } catch {
    // ignore
  }
}

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

function addCoins(amount) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (raw) {
      const prog = JSON.parse(raw);
      prog.coins = (prog.coins || 0) + amount;
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(prog));
      window.dispatchEvent(new CustomEvent('coins-updated', { detail: prog.coins }));
    }
  } catch {
    // ignore
  }
}

const WHEEL_PRIZES = [
  { coins: 30, label: '30 🪙', color: '#3b82f6' },
  { coins: 75, label: '75 🪙', color: '#ec4899' },
  { coins: 50, label: '50 🪙', color: '#10b981' },
  { coins: 150, label: '150 🪙 ⭐', color: '#f59e0b' },
  { coins: 40, label: '40 🪙', color: '#8b5cf6' },
  { coins: 100, label: '100 🪙', color: '#ef4444' },
  { coins: 60, label: '60 🪙', color: '#06b6d4' },
  { coins: 300, label: '300 🪙 👑', color: '#eab308' }
];

export function openDailyModal() {
  const existing = document.getElementById('daily-modal-root');
  if (existing) existing.remove();

  const state = getDailyState();
  const canSpin = state.canClaim || !state.spunToday;

  const backdrop = document.createElement('div');
  backdrop.id = 'daily-modal-root';
  backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md select-none animate-fade-in';

  let currentRotation = 0;
  let isSpinning = false;

  const modal = document.createElement('div');
  modal.className = 'flex flex-col w-full max-w-sm bg-surface rounded-3xl border border-line shadow-2xl overflow-hidden p-5 text-center space-y-4';

  modal.innerHTML = `
    <div class="flex items-center justify-between border-b border-line pb-3">
      <div class="flex items-center gap-2 text-left">
        <span class="text-2xl">🎁</span>
        <div>
          <h2 class="font-extrabold text-base leading-tight">Täglicher Bonus</h2>
          <p class="text-xs text-ink-muted">Streak: <span class="text-pop-yellow font-black">${state.streak} Tage 🔥</span></p>
        </div>
      </div>
      <button id="close-daily-btn" type="button" class="w-8 h-8 rounded-full bg-surface-raised grid place-items-center text-ink-muted font-bold active:scale-95 transition">✕</button>
    </div>

    <!-- Daily Streak Row -->
    <div class="grid grid-cols-7 gap-1 p-2 bg-surface-raised rounded-2xl">
      ${[1, 2, 3, 4, 5, 6, 7].map(d => {
        const isReached = d <= state.streak;
        const isCurrent = d === state.streak;
        return `
          <div class="flex flex-col items-center py-1.5 px-0.5 rounded-xl ${isCurrent ? 'bg-amber-400 text-bg font-black scale-105 shadow' : isReached ? 'bg-surface text-amber-400 font-bold' : 'opacity-40 text-ink-muted'} text-[10px]">
            <span>Tag ${d}</span>
            <span class="text-sm mt-0.5">${d === 7 ? '👑' : '🪙'}</span>
            <span class="text-[9px] mt-0.5">+${d * 15}</span>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Glücksrad / Wheel -->
    <div class="relative w-64 h-64 mx-auto my-2 flex items-center justify-center">
      <!-- Pointer -->
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-3xl filter drop-shadow">🔻</div>
      <canvas id="wheel-canvas" width="240" height="240" class="rounded-full shadow-2xl border-4 border-amber-400/80"></canvas>
      <div class="absolute w-12 h-12 rounded-full bg-surface border-4 border-amber-400 shadow-md grid place-items-center font-black text-xs text-pop-yellow">
        GO!
      </div>
    </div>

    <!-- Win Result / Spin Button -->
    <div id="daily-action-box" class="pt-1">
      ${canSpin ? `
        <button id="spin-wheel-btn" type="button" class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-bg font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition cursor-pointer">
          🎰 Glücksrad drehen (Kostenlos)
        </button>
      ` : `
        <div class="p-3 rounded-2xl bg-surface-raised border border-line text-xs text-ink-muted">
          <span>✅ Heute schon gedreht! Morgen wiederkommen für Tag ${state.streak + 1} 🔥</span>
        </div>
      `}
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Draw wheel on canvas
  const canvas = modal.querySelector('#wheel-canvas');
  const ctx = canvas.getContext('2d');
  const numSlices = WHEEL_PRIZES.length;
  const sliceAngle = (Math.PI * 2) / numSlices;

  function drawWheel(rotation = 0) {
    ctx.clearRect(0, 0, 240, 240);
    ctx.save();
    ctx.translate(120, 120);
    ctx.rotate(rotation);

    for (let i = 0; i < numSlices; i++) {
      const p = WHEEL_PRIZES[i];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 116, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#0e0b1f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(p.label, 105, 4);
      ctx.restore();
    }
    ctx.restore();
  }

  drawWheel(0);

  modal.querySelector('#close-daily-btn')?.addEventListener('click', () => backdrop.remove());

  const spinBtn = modal.querySelector('#spin-wheel-btn');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      if (isSpinning) return;
      isSpinning = true;
      spinBtn.disabled = true;
      spinBtn.classList.add('opacity-50', 'pointer-events-none');

      // Random target prize
      const prizeIdx = Math.floor(Math.random() * numSlices);
      const prize = WHEEL_PRIZES[prizeIdx];

      // Calculate final angle to land under top pointer (-Math.PI/2)
      const targetAngleOnWheel = (prizeIdx + 0.5) * sliceAngle;
      const targetRotation = (Math.PI * 2 * 5) - targetAngleOnWheel - (Math.PI / 2);

      let start = null;
      const duration = 3800;

      function animateSpin(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const rot = ease * targetRotation;
        drawWheel(rot);

        if (progress < 1) {
          requestAnimationFrame(animateSpin);
        } else {
          // Finished!
          isSpinning = false;
          playTone(523, 'triangle', 0.15, 0.2);
          setTimeout(() => playTone(659, 'triangle', 0.18, 0.2), 120);
          setTimeout(() => playTone(880, 'sine', 0.3, 0.25), 260);

          const totalWon = prize.coins + (state.streak * 10);
          addCoins(totalWon);

          // Update state
          state.lastDate = state.todayStr;
          state.spunToday = true;
          state.canClaim = false;
          saveDailyState(state);

          const actionBox = modal.querySelector('#daily-action-box');
          if (actionBox) {
            actionBox.innerHTML = `
              <div class="p-4 rounded-2xl bg-amber-400/20 border-2 border-amber-400 animate-pop-in text-center space-y-1">
                <span class="text-3xl">🎉</span>
                <span class="block text-sm font-black text-amber-300">Du hast ${prize.label} gewonnen!</span>
                <span class="block text-xs text-ink-muted">+${state.streak * 10} 🪙 Streak-Bonus = <strong class="text-amber-300 font-extrabold">+${totalWon} 🪙</strong></span>
              </div>
            `;
          }
        }
      }

      requestAnimationFrame(animateSpin);
    });
  }
}
