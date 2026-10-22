/* ============================================================
   UI UPGRADE — Глобальное улучшение дизайна, иконки и СМЕНА ТЕМЫ
   ============================================================ */

(function(){
  // 1. ПРИМЕНЯЕМ СОХРАНЁННУЮ ТЕМУ СРАЗУ ПРИ ЗАГРУЗКЕ
  const savedTheme = localStorage.getItem('global_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const style = document.createElement('style');
  style.textContent = `
    /* СВЕТЛАЯ ТЕМА */
    [data-theme="light"] {
      --bg: #F6F4FB !important;
      --bg-2: #EDE9F7 !important;
      --text: #171233 !important;
      --muted: #6B6390 !important;
      --card: rgba(255, 255, 255, 0.85) !important;
      --card-2: rgba(255, 255, 255, 1) !important;
      --stroke: rgba(20, 10, 50, 0.1) !important;
    }
    [data-theme="light"] body {
      background: 
        radial-gradient(circle at 10% 10%, rgba(124,92,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 90% 90%, rgba(74,214,200,0.1) 0%, transparent 50%),
        #F6F4FB !important;
      color: #171233 !important;
    }
    [data-theme="light"] header,
    [data-theme="light"] .bottom-nav {
      background: rgba(246, 244, 251, 0.9) !important;
      border-bottom: 1px solid rgba(20, 10, 50, 0.1) !important;
    }
    [data-theme="light"] .bottom-nav {
      border-top: 1px solid rgba(20, 10, 50, 0.1) !important;
      border-bottom: none !important;
    }
    [data-theme="light"] h1, 
    [data-theme="light"] h2, 
    [data-theme="light"] h3, 
    [data-theme="light"] h4, 
    [data-theme="light"] .logo,
    [data-theme="light"] .tcard b,
    [data-theme="light"] .nav-links a:hover,
    [data-theme="light"] .close-link:hover {
      color: #171233 !important; 
    }
    [data-theme="light"] .module, 
    [data-theme="light"] .lesson, 
    [data-theme="light"] .tcard, 
    [data-theme="light"] .practice-box, 
    [data-theme="light"] .quiz-q, 
    [data-theme="light"] .reflect-box,
    [data-theme="light"] .daily-panel,
    [data-theme="light"] .ach-card,
    [data-theme="light"] .tree-card,
    [data-theme="light"] .tool-card,
    [data-theme="light"] .near,
    [data-theme="light"] .quiz,
    [data-theme="light"] .step,
    [data-theme="light"] .panel,
    [data-theme="light"] .stat {
      background: rgba(255, 255, 255, 0.8) !important;
      border-color: rgba(20, 10, 50, 0.1) !important;
      box-shadow: 0 4px 15px rgba(20, 10, 50, 0.05) !important;
    }
    [data-theme="light"] .tcard p, 
    [data-theme="light"] .tcard ul li,
    [data-theme="light"] .module p,
    [data-theme="light"] .lesson p,
    [data-theme="light"] .stat .lbl {
      color: #4A426E !important;
    }
    [data-theme="light"] textarea,
    [data-theme="light"] input[type="text"],
    [data-theme="light"] input[type="number"],
    [data-theme="light"] .practice-box textarea,
    [data-theme="light"] .reflect-box textarea {
      background: rgba(255, 255, 255, 0.9) !important;
      color: #171233 !important;
      border-color: rgba(20, 10, 50, 0.15) !important;
    }
    [data-theme="light"] .btn-ghost,
    [data-theme="light"] .pill,
    [data-theme="light"] .back-btn,
    [data-theme="light"] .step-pill {
      background: rgba(20, 10, 50, 0.05) !important;
      border-color: rgba(20, 10, 50, 0.1) !important;
      color: #171233 !important;
    }
    [data-theme="light"] .nav-item { color: #6B6390 !important; }
    [data-theme="light"] .nav-item.active { color: #7c5cff !important; }
    [data-theme="light"] .nav-item.active .icon svg {
      stroke: #7c5cff !important;
      filter: drop-shadow(0 0 8px rgba(124,92,255,0.4)) !important;
    }
    [data-theme="light"] .nav-item .icon svg { stroke: #6B6390 !important; }

    /* Кнопка переключения темы */
    .theme-toggle-btn {
      width: 38px; height: 38px; border-radius: 50%;
      background: var(--card); border: 1px solid var(--stroke);
      color: var(--text); display: grid; place-items: center;
      cursor: pointer; font-size: 18px; transition: 0.3s;
      margin-left: 8px; flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .theme-toggle-btn:hover {
      transform: rotate(15deg) scale(1.1);
      background: var(--card-2);
    }

    /* Фон и скроллбар */
    body::before {
      content: ""; position: fixed; top: -20%; left: -10%;
      width: 60vw; height: 60vw;
      background: radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 60%);
      border-radius: 50%; z-index: -1;
      animation: floatOrb 20s infinite alternate ease-in-out;
      pointer-events: none;
    }
    body::after {
      content: ""; position: fixed; bottom: -20%; right: -10%;
      width: 50vw; height: 50vw;
      background: radial-gradient(circle, rgba(74,214,200,0.1) 0%, transparent 60%);
      border-radius: 50%; z-index: -1;
      animation: floatOrb 25s infinite alternate-reverse ease-in-out;
      pointer-events: none;
    }
    @keyframes floatOrb {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(5vw, 5vh) scale(1.1); }
      100% { transform: translate(-5vw, -5vh) scale(0.9); }
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--stroke); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent-2); }

    .ui-svg-icon { width: 24px; height: 24px; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; }
    .module .icn .ui-svg-icon { width: 28px; height: 28px; }
    .state .emoji .ui-svg-icon { width: 26px; height: 26px; }
    .tool-card .icon .ui-svg-icon { width: 24px; height: 24px; }
  `;
  document.head.appendChild(style);

  // 2. ДОБАВЛЯЕМ КНОПКУ ПЕРЕКЛЮЧЕНИЯ ТЕМЫ В ШАПКУ
  document.addEventListener('DOMContentLoaded', () => {
    // Ищем шапку (разные страницы могут иметь разную структуру)
    const headerNav = document.querySelector('.nav-user') || 
                      document.querySelector('.nav') || 
                      document.querySelector('header .container');
    
    // Проверяем, нет ли уже кнопки
    if (headerNav && !document.getElementById('globalThemeBtn')) {
      const btn = document.createElement('button');
      btn.id = 'globalThemeBtn';
      btn.className = 'theme-toggle-btn';
      btn.title = 'Сменить тему';
      btn.innerHTML = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
      
      btn.onclick = (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('global_theme', next);
        btn.innerHTML = next === 'dark' ? '☀️' : '🌙';
      };
      
      // Если это контейнер с юзером (как на главной), просто добавляем в конец
      if (headerNav.classList.contains('nav-user')) {
        headerNav.appendChild(btn);
      } else {
        // Если это просто nav, оборачиваем в div для выравнивания
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.appendChild(btn);
        headerNav.appendChild(wrapper);
      }
    }

    // 3. ЗАМЕНА ЭМОДЗИ НА SVG
    const iconMap = {
      '💰': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
      '🧠': '<svg viewBox="0 0 24 24" stroke="#7c5cff"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>',
      '🆘': '<svg viewBox="0 0 24 24" stroke="#ff5c8a"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
      '🔥': '<svg viewBox="0 0 24 24" stroke="#ffb547"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      '⭐': '<svg viewBox="0 0 24 24" stroke="#ffb547"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      '🌿': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      '🎡': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
      '📓': '<svg viewBox="0 0 24 24" stroke="#f2f2f7"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      '🏆': '<svg viewBox="0 0 24 24" stroke="#ffb547"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      '🕵️‍♂️': '<svg viewBox="0 0 24 24" stroke="#ff5c8a"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg>',
      '💸': '<svg viewBox="0 0 24 24" stroke="#4ad6c8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    };

    const targets = document.querySelectorAll('.state .emoji, .module .icn, .tool-card .icon, .pill, .tip-emoji, .chal-icon, .step-pill .ico');
    targets.forEach(el => {
      const text = el.textContent.trim();
      if (iconMap[text]) {
        el.innerHTML = iconMap[text].replace('<svg ', '<svg class="ui-svg-icon" ');
      }
    });
  });
})();
