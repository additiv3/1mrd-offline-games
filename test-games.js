
import { JSDOM } from 'jsdom';
import fs from 'fs';
const dom = new JSDOM('<!DOCTYPE html><html><body><div id=\"app\"></div></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;
global.AudioContext = class {
  createOscillator() { return { frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {}, type: '' }; }
  createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
  resume() { return Promise.resolve(); }
  get currentTime() { return 0; }
  get destination() { return {}; }
};
global.performance = { now: () => 0 };
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = clearTimeout;
global.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };

const games = fs.readdirSync('./assets').filter(f => f.startsWith('game-') && f.endsWith('.js'));
for (const file of games) {
  try {
    const module = await import('./assets/' + file);
    const init = module.default?.initialize || module.initialize;
    if (init) {
      const container = document.createElement('div');
      await init(container, { storage: { get: () => 0, set: () => {} }, reportResult: () => {} });
      console.log(file + ' OK');
    } else {
      console.log(file + ' NO INIT');
    }
  } catch (err) {
    console.error(file + ' ERROR: ' + err.message);
  }
}

