// Pong Duell (Air Hockey / Retro Pong) - 1 or 2 Players on one smartphone
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

    if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.06);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    } else if (type === 'wall') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'score') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, t);
      osc.frequency.setValueAtTime(880, t + 0.1);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.28);
    }
  } catch {}
}

const WIN_SCORE = 5;

class PongDuellGame {
  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw new Error('Canvas wird nicht unterstützt');
    this.g = g;

    this.is2Player = ctx.mode === 'pass-and-play';
    this.difficulty = ctx.difficulty || 'mittel';

    this.p1Score = 0;
    this.p2Score = 0;
    this.gameOver = false;
    this.paused = false;

    this.width = 360;
    this.height = 640;
    this.scale = 1;
    this.raf = 0;
    this.last = 0;

    // Paddle sizes
    this.paddleW = 86;
    this.paddleH = 16;
    this.p1X = (this.width - this.paddleW) / 2;
    this.p2X = (this.width - this.paddleW) / 2;
    this.p1Y = this.height - 48;
    this.p2Y = 32;

    this.p1TargetX = this.p1X;
    this.p2TargetX = this.p2X;

    // Ball
    this.ballR = 9;
    this.ballX = this.width / 2;
    this.ballY = this.height / 2;
    this.ballVx = 0;
    this.ballVy = 0;
    this.trail = [];
    this.particles = [];

    // Pointer tracking for multitouch
    this.activeTouches = new Map();

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    window.addEventListener('keydown', this.onKey);

