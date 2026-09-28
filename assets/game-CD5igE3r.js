import { getEquippedSkin } from "./shop-manager.js";
import { onDunkScore, onDunkGameOver } from "./challenges-manager.js";

// Dunk Drop Physics Constants
const GRAVITY = 1320;
const JUMP_VELOCITY = -450;
const TERMINAL_VY = 820;
const HOOP_SPACING = 250;

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function getScrollSpeed(score) {
  return Math.min(235, 140 + score * 3.5);
}

function getHoopWidth(spawned) {
  return Math.max(68, 100 - spawned * 1.1);
}

// Web Audio API for sound effects
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (!audioCtx || audioCtx.state !== 'running') {
      audioCtx?.resume?.();
    }
    if (!audioCtx) return;

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'flap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'rim') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.14);
      osc.start(t);
      osc.stop(t + 0.14);
    } else if (type === 'swish') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.16);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.22);
      osc.start(t);
      osc.stop(t + 0.22);
    } else if (type === 'score') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.14);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.linearRampToValueAtTime(40, t + 0.15);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  } catch {
    // Ignore audio failures
  }
}

function createWorld(width) {
  const targetX = Math.min(width * 0.28, 120);
  return {
    width,
    targetBallX: targetX,
    ballX: targetX,
    ballY: 268.8,
    vx: 0,
    vy: 0,
    spin: 0,
    squish: 0,
    hitPause: 0,
    hoops: [],
    pickups: [],
    particles: [],
    score: 0,
    hoopsTotal: 0,
    upHoopsCount: 0,
    swishesCount: 0,
    hoopsSpawned: 0,
    shield: false,
    invulnerable: 0,
    started: false,
    over: false,
    time: 0,
    distance: 0,
    events: []
  };
}

function flap(world) {
  if (world.over) return;
  world.started = true;

  // Ultra-responsive, smooth jump without violent forward jerk
  world.vy = JUMP_VELOCITY;
  world.vx = 0; // Pure vertical flappy-control: no chaotic forward rushing!
  world.spin += 1.8;
  world.squish = -0.22; // Stretch upward
  world.events.push({ type: 'flap', x: world.ballX, y: world.ballY });
  playSound('flap');
}

function spawnHoop(world, rand) {
  const lastHoop = world.hoops[world.hoops.length - 1];
  const nextX = lastHoop ? lastHoop.x + HOOP_SPACING : Math.min(world.width + 80, world.ballX + 380);
  const lastY = lastHoop ? lastHoop.y : 320;
  const nextY = clamp(lastY + (rand() - 0.5) * 280, 180, 490);
  const dir = world.hoopsSpawned >= 4 && rand() < 0.28 ? 'up' : 'down';

  if (lastHoop && world.hoopsSpawned >= 5 && !world.shield && world.pickups.length === 0 && rand() < 0.2) {
    world.pickups.push({
      x: lastHoop.x + HOOP_SPACING / 2,
      y: (nextY + lastY) / 2 - 30,
      taken: false
    });
  }

  world.hoops.push({
    x: nextX,
    y: nextY,
    w: getHoopWidth(world.hoopsSpawned),
    dir,
    scored: false,
    missed: false,
    touched: false,
    netWave: 0
  });
  world.hoopsSpawned++;
}

function takeDamage(world) {
  if (world.invulnerable > 0 || world.over) return;
  if (world.shield) {
    world.shield = false;
    world.invulnerable = 1.2;
    world.events.push({ type: 'shield-break' });
    playSound('hit');
    return;
  }
  world.over = true;
  world.events.push({ type: 'over' });
}

function checkScoring(world, hoop, prevBallY) {
  if (hoop.scored || hoop.missed) return;
  const halfW = hoop.w / 2;
  const inHorizontalRange = Math.abs(world.ballX - hoop.x) < halfW - 17 * 0.3;

  if (inHorizontalRange) {
    const passedDown = prevBallY < hoop.y && world.ballY >= hoop.y;
    const passedUp = prevBallY > hoop.y && world.ballY <= hoop.y;

    if ((hoop.dir === 'down' && passedDown) || (hoop.dir === 'up' && passedUp)) {
      hoop.scored = true;
      hoop.netWave = 1.0;
      const isSwish = !hoop.touched;
      const points = isSwish ? 2 : 1;
      world.score += points;
      world.hoopsTotal++;
      if (hoop.dir === 'up') world.upHoopsCount++;
      if (isSwish) world.swishesCount++;

      // Trigger challenge hooks
      onDunkScore(points, isSwish, hoop.dir === 'up');

      world.events.push({
        type: 'score',
        points,
        swish: isSwish,
        dir: hoop.dir,
        x: hoop.x,
        y: hoop.y
      });
      playSound(isSwish ? 'swish' : 'score');
      return;
    }
  }

  // If the hoop has passed significantly behind the ball without scoring
  if (hoop.x + halfW < world.ballX - 25) {
    hoop.missed = true;
    takeDamage(world);
  }
}

