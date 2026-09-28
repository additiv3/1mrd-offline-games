/* 1 Milliarde Offline Games – Shop & Belohnungs-Manager */

const STORAGE_KEY_SHOP = 'mrd:v1:shop:data';
const STORAGE_KEY_PROGRESS = 'mrd:v1:shell:progress';

export const SHOP_ITEMS = [
  // Bälle für Dunk Drop
  {
    id: 'ball_classic',
    category: 'ball',
    name: 'Basketball',
    icon: '🏀',
    price: 0,
    desc: 'Der klassische Leder-Basketball mit schwarzem Naht-Muster.',
    isDefault: true
  },
  {
    id: 'ball_fire',
    category: 'ball',
    name: 'Feuerball',
    icon: '🔥',
    price: 80,
    desc: 'Lodernde Flammen mit glühender Korona bei jedem Sprung.'
  },
  {
    id: 'ball_disco',
    category: 'ball',
    name: 'Disco-Kugel',
    icon: '🪩',
    price: 120,
    desc: 'Spiegelnder Retro-Chrom-Look mit funkelnden Lichtreflexen.'
  },
  {
    id: 'ball_gold',
    category: 'ball',
    name: 'Gold-Ball',
    icon: '⭐',
    price: 200,
    desc: 'Pures 24-Karat Gold mit strahlendem Heiligenschein.'
  },
  {
    id: 'ball_tennis',
    category: 'ball',
    name: 'Tennisball',
    icon: '🎾',
    price: 50,
    desc: 'Fluoreszierender Neongelb-Filz mit geschwungenen weißen Nähten.'
  },

  // Karten-Rücken für Solitär, Spider & Spades
  {
    id: 'card_classic',
    category: 'card',
    name: 'Saphirblau',
    icon: '🎴',
    price: 0,
    desc: 'Traditionelles geometrisches Rauten-Muster in tiefem Blau.',
    isDefault: true
  },
  {
    id: 'card_crimson',
    category: 'card',
    name: 'Roter Phönix',
    icon: '🔴',
    price: 75,
    desc: 'Feuriges Rubinrot mit barockem Phönix-Ornament.'
  },
  {
    id: 'card_galaxy',
    category: 'card',
    name: 'Kosmos Neon',
    icon: '🌌',
    price: 130,
    desc: 'Geheimnisvoller Sternennebel mit funkelnden Sternen.'
  },
  {
    id: 'card_royal',
    category: 'card',
    name: 'Royal Gold',
    icon: '👑',
    price: 190,
    desc: 'Königliches Gold-Filigran auf mitternachtsblauem Samt.'
  },
  {
    id: 'card_dark',
    category: 'card',
    name: 'Obsidian Black',
    icon: '🖤',
    price: 60,
    desc: 'Mattschwarzes Luxus-Finish mit minimalistischem Silberstreif.'
  },

  // Farbthemen für die gesamte App
  {
    id: 'theme_default',
    category: 'theme',
    name: 'Deep Space',
    icon: '🚀',
    price: 0,
    desc: 'Das klassische dunkle Universum der 1-Mrd-Games.',
    isDefault: true
  },
  {
    id: 'theme_emerald',
    category: 'theme',
    name: 'Cyber Emerald',
    icon: '🌿',
    price: 110,
    desc: 'Giftgrüne Neon-Akzente und kühles Minz-Leuchten.'
  },
  {
    id: 'theme_sunset',
    category: 'theme',
    name: 'Sunset Glow',
    icon: '🌅',
    price: 110,
    desc: 'Warme Abendsonne mit Purpur- und Korallentönen.'
  },
  {
    id: 'theme_amethyst',
    category: 'theme',
    name: 'Amethyst',
    icon: '💜',
    price: 110,
    desc: 'Mystisches lila Funkeln mit samtigen Schatten.'
  }
];

export function getShopData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHOP);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          inventory: Array.isArray(parsed.inventory) ? parsed.inventory : ['ball_classic', 'card_classic', 'theme_default'],
          equipped: {
            ball: parsed.equipped?.ball || 'ball_classic',
            card: parsed.equipped?.card || 'card_classic',
            theme: parsed.equipped?.theme || 'theme_default'
          }
        };
      }
    }
  } catch (e) {}
  return {
    inventory: ['ball_classic', 'card_classic', 'theme_default'],
    equipped: {
      ball: 'ball_classic',
      card: 'card_classic',
      theme: 'theme_default'
    }
  };
}

export function saveShopData(data) {
  try {
    localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(data));
    applyActiveTheme(data.equipped.theme);
  } catch (e) {}
}

