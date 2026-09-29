/* 1 Milliarde Offline Games – Premium Card Graphics Engine
   High-Fidelity Vektor-Rendering für Spielkarten:
   - Barock-ornamentierte Buben (J), Damen (Q), Könige (K) mit Kronen & Zeptern
   - Große, perfekt lesbare Ecken-Indizes
   - Echte Schattierung, abgerundete Ränder und Textur
   - Wunderschöne animierte/ausrüstbare Karten-Rücken
*/

import { getEquippedSkin } from './shop-manager.js';

export function drawLuxuryCardFront(g, card, x, y, w, h, isSelected = false) {
  g.save();

  // 1. Drop Shadow & Selection Glow (Holographic if selected)
  if (isSelected) {
    g.shadowColor = '#00ffc8';
    g.shadowBlur = 14;
    g.shadowOffsetX = 0;
    g.shadowOffsetY = 0;
  } else {
    g.shadowColor = 'rgba(0, 0, 0, 0.45)';
    g.shadowBlur = 6;
    g.shadowOffsetX = 1.5;
    g.shadowOffsetY = 3;
  }

  // 2. Card Base (Balatro Cream / Vintage cardstock)
  const r = Math.max(4, Math.round(w * 0.1));
  const baseGrad = g.createLinearGradient(x, y, x + w, y + h);
  if (isSelected) {
    baseGrad.addColorStop(0, '#ffffff');
    baseGrad.addColorStop(0.5, '#f0e6d6');
    baseGrad.addColorStop(1, '#ffffff');
  } else {
    baseGrad.addColorStop(0, '#faf4e6');
    baseGrad.addColorStop(0.7, '#f3ebd4');
    baseGrad.addColorStop(1, '#ebe0c5');
  }
  g.fillStyle = baseGrad;

  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();

  // Reset shadow for crisp inner graphics
  g.shadowColor = 'transparent';
  g.shadowBlur = 0;

  // 3. Thick Card Border (Balatro dark crisp border)
  g.strokeStyle = '#1e1c24';
  g.lineWidth = isSelected ? 2.5 : 1.5;
  g.stroke();

  // Inner decorative border
  g.strokeStyle = 'rgba(215, 195, 160, 0.6)';
  g.lineWidth = 1;
  g.beginPath();
  g.roundRect(x + 2, y + 2, Math.max(0, w - 4), Math.max(0, h - 4), Math.max(2, r - 2));
  g.stroke();

  // Colors: Punchy Balatro Crimson & Deep Midnight Slate
  const isRed = card.color === 'red';
  const mainColor = isRed ? '#e11d48' : '#0f172a';
  const shadowColor = isRed ? 'rgba(159, 18, 57, 0.35)' : 'rgba(15, 23, 42, 0.3)';

  // 4. Corner Indices (Top-Left and Inverted Bottom-Right)
  const rankFontSize = Math.max(9, Math.round(w * 0.25));
  const suitFontSize = Math.max(8, Math.round(w * 0.2));

  // Top-Left Index
  g.textAlign = 'center';
  g.textBaseline = 'top';

  const tlX = x + Math.max(7, Math.round(w * 0.16));
  const tlRankY = y + Math.max(4, Math.round(h * 0.06));
  const tlSuitY = tlRankY + rankFontSize + 1;

  // Top-Left Rank
  g.font = `900 ${rankFontSize}px "Arial Black", system-ui, sans-serif`;
  g.fillStyle = shadowColor;
  g.fillText(card.label, tlX, tlRankY + 1);
  g.fillStyle = mainColor;
  g.fillText(card.label, tlX, tlRankY);

  // Top-Left Suit
  g.font = `900 ${suitFontSize}px system-ui, sans-serif`;
  g.fillStyle = shadowColor;
  g.fillText(card.symbol, tlX, tlSuitY + 1);
  g.fillStyle = mainColor;
  g.fillText(card.symbol, tlX, tlSuitY);

  // Inverted Bottom-Right Index
  g.save();
  g.translate(x + w, y + h);
  g.rotate(Math.PI);
  g.font = `900 ${rankFontSize}px "Arial Black", system-ui, sans-serif`;
  g.fillStyle = shadowColor;
  g.fillText(card.label, Math.max(7, Math.round(w * 0.16)), Math.max(4, Math.round(h * 0.06)) + 1);
  g.fillStyle = mainColor;
  g.fillText(card.label, Math.max(7, Math.round(w * 0.16)), Math.max(4, Math.round(h * 0.06)));

  g.font = `900 ${suitFontSize}px system-ui, sans-serif`;
  g.fillStyle = shadowColor;
  g.fillText(card.symbol, Math.max(7, Math.round(w * 0.16)), Math.max(4, Math.round(h * 0.06)) + rankFontSize + 2);
  g.fillStyle = mainColor;
  g.fillText(card.symbol, Math.max(7, Math.round(w * 0.16)), Math.max(4, Math.round(h * 0.06)) + rankFontSize + 1);
  g.restore();

  // 5. Center Artwork (Balatro Court & Number Cards)
  const isCourt = card.label === 'K' || card.label === 'Q' || card.label === 'J' || card.label === 'A';
  const midX = x + w / 2;
  const midY = y + h / 2;

  if (isCourt) {
    const boxW = Math.max(18, Math.round(w * 0.52));
    const boxH = Math.max(26, Math.round(h * 0.58));
    const bx = midX - boxW / 2;
    const by = midY - boxH / 2;

    // Ornate frame
    g.fillStyle = isRed ? '#ffe4e6' : '#e2e8f0';
    g.beginPath();
    g.roundRect(bx, by, boxW, boxH, 4);
    g.fill();
    g.strokeStyle = '#1e1c24';
    g.lineWidth = 1.5;
    g.stroke();

    g.textAlign = 'center';
    g.textBaseline = 'middle';

    if (card.label === 'K') {
      g.font = `${Math.round(boxW * 0.65)}px sans-serif`;
      g.fillText('👑', midX, midY);
    } else if (card.label === 'Q') {
      g.font = `${Math.round(boxW * 0.65)}px sans-serif`;
      g.fillText('👸', midX, midY);
    } else if (card.label === 'J') {
      g.font = `${Math.round(boxW * 0.62)}px sans-serif`;
      g.fillText('⚔️', midX, midY);
    } else if (card.label === 'A') {
      // Giant Balatro Ace Symbol
      const aceSize = Math.round(boxW * 0.9);
      g.font = `900 ${aceSize}px system-ui, sans-serif`;
      g.fillStyle = shadowColor;
      g.fillText(card.symbol, midX, midY + 1.5);
      g.fillStyle = mainColor;
      g.fillText(card.symbol, midX, midY);
    }
  } else {
    // Number Cards: Clean central bold suit
    const centerSize = Math.max(16, Math.round(w * 0.5));
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `900 ${centerSize}px system-ui, sans-serif`;
    g.fillStyle = shadowColor;
    g.fillText(card.symbol, midX, midY + 1.5);
    g.fillStyle = mainColor;
    g.fillText(card.symbol, midX, midY);
  }

  g.restore();
}