// Improved Rim & Pole Collision Physics:
// Resets view back to the left (pushes hoops right), gives breathing room and avoids forward slingshot!
function checkRim(world, hoop, rimX, isFrontRim) {
  const dx = world.ballX - rimX;
  const dy = world.ballY - hoop.y;
  const distSq = dx * dx + dy * dy;
  const collisionRadius = 21; // ball radius (17) + rim edge (4)

  if (distSq >= collisionRadius * collisionRadius) return;

  const dist = Math.sqrt(distSq) || 0.001;
  const nx = dx / dist;
  const ny = dy / dist;

  // Visual & audio feedback
  if (!hoop.touched) {
    hoop.touched = true;
    playSound('rim');
  }

  // KEY IMPROVEMENT:
  // When colliding against the rim/pole:
  // 1. Shift all hoops and pickups BACKWARDS to the right by 45px!
  // This visually pushes the entire obstacle field back to the left relative to the ball,
  // preventing the player from being slammed or rushed forward into the next ring.
  const pushBackAmount = isFrontRim ? 48 : 28;
  for (const h of world.hoops) {
    h.x += pushBackAmount;
  }
  for (const p of world.pickups) {
    p.x += pushBackAmount;
  }
  world.distance = Math.max(0, world.distance - pushBackAmount);

  // 2. Bounce the ball safely backwards and upwards!
  world.ballX = Math.max(30, rimX + (nx < 0 ? -collisionRadius : collisionRadius * 0.5));
  world.ballY = hoop.y + ny * collisionRadius;
  
  // Clean upward recoil
  world.vy = -Math.abs(world.vy) * 0.42 - 110;
  world.vx = -40; // Soft backward push, zero forward slingshot!
  world.squish = 0.25;

  // 3. Briefly pause / slow down the scrolling for 0.3s so player has time to react
  world.hitPause = 0.32;

  world.events.push({
    type: 'rim',
    x: rimX,
    y: hoop.y,
    nx,
    ny
  });
}

function updateWorld(world, dt, rand) {
  world.time += dt;

  if (!world.started) {
    world.ballY = 268.8 + Math.sin(world.time * 3) * 10;
    return;
  }

  if (world.over) {
    world.vy = Math.min(world.vy + GRAVITY * dt, TERMINAL_VY);
    world.ballY = Math.min(world.ballY + world.vy * dt, 595);
    world.ballX += world.vx * dt;
    world.vx *= Math.pow(0.85, dt * 60);
    return;
  }

  // Handle hitPause grace period after rim collision
  let speedMultiplier = 1.0;
  if (world.hitPause > 0) {
    world.hitPause = Math.max(0, world.hitPause - dt);
    speedMultiplier = 0.25; // Slow-mo to allow comfortable recovery
  }

  const baseScrollSpeed = getScrollSpeed(world.score);
  const scrollSpeed = baseScrollSpeed * speedMultiplier;

  world.distance += scrollSpeed * dt;
  world.spin += dt * baseScrollSpeed / 17;
  world.invulnerable = Math.max(0, world.invulnerable - dt);

  // Very gentle and smooth return towards targetBallX (NO violent spring slingshot!)
  const dxTarget = world.targetBallX - world.ballX;
  world.ballX += dxTarget * Math.min(1.0, dt * 5.0);
  world.vx *= Math.pow(0.5, dt * 30);

  // Decay visual squish
  world.squish *= Math.pow(0.05, dt);

  // Vertical physics
  const prevBallY = world.ballY;
  world.vy = Math.min(world.vy + GRAVITY * dt, TERMINAL_VY);
  world.ballY += world.vy * dt;

  // Scroll hoops and pickups
  for (const h of world.hoops) {
    h.x -= scrollSpeed * dt;
    if (h.netWave > 0) h.netWave = Math.max(0, h.netWave - dt * 2.2);
  }
  for (const p of world.pickups) {
    p.x -= scrollSpeed * dt;
  }

  // Check scoring and rim collisions (distinguish front and back rim)
  for (const h of world.hoops) {
    checkScoring(world, h, prevBallY);
    checkRim(world, h, h.x - h.w / 2, true);  // Front rim
    checkRim(world, h, h.x + h.w / 2, false); // Back rim
  }

  // Check pickups
  for (const p of world.pickups) {
    if (!p.taken && Math.hypot(world.ballX - p.x, world.ballY - p.y) < 32) {
      p.taken = true;
      world.shield = true;
      world.events.push({ type: 'shield-get' });
      playSound('score');
    }
  }

  // Ceiling bounce
  if (world.ballY < 17) {
    world.ballY = 17;
    world.vy = Math.max(0, world.vy);
  }

  // Floor collision (death)
  if (world.ballY > 595) {
    world.ballY = 595;
    takeDamage(world);
    if (!world.over) {
      world.vy = -380;
    }
  }

  // Cleanup off-screen items
  world.hoops = world.hoops.filter(h => h.x > -120);
  world.pickups = world.pickups.filter(p => p.x > -60 && !p.taken);

  // Spawn new hoops
  while (world.hoops.length === 0 || (world.hoops[world.hoops.length - 1]?.x ?? 0) < world.width + 90) {
    spawnHoop(world, rand);
  }
}