export function getShellCoins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.coins === 'number') return p.coins;
    }
  } catch (e) {}
  return 0;
}

export function modifyShellCoins(delta) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    let p = { coins: 0, stats: {} };
    if (raw) {
      p = JSON.parse(raw) || p;
    }
    p.coins = Math.max(0, (p.coins || 0) + delta);
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(p));
    // Dispatch storage event so shell listeners update immediately
    window.dispatchEvent(new CustomEvent('coins-updated', { detail: { coins: p.coins } }));
    return p.coins;
  } catch (e) {}
  return 0;
}

export function getEquippedSkin(category) {
  const data = getShopData();
  return data.equipped[category] || (category === 'ball' ? 'ball_classic' : category === 'card' ? 'card_classic' : 'theme_default');
}

export function applyActiveTheme(themeId) {
  let styleEl = document.getElementById('shop-custom-theme-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'shop-custom-theme-style';
    document.head.appendChild(styleEl);
  }

  if (themeId === 'theme_emerald') {
    styleEl.textContent = `
      body { --color-accent: #00ffaa; background-color: #061712 !important; }
      #root { background: radial-gradient(circle at 50% 10%, #0d3829 0%, #061712 90%) !important; }
    `;
  } else if (themeId === 'theme_sunset') {
    styleEl.textContent = `
      body { --color-accent: #ff6b4a; background-color: #1a0b12 !important; }
      #root { background: radial-gradient(circle at 50% 10%, #3d1222 0%, #170710 90%) !important; }
    `;
  } else if (themeId === 'theme_amethyst') {
    styleEl.textContent = `
      body { --color-accent: #b05cff; background-color: #120824 !important; }
      #root { background: radial-gradient(circle at 50% 10%, #2f1259 0%, #0f061c 90%) !important; }
    `;
  } else {
    styleEl.textContent = '';
  }
}

// Automatically apply theme on load
if (typeof document !== 'undefined') {
  try {
    const s = getShopData();
    applyActiveTheme(s.equipped.theme);
  } catch (e) {}
}

