// Wasser sortieren (Water Sort Puzzle) - 100% offline, responsive Canvas & Touch
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'select') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(580, t + 0.08);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'pour') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(480, t + 0.18);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + idx * 0.09);
        g.gain.setValueAtTime(0.2, t + idx * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.3);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(t + idx * 0.09);
        o.stop(t + idx * 0.09 + 0.3);
      });
    } else if (type === 'invalid') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    }
  } catch {}
}

const TUBE_CAPACITY = 4;
const COLOR_PALETTE = [
  { id: 1, name: 'Cyan', color: '#00e5ff', light: '#80f2ff' },
  { id: 2, name: 'Pink', color: '#ff2a6d', light: '#ff85aa' },
  { id: 3, name: 'Amber', color: '#ffb300', light: '#ffd54f' },
  { id: 4, name: 'Purple', color: '#9c27b0', light: '#ba68c8' },
  { id: 5, name: 'Green', color: '#00e676', light: '#69f0ae' },
  { id: 6, name: 'Blue', color: '#2979ff', light: '#82b1ff' }
];

function generatePuzzle(numColors) {
  // Guarantee solvability: start solved, then shuffle with legal reverse pours
  const tubes = [];
  for (let i = 0; i < numColors; i++) {
    tubes.push(Array(TUBE_CAPACITY).fill(i + 1));
  }
  // Add 2 empty tubes
  tubes.push([]);
  tubes.push([]);

  // Shuffle reverse moves
  let moves = 0;
  let attempts = 0;
  while (moves < numColors * 25 && attempts < 2000) {
    attempts++;
    const fromIdx = Math.floor(Math.random() * tubes.length);
    const toIdx = Math.floor(Math.random() * tubes.length);
    if (fromIdx === toIdx) continue;
    
    const from = tubes[fromIdx];
    const to = tubes[toIdx];
    if (from.length === 0 || to.length >= TUBE_CAPACITY) continue;

    const color = from[from.length - 1];
    let c_count = 0;
    for (let i = from.length - 1; i >= 0; i--) {
      if (from[i] === color) c_count++;
      else break;
    }

    const isOnlyColor = (c_count === from.length);
    const maxK = Math.min(TUBE_CAPACITY - to.length, isOnlyColor ? c_count : c_count - 1);
    
    if (maxK >= 1) {
      const k = Math.floor(Math.random() * maxK) + 1;
      if (to.length === 0 && k === from.length) continue; // Avoid useless move

      for (let i = 0; i < k; i++) {
        from.pop();
        to.push(color);
      }
      moves++;
    }
  }

  return tubes.map(t => [...t]);
}

function checkWin(tubes, numColors) {
  let completedColors = 0;
  for (const tube of tubes) {
    if (tube.length === 0) continue;
    if (tube.length === TUBE_CAPACITY && tube.every(c => c === tube[0])) {
      completedColors++;
    } else {
      return false;
    }
  }
  return completedColors === numColors;
}

class WaterSortGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas wird nicht unterstützt');
    this.g = g;

    this.difficulty = ctx.difficulty || 'mittel';
    this.numColors = this.difficulty === 'leicht' ? 3 : this.difficulty === 'schwer' ? 5 : 4;

    this.tubes = [];
    this.history = [];
    this.selectedTube = null;
    this.animatingPour = null;
    this.particles = [];
    this.moves = 0;
    this.level = ctx.storage.get('level', 1);
    this.isWon = false;
    this.paused = false;
    this.raf = 0;
    this.last = 0;

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointer);
    this.initLevel();
    this.start();
  }

  initLevel() {
    this.tubes = generatePuzzle(this.numColors);
    this.history = [];
    this.selectedTube = null;
    this.animatingPour = null;
    this.particles = [];
    this.moves = 0;
    this.isWon = false;
  }

  pause() {
    this.paused = true;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.draw();
  }

  resume() {
    this.paused = false;
    this.start();
  }

  reset() {
    this.initLevel();
    this.draw();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointer);
    this.canvas.remove();
  }

  start() {
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  frame = time => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.033, Math.max(0, (time - this.last) / 1000));
    this.last = time;

    // Update animations
    if (this.animatingPour) {
      this.animatingPour.progress += dt * 3.5;
      if (this.animatingPour.progress >= 1) {
        // Complete pour
        const { fromIdx, toIdx, count } = this.animatingPour;
        for (let i = 0; i < count; i++) {
          const color = this.tubes[fromIdx].pop();
          this.tubes[toIdx].push(color);
        }
        this.animatingPour = null;
        this.selectedTube = null;

        // Check for win
        if (checkWin(this.tubes, this.numColors)) {
          this.isWon = true;
          playSound('win');
          this.level++;
          this.ctx.storage.set('level', this.level);
          this.spawnConfetti();
          setTimeout(() => {
            this.ctx.reportResult({
              outcome: 'completed',
              score: this.moves,
              headline: 'Level geschafft! 🎉'
            });
          }, 1500);
        }
      }
    }

    // Update particles
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    this.draw();
  };

  spawnConfetti() {
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 220;
      const c = COLOR_PALETTE[Math.floor(Math.random() * this.numColors)];
      this.particles.push({
        x: this.width / 2,
        y: this.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        life: 1.5 + Math.random(),
        color: c.color,
        size: 3 + Math.random() * 4
      });
    }
  }

  onPointer = e => {
    if (this.isWon || this.animatingPour || this.paused) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.scale;
    const y = (e.clientY - rect.top) / this.scale;

    // Check UI buttons (Undo, Restart)
    if (y > this.height - 75 && y < this.height - 25) {
      const btnW = 120;
      const mid = this.width / 2;
      // Undo button
      if (x > mid - btnW - 10 && x < mid - 10) {
        this.undo();
        return;
      }
      // Restart button
      if (x > mid + 10 && x < mid + btnW + 10) {
        this.reset();
        return;
      }
    }

    // Check tube selection
    const tubePositions = this.getTubePositions();
    for (let i = 0; i < tubePositions.length; i++) {
      const pos = tubePositions[i];
      if (x >= pos.x - 30 && x <= pos.x + pos.w + 30 && y >= pos.y - 40 && y <= pos.y + pos.h + 40) {
        this.handleTubeTap(i);
        return;
      }
    }
  };

  handleTubeTap(index) {
    if (this.selectedTube === null) {
      // Select if not empty
      if (this.tubes[index].length > 0) {
        this.selectedTube = index;
        playSound('select');
      }
    } else if (this.selectedTube === index) {
      // Deselect
      this.selectedTube = null;
      playSound('select');
    } else {
      // Attempt pour from selectedTube to index
      const from = this.tubes[this.selectedTube];
      const to = this.tubes[index];
      const fromColor = from[from.length - 1];

      // Count consecutive top colors in 'from'
      let count = 0;
      for (let i = from.length - 1; i >= 0; i--) {
        if (from[i] === fromColor) count++;
        else break;
      }

      const availableSpace = TUBE_CAPACITY - to.length;
      const canPour = availableSpace > 0 && (to.length === 0 || to[to.length - 1] === fromColor);

      if (canPour) {
        const pourCount = Math.min(count, availableSpace);
        // Save history for undo
        this.history.push({
          tubes: this.tubes.map(t => [...t]),
          moves: this.moves
        });
        this.moves++;

        this.animatingPour = {
          fromIdx: this.selectedTube,
          toIdx: index,
          count: pourCount,
          color: fromColor,
          progress: 0
        };
        playSound('pour');
      } else {
        playSound('invalid');
        this.selectedTube = null;
      }
    }
  }

  undo() {
    if (this.history.length === 0 || this.animatingPour || this.isWon) return;
    const last = this.history.pop();
    this.tubes = last.tubes;
    this.moves = last.moves;
    this.selectedTube = null;
    playSound('select');
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.height = 640;
    this.scale = this.canvas.height / this.height;
    this.width = this.canvas.width / this.scale;
    this.draw();
  }

  getTubePositions() {
    const totalTubes = this.tubes.length;
    const isTwoRows = totalTubes > 4;
    const tubesPerRow = isTwoRows ? Math.ceil(totalTubes / 2) : totalTubes;
    const tubeW = 48;
    const tubeH = 160;
    const positions = [];

    if (!isTwoRows) {
      const spacing = Math.min(40, (this.width - 40 - totalTubes * tubeW) / (totalTubes + 1));
      const startX = (this.width - (totalTubes * tubeW + (totalTubes - 1) * spacing)) / 2;
      const startY = 220;
      for (let i = 0; i < totalTubes; i++) {
        positions.push({
          x: startX + i * (tubeW + spacing),
          y: startY,
          w: tubeW,
          h: tubeH
        });
      }
    } else {
      const topCount = Math.ceil(totalTubes / 2);
      const bottomCount = totalTubes - topCount;
      const spacingTop = Math.min(36, (this.width - 40 - topCount * tubeW) / (topCount + 1));
      const startXTop = (this.width - (topCount * tubeW + (topCount - 1) * spacingTop)) / 2;
      const spacingBottom = Math.min(36, (this.width - 40 - bottomCount * tubeW) / (bottomCount + 1));
      const startXBottom = (this.width - (bottomCount * tubeW + (bottomCount - 1) * spacingBottom)) / 2;

      for (let i = 0; i < totalTubes; i++) {
        if (i < topCount) {
          positions.push({
            x: startXTop + i * (tubeW + spacingTop),
            y: 160,
            w: tubeW,
            h: tubeH
          });
        } else {
          const bIdx = i - topCount;
          positions.push({
            x: startXBottom + bIdx * (tubeW + spacingBottom),
            y: 350,
            w: tubeW,
            h: tubeH
          });
        }
      }
    }
    return positions;
  }

  draw() {
    const { g, width, height } = this;
    g.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    // Dark sleek gradient background
    const bg = g.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#0d1322');
    bg.addColorStop(1, '#1b233a');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, height);

    // Title & Info
    g.textAlign = 'center';
    g.font = '900 28px ui-rounded, system-ui, sans-serif';
    g.fillStyle = '#ffffff';
    g.fillText('Wasser sortieren', width / 2, 54);

    g.font = '600 15px ui-rounded, system-ui, sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.65)';
    g.fillText(`Level ${this.level} · Züge: ${this.moves}`, width / 2, 82);

    const positions = this.getTubePositions();

    // Draw tubes
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const isSelected = this.selectedTube === i;
      const isPouringFrom = this.animatingPour && this.animatingPour.fromIdx === i;

      let offsetY = isSelected ? -24 : 0;
      let angle = 0;
      if (isPouringFrom) {
        const targetPos = positions[this.animatingPour.toIdx];
        const dir = targetPos.x > pos.x ? 1 : -1;
        angle = dir * Math.min(1.2, this.animatingPour.progress * 1.4);
        offsetY = -30;
      }

      g.save();
      g.translate(pos.x + pos.w / 2, pos.y + offsetY);
      if (angle !== 0) g.rotate(angle);
      g.translate(-pos.w / 2, 0);

      this.drawTube(pos.w, pos.h, this.tubes[i], isSelected);
      g.restore();
    }

    // Draw pouring stream if animating
    if (this.animatingPour) {
      const fromPos = positions[this.animatingPour.fromIdx];
      const toPos = positions[this.animatingPour.toIdx];
      const colorData = COLOR_PALETTE[this.animatingPour.color - 1];
      if (colorData) {
        g.strokeStyle = colorData.color;
        g.lineWidth = 6;
        g.beginPath();
        const startX = fromPos.x + fromPos.w / 2 + (toPos.x > fromPos.x ? 25 : -25);
        const startY = fromPos.y - 25;
        const endX = toPos.x + toPos.w / 2;
        const endY = toPos.y + toPos.h * (1 - this.tubes[this.animatingPour.toIdx].length / TUBE_CAPACITY);
        g.moveTo(startX, startY);
        g.quadraticCurveTo((startX + endX) / 2, startY - 20, endX, endY);
        g.stroke();
      }
    }

    // Particles
    for (const p of this.particles) {
      g.fillStyle = p.color;
      g.beginPath();
      g.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      g.fill();
    }

    // Bottom Action Buttons (Undo & Reset)
    const btnW = 120;
    const btnH = 44;
    const mid = width / 2;
    const btnY = height - 68;

    // Undo button
    g.fillStyle = this.history.length > 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';
    g.beginPath();
    g.roundRect(mid - btnW - 10, btnY, btnW, btnH, 12);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.2)';
    g.lineWidth = 1.5;
    g.stroke();
    g.fillStyle = this.history.length > 0 ? '#ffffff' : 'rgba(255,255,255,0.3)';
    g.font = '700 15px ui-rounded, system-ui, sans-serif';
    g.fillText('↩ Rückgängig', mid - btnW / 2 - 10, btnY + 28);

    // Reset button
    g.fillStyle = 'rgba(255,255,255,0.15)';
    g.beginPath();
    g.roundRect(mid + 10, btnY, btnW, btnH, 12);
    g.fill();
    g.stroke();
    g.fillStyle = '#ffffff';
    g.fillText('🔄 Neu mischen', mid + 10 + btnW / 2, btnY + 28);

    // Win banner
    if (this.isWon) {
      g.fillStyle = 'rgba(0,0,0,0.55)';
      g.fillRect(0, 0, width, height);
      g.fillStyle = '#00e5ff';
      g.font = '900 36px ui-rounded, system-ui, sans-serif';
      g.fillText('Gelöst! 🎉', width / 2, height / 2 - 20);
      g.font = '700 20px ui-rounded, system-ui, sans-serif';
      g.fillStyle = '#ffffff';
      g.fillText(`In ${this.moves} Zügen geschafft`, width / 2, height / 2 + 20);
    }
  }

  drawTube(w, h, liquidArray, isSelected) {
    const g = this.g;
    const r = w / 2;

    // Glass Tube path (open top, rounded bottom)
    g.save();

    // Clip to tube interior
    g.beginPath();
    g.moveTo(2, 0);
    g.lineTo(2, h - r);
    g.arc(r, h - r, r - 2, Math.PI, 0, true);
    g.lineTo(w - 2, 0);
    g.closePath();
    g.clip();

    // Draw liquid segments
    const segH = (h - 10) / TUBE_CAPACITY;
    for (let i = 0; i < liquidArray.length; i++) {
      const colorId = liquidArray[i];
      const colorData = COLOR_PALETTE[colorId - 1];
      if (!colorData) continue;

      const y = h - (i + 1) * segH;
      const grad = g.createLinearGradient(0, y, w, y);
      grad.addColorStop(0, colorData.color);
      grad.addColorStop(0.7, colorData.light);
      grad.addColorStop(1, colorData.color);
      g.fillStyle = grad;
      g.fillRect(0, y, w, segH + 1);

      // Liquid surface meniscus
      g.fillStyle = 'rgba(255,255,255,0.3)';
      g.fillRect(0, y, w, 2.5);
    }

    g.restore();

    // Glass Outline & Highlights
    g.strokeStyle = isSelected ? '#00e5ff' : 'rgba(255, 255, 255, 0.45)';
    g.lineWidth = isSelected ? 3.5 : 2;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, h - r);
    g.arc(r, h - r, r, Math.PI, 0, true);
    g.lineTo(w, 0);
    g.stroke();

    // Rim collar
    g.beginPath();
    g.ellipse(r, 0, r + 2, 3.5, 0, 0, Math.PI * 2);
    g.stroke();

    // Glass sheen
    g.strokeStyle = 'rgba(255,255,255,0.4)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(6, 10);
    g.lineTo(6, h - r - 8);
    g.stroke();
  }
}

export default {
  async initialize(container, ctx) {
    return new WaterSortGame(container, ctx);
  }
};
