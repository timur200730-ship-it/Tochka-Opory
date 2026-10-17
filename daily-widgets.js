/* ============================================================
   ЕЖЕДНЕВНЫЕ ВИДЖЕТЫ: Трекер настроения и Совет дня
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
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function saveData(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e){}
  }

  function getTodayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  function getTipOfDay() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return TIPS[dayOfYear % TIPS.length];
  }

  const styles = `
    .daily-wrap { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-top: 20px; }
    @media (max-width: 768px) { .daily-wrap { grid-template-columns: 1fr; } }
    
    .daily-card { padding: 24px; border-radius: 20px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: #f2f2f7; font-family: 'Inter', sans-serif; }
    .daily-title { font-size: 18px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    
    .mood-row { display: flex; justify-content: space-between; gap: 8px; }
    .mood-btn { flex: 1; padding: 12px 0; border-radius: 12px; background: rgba(0,0,0,.2); border: 1px solid rgba(255,255,255,.1); font-size: 24px; cursor: pointer; transition: .2s; }
    .mood-btn:hover { background: rgba(255,255,255,.1); transform: translateY(-2px); }
    .mood-btn.selected { background: rgba(124,92,255,.3); border-color: #7c5cff; transform: scale(1.1); }
    
    .mood-history { display: flex; gap: 6px; margin-top: 16px; }
    .mood-dot { width: 100%; aspect-ratio: 1; border-radius: 6px; background: rgba(255,255,255,.06); display: grid; place-items: center; font-size: 16px; }
    .mood-dot.filled { background: rgba(124,92,255,.2); border: 1px solid rgba(124,92,255,.4); }

    .tip-text { font-size: 15px; line-height: 1.6; color: #a1a1b5; font-style: italic; }
  `;

  function render() {
    const container = document.getElementById('dailyWidgets');
    if (!container) return;

    const data = loadData();
    if (!data.moods) data.moods = {};
    const today = getTodayKey();
    const todayMood = data.moods[today] || null;

    // Последние 7 дней
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
      const m = data.moods[k];
      const moodObj = MOODS.find(x => x.id === m);
      last7.push(moodObj ? moodObj.emoji : '');
    }

    container.innerHTML = `
      <style>${styles}</style>
      <div class="daily-wrap">
        <div class="daily-card">
          <div class="daily-title">📊 Как ты сегодня?</div>
          <div class="mood-row">
            ${MOODS.map(m => `<button class="mood-btn ${todayMood === m.id ? 'selected' : ''}" onclick="window.setMood('${m.id}')" title="${m.label}">${m.emoji}</button>`).join('')}
          </div>
          <div class="mood-history">
            ${last7.map(emoji => `<div class="mood-dot ${emoji ? 'filled' : ''}">${emoji}</div>`).join('')}
          </div>
        </div>
        
        <div class="daily-card">
          <div class="daily-title">💡 Совет дня</div>
          <div class="tip-text">«${getTipOfDay()}»</div>
        </div>
      </div>
    `;
  }

  window.setMood = function(moodId) {
    const data = loadData();
    if (!data.moods) data.moods = {};
    data.moods[getTodayKey()] = moodId;
    saveData(data);
    render();
  };

  document.addEventListener('DOMContentLoaded', render);
})();