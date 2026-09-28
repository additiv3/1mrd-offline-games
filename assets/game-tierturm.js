// Tierturm (Animal Stacker) - 100% offline, responsive Canvas & Touch
let audioCtx = null;
function playSound(type, combo = 0) {
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

    if (type === 'drop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'perfect') {
      const baseFreq = 523.25; // C5
      const scale = [1, 1.122, 1.26, 1.335, 1.498, 1.682, 1.888, 2];
      const noteFreq = baseFreq * scale[Math.min(scale.length - 1, combo)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, t);
      osc.frequency.setValueAtTime(noteFreq * 1.5, t + 0.06);
      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.28);
    } else if (type === 'miss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.25);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  } catch {}
}

const ANIMALS = [
  { emoji: '🦒', name: 'Giraffe', color: '#f59e0b', topColor: '#fbbf24' },
  { emoji: '🐱', name: 'Katze', color: '#ec4899', topColor: '#f472b6' },
  { emoji: '🐼', name: 'Panda', color: '#10b981', topColor: '#34d399' },
  { emoji: '🦊', name: 'Fuchs', color: '#ea580c', topColor: '#fb923c' },
  { emoji: '🐸', name: 'Frosch', color: '#84cc16', topColor: '#a3e635' },
  { emoji: '🐵', name: 'Affe', color: '#8b5cf6', topColor: '#a78bfa' },
  { emoji: '🐻', name: 'Bär', color: '#06b6d4', topColor: '#22d3ee' }
];

const BLOCK_H = 34;

class TierturmGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas wird nicht unterstützt');
    this.g = g;

    this.best = ctx.storage.get('best', 0);
    this.width = 360;
    this.height = 640;
    this.scale = 1;
    this.raf = 0;
    this.last = 0;
    this.paused = false;

    this.difficulty = ctx.difficulty || 'leicht';
    this.speedMult = this.difficulty === 'schwer' ? 1.35 : 1.0;

    this.stack = [];
    this.fallingPieces = [];
    this.particles = [];
    this.floatingText = [];

    this.currentX = 0;
    this.currentW = 160;
    this.dir = 1;
    this.speed = 170 * this.speedMult;
    this.combo = 0;
    this.cameraY = 0;
    this.targetCameraY = 0;
    this.gameOver = false;

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointer);
    window.addEventListener('keydown', this.onKey);

    this.initGame();
    this.start();
  }

  initGame() {
    this.stack = [];
    this.fallingPieces = [];
    this.particles = [];
    this.floatingText = [];
    this.combo = 0;
    this.gameOver = false;
    this.currentW = 160;

    // Base block
    const baseW = 180;
    const baseBlock = {
      x: (this.width - baseW) / 2,
      y: 540,
      w: baseW,
      h: BLOCK_H,
      animal: ANIMALS[0]
    };
    this.stack.push(baseBlock);

    this.spawnNextBlock();
    this.targetCameraY = 0;
    this.cameraY = 0;
  }

  spawnNextBlock() {
    const topBlock = this.stack[this.stack.length - 1];
    this.currentW = topBlock.w;
    this.currentX = 0;
    this.dir = 1;
    this.speed = (175 + Math.min(180, this.stack.length * 6)) * this.speedMult;
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
    this.initGame();
    this.paused ? this.draw() : this.start();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointer);
    window.removeEventListener('keydown', this.onKey);
    this.canvas.remove();
  }

  start() {
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  onPointer = e => {
    e.preventDefault();
    this.tap();
  };

  onKey = e => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter') {
      e.preventDefault();
      this.tap();
    }
  };

  tap() {
    if (this.paused) return;
    if (this.gameOver) {
      this.reset();
      return;
    }
    this.dropBlock();
  }

  dropBlock() {
    const topBlock = this.stack[this.stack.length - 1];
    const newY = topBlock.y - BLOCK_H;
    const animal = ANIMALS[this.stack.length % ANIMALS.length];

    const diff = this.currentX - topBlock.x;
    const perfectThreshold = 4.5;

    if (Math.abs(diff) <= perfectThreshold) {
      // Perfect placement!
      this.combo++;
      playSound('perfect', this.combo);

      let placedW = topBlock.w;
      if (this.combo >= 3 && placedW < 190) {
        placedW = Math.min(190, placedW + 8);
      }

      this.stack.push({
        x: topBlock.x,
        y: newY,
        w: placedW,
        h: BLOCK_H,
        animal
      });

      this.spawnSparkles(topBlock.x + placedW / 2, newY + BLOCK_H / 2, animal.topColor);
      this.floatingText.push({
        text: this.combo > 1 ? `PERFEKT x${this.combo}! ✨` : 'PERFEKT! ✨',
        x: topBlock.x + placedW / 2,
        y: newY - 14,
        life: 0.85,
        color: '#fde047'
      });
    } else if (diff > 0 && diff < topBlock.w) {
      // Overhang to right
      this.combo = 0;
      playSound('drop');
      const placedW = topBlock.w - diff;
      this.stack.push({
        x: this.currentX,
        y: newY,
        w: placedW,
        h: BLOCK_H,
        animal
      });

      // Falling cut piece
      this.fallingPieces.push({
        x: this.currentX + placedW,
        y: newY,
        w: diff,
        h: BLOCK_H,
        vx: 40 + Math.random() * 40,
        vy: 0,
        rot: 0,
        vRot: 3.5,
        animal
      });
    } else if (diff < 0 && -diff < topBlock.w) {
      // Overhang to left
      this.combo = 0;
      playSound('drop');
      const cutW = -diff;
      const placedW = topBlock.w - cutW;
      this.stack.push({
        x: topBlock.x,
        y: newY,
        w: placedW,
        h: BLOCK_H,
        animal
      });

      // Falling cut piece
      this.fallingPieces.push({
        x: this.currentX,
        y: newY,
        w: cutW,
        h: BLOCK_H,
        vx: -(40 + Math.random() * 40),
        vy: 0,
        rot: 0,
        vRot: -3.5,
        animal
      });
    } else {
      // Complete miss!
      this.combo = 0;
      playSound('miss');
      this.fallingPieces.push({
        x: this.currentX,
        y: newY,
        w: this.currentW,
        h: BLOCK_H,
        vx: this.dir * 60,
        vy: 0,
        rot: 0,
        vRot: this.dir * 4,
        animal
      });
      this.endGame();
      return;
    }

    // Scroll camera up if tower grows
    const stackHeight = this.stack.length;
    if (stackHeight > 5) {
      this.targetCameraY = (stackHeight - 5) * BLOCK_H;
    }

    this.spawnNextBlock();
  }

  endGame() {
    this.gameOver = true;
    const score = this.stack.length - 1;
    const isNewBest = score > this.best;
    if (isNewBest) {
      this.best = score;
      this.ctx.storage.set('best', score);
    }
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'completed',
        score,
        headline: isNewBest && score > 0 ? 'Neuer Rekord! 🦒' : 'Turm eingestürzt!'
      });
    }, 1200);
  }

  spawnSparkles(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 140;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0.5,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / this.height;
    this.width = this.canvas.width / this.scale;
    this.draw();
  }

  frame = time => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.033, Math.max(0, (time - this.last) / 1000));
    this.last = time;

    this.update(dt);
    this.draw();
  };

  update(dt) {
    // Camera smooth follow
    this.cameraY += (this.targetCameraY - this.cameraY) * Math.min(1, dt * 6);

    // Block moving back and forth
    if (!this.gameOver && !this.paused) {
      this.currentX += this.dir * this.speed * dt;
      if (this.currentX + this.currentW >= this.width + 30) {
        this.currentX = this.width + 30 - this.currentW;
        this.dir = -1;
      } else if (this.currentX <= -30) {
        this.currentX = -30;
        this.dir = 1;
      }
    }

    // Falling pieces physics
    for (const p of this.fallingPieces) {
      p.vy += 850 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vRot * dt;
    }
    this.fallingPieces = this.fallingPieces.filter(p => p.y < 800 + this.cameraY);

    // Particles
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 280 * dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Floating text
    for (const t of this.floatingText) {
      t.life -= dt;
      t.y -= 35 * dt;
    }
    this.floatingText = this.floatingText.filter(t => t.life > 0);
  }

  draw() {
    const { g, width, height } = this;
    g.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    // Sky gradient shifting with tower height
    const currentScore = this.stack.length - 1;
    const bg = g.createLinearGradient(0, 0, 0, height);
    if (currentScore < 10) {
      bg.addColorStop(0, '#1e293b');
      bg.addColorStop(1, '#0f172a');
    } else if (currentScore < 25) {
      bg.addColorStop(0, '#311042');
      bg.addColorStop(1, '#180b28');
    } else {
      bg.addColorStop(0, '#090514');
      bg.addColorStop(1, '#1b092b');
    }
    g.fillStyle = bg;
    g.fillRect(0, 0, width, height);

    // Distant stars/clouds
    g.fillStyle = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < 25; i++) {
      const sx = ((i * 97 + 13) % 400) / 400 * width;
      const sy = (((i * 53 + 7) % 300) / 300 * height + this.cameraY * 0.15) % height;
      g.fillRect(sx, sy, 2, 2);
    }

    g.save();
    g.translate(0, this.cameraY);

    // Draw stack blocks
    for (let i = 0; i < this.stack.length; i++) {
      const b = this.stack[i];
      this.drawBlock(b.x, b.y, b.w, b.h, b.animal, i === this.stack.length - 1);
    }

    // Draw active sliding block
    if (!this.gameOver) {
      const topBlock = this.stack[this.stack.length - 1];
      const activeY = topBlock.y - BLOCK_H;
      const activeAnimal = ANIMALS[this.stack.length % ANIMALS.length];
      this.drawBlock(this.currentX, activeY, this.currentW, BLOCK_H, activeAnimal, true);
    }

    // Draw falling sliced pieces
    for (const p of this.fallingPieces) {
      g.save();
      g.translate(p.x + p.w / 2, p.y + p.h / 2);
      g.rotate(p.rot);
      this.drawBlock(-p.w / 2, -p.h / 2, p.w, p.h, p.animal, false);
      g.restore();
    }

    // Particles
    for (const p of this.particles) {
      g.fillStyle = p.color;
      g.beginPath();
      g.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      g.fill();
    }

    // Floating text
    g.textAlign = 'center';
    for (const t of this.floatingText) {
      g.fillStyle = t.color;
      g.globalAlpha = Math.min(1, t.life * 2);
      g.font = '900 18px ui-rounded, system-ui, sans-serif';
      g.fillText(t.text, t.x, t.y);
    }
    g.globalAlpha = 1;

    g.restore();

    // HUD: Score & Best
    g.textAlign = 'center';
    g.fillStyle = '#ffffff';
    g.font = '900 60px ui-rounded, system-ui, sans-serif';
    g.fillText(String(currentScore), width / 2, 92);
    g.font = '700 16px ui-rounded, system-ui, sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.fillText(`Rekord ${this.best}`, width / 2, 120);

    // Start instructions
    if (this.stack.length === 1 && !this.gameOver) {
      g.fillStyle = '#ffffff';
      g.font = '800 20px ui-rounded, system-ui, sans-serif';
      g.fillText('Tippen zum Platzieren', width / 2, 430);
    }

    // Game Over
    if (this.gameOver) {
      g.fillStyle = 'rgba(0,0,0,0.65)';
      g.fillRect(0, 0, width, height);
      g.fillStyle = '#f59e0b';
      g.font = '900 36px ui-rounded, system-ui, sans-serif';
      g.fillText('Turm eingestürzt! 🦒', width / 2, height / 2 - 25);
      g.font = '700 22px ui-rounded, system-ui, sans-serif';
      g.fillStyle = '#ffffff';
      g.fillText(`Höhe: ${currentScore} Tiere`, width / 2, height / 2 + 18);
      g.font = '600 16px ui-rounded, system-ui, sans-serif';
      g.fillStyle = 'rgba(255,255,255,0.7)';
      g.fillText('Tippen für Neustart', width / 2, height / 2 + 55);
    }
  }

  drawBlock(x, y, w, h, animal, showFace) {
    if (w <= 0) return;
    const g = this.g;

    // Block body with rounded corners
    g.fillStyle = animal.color;
    g.beginPath();
    g.roundRect(x, y, w, h, 8);
    g.fill();

    // Top highlight rim
    g.fillStyle = animal.topColor;
    g.fillRect(x + 2, y, Math.max(0, w - 4), 5);

    // Animal face / icon in center if wide enough
    if (showFace && w >= 36) {
      g.font = '20px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(animal.emoji, x + w / 2, y + h / 2 + 1);
    }
  }
}

export default {
  async initialize(container, ctx) {
    return new TierturmGame(container, ctx);
  }
};