const FONT_STACK = 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif';
const COLOR_RIM = '#ff5a36';
const COLOR_SHIELD = '#3ee0ff';
const COLOR_SWISH = '#8cff5a';

class DunkDropGame {
  container;
  ctx;
  canvas = document.createElement('canvas');
  g;
  observer;
  world;
  texts = [];
  best;
  scale = 1;
  width = 360;
  raf = 0;
  last = 0;
  paused = false;
  flash = 0;
  reportTimer;

  constructor(container, ctx) {
    this.container = container;
    this.ctx = ctx;
    this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    container.appendChild(this.canvas);

    const g = this.canvas.getContext('2d');
    if (!g) throw Error('Canvas wird nicht unterstützt');
    this.g = g;

    this.best = ctx.storage.get('best', 0);
    this.world = createWorld(this.width);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(container);
    this.resize();

    this.canvas.addEventListener('pointerdown', this.onPointer);
    window.addEventListener('keydown', this.onKey);
    this.start();
  }

  pause() {
    this.paused = true;
    this.stop();
    this.draw();
  }

  resume() {
    this.paused = false;
    this.start();
  }

  reset() {
    clearTimeout(this.reportTimer);
    this.world = createWorld(this.width);
    this.texts = [];
    this.flash = 0;
    this.paused ? this.draw() : this.start();
  }

  dispose() {
    this.stop();
    clearTimeout(this.reportTimer);
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

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  frame = time => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.033, Math.max(0, (time - this.last) / 1000));
    this.last = time;

    updateWorld(this.world, dt, Math.random);
    this.handleEvents();

    for (const t of this.texts) {
      t.life -= dt;
      t.y -= 40 * dt;
    }
    this.texts = this.texts.filter(t => t.life > 0);
    this.flash = Math.max(0, this.flash - dt);

