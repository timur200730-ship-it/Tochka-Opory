/* ============================================================
   UI UPGRADE — Глобальное улучшение дизайна и иконки
   ============================================================ */

(function(){
  const style = document.createElement('style');
  style.textContent = `
    /* 1. Анимированный живой фон */
    body::before {
      content: "";
      position: fixed;
      top: -20%; left: -10%;
      width: 60vw; height: 60vw;
      background: radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 60%);
      border-radius: 50%;
      z-index: -1;
      animation: floatOrb 20s infinite alternate ease-in-out;
      pointer-events: none;
    }
    body::after {
      content: "";
      position: fixed;
      bottom: -20%; right: -10%;
      width: 50vw; height: 50vw;
      background: radial-gradient(circle, rgba(74,214,200,0.1) 0%, transparent 60%);
      border-radius: 50%;
      z-index: -1;
      animation: floatOrb 25s infinite alternate-reverse ease-in-out;
      pointer-events: none;
    }
    @keyframes floatOrb {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(5vw, 5vh) scale(1.1); }
      100% { transform: translate(-5vw, -5vh) scale(0.9); }
    }

    /* 2. Стеклянный эффект для шапки */
    header {
      background: rgba(11, 11, 18, 0.6) !important;
      backdrop-filter: blur(20px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
      border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    }

    /* 3. Кастомный скроллбар */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0b0b12; }
    ::-webkit-scrollbar-thumb {
      background: #2c2c33;
      border-radius: 4px;
      border: 2px solid #0b0b12;
    }
    ::-webkit-scrollbar-thumb:hover { background: #4ad6c8; }

    /* 4. Красивое выделение текста */
    ::selection {
      background: rgba(124, 92, 255, 0.3);
      color: #fff;
    }

    /* 5. Стеклянные подложки для иконок */
    .state .emoji, .tool-card .icon, .module .icn, .mood-btn, .tip-emoji, .chal-icon {
      background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.05) !important;
      transition: all 0.3s ease !important;
    }
    .state .emoji { width: 52px !important; height: 52px !important; margin-bottom: 12px !important; }
    .module .icn { width: 56px !important; height: 56px !important; margin-bottom: 16px !important; }
    .tool-card .icon { width: 48px !important; height: 48px !important; margin-bottom: 12px !important; }
    .mood-btn { height: 44px !important; width: auto !important; padding: 0 12px !important; flex: 1 !important; }
    .tip-emoji { width: 36px !important; height: 36px !important; }
    .chal-icon { width: 64px !important; height: 64px !important; }

    .state:hover .emoji, .module:hover .icn, .tool-card:hover .icon, .mood-btn:hover, .chal-icon:hover {
      transform: translateY(-4px) scale(1.05) !important;
      box-shadow: 0 8px 20px rgba(124,92,255,0.25), inset 0 2px 4px rgba(255,255,255,0.1) !important;
      border-color: rgba(124,92,255,0.5) !important;
    }

    /* 6. Размер и цвет SVG-иконок */
    .ui-svg-icon {
      width: 24px;
      height: 24px;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .module .icn .ui-svg-icon { width: 28px; height: 28px; }
    .state .emoji .ui-svg-icon { width: 26px; height: 26px; }
    .tool-card .icon .ui-svg-icon { width: 24px; height: 24px; }
  `;
  document.head.appendChild(style);

  // 7. ЗАМЕНА ЭМОДЗИ НА SVG-ИКОНКИ
  document.addEventListener('DOMContentLoaded', () => {
    const iconMap = {
      '💰': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
      '🧠': '<svg viewBox="0 0 24 24" stroke="#7c5cff"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>',
      '🆘': '<svg viewBox="0 0 24 24" stroke="#ff5c8a"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
      '🔥': '<svg viewBox="0 0 24 24" stroke="#ffb547"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      '⭐': '<svg viewBox="0 0 24 24" stroke="#ffb547"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      '🌿': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      '🎡': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
      '📓': '<svg viewBox="0 0 24 24" stroke="#f2f2f7" fill="none" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h8"/></svg>',
      '🏆': '<svg viewBox="0 0 24 24" stroke="#ffb547"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      '🕵️‍♂️': '<svg viewBox="0 0 24 24" stroke="#ff5c8a"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg>',
      '💸': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    };

    // Проходим по всем элементам, где могут быть иконки
    const targets = document.querySelectorAll('.state .emoji, .module .icn, .tool-card .icon, .pill, .nav-item .icon, .tip-emoji, .chal-icon, .step-pill .ico');
    
    targets.forEach(el => {
      const text = el.textContent.trim();
      if (iconMap[text]) {
        el.innerHTML = iconMap[text].replace('<svg ', '<svg class="ui-svg-icon" ');
      }
    });
  });
})();