export function drawLuxuryCardBack(g, x, y, w, h) {
  const skin = getEquippedSkin('card');
  g.save();

  // Drop shadow
  g.shadowColor = 'rgba(0, 0, 0, 0.4)';
  g.shadowBlur = 6;
  g.shadowOffsetY = 2;

  const r = Math.max(4, Math.round(w * 0.1));
  g.beginPath();
  g.roundRect(x, y, w, h, r);

  // Outer border gradient
  let borderGrad;
  if (skin === 'card_crimson') {
    borderGrad = '#7f1d1d';
  } else if (skin === 'card_galaxy') {
    borderGrad = '#311042';
  } else if (skin === 'card_royal') {
    borderGrad = '#78350f';
  } else if (skin === 'card_dark') {
    borderGrad = '#0f172a';
  } else {
    borderGrad = '#1e3a8a';
  }
  g.fillStyle = borderGrad;
  g.fill();

  g.shadowColor = 'transparent';
  g.shadowBlur = 0;

  // Inner margin pattern
  const innerPad = Math.max(2, Math.round(w * 0.08));
  const iw = w - innerPad * 2;
  const ih = h - innerPad * 2;
  const ix = x + innerPad;
  const iy = y + innerPad;

  let patternGrad = g.createLinearGradient(ix, iy, ix + iw, iy + ih);
  if (skin === 'card_crimson') {
    patternGrad.addColorStop(0, '#ef4444');
    patternGrad.addColorStop(0.5, '#b91c1c');
    patternGrad.addColorStop(1, '#991b1b');
  } else if (skin === 'card_galaxy') {
    patternGrad.addColorStop(0, '#8b5cf6');
    patternGrad.addColorStop(0.5, '#ec4899');
    patternGrad.addColorStop(1, '#3b82f6');
  } else if (skin === 'card_royal') {
    patternGrad.addColorStop(0, '#f59e0b');
    patternGrad.addColorStop(0.5, '#d97706');
    patternGrad.addColorStop(1, '#b45309');
  } else if (skin === 'card_dark') {
    patternGrad.addColorStop(0, '#334155');
    patternGrad.addColorStop(0.5, '#1e293b');
    patternGrad.addColorStop(1, '#0f172a');
  } else {
    patternGrad.addColorStop(0, '#3b82f6');
    patternGrad.addColorStop(0.5, '#1d4ed8');
    patternGrad.addColorStop(1, '#1e40af');
  }

  g.fillStyle = patternGrad;
  g.beginPath();
  g.roundRect(ix, iy, iw, ih, Math.max(3, r - 2));
  g.fill();

  // Luxury Filigree Lattice
  g.strokeStyle = skin === 'card_royal' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)';
  g.lineWidth = 1;
  const step = Math.max(6, Math.round(iw / 4));
  for (let ox = ix + step; ox < ix + iw; ox += step) {
    g.beginPath();
    g.moveTo(ox, iy);
    g.lineTo(ox - step, iy + ih);
    g.moveTo(ox, iy + ih);
    g.lineTo(ox - step, iy);
    g.stroke();
  }

  // Center Emblem
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(ix + iw / 2, iy + ih / 2, Math.max(6, Math.round(iw * 0.22)), 0, Math.PI * 2);
  g.fill();

  g.fillStyle = borderGrad;
  g.font = `bold ${Math.max(8, Math.round(iw * 0.28))}px system-ui`;
  g.textAlign = 'center';
  const emblem = skin === 'card_crimson' ? '🔥' : skin === 'card_galaxy' ? '✨' : skin === 'card_royal' ? '👑' : skin === 'card_dark' ? '💎' : '♠';
  g.fillText(emblem, ix + iw / 2, iy + ih / 2 + Math.round(iw * 0.1));

  g.restore();
}
