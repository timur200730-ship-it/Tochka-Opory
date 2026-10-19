/* ============================================================
   НИЖНЕЕ МЕНЮ (Tab Bar) + Тёплый конверт + Красивое всплывающее окно
   ============================================================ */

(function(){
  const style = document.createElement('style');
  style.textContent = `
    /* Отступ для body, чтобы меню не перекрывало контент */
    body { padding-bottom: calc(150px + env(safe-area-inset-bottom)) !important; }

    .bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: rgba(11, 11, 18, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
      z-index: 9999;
      font-family: 'Inter', sans-serif;
    }

    .nav-item {
    .nav-item {
  /* ... старые стили ... */
  font-size: 10px !important; /* Уменьшили размер шрифта */
  white-space: nowrap !important; /* Запретили перенос слов на новую строку */
}
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #a1a1b5;
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      transition: .2s;
      background: none;
      border: none;
      cursor: pointer;
      flex: 1;
      padding: 4px 0;
    }

    .nav-item:hover, .nav-item.active {
      color: #4ad6c8;
    }

    .nav-item .icon {
      font-size: 20px;
      transition: .2s;
    }
    
    .nav-item.active .icon {
      transform: translateY(-2px) scale(1.1);
      filter: drop-shadow(0 0 8px rgba(74,214,200,0.5));
    }

    /* Затемненный фон при открытии меню */
    .tools-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      z-index: 9997;
      opacity: 0;
      pointer-events: none;
      transition: .3s;
    }
    .tools-backdrop.show {
      opacity: 1;
      pointer-events: auto;
    }

    /* Само всплывающее окно */
    .tools-popup {
      position: fixed;
      bottom: calc(90px + env(safe-area-inset-bottom));
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #1c1c24;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 16px;
      width: calc(100% - 40px);
      max-width: 360px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset;
      opacity: 0;
      pointer-events: none;
      transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 9998;
    }
    .tools-popup.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }

    .tools-popup a {
      padding: 14px 12px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      color: #f2f2f7;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: .2s;
      text-align: center;
    }
    .tools-popup a:hover {
      background: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }
    .tools-popup a .popup-icon {
      width: 24px; height: 24px; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none;
    }

    /* Модалка поддержки */
    .support-modal {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: .3s;
    }
    .support-modal.show {
      opacity: 1;
      pointer-events: auto;
    }
    .support-card {
      background: linear-gradient(135deg, rgba(30,30,40,0.95), rgba(20,20,30,0.95));
      border: 1px solid rgba(255,92,138,0.3);
      border-radius: 24px;
      padding: 30px;
      max-width: 340px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      transform: translateY(20px);
      transition: .3s;
    }
    .support-modal.show .support-card {
      transform: translateY(0);
    }
    .support-card h3 {
      font-size: 18px;
      color: #ff9dba;
      margin-bottom: 12px;
    }
    .support-card p {
      font-size: 15px;
      color: #f2f2f7;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .support-card button {
      background: rgba(255,255,255,0.1);
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
    }
  `;
  document.head.appendChild(style);

  const path = window.location.pathname;
  const isHome = path.includes('index.html') || path === '/' || path.endsWith('/');
  const isModules = path.includes('module-') || path.includes('lesson.html');
  const isNotebook = path.includes('notebook.html');

  // Иконки для всплывающего меню (чтобы было красиво)
  const svg = {
    leaf: '<svg class="popup-icon" viewBox="0 0 24 24" stroke="#4ad6c8"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    money: '<svg class="popup-icon" viewBox="0 0 24 24" stroke="#4ad6c8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    wheel: '<svg class="popup-icon" viewBox="0 0 24 24" stroke="#4ad6c8"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
    trophy: '<svg class="popup-icon" viewBox="0 0 24 24" stroke="#ffb547"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    spy: '<svg class="popup-icon" viewBox="0 0 24 24" stroke="#ff5c8a"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg>',
    bad: '<svg class="popup-icon" viewBox="0 0 24 24" stroke="#ffb547"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
  };

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <a href="index.html" class="nav-item ${isHome ? 'active' : ''}">
      <span class="icon">🏠</span><span>Главная</span>
    </a>
    <a href="index.html#modules" class="nav-item ${isModules ? 'active' : ''}">
      <span class="icon">📚</span><span>Модули</span>
    </a>
    <button class="nav-item" onclick="window.toggleTools()">
      <span class="icon">🛠</span><span>Сервисы</span>
    </button>
    <a href="notebook.html" class="nav-item ${isNotebook ? 'active' : ''}">
      <span class="icon">📓</span><span>Тетрадь</span>
    </a>
    <a href="panic.html" class="nav-item" style="color:#ff5c8a;">
  <span class="icon">🆘</span><span>SOS</span>
</a>
    <button class="nav-item" onclick="openSupport()">
      <span class="icon">🤍</span><span>Помощь</span>
    </button>
  `;
  document.body.appendChild(nav);

  // Создаем фон (затемнение)
  const backdrop = document.createElement('div');
  backdrop.id = 'toolsBackdrop';
  backdrop.className = 'tools-backdrop';
  backdrop.onclick = window.toggleTools;
  document.body.appendChild(backdrop);

  // Создаем попап с инструментами
  const toolsPopup = document.createElement('div');
  toolsPopup.id = 'toolsPopup';
  toolsPopup.className = 'tools-popup';
  toolsPopup.innerHTML = `
    <a href="breathing.html">${svg.leaf} Дыхание</a>
    <a href="budget.html">${svg.money} Бюджет</a>
    <a href="balance-wheel.html">${svg.wheel} Колесо баланса</a>
    <a href="challenges.html">${svg.trophy} Челленджи</a>
    <a href="scam-game.html">${svg.spy} Мошенник</a>
    <a href="habit-calculator.html">${svg.bad} Привычки</a>
    <a href="body-map.html">🧠 Карта тела</a>
    <a href="emotion-wheel.html">🎡 Эмоции</a>
    <a href="salary-simulator.html">💸 Зарплата</a>
    <a href="cbt-diary.html">📝 Дневник</a>
  `;
  document.body.appendChild(toolsPopup);

  // Модалка поддержки
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
    const popup = document.getElementById('toolsPopup');
    const bd = document.getElementById('toolsBackdrop');
    popup.classList.toggle('show');
    bd.classList.toggle('show');
  };

  window.openSupport = function() {
    const randomPhrase = warmWords[Math.floor(Math.random() * warmWords.length)];
    document.getElementById('supportText').textContent = randomPhrase;
    document.getElementById('supportModal').classList.add('show');
  };
})();
