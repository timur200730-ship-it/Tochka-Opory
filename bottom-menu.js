(function(){
  const style = document.createElement('style');
  style.textContent = `
    body { padding-bottom: calc(100px + env(safe-area-inset-bottom)) !important; }
    .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(11, 11, 18, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-around; align-items: center; padding: 10px 0 calc(10px + env(safe-area-inset-bottom)); z-index: 9999; font-family: 'Inter', sans-serif; }
    .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1b5; text-decoration: none; font-size: 10px !important; font-weight: 600; transition: .2s; background: none; border: none; cursor: pointer; flex: 1; padding: 4px 0; white-space: nowrap !important; }
    .nav-item:hover, .nav-item.active { color: #4ad6c8; }
    .nav-item .icon { font-size: 20px; transition: .2s; }
    .nav-item.active .icon { transform: translateY(-2px) scale(1.1); filter: drop-shadow(0 0 8px rgba(74,214,200,0.5)); }
    .tools-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); z-index: 9997; opacity: 0; pointer-events: none; transition: .3s; }
    .tools-backdrop.show { opacity: 1; pointer-events: auto; }
    .tools-popup { position: fixed; bottom: calc(90px + env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%) translateY(20px); background: #1c1c24; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 16px; width: calc(100% - 40px); max-width: 360px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); opacity: 0; pointer-events: none; transition: .3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 9998; }
    .tools-popup.show { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
    .tools-popup a { padding: 14px 12px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #f2f2f7; text-decoration: none; font-size: 13px; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: .2s; text-align: center; }
    .tools-popup a:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
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

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <a href="index.html" class="nav-item ${isHome ? 'active' : ''}"><span class="icon">🏠</span><span>Главная</span></a>
    <a href="index.html#modules" class="nav-item ${isModules ? 'active' : ''}"><span class="icon">📚</span><span>Модули</span></a>
    <button class="nav-item" onclick="window.toggleTools()"><span class="icon">🛠</span><span>Сервисы</span></button>
    <a href="notebook.html" class="nav-item ${isNotebook ? 'active' : ''}"><span class="icon">📓</span><span>Тетрадь</span></a>
    <button class="nav-item" onclick="window.openSupport()"><span class="icon">🤍</span><span>Помощь</span></button>
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
    <a href="panic-help.html">🚨 SOS Помощь</a> 
    <a href="breathing.html">🌿 Дыхание</a>
    <a href="budget.html">💰 Бюджет</a>
    <a href="balance-wheel.html">🎡 Колесо</a>
    <a href="challenges.html">🏆 Челленджи</a>
    <a href="scam-game.html">🕵️ Мошенник</a>
    <a href="habit-calculator.html">💸 Привычки</a>
    <a href="body-map.html">🧠 Карта тела</a>
    <a href="emotion-wheel.html">😡 Эмоции</a>
    <a href="salary-simulator.html">💵 Зарплата</a>
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