    this.resetBall(1);
    this.start();
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
    this.p1Score = 0;
    this.p2Score = 0;
    this.gameOver = false;
    this.resetBall(1);
    this.paused ? this.draw() : this.start();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    window.removeEventListener('keydown', this.onKey);
    this.canvas.remove();
  }

  start() {
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  resetBall(servingPlayer) {
    this.ballX = this.width / 2;
    this.ballY = this.height / 2;
    const speed = 310;
    const angle = (Math.random() - 0.5) * 0.9;
    this.ballVx = speed * Math.sin(angle);
    this.ballVy = (servingPlayer === 1 ? -1 : 1) * speed * Math.cos(angle);
    this.trail = [];
  }

  onPointerDown = e => {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.scale;
    const y = (e.clientY - rect.top) / this.scale;

    this.activeTouches.set(e.pointerId, { x, y });
    this.updatePaddlesFromTouches();

    if (this.gameOver) {
      this.reset();
    }
  };

  onPointerMove = e => {
    if (this.activeTouches.has(e.pointerId)) {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.scale;
      const y = (e.clientY - rect.top) / this.scale;
      this.activeTouches.set(e.pointerId, { x, y });
      this.updatePaddlesFromTouches();
    }
  };

  onPointerUp = e => {
    this.activeTouches.delete(e.pointerId);
  };

  onKey = e => {
    const step = 28;
    if (e.code === 'ArrowLeft') this.p1TargetX -= step;
    if (e.code === 'ArrowRight') this.p1TargetX += step;
    if (e.code === 'KeyA') this.p2TargetX -= step;
    if (e.code === 'KeyD') this.p2TargetX += step;
  };

  updatePaddlesFromTouches() {
    if (!this.is2Player) {
      const firstTouch = this.activeTouches.values().next().value;
      if (firstTouch) {
        this.p1TargetX = firstTouch.x - this.paddleW / 2;
      }
    } else {
      for (const [, pos] of this.activeTouches) {
        if (pos.y > this.height / 2) {
          // Bottom player (P1)
          this.p1TargetX = pos.x - this.paddleW / 2;
        } else {
          // Top player (P2)
          this.p2TargetX = pos.x - this.paddleW / 2;
        }
      }
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / this.height;
    this.width = this.canvas.width / this.scale;
    this.p1Y = this.height - 48;
    this.p2Y = 32;
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
    if (this.gameOver || this.paused) return;

    // Smooth paddle interpolation
    this.p1TargetX = Math.max(8, Math.min(this.width - this.paddleW - 8, this.p1TargetX));
    this.p1X += (this.p1TargetX - this.p1X) * Math.min(1, dt * 25);

    // AI logic for P2 in Solo mode
    if (!this.is2Player) {
      let aiSpeed = 260;
      let errorMargin = 20;
      if (this.difficulty === 'leicht') {
        aiSpeed = 190;
        errorMargin = 38;
      } else if (this.difficulty === 'schwer') {
        aiSpeed = 380;
        errorMargin = 8;
      }

      // Track ball target
      const ballPredictedX = this.ballX + (this.ballVy < 0 ? (this.ballVx / Math.abs(this.ballVy || 1)) * (this.ballY - this.p2Y) : 0);
      const targetCenter = this.ballVy < 0 ? ballPredictedX : this.width / 2;
      const targetPaddleX = targetCenter - this.paddleW / 2 + (Math.sin(this.last * 0.003) * errorMargin);

      if (this.p2X < targetPaddleX - 4) {
        this.p2X += Math.min(targetPaddleX - this.p2X, aiSpeed * dt);
      } else if (this.p2X > targetPaddleX + 4) {
        this.p2X -= Math.min(this.p2X - targetPaddleX, aiSpeed * dt);
      }
    } else {
      this.p2TargetX = Math.max(8, Math.min(this.width - this.paddleW - 8, this.p2TargetX));
      this.p2X += (this.p2TargetX - this.p2X) * Math.min(1, dt * 25);
    }
    this.p2X = Math.max(8, Math.min(this.width - this.paddleW - 8, this.p2X));

    // Continuous Collision Detection
    const nextY = this.ballY + this.ballVy * dt;
    if (this.ballVy > 0 && this.ballY + this.ballR <= this.p1Y && nextY + this.ballR >= this.p1Y) {
      const t = (this.p1Y - (this.ballY + this.ballR)) / this.ballVy;
      const crossX = this.ballX + this.ballVx * t;
      if (crossX >= this.p1X - 4 && crossX <= this.p1X + this.paddleW + 4) {
        this.ballY = this.p1Y - this.ballR - this.ballVy * dt + 1;
        this.ballX = crossX - this.ballVx * dt;
      }
    } else if (this.ballVy < 0 && this.ballY - this.ballR >= this.p2Y + this.paddleH && nextY - this.ballR <= this.p2Y + this.paddleH) {
      const t = (this.p2Y + this.paddleH - (this.ballY - this.ballR)) / this.ballVy;
      const crossX = this.ballX + this.ballVx * t;
      if (crossX >= this.p2X - 4 && crossX <= this.p2X + this.paddleW + 4) {
        this.ballY = this.p2Y + this.paddleH + this.ballR - this.ballVy * dt - 1;
        this.ballX = crossX - this.ballVx * dt;
      }
    }

    // Ball motion
    this.ballX += this.ballVx * dt;
    this.ballY += this.ballVy * dt;

    // Trail
    this.trail.push({ x: this.ballX, y: this.ballY });
    if (this.trail.length > 8) this.trail.shift();

    // Wall bounce
    if (this.ballX <= this.ballR + 4) {
      this.ballX = this.ballR + 4;
      this.ballVx = Math.abs(this.ballVx);
      playSound('wall');
    } else if (this.ballX >= this.width - this.ballR - 4) {
      this.ballX = this.width - this.ballR - 4;
      this.ballVx = -Math.abs(this.ballVx);
      playSound('wall');
    }

    // Paddle 1 Collision (Bottom)
    if (
      this.ballVy > 0 &&
      this.ballY + this.ballR >= this.p1Y &&
      this.ballY - this.ballR <= this.p1Y + this.paddleH &&
      this.ballX >= this.p1X - 4 &&
      this.ballX <= this.p1X + this.paddleW + 4
    ) {
      this.ballY = this.p1Y - this.ballR;
      const hitFrac = (this.ballX - (this.p1X + this.paddleW / 2)) / (this.paddleW / 2);
      const currentSpeed = Math.min(580, Math.hypot(this.ballVx, this.ballVy) * 1.05);
      const bounceAngle = hitFrac * 1.05; // max ~60 deg
      this.ballVx = currentSpeed * Math.sin(bounceAngle);
      this.ballVy = -Math.abs(currentSpeed * Math.cos(bounceAngle));
      playSound('hit');
      this.spawnHitSparks(this.ballX, this.p1Y, '#00e5ff');
    }

    // Paddle 2 Collision (Top)
    if (
      this.ballVy < 0 &&
      this.ballY - this.ballR <= this.p2Y + this.paddleH &&
      this.ballY + this.ballR >= this.p2Y &&
      this.ballX >= this.p2X - 4 &&
      this.ballX <= this.p2X + this.paddleW + 4
    ) {
      this.ballY = this.p2Y + this.paddleH + this.ballR;
      const hitFrac = (this.ballX - (this.p2X + this.paddleW / 2)) / (this.paddleW / 2);
      const currentSpeed = Math.min(580, Math.hypot(this.ballVx, this.ballVy) * 1.05);
      const bounceAngle = hitFrac * 1.05;
      this.ballVx = currentSpeed * Math.sin(bounceAngle);
      this.ballVy = Math.abs(currentSpeed * Math.cos(bounceAngle));
      playSound('hit');
      this.spawnHitSparks(this.ballX, this.p2Y + this.paddleH, '#ff2d75');
    }

    // Score Bottom (P2 scores)
    if (this.ballY > this.height + 20) {
      this.p2Score++;
      playSound('score');
      if (this.p2Score >= WIN_SCORE) {
        this.finishMatch(2);
      } else {
        this.resetBall(1);
      }
    }

    // Score Top (P1 scores)
    if (this.ballY < -20) {
      this.p1Score++;
      playSound('score');
      if (this.p1Score >= WIN_SCORE) {
        this.finishMatch(1);
      } else {
        this.resetBall(2);
      }
    }

    // Particles
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  spawnHitSparks(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.25,
        color,
        size: 2.5
      });
    }
  }

  finishMatch(winner) {
    this.gameOver = true;
    const headline = this.is2Player
      ? `Spieler ${winner} gewinnt! 🏆`
      : winner === 1
      ? 'Du hast gewonnen! 🏆'
      : 'KI gewinnt!';
    const winnerScore = winner === 1 ? this.p1Score : this.p2Score;
    setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'completed',
        score: winnerScore,
        headline
      });
    }, 1200);
  }

  draw() {
    const { g, width, height } = this;
    g.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    // Dark sleek court with a subtle grid
    g.fillStyle = '#05070a';
    g.fillRect(0, 0, width, height);
    
    // Grid pattern
    g.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    g.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, height); g.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(width, y); g.stroke();
    }

    // Court border glow
    g.shadowColor = '#4c55ff';
    g.shadowBlur = 10;
    g.strokeStyle = 'rgba(76, 85, 255, 0.4)';
    g.lineWidth = 4;
    g.strokeRect(4, 4, width - 8, height - 8);
    g.shadowBlur = 0;

    // Center dividing net line (laser style)
    g.setLineDash([12, 12]);
    g.strokeStyle = 'rgba(76, 85, 255, 0.3)';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(0, height / 2);
    g.lineTo(width, height / 2);
    g.stroke();
    g.setLineDash([]);

    // Scores
    g.textAlign = 'center';
    g.font = '900 64px ui-rounded, system-ui, sans-serif';

    // Top score (Player 2 / AI)
    g.fillStyle = 'rgba(255, 20, 100, 0.15)';
    g.fillText(String(this.p2Score), width / 2, height / 2 - 60);

    // Bottom score (Player 1)
    g.fillStyle = 'rgba(0, 255, 200, 0.15)';
    g.fillText(String(this.p1Score), width / 2, height / 2 + 105);

    // Player labels
    g.font = '800 14px ui-rounded, system-ui, sans-serif';
    if (this.is2Player) {
      g.save();
      g.translate(width / 2, 16);
      g.rotate(Math.PI);
      g.fillStyle = '#ff1464';
      g.fillText('PLAYER 2', 0, 0);
      g.restore();
      g.fillStyle = '#00ffc8';
      g.fillText('PLAYER 1', width / 2, height - 12);
    } else {
      g.fillStyle = 'rgba(255, 20, 100, 0.9)';
      g.fillText(`CPU [${this.difficulty.toUpperCase()}]`, width / 2, 22);
      g.fillStyle = 'rgba(0, 255, 200, 0.9)';
      g.fillText('PLAYER', width / 2, height - 14);
    }

    // Ball Trail (Neon Gradient)
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const frac = (i + 1) / this.trail.length;
      g.fillStyle = `rgba(0, 255, 200, ${frac * 0.4})`;
      if (this.ballVy > 0) g.fillStyle = `rgba(255, 20, 100, ${frac * 0.4})`; // Trail color depends on direction
      g.beginPath();
      g.arc(t.x, t.y, this.ballR * frac * 0.9, 0, Math.PI * 2);
      g.fill();
    }

    // Ball
    g.fillStyle = '#ffffff';
    g.shadowColor = this.ballVy > 0 ? '#ff1464' : '#00ffc8';
    g.shadowBlur = 15;
    g.beginPath();
    g.arc(this.ballX, this.ballY, this.ballR, 0, Math.PI * 2);
    g.fill();
    g.shadowBlur = 0;

    // Paddle function
    const drawPaddle = (x, y, color) => {
      g.fillStyle = '#ffffff';
      g.shadowColor = color;
      g.shadowBlur = 18;
      g.beginPath();
      g.roundRect(x, y, this.paddleW, this.paddleH, 8);
      g.fill();
      // inner core
      g.shadowBlur = 0;
      g.fillStyle = color;
      g.beginPath();
      g.roundRect(x + 2, y + 2, this.paddleW - 4, this.paddleH - 4, 6);
      g.fill();
    };

    // Paddle 1 (Bottom - Cyan)
    drawPaddle(this.p1X, this.p1Y, '#00ffc8');

    // Paddle 2 (Top - Pink)
    drawPaddle(this.p2X, this.p2Y, '#ff1464');

    // Particles
    g.globalCompositeOperation = 'screen';
    for (const p of this.particles) {
      g.fillStyle = p.color;
      g.shadowColor = p.color;
      g.shadowBlur = 8;
      g.beginPath();
      g.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      g.fill();
      g.shadowBlur = 0;
    }
    g.globalCompositeOperation = 'source-over';

    // Game Over Overlay
    if (this.gameOver) {
      g.fillStyle = 'rgba(0,0,0,0.65)';
      g.fillRect(0, 0, width, height);
      g.fillStyle = '#ffffff';
      g.font = '900 32px ui-rounded, system-ui, sans-serif';
      const winnerName = this.is2Player
        ? (this.p1Score > this.p2Score ? 'Spieler 1' : 'Spieler 2')
        : (this.p1Score > this.p2Score ? 'Du' : 'KI');
      g.fillText(`${winnerName} gewinnt! 🏆`, width / 2, height / 2 - 20);
      g.font = '600 18px ui-rounded, system-ui, sans-serif';
      g.fillStyle = 'rgba(255,255,255,0.75)';
      g.fillText('Tippen für neues Spiel', width / 2, height / 2 + 25);
    }
  }
}

export default {
  async initialize(container, ctx) {
    return new PongDuellGame(container, ctx);
  }
};
