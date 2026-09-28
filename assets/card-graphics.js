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

  // 1. Soft Drop Shadow
  g.shadowColor = isSelected ? 'rgba(255, 215, 0, 0.65)' : 'rgba(0, 0, 0, 0.35)';
  g.shadowBlur = isSelected ? 12 : 5;
  g.shadowOffsetX = 0;
  g.shadowOffsetY = isSelected ? 0 : 2;

  // 2. Card Base with subtle ivory gradient
  const r = Math.max(4, Math.round(w * 0.1));
  const cardGrad = g.createLinearGradient(x, y, x, y + h);
  cardGrad.addColorStop(0, '#ffffff');
  cardGrad.addColorStop(1, '#f9fafb');
  g.fillStyle = cardGrad;

  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();

  // Reset shadow for inner graphics
  g.shadowColor = 'transparent';
  g.shadowBlur = 0;
  g.shadowOffsetX = 0;
  g.shadowOffsetY = 0;

  // 3. Card Border
  if (isSelected) {
    g.strokeStyle = '#ffd700';
    g.lineWidth = 2.5;
  } else {
    g.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    g.lineWidth = 1;
  }
  g.stroke();

  // Color selection
  const isRed = card.color === 'red';
  const mainColor = isRed ? '#dc2626' : '#0f172a';
  const accentColor = isRed ? '#ef4444' : '#334155';

  // 4. Corner Top-Left Rank & Suit (High Legibility)
  const rankFontSize = Math.max(11, Math.round(w * 0.34));
  const suitFontSize = Math.max(10, Math.round(w * 0.3));

  g.fillStyle = mainColor;
  g.font = `900 ${rankFontSize}px system-ui, -apple-system, sans-serif`;
  g.textAlign = 'center';
  g.fillText(card.label, x + Math.round(w * 0.22), y + Math.round(h * 0.26));

  g.font = `bold ${suitFontSize}px system-ui, sans-serif`;
  g.fillText(card.symbol, x + Math.round(w * 0.22), y + Math.round(h * 0.44));

  // Small symmetrical bottom-right indices for larger card viewports
  if (w >= 48) {
    g.save();
    g.translate(x + w, y + h);
    g.rotate(Math.PI);
    g.font = `900 ${Math.round(w * 0.26)}px system-ui, sans-serif`;
    g.fillText(card.label, Math.round(w * 0.18), Math.round(h * 0.22));
    g.font = `bold ${Math.round(w * 0.22)}px system-ui, sans-serif`;
    g.fillText(card.symbol, Math.round(w * 0.18), Math.round(h * 0.38));
    g.restore();
  }

  // 5. Center Artwork / Court Card Graphic
  const cx = x + w * 0.62;
  const cy = y + h * 0.6;
  const isCourt = card.label === 'K' || card.label === 'Q' || card.label === 'J' || card.label === 'A';

  if (isCourt) {
    // Elegant Inner Portrait Frame
    const portraitW = Math.round(w * 0.55);
    const portraitH = Math.round(h * 0.62);
    const px = x + w - portraitW - 3;
    const py = y + Math.round(h * 0.18);

    g.save();
    // Inner frame with subtle luxury tint
    const frameBg = isRed ? 'rgba(254, 226, 226, 0.45)' : 'rgba(241, 245, 249, 0.65)';
    g.fillStyle = frameBg;
    g.beginPath();
    g.roundRect(px, py, portraitW, portraitH, 4);
    g.fill();

    g.strokeStyle = isRed ? 'rgba(239, 68, 68, 0.35)' : 'rgba(100, 116, 139, 0.35)';
    g.lineWidth = 1;
    g.stroke();

    // Specific Royal Crown / Character Emblem
    g.textAlign = 'center';
    if (card.label === 'K') {
      // King 👑 with Royal Scepter
      g.font = `${Math.round(portraitW * 0.62)}px sans-serif`;
      g.fillText('🤴', px + portraitW / 2, py + portraitH * 0.6);
      g.font = `bold ${Math.round(portraitW * 0.32)}px system-ui`;
      g.fillStyle = '#b45309';
      g.fillText('👑', px + portraitW / 2, py + portraitH * 0.24);
      g.font = `${Math.round(portraitW * 0.38)}px system-ui`;
      g.fillStyle = mainColor;
      g.fillText(card.symbol, px + portraitW / 2, py + portraitH * 0.92);
    } else if (card.label === 'Q') {
      // Queen 👸 with Tiara
      g.font = `${Math.round(portraitW * 0.62)}px sans-serif`;
      g.fillText('👸', px + portraitW / 2, py + portraitH * 0.6);
      g.font = `bold ${Math.round(portraitW * 0.32)}px system-ui`;
      g.fillStyle = '#be185d';
      g.fillText('✨', px + portraitW / 2, py + portraitH * 0.24);
      g.font = `${Math.round(portraitW * 0.38)}px system-ui`;
      g.fillStyle = mainColor;
      g.fillText(card.symbol, px + portraitW / 2, py + portraitH * 0.92);
    } else if (card.label === 'J') {
      // Jack 👱 with Sword
      g.font = `${Math.round(portraitW * 0.62)}px sans-serif`;
      g.fillText('💂', px + portraitW / 2, py + portraitH * 0.6);
      g.font = `bold ${Math.round(portraitW * 0.28)}px system-ui`;
      g.fillStyle = '#0284c7';
      g.fillText('⚔️', px + portraitW / 2, py + portraitH * 0.24);
      g.font = `${Math.round(portraitW * 0.38)}px system-ui`;
      g.fillStyle = mainColor;
      g.fillText(card.symbol, px + portraitW / 2, py + portraitH * 0.92);
    } else if (card.label === 'A') {
      // Ace: Giant Grand Suit with Gold Shimmer Ring
      g.font = `${Math.round(portraitW * 0.82)}px system-ui, sans-serif`;
      g.fillStyle = mainColor;
      g.fillText(card.symbol, px + portraitW / 2, py + portraitH * 0.7);
    }
    g.restore();

  } else {
    // Number Cards: Clean, bold center suit display
    g.textAlign = 'center';
    g.fillStyle = mainColor;
    const centerSize = Math.max(16, Math.round(w * 0.52));
    g.font = `${centerSize}px system-ui, sans-serif`;
    g.fillText(card.symbol, cx, cy + Math.round(centerSize * 0.32));
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
