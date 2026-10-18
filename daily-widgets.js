/* ============================================================
   ЕЖЕДНЕВНЫЕ ВИДЖЕТЫ: Трекер настроения и Совет дня (Компактные)
   ============================================================ */

(function(){
  const KEY = 'tochka_opory_v1';
  const MOODS = [
    { id: 'great', emoji: '😄', label: 'Отлично' },
    { id: 'good', emoji: '🙂', label: 'Хорошо' },
    { id: 'ok', emoji: '😐', label: 'Нормально' },
    { id: 'bad', emoji: '🙁', label: 'Плохо' },
    { id: 'awful', emoji: '😢', label: 'Ужасно' }
  ];

  const TIPS = [
    "Сон 7–8 часов улучшает память на 30%. Не учись ночью перед экзаменом.",
    "Правило 2 минут: если дело займёт меньше 2 минут — сделай его прямо сейчас.",
    "Записывай траты сразу после покупки. Вечером ты не вспомнишь половину.",
    "Тревога — это не слабость, а сигнал. Спроси себя: «Что я могу сделать прямо сейчас?»",
    "Откладывай 10% с любого дохода. Даже 500 рублей в месяц — это 6000 в год.",
    "Прогулка на 15 минут снижает уровень стресса лучше, чем час в телефоне.",
    "Не сравнивай свой день 1 с чьим-то днём 100. У каждого свой темп.",
    "Пей воду. Обезвоживание часто маскируется под усталость и голод.",
    "Если не можешь начать — включи таймер на 5 минут. Сделай хоть что-то.",
    "«Нет» — это полное предложение. Тебе не нужно оправдываться.",
    "Разбей большую задачу на 3 маленьких. Мозг пугается объёма, а не сути.",
    "Дыши 4-7-8: вдох на 4, задержка на 7, выдох на 8. Это успокаивает за 2 минуты.",
    "Заведи «банк побед»: записывай всё, что получилось. Даже мелочи.",
    "Ты не обязан(а) быть продуктивным(ой) 24/7. Отдых — это тоже часть работы.",
    "Не бери в долг, чтобы закрыть другой долг. Это ловушка.",
    "Если тяжело — позвони на 8 800 2000 122. Это бесплатно и анонимно.",
    "Планируй день с вечера. Утром мозг тратит энергию на выбор, а не на дело.",
    "Ешь слона по кусочкам. Любая курсовая пишется по одному абзацу.",
    "Сравнивай себя только с собой вчерашним. Это единственный честный ориентир.",
    "Выключи уведомления в мессенджерах на 1 час. Ты удивишься, сколько успеешь.",
    "Называй эмоции словами. «Я злюсь» снижает уровень злости сильнее, чем «я в порядке».",
    "Любая ошибка — это данные. Не «я плохой», а «этот способ не сработал».",
    "Твоя ценность не измеряется оценками, лайками или чьим-то мнением.",
    "Перед сном выпиши 3 вещи, за которые ты благодарен(на) сегодня.",
    "Не пытайся сделать всё. Выбери одно самое важное на сегодня.",
    "Отмени подписки, которыми не пользуешься. Это тихие пожиратели бюджета.",
    "Если друг в беде — просто побудь рядом. Не надо давать советы.",
    "Учись говорить «мне нужно время подумать». Это спасает от импульсивных решений.",
    "Держи телефон заряженным, а себя — нет. Отдых важнее.",
    "Начни с самого сложного с утра. Потом день пойдёт легче."
  ];

  function loadData() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : {}; } catch(e) { return {}; }
  }
  function saveData(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e){} }
  function getTodayKey() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }

  function getTipOfDay() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return TIPS[dayOfYear % TIPS.length];
  }

  const styles = `
    .daily-panel { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      background: rgba(255,255,255,.04); 
      border: 1px solid rgba(255,255,255,.1); 
      border-radius: 16px; 
      padding: 12px 20px; 
      margin: 0 auto 24px; 
      max-width: 900px; 
      flex-wrap: wrap; 
      gap: 16px; 
      font-family: 'Inter', sans-serif;
    }
    .daily-part { display: flex; align-items: center; gap: 12px; }
    .daily-label { font-size: 13px; font-weight: 600; color: #a1a1b5; white-space: nowrap; }
    
    .mood-row { display: flex; gap: 6px; width: 100%; max-width: 280px; }
    .mood-btn { 
      width: 34px; height: 34px; 
      border-radius: 10px; 
      background: rgba(0,0,0,.2); 
      border: 1px solid rgba(255,255,255,.08); 
      font-size: 18px; 
      cursor: pointer; 
      transition: .2s; 
      display: grid; 
      place-items: center;
    }
    .mood-btn:hover { background: rgba(255,255,255,.1); transform: translateY(-2px); }
    .mood-btn.selected { background: rgba(74,214,200,.2); border-color: #4ad6c8; transform: scale(1.05); }
    
    .tip-text { font-size: 13.5px; color: #d1d1d6; line-height: 1.4; max-width: 400px; }
    .tip-emoji { font-size: 20px; }

    @media (max-width: 768px) { 
      .daily-panel { flex-direction: column; align-items: flex-start; }
      .tip-text { max-width: 100%; }
    }
  `;

  function render() {
    const container = document.getElementById('dailyWidgets');
    if (!container) return;

    const data = loadData();
    if (!data.moods) data.moods = {};
    const today = getTodayKey();
    const todayMood = data.moods[today] || null;

    container.innerHTML = `
      <style>${styles}</style>
      <div class="daily-panel">
        <div class="daily-part">
          <span class="daily-label">Как ты сегодня?</span>
          <div class="mood-row">
            ${MOODS.map(m => `<button class="mood-btn ${todayMood === m.id ? 'selected' : ''}" onclick="window.setMood('${m.id}')" title="${m.label}">${m.emoji}</button>`).join('')}
          </div>
        </div>
        
        <div class="daily-part">
          <span class="tip-emoji">💡</span>
          <div class="tip-text"><b>Совет:</b> ${getTipOfDay()}</div>
        </div>
      </div>
    `;
  }

  window.setMood = function(moodId) {
    const data = loadData();
    if (!data.moods) data.moods = {};
    data.moods[getTodayKey()] = moodId;
    saveData(data);
    render(); // Перерисовываем, чтобы выделился новый смайлик
  };

  document.addEventListener('DOMContentLoaded', render);
})();
