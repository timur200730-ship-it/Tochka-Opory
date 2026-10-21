(function(){
  const style = document.createElement('style');
  style.textContent = `
    body { padding-bottom: calc(100px + env(safe-area-inset-bottom)) !important; }
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(11, 11, 18, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-around; align-items: center; padding: 10px 0 calc(10px + env(safe-area-inset-bottom)); z-index: 9999; font-family: 'Inter', sans-serif; }
    .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1b5; text-decoration: none; font-size: 10px !important; font-weight: 600; transition: .2s; background: none; border: none; cursor: pointer; flex: 1; padding: 4px 0; white-space: nowrap !important; }
    .nav-item .icon { font-size: 20px; transition: .2s; display: flex; align-items: center; justify-content: center; height: 24px; }
    .nav-item .icon svg { width: 24px; height: 24px; fill: currentColor; transition: .3s; }
    
    /* Активное состояние (бирюзовое свечение) */
    .nav-item.active { color: #4ad6c8; }
    .nav-item.active .icon { transform: translateY(-2px); }
    .nav-item.active .icon svg { filter: drop-shadow(0 0 8px rgba(74,214,200,0.6)); }
    
    /* Особое свечение для кнопки Помощь (сердечко) */
    .nav-item.help-btn { color: #ff5c8a; }
    .nav-item.help-btn .icon svg { filter: drop-shadow(0 0 8px rgba(255,92,138,0.4)); }
    
    .tools-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); z-index: 9997; opacity: 0; pointer-events: none; transition: .3s; }
    .tools-backdrop.show { opacity: 1; pointer-events: auto; }
    
    .tools-popup { position: fixed; bottom: calc(90px + env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%) translateY(20px); background: #1c1c24; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 16px; width: calc(100% - 40px); max-width: 360px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); opacity: 0; pointer-events: none; transition: .3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 9998; }
    .tools-popup.show { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
    .tools-popup a { padding: 14px 12px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #f2f2f7; text-decoration: none; font-size: 13px; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: .2s; text-align: center; }
    .tools-popup a:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
    .tools-popup a .popup-icon { width: 24px; height: 24px; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; }
    
    .support-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 10000; opacity: 0; pointer-events: none; transition: .3s; }
    .support-modal.show { opacity: 1; pointer-events: auto; }
    .support-card { background: linear-gradient(135deg, rgba(30,30,40,0.95), rgba(20,20,30,0.95)); border: 1px solid rgba(255,92,138,0.3); border-radius: 24px; padding: 30px; max-width: 340px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform: translateY(20px); transition: .3s; }
    .support-modal.show .support-card { transform: translateY(0); }
    .support-card h3 { font-size: 18px; color: #ff9dba; margin-bottom: 12px; }
    .support-card p { font-size: 15px; color: #f2f2f7; line-height: 1.6; margin-bottom: 20px; }
    .support-card button { background: rgba(255,255,255,0.1); border: none; padding: 10px 20px; border-radius: 12px; color: #fff; font-weight: 600; cursor: pointer; width: 100%; }
  `;
  document.head.appendChild(style);

  const path = window.location.pathname;
  const isHome = path.includes('index.html') || path === '/' || path.endsWith('/');
  const isModules = path.includes('module-') || path.includes('lesson.html');
  const isNotebook = path.includes('notebook.html');

  // НОВЫЕ ЗАЛИВНЫЕ ИКОНКИ (SVG)
  const navIcons = {
    home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    modules: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>',
    services: '<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
    notebook: '<svg viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>',
    help: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
  };

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <a href="index.html" class="nav-item ${isHome ? 'active' : ''}">
      <span class="icon">${navIcons.home}</span><span>Главная</span>
    </a>
    <a href="index.html#modules" class="nav-item ${isModules ? 'active' : ''}">
      <span class="icon">${navIcons.modules}</span><span>Модули</span>
    </a>
    <button class="nav-item" onclick="window.toggleTools()">
      <span class="icon">${navIcons.services}</span><span>Сервисы</span>
    </button>
    <a href="notebook.html" class="nav-item ${isNotebook ? 'active' : ''}">
      <span class="icon">${navIcons.notebook}</span><span>Тетрадь</span>
    </a>
    <button class="nav-item help-btn" onclick="window.openSupport()">
      <span class="icon">${navIcons.help}</span><span>Помощь</span>
    </button>
  `;
  document.body.appendChild(nav);

  const backdrop = document.createElement('div');
  backdrop.id = 'toolsBackdrop';
  backdrop.className = 'tools-backdrop';
  backdrop.onclick = window.toggleTools;
  document.body.appendChild(backdrop);

  const toolsPopup = document.createElement('div');
  toolsPopup.id = 'toolsPopup';
  toolsPopup.className = 'tools-popup';
  toolsPopup.innerHTML = `
    <a href="breathing.html">🌿 Дыхание</a>
    <a href="budget.html">💰 Бюджет</a>
    <a href="balance-wheel.html">🎡 Колесо</a>
    <a href="challenges.html">🏆 Челленджи</a>
    <a href="scam-game.html">🕵️ Мошенник</a>
    <a href="habit-calculator.html">💸 Привычки</a>
    <a href="body-map.html">🧠 Карта тела</a>
    <a href="emotion-magic.html">✨ Магия слов</a>
    <a href="survive-test.html">🌧 Пережить</a>
    <a href="cbt-diary.html">📝 Дневник</a>
  `;
  document.body.appendChild(toolsPopup);

  const supportModal = document.createElement('div');
  supportModal.id = 'supportModal';
  supportModal.className = 'support-modal';
  supportModal.innerHTML = `
    <div class="support-card">
      <h3>🤍 Мы рядом</h3>
      <p id="supportText">Ты уже проделал(а) большой путь. Даже если сейчас кажется, что стоишь на месте — ты дышишь, а значит, продолжаешь жить. Сделай глубокий вдох. Ты справишься.</p>
      <button onclick="document.getElementById('supportModal').classList.remove('show')">Спасибо 💛</button>
    </div>
  `;
  document.body.appendChild(supportModal);

  const warmWords = [
    "Ты не обязан(а) быть продуктивным(ой) 24/7. Отдых — это тоже важная работа.",
    "Если сейчас тяжело — просто сделай глубокий вдох. Шаг за шагом, ты справишься.",
    "Твоя ценность не измеряется оценками, лайками или чужим мнением. Ты важен(на) просто так.",
    "Любая ошибка — это не провал, а данные. Теперь ты знаешь, как делать не надо.",
    "Ты уже здесь. Ты пытаешься разобраться в себе. Это требует огромной смелости.",
    "Не сравнивай свой день 1 с чьим-то днём 100. У каждого свой темп.",
    "Позволь себе сегодня сделать меньше, но почувствовать больше.",
    "Ты — не свои мысли. Ты — тот, кто их замечает."
  ];

  window.toggleTools = function() {
    document.getElementById('toolsPopup').classList.toggle('show');
    document.getElementById('toolsBackdrop').classList.toggle('show');
  };

  window.openSupport = function() {
    const randomPhrase = warmWords[Math.floor(Math.random() * warmWords.length)];
    document.getElementById('supportText').textContent = randomPhrase;
    document.getElementById('supportModal').classList.add('show');
  };
})();