export function openShopModal() {
  const existing = document.getElementById('shop-modal-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'shop-modal-container';
  container.className = 'shop-mobile-container';
  container.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);animation:shopFadeIn 0.2s ease-out;';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes shopFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .shop-dialog {
      background:#16122b;
      border:1px solid rgba(255,255,255,0.12);
      border-radius:28px;
      width:100%;
      max-width:480px;
      max-height:90vh;
      display:flex;
      flex-direction:column;
      box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);
      overflow:hidden;
      color:#ffffff;
      font-family:system-ui,-apple-system,sans-serif;
    }
    @media (max-width: 640px) {
      .shop-mobile-container {
        padding: 0 !important;
      }
      .shop-dialog {
        max-width: 100%;
        max-height: 100dvh;
        height: 100dvh;
        border-radius: 0;
        border: none;
      }
    }
  `;
  container.appendChild(style);

  let activeTab = 'ball';

  function render() {
    const coins = getShellCoins();
    const shopData = getShopData();

    const items = SHOP_ITEMS.filter(it => it.category === activeTab);

    container.innerHTML = '';
    container.appendChild(style);

    const dialog = document.createElement('div');
    dialog.className = 'shop-dialog';

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'padding:18px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);background:#1a1533;';
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:24px;">🛍️</span>
        <div>
          <h2 style="font-size:19px;font-weight:900;margin:0;letter-spacing:-0.02em;">Design-Shop</h2>
          <p style="font-size:12px;color:rgba(255,255,255,0.6);margin:2px 0 0 0;">Freischalten & Ausrüsten</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="display:flex;align-items:center;gap:6px;background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.3);padding:5px 12px;border-radius:999px;font-weight:900;color:#ffd700;font-size:15px;">
          <span>🪙</span>
          <span>${coins}</span>
        </div>
        <button id="shop-close-btn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:34px;height:34px;border-radius:999px;font-size:18px;font-weight:bold;cursor:pointer;display:grid;place-items:center;">✕</button>
      </div>
    `;
    dialog.appendChild(header);

    // Tabs
    const tabs = document.createElement('div');
    tabs.style.cssText = 'display:flex;gap:6px;padding:12px 16px;background:rgba(0,0,0,0.2);border-bottom:1px solid rgba(255,255,255,0.06);';
    const tabDefs = [
      { id: 'ball', label: '🏀 Bälle' },
      { id: 'card', label: '🃏 Karten' },
      { id: 'theme', label: '🎨 Themen' }
    ];
    tabDefs.forEach(t => {
      const btn = document.createElement('button');
      btn.style.cssText = `flex:1;padding:8px 6px;border-radius:14px;border:none;font-weight:bold;font-size:13px;cursor:pointer;transition:all 0.15s;${activeTab === t.id ? 'background:#7c4dff;color:#fff;box-shadow:0 4px 12px rgba(124,77,255,0.4);' : 'background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.7);'}`;
      btn.textContent = t.label;
      btn.onclick = () => { activeTab = t.id; render(); };
      tabs.appendChild(btn);
    });
    dialog.appendChild(tabs);

    // Items list
    const list = document.createElement('div');
    list.style.cssText = 'flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;';

    items.forEach(it => {
      const isOwned = it.isDefault || shopData.inventory.includes(it.id);
      const isEquipped = shopData.equipped[it.category] === it.id;
      const canAfford = coins >= it.price;

      const itemCard = document.createElement('div');
      itemCard.style.cssText = `display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;border-radius:20px;background:${isEquipped ? 'rgba(124,77,255,0.18)' : 'rgba(255,255,255,0.04)'};border:1.5px solid ${isEquipped ? '#7c4dff' : 'rgba(255,255,255,0.08)'};`;

      itemCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;min-width:0;">
          <div style="width:50px;height:50px;border-radius:16px;display:grid;place-items:center;font-size:28px;background:rgba(255,255,255,0.08);shrink:0;">
            ${it.icon}
          </div>
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;">
              <h4 style="margin:0;font-size:15px;font-weight:800;letter-spacing:-0.01em;">${it.name}</h4>
              ${isEquipped ? '<span style="background:#00e5ff;color:#0e0b1f;font-size:10px;font-weight:900;padding:2px 6px;border-radius:6px;">AKTIV</span>' : ''}
            </div>
            <p style="margin:3px 0 0 0;font-size:12px;color:rgba(255,255,255,0.65);line-height:1.3;">${it.desc}</p>
          </div>
        </div>
      `;

      const actionWrap = document.createElement('div');
      actionWrap.style.cssText = 'shrink:0;';

      if (isEquipped) {
        const btn = document.createElement('button');
        btn.disabled = true;
        btn.style.cssText = 'padding:7px 14px;border-radius:12px;background:rgba(0,229,255,0.2);color:#00e5ff;border:none;font-weight:bold;font-size:12px;';
        btn.textContent = '✓ Ausgerüstet';
        actionWrap.appendChild(btn);
      } else if (isOwned) {
        const btn = document.createElement('button');
        btn.style.cssText = 'padding:7px 16px;border-radius:12px;background:#7c4dff;color:#fff;border:none;font-weight:bold;font-size:12px;cursor:pointer;';
        btn.textContent = 'Ausrüsten';
        btn.onclick = () => {
          shopData.equipped[it.category] = it.id;
          saveShopData(shopData);
          render();
        };
        actionWrap.appendChild(btn);
      } else {
        const btn = document.createElement('button');
        btn.style.cssText = `padding:7px 14px;border-radius:12px;border:none;font-weight:900;font-size:12px;display:flex;align-items:center;gap:5px;${canAfford ? 'background:#ffd700;color:#0e0b1f;cursor:pointer;' : 'background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);cursor:not-allowed;'}`;
        btn.innerHTML = `<span>${it.price}</span> <span>🪙</span>`;
        if (canAfford) {
          btn.onclick = () => {
            modifyShellCoins(-it.price);
            shopData.inventory.push(it.id);
            shopData.equipped[it.category] = it.id;
            saveShopData(shopData);
            render();
          };
        }
        actionWrap.appendChild(btn);
      }

      itemCard.appendChild(actionWrap);
      list.appendChild(itemCard);
    });

    dialog.appendChild(list);

    // Footer tip
    const foot = document.createElement('div');
    foot.style.cssText = 'padding:12px 18px;border-top:1px solid rgba(255,255,255,0.08);background:#130e24;display:flex;align-items:center;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.5);';
    foot.innerHTML = `
      <span>Tipp: Spiele Minispiele, um weitere Münzen zu sammeln!</span>
      <span style="color:#ffd700;font-weight:bold;">100% Offline</span>
    `;
    dialog.appendChild(foot);

    container.appendChild(dialog);

    dialog.querySelector('#shop-close-btn').onclick = () => container.remove();
  }

  container.onclick = (e) => {
    if (e.target === container) container.remove();
  };

  render();
  document.body.appendChild(container);
}