    this.draw();
  };

  handleEvents() {
    const w = this.world;
    for (const ev of w.events) {
      if (ev.type === 'score') {
        this.say(ev.swish ? 'SWISH +2' : '+1', ev.x, ev.y - 30, ev.swish ? COLOR_SWISH : '#ffffff');
      } else if (ev.type === 'shield-get') {
        this.say('Schutzschild!', w.ballX + 40, w.ballY - 30, COLOR_SHIELD);
      } else if (ev.type === 'shield-break') {
        this.flash = 0.35;
        this.say('Schild weg!', w.ballX + 40, w.ballY - 30, COLOR_SHIELD);
      } else if (ev.type === 'rim') {
        this.flash = 0.08;
      } else if (ev.type === 'over') {
        this.flash = 0.5;
        this.finish();
      }
    }
    w.events.length = 0;
  }

  finish() {
    const sc = this.world.score;
    const isNewBest = sc > this.best;
    if (isNewBest) {
      this.best = sc;
      this.ctx.storage.set('best', sc);
    }

    // Fair coin rewards based on score
    const coinsEarned = Math.max(2, Math.round(sc * 1.5) + (isNewBest && sc > 5 ? 15 : 0));
    onDunkGameOver(sc, this.world.hoopsTotal, this.world.upHoopsCount, this.world.swishesCount);

    this.reportTimer = setTimeout(() => {
      this.ctx.reportResult({
        outcome: 'completed',
        score: sc,
        hoops: this.world.hoopsTotal,
        upHoops: this.world.upHoopsCount,
        swishes: this.world.swishesCount,
        coinsEarned,
        headline: isNewBest && sc > 0 ? 'Neuer Rekord! 🏆' : 'Game Over'
      });
    }, 900);
  }

  say(text, x, y, color) {
    this.texts.push({ text, x, y, life: 0.9, color });
  }

  onPointer = e => {
    e.preventDefault();
    this.tap();
  };

  onKey = e => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      this.tap();
    }
  };

  tap() {
    if (!this.paused) flap(this.world);
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.scale = this.canvas.height / 640;
    this.width = this.canvas.width / this.scale;
    this.world.width = this.width;
    if (!this.world.started) {
      this.world.targetBallX = Math.min(this.width * 0.28, 120);
      this.world.ballX = this.world.targetBallX;
    }
    this.draw();
  }

  draw() {
    const { g, world: w, width } = this;
    g.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    // Dynamic background gradient
    const bgGrad = g.createLinearGradient(0, 0, 0, 640);
    bgGrad.addColorStop(0, '#1a1245');
    bgGrad.addColorStop(1, '#4a2270');
    g.fillStyle = bgGrad;
    g.fillRect(0, 0, width, 640);

    // Parallax background stars
    g.fillStyle = 'rgba(255, 255, 255, 0.45)';
    const span = width + 40;
    for (let i = 0; i < 40; i++) {
      const sx = (((i * 83 + 17) % 400) / 400 * span - w.distance * 0.15) % span;
      const sy = ((i * 47 + 11) % 300) / 300 * 492;
      g.fillRect(sx < 0 ? sx + span - 20 : sx - 20, sy, 1.5 + (i % 3) * 0.6, 1.5 + (i % 3) * 0.6);
    }

    // Floor (hardwood court vibe)
    g.fillStyle = '#c9803f';
    g.fillRect(0, 612, width, 28);
    g.fillStyle = '#e39b55';
    g.fillRect(0, 612, width, 3);
    g.strokeStyle = 'rgba(90,40,10,0.35)';
    g.lineWidth = 1;
    for (let x = -(w.distance % 48); x < width; x += 48) {
      g.beginPath();
      g.moveTo(x, 615);
      g.lineTo(x, 640);
      g.stroke();
    }

    // Hoops back net & ring
    for (const h of w.hoops) this.drawHoopBack(h);

    // Pickups (shield)
    for (const p of w.pickups) this.drawPickup(p);

    // Ball with active skin
    this.drawBall();

    // Hoops front rim
    for (const h of w.hoops) this.drawHoopFront(h);

    // Floating text feedback
    g.textAlign = 'center';
    for (const t of this.texts) {
      g.globalAlpha = Math.min(1, t.life * 2);
      g.fillStyle = t.color;
      g.font = `900 22px ${FONT_STACK}`;
      g.fillText(t.text, t.x, t.y);
    }
    g.globalAlpha = 1;

    // HUD: Score & Best
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.font = `900 64px ${FONT_STACK}`;
    g.fillText(String(w.score), width / 2, 96);
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.font = `700 16px ${FONT_STACK}`;
    g.fillText(`Rekord ${this.best}`, width / 2, 122);

    // Tutorial overlays on start
    if (!w.started) {
      g.fillStyle = '#ffffff';
      g.font = `900 26px ${FONT_STACK}`;
      g.fillText('Tippen zum Hüpfen', width / 2, 396.8);
      g.font = `600 16px ${FONT_STACK}`;
      g.fillStyle = 'rgba(255,255,255,0.85)';
      g.fillText('Lass den Ball von oben durch die Ringe fallen', width / 2, 426.8);
      g.fillStyle = COLOR_SHIELD;
      g.fillText('Blauer Ring mit ↑ : von unten durch!', width / 2, 450.8);
      g.fillStyle = '#9fdcff';
      g.fillText('Schild einsammeln = zweites Leben', width / 2, 474.8);
    }

    // Impact flash
    if (this.flash > 0) {
      g.fillStyle = `rgba(255,255,255,${this.flash * 0.8})`;
      g.fillRect(0, 0, width, 640);
    }
  }

  hoopColor(h) {
    return h.scored ? COLOR_SWISH : h.dir === 'up' ? COLOR_SHIELD : COLOR_RIM;
  }

  drawHoopBack(h) {
    const g = this.g;
    const rx = h.w / 2;
    const ry = h.w * 0.16;
    const netLen = h.w * 0.75 * (h.dir === 'up' ? -1 : 1);
    const bottomRx = rx * 0.55;

    // Net weave
    g.strokeStyle = 'rgba(255,255,255,0.5)';
    g.lineWidth = 1.5;
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      g.beginPath();
      g.moveTo(h.x - rx + 2 * rx * t, h.y);
      g.lineTo(h.x - bottomRx + 2 * bottomRx * t, h.y + netLen);
      g.stroke();
    }
    for (let j = 1; j <= 3; j++) {
      const frac = j / 3.4;
      g.beginPath();
      g.ellipse(h.x, h.y + netLen * frac, rx + (bottomRx - rx) * frac, ry * (1 - frac * 0.5), 0, 0, Math.PI * 2);
      g.stroke();
    }

    // Rim back half
    g.strokeStyle = this.hoopColor(h);
    g.lineWidth = 5;
    g.beginPath();
    g.ellipse(h.x, h.y, rx, ry, 0, Math.PI, Math.PI * 2);
    g.stroke();
  }

  drawHoopFront(h) {
    const g = this.g;
    g.strokeStyle = this.hoopColor(h);
    g.lineWidth = 5;
    g.beginPath();
    g.ellipse(h.x, h.y, h.w / 2, h.w * 0.16, 0, 0, Math.PI);
    g.stroke();

    // Direction arrow for upward hoops
    if (h.dir === 'up' && !h.scored) {
      const ax = h.x;
      const ay = h.y + h.w * 0.75 + 34 + Math.sin(this.world.time * 6) * 4;
      g.fillStyle = COLOR_SHIELD;
      g.beginPath();
      g.moveTo(ax, ay - 18);
      g.lineTo(ax + 13, ay);
      g.lineTo(ax + 5, ay);
      g.lineTo(ax + 5, ay + 16);
      g.lineTo(ax - 5, ay + 16);
      g.lineTo(ax - 5, ay);
      g.lineTo(ax - 13, ay);
      g.closePath();
      g.fill();
    }
  }

  drawPickup(p) {
    const g = this.g;
    const bob = p.y + Math.sin(this.world.time * 4 + p.x * 0.05) * 5;
    const halo = g.createRadialGradient(p.x, bob, 2, p.x, bob, 30);
    halo.addColorStop(0, 'rgba(62,224,255,0.9)');
    halo.addColorStop(1, 'rgba(62,224,255,0)');
    g.fillStyle = halo;
    g.beginPath();
    g.arc(p.x, bob, 30, 0, Math.PI * 2);
    g.fill();

    // Shield crest icon
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.moveTo(p.x, bob - 10);
    g.lineTo(p.x + 9, bob - 6);
    g.lineTo(p.x + 8, bob + 3);
    g.quadraticCurveTo(p.x + 5, bob + 9, p.x, bob + 12);
    g.quadraticCurveTo(p.x - 5, bob + 9, p.x - 8, bob + 3);
    g.lineTo(p.x - 9, bob - 6);
    g.closePath();
    g.fill();
  }

  drawBall() {
    const { g, world: w } = this;
    const blinking = w.invulnerable > 0 && Math.floor(w.time * 12) % 2 === 0;
    const ballSkin = getEquippedSkin('ball');

    g.save();
    g.translate(w.ballX, w.ballY);
    if (blinking) g.globalAlpha = 0.4;

    // Dynamic squash and stretch
    const velY = w.vy;
    let stretch = Math.min(0.2, Math.abs(velY) / 2600);
    if (w.squish > 0) {
      stretch -= w.squish;
    } else if (w.squish < 0) {
      stretch -= w.squish;
    }
    const scaleY = Math.max(0.75, Math.min(1.25, 1 + (velY > 0 ? stretch : -stretch * 0.8)));
    const scaleX = 1 / Math.sqrt(scaleY);
    g.scale(scaleX, scaleY);

    if (ballSkin === 'ball_fire') {
      const aura = g.createRadialGradient(0, 0, 10, 0, 0, 24);
      aura.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
      aura.addColorStop(1, 'rgba(255, 0, 0, 0)');
      g.fillStyle = aura;
      g.beginPath();
      g.arc(0, 0, 24, 0, Math.PI * 2);
      g.fill();

      const grad = g.createRadialGradient(-4, -5, 2, 0, 0, 17);
      grad.addColorStop(0, '#fff3a8');
      grad.addColorStop(0.4, '#ff5722');
      grad.addColorStop(1, '#b71c1c');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, 17, 0, Math.PI * 2);
      g.fill();
    } else if (ballSkin === 'ball_disco') {
      const grad = g.createRadialGradient(-5, -6, 2, 0, 0, 17);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(1, '#475569');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, 17, 0, Math.PI * 2);
      g.fill();

      g.rotate(w.spin * 0.2);
      g.strokeStyle = 'rgba(255,255,255,0.7)';
      g.lineWidth = 1;
      for (let i = -14; i <= 14; i += 7) {
        g.beginPath();
        g.moveTo(i, -12); g.lineTo(i, 12);
        g.moveTo(-12, i); g.lineTo(12, i);
        g.stroke();
      }
    } else if (ballSkin === 'ball_gold') {
      const aura = g.createRadialGradient(0, 0, 12, 0, 0, 23);
      aura.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
      aura.addColorStop(1, 'rgba(255, 215, 0, 0)');
      g.fillStyle = aura;
      g.beginPath();
      g.arc(0, 0, 23, 0, Math.PI * 2);
      g.fill();

      const grad = g.createRadialGradient(-5, -6, 2, 0, 0, 17);
      grad.addColorStop(0, '#fff9c4');
      grad.addColorStop(0.5, '#ffd700');
      grad.addColorStop(1, '#b8860b');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, 17, 0, Math.PI * 2);
      g.fill();

      g.rotate(w.spin * 0.25);
      g.fillStyle = '#ffffff';
      g.font = 'bold 12px sans-serif';
      g.textAlign = 'center';
      g.fillText('★', 0, 4);
    } else if (ballSkin === 'ball_tennis') {
      const grad = g.createRadialGradient(-5, -6, 2, 0, 0, 17);
      grad.addColorStop(0, '#eaff7b');
      grad.addColorStop(1, '#a6d608');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, 17, 0, Math.PI * 2);
      g.fill();

      g.rotate(w.spin * 0.25);
      g.strokeStyle = '#ffffff';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(-17 * 1.1, 0, 12.75, -0.9, 0.9);
      g.stroke();
      g.beginPath();
      g.arc(17 * 1.1, 0, 12.75, Math.PI - 0.9, Math.PI + 0.9);
      g.stroke();
    } else {
      const ballGrad = g.createRadialGradient(-5, -6, 3, 0, 0, 17);
      ballGrad.addColorStop(0, '#ffb26b');
      ballGrad.addColorStop(1, '#e8641c');
      g.fillStyle = ballGrad;
      g.beginPath();
      g.arc(0, 0, 17, 0, Math.PI * 2);
      g.fill();

      g.rotate(w.spin * 0.25);
      g.strokeStyle = 'rgba(60,20,0,0.8)';
      g.lineWidth = 1.8;
      g.beginPath();
      g.moveTo(-17, 0);
      g.lineTo(17, 0);
      g.moveTo(0, -17);
      g.lineTo(0, 17);
      g.stroke();
      g.beginPath();
      g.arc(-17 * 1.1, 0, 12.75, -0.9, 0.9);
      g.stroke();
      g.beginPath();
      g.arc(17 * 1.1, 0, 12.75, Math.PI - 0.9, Math.PI + 0.9);
      g.stroke();
    }

    g.restore();

    if (w.shield) {
      g.strokeStyle = `rgba(62,224,255,${0.6 + 0.3 * Math.sin(w.time * 6)})`;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(w.ballX, w.ballY, 24, 0, Math.PI * 2);
      g.stroke();
    }
  }
}

const gameModule = {
  async initialize(container, ctx) {
    return new DunkDropGame(container, ctx);
  }
};

export { gameModule as default };