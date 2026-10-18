/* ============================================================
   UI UPGRADE — Глобальное улучшение дизайна
   Добавляет анимированный фон, стеклянные эффекты и кастомный скроллбар
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
      background: radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 60%);
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
      background: radial-gradient(circle, rgba(74,214,200,0.12) 0%, transparent 60%);
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

    /* 5. Плавное появление страницы */
    body {
      animation: fadeInPage 0.6s ease-out;
    }
    @keyframes fadeInPage {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 6. Улучшение карточек */
    .module, .lesson, .tcard, .practice-box, .quiz-q, .daily-card, .tree-card, .ach-card {
      box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
    }
    .module:hover, .lesson:hover {
      box-shadow: 0 12px 40px rgba(124,92,255,0.15) !important;
      border-color: rgba(255,255,255,0.2) !important;
    }

    /* 7. Свечение кнопок при наведении */
    .btn-primary {
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: "";
      position: absolute;
      top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: rotate(45deg);
      transition: 0.5s;
      opacity: 0;
    }
    .btn-primary:hover::after {
      opacity: 1;
      left: 100%;
    }
  `;
       /* 8. ПРЕМИАЛЬНЫЕ ИКОНКИ И СМАЙЛИКИ */
    .state .emoji, .mood-btn, .tip-emoji, .chal-icon {
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)) !important;
      border: 1px solid rgba(255,255,255,0.15) !important;
      border-radius: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1) !important;
      text-shadow: 0 0 15px rgba(255,255,255,0.3) !important;
      transition: all 0.3s ease !important;
    }
    .state .emoji { width: 52px !important; height: 52px !important; font-size: 26px !important; margin-bottom: 12px !important; }
    .mood-btn { width: 44px !important; height: 44px !important; font-size: 22px !important; }
    .tip-emoji { width: 40px !important; height: 40px !important; font-size: 20px !important; }
    .chal-icon { width: 64px !important; height: 64px !important; font-size: 32px !important; }
    
    .state:hover .emoji, .mood-btn:hover, .chal-icon:hover {
      transform: translateY(-5px) scale(1.05) !important;
      box-shadow: 0 10px 25px rgba(124,92,255,0.4), inset 0 2px 4px rgba(255,255,255,0.2) !important;
      border-color: rgba(124,92,255,0.6) !important;
    }
  // 9. ЗАМЕНА ЭМОДЗИ НА SVG-ИКОНКИ
  document.addEventListener('DOMContentLoaded', () => {
    const iconMap = {
      '💰': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ad6c8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
      '🧠': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c5cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>',
      '🆘': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5c8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
      '🎓': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ad6c8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
      '🔥': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb547" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      '📓': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f2f2f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      '🌿': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ad6c8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      '🏆': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffb547" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>'
    };

    // Находим все элементы, которые содержат эмодзи, и заменяем их
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      let text = node.nodeValue;
      let replaced = false;
      for (const [emoji, svg] of Object.entries(iconMap)) {
        if (text.includes(emoji)) {
          text = text.replace(emoji, svg);
          replaced = true;
        }
      }
      if (replaced) {
        const span = document.createElement('span');
        span.innerHTML = text;
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.justifyContent = 'center';
        node.parentNode.replaceChild(span, node);
      }
    }
  });
  document.head.appendChild(style);
})();
