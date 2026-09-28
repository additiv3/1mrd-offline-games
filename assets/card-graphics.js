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
    g.shadowBlur = 15;
    g.shadowOffsetX = 0;
    g.shadowOffsetY = 0;
  } else {
    g.shadowColor = 'rgba(0, 0, 0, 0.4)';
    g.shadowBlur = 8;
    g.shadowOffsetX = 2;
    g.shadowOffsetY = 4;
  }

  // 2. Card Base (Vintage / Punchy)
  const r = Math.max(5, Math.round(w * 0.12));
  
  // Card base gradient
  const baseGrad = g.createLinearGradient(x, y, x + w, y + h);
  if (isSelected) {
    // Balatro holo effect base
    baseGrad.addColorStop(0, '#fdfbfb');
    baseGrad.addColorStop(0.5, '#e2d1c3');
    baseGrad.addColorStop(1, '#fdfbfb');
  } else {
    baseGrad.addColorStop(0, '#f4ebd8'); // Vintage paper color
    baseGrad.addColorStop(1, '#e3d5b8');
  }
  g.fillStyle = baseGrad;

  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();

  // Reset shadow for inner graphics
  g.shadowColor = 'transparent';
  g.shadowBlur = 0;

  // 3. Thick Card Border
  g.strokeStyle = '#222222';
  g.lineWidth = isSelected ? 3 : 2;
  g.stroke();

  // Inner border
  g.strokeStyle = 'rgba(255,255,255,0.7)';
  g.lineWidth = 1;
  g.beginPath();
  g.roundRect(x + 2, y + 2, w - 4, h - 4, r - 2);
  g.stroke();

  // Holographic overlay for selected cards
  if (isSelected) {
    g.globalCompositeOperation = 'overlay';
    const holo = g.createLinearGradient(x, y, x + w, y + h);
    holo.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
    holo.addColorStop(0.33, 'rgba(0, 255, 0, 0.4)');
    holo.addColorStop(0.66, 'rgba(0, 0, 255, 0.4)');
    holo.addColorStop(1, 'rgba(255, 255, 0, 0.4)');
    g.fillStyle = holo;
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
    g.globalCompositeOperation = 'source-over';
  }

  // Color selection (Punchier colors)
  const isRed = card.color === 'red';
  const mainColor = isRed ? '#e62222' : '#1a1a24'; // Brighter red, darker black/blue
  const shadowColor = isRed ? '#990000' : '#000000'; // 3D text effect

  // 4. Corner Rank & Suit (Balatro style - very bold)
  const rankFontSize = Math.max(12, Math.round(w * 0.4));
  const suitFontSize = Math.max(10, Math.round(w * 0.35));

  const drawText3D = (text, tx, ty, font, color, sColor) => {
    g.font = font;
    g.textAlign = 'center';
    // 3D Drop
    g.fillStyle = sColor;
    g.fillText(text, tx, ty + 2);
    // Main
    g.fillStyle = color;
    g.fillText(text, tx, ty);
  };

  const cxRank = x + Math.round(w * 0.22);
  const cyRank = y + Math.round(h * 0.28);
  const cySuit = y + Math.round(h * 0.48);

  drawText3D(card.label, cxRank, cyRank, `900 ${rankFontSize}px "Arial Black", impact, sans-serif`, mainColor, shadowColor);
  drawText3D(card.symbol, cxRank, cySuit, `900 ${suitFontSize}px "Arial Black", sans-serif`, mainColor, shadowColor);

  // Symmetrical bottom-right for large cards
  if (w >= 48) {
    g.save();
    g.translate(x + w, y + h);
    g.rotate(Math.PI);
    drawText3D(card.label, Math.round(w * 0.18), Math.round(h * 0.22), `900 ${Math.round(w * 0.3)}px "Arial Black", impact, sans-serif`, mainColor, shadowColor);
    drawText3D(card.symbol, Math.round(w * 0.18), Math.round(h * 0.4), `900 ${Math.round(w * 0.25)}px "Arial Black", sans-serif`, mainColor, shadowColor);
    g.restore();
  }

  // 5. Center Artwork
  const cx = x + w * 0.62;
  const cy = y + h * 0.6;
  const isCourt = card.label === 'K' || card.label === 'Q' || card.label === 'J' || card.label === 'A';

  if (isCourt) {
    const portraitW = Math.round(w * 0.55);
    const portraitH = Math.round(h * 0.62);
    const px = x + w - portraitW - 4;
    const py = y + Math.round(h * 0.18);

    g.save();
    // Inner frame with dark border (Balatro style portrait)
    g.fillStyle = isRed ? '#ffcccc' : '#d1d5db';
    g.beginPath();
    g.roundRect(px, py, portraitW, portraitH, 3);
    g.fill();
    g.lineWidth = 2;
    g.strokeStyle = '#222222';
    g.stroke();

    g.textAlign = 'center';
    if (card.label === 'K') {
      g.font = `${Math.round(portraitW * 0.65)}px sans-serif`;
      g.fillText('🤴', px + portraitW / 2, py + portraitH * 0.6);
      g.font = `bold ${Math.round(portraitW * 0.4)}px system-ui`;
      g.fillText('👑', px + portraitW / 2, py + portraitH * 0.28);
    } else if (card.label === 'Q') {
      g.font = `${Math.round(portraitW * 0.65)}px sans-serif`;
      g.fillText('👸', px + portraitW / 2, py + portraitH * 0.6);
      g.font = `bold ${Math.round(portraitW * 0.4)}px system-ui`;
      g.fillText('✨', px + portraitW / 2, py + portraitH * 0.28);
    } else if (card.label === 'J') {
      g.font = `${Math.round(portraitW * 0.65)}px sans-serif`;
      g.fillText('💂', px + portraitW / 2, py + portraitH * 0.6);
      g.font = `bold ${Math.round(portraitW * 0.35)}px system-ui`;
      g.fillText('⚔️', px + portraitW / 2, py + portraitH * 0.28);
    } else if (card.label === 'A') {
      // Giant Ace
      drawText3D(card.symbol, px + portraitW / 2, py + portraitH * 0.75, `900 ${Math.round(portraitW * 0.95)}px sans-serif`, mainColor, shadowColor);
    }
    g.restore();

  } else {
    // Number Cards: Huge bold center suit
    const centerSize = Math.max(18, Math.round(w * 0.6));
    drawText3D(card.symbol, cx, cy + Math.round(centerSize * 0.35), `900 ${centerSize}px sans-serif`, mainColor, shadowColor);
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
